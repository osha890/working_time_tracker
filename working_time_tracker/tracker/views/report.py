from django.contrib.auth.models import User
from django.db.models import DurationField, ExpressionWrapper, F, Sum

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from tracker.models import Task, Track
from tracker.serializers.report import ReportSerializer


def build_report(track_items, aggregate_total=False):
    users_dict = {}

    user_ids = set([track_item["user"] for track_item in track_items])
    users = User.objects.filter(id__in=user_ids).values("id", "username")
    users_map = {u["id"]: u for u in users}

    task_ids = set([track_item["task"] for track_item in track_items])
    tasks = Task.objects.filter(id__in=task_ids).values("id", "title")
    tasks_map = {t["id"]: t for t in tasks}

    for track_item in track_items:
        uid = track_item["user"]
        tid = track_item["task"]
        status = track_item.get("status")
        total = track_item["total"]

        if uid not in users_dict:
            users_dict[uid] = {"user": users_map.get(uid, {"id": uid, "username": "Unknown"}), "tasks": {}}
        user_entry = users_dict[uid]

        if tid not in user_entry["tasks"]:
            user_entry["tasks"][tid] = {"task": tasks_map.get(tid, {"id": tid, "title": "Unknown"}), "statuses": []}
        task_entry = user_entry["tasks"][tid]

        if aggregate_total:
            task_entry["total_time"] = str(total)
        else:
            task_entry["statuses"].append({"status": status, "total_time": str(total)})

    result = []
    for user_data in users_dict.values():
        user_data["tasks"] = list(user_data["tasks"].values())
        result.append(user_data)

    return result


class ReportView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ReportSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        user = request.user

        filters = {"time_to__isnull": False}

        def make_filter_from_data(filter_key, data_key):
            if data_key in data:
                value = data[data_key]
                if value:
                    filters[filter_key] = value

        if user.is_staff:
            make_filter_from_data("user__in", "user_ids")
        else:
            filters["user"] = user

        aggregate = False

        make_filter_from_data("task__in", "task_ids")
        make_filter_from_data("status__in", "statuses")

        if "status__in" not in filters:
            aggregate = True

        queryset = Track.objects.filter(**filters)

        duration_expr = ExpressionWrapper(F("time_to") - F("time_from"), output_field=DurationField())
        queryset = queryset.annotate(duration=duration_expr)

        if aggregate:
            track_items = queryset.values("user", "task").annotate(total=Sum("duration"))
        else:
            track_items = queryset.values("user", "task", "status").annotate(total=Sum("duration"))

        report = build_report(track_items, data.get("aggregate_total", False))
        return Response(report)
