from django.contrib.auth.models import User
from django.db.models import Case, DurationField, ExpressionWrapper, F, Sum, When
from django.db.models.functions import Now
from django.http import HttpResponse

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from tracker.models import Task, Track
from tracker.serializers.report import ReportSerializer
from tracker.utils import generate_xlsx_report


class ReportBuilder:
    def __init__(self, track_items):
        self.track_items = track_items
        self.aggregate_total = False
        self.users_map = {}
        self.tasks_map = {}

    def to_aggregate(self, aggregate_total: bool):
        self.aggregate_total = aggregate_total
        return self

    def build(self):
        self.__create_maps()
        return self.__to_list(self.__group_data())

    def __create_maps(self):
        user_ids = set([track_item["user"] for track_item in self.track_items])
        users = User.objects.filter(id__in=user_ids).values("id", "username")
        self.users_map = {u["id"]: u for u in users}

        task_ids = set([track_item["task"] for track_item in self.track_items])
        tasks = Task.objects.filter(id__in=task_ids).values("id", "title")
        self.tasks_map = {t["id"]: t for t in tasks}

    def __group_data(self):
        result_dict = {}
        for track_item in self.track_items:
            uid = track_item["user"]
            tid = track_item["task"]
            status = track_item.get("status")
            total = track_item["total"]

            user_entry = result_dict.setdefault(
                uid, {"user": self.users_map.get(uid, {"id": uid, "username": "Unknown"}), "tasks": {}}
            )
            task_entry = user_entry["tasks"].setdefault(
                tid, {"task": self.tasks_map.get(tid, {"id": tid, "title": "Unknown"}), "statuses": []}
            )

            if self.aggregate_total:
                task_entry["total_time"] = str(total)
            else:
                task_entry["statuses"].append({"status": status, "total_time": str(total)})

        return result_dict

    @staticmethod
    def __to_list(result_dict):
        result = []
        for user_data in result_dict.values():
            user_data["tasks"] = list(user_data["tasks"].values())
            result.append(user_data)
        return result


class ReportQueryBuilder:
    def __init__(self, user, data):
        self.user = user
        self.data = data
        self.filters = {}
        self.aggregate = False

    def create_filters(self):
        def create_filter_from_data(filter_key, data_key):
            value = self.data.get(data_key)
            if value:
                self.filters[filter_key] = value

        create_filter_from_data("task__in", "task_ids")
        create_filter_from_data("status__in", "statuses")

        if self.user.is_staff:
            create_filter_from_data("user__in", "user_ids")
        else:
            self.filters["user"] = self.user

        if "status__in" not in self.filters:
            self.aggregate = True

        return self

    def build(self):
        return self.__aggregate_data(self.__build_queryset(Track.objects.none()))

    def __build_queryset(self, queryset):
        queryset = Track.objects.filter(**self.filters)
        duration_expr = ExpressionWrapper(
            Case(When(time_to__isnull=True, then=Now()), default=F("time_to")) - F("time_from"),
            output_field=DurationField(),
        )
        queryset = queryset.annotate(duration=duration_expr)
        return queryset

    def __aggregate_data(self, built_queryset):
        if self.aggregate:
            return built_queryset.values("user", "task").annotate(total=Sum("duration"))
        return built_queryset.values("user", "task", "status").annotate(total=Sum("duration"))


class ReportView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ReportSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        user = request.user

        report_queryset = ReportQueryBuilder(user, data).create_filters().build()

        report = ReportBuilder(report_queryset).to_aggregate(data.get("aggregate_total", False)).build()

        report_format = data.get("report_format")
        if report_format == "xlsx":
            xlsx_file = generate_xlsx_report(report)
            response = HttpResponse(xlsx_file, content_type="application/octet-stream")
            response["Content-Disposition"] = 'attachment; filename="report.xlsx"'
            return response
        return Response(report)
