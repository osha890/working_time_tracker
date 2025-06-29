from io import BytesIO

from django.contrib.auth.models import User
from django.db.models import Case, DurationField, ExpressionWrapper, F, Sum, When
from django.db.models.functions import Now
import openpyxl
from openpyxl.styles import Font

from tracker.models import Project, Task, Track


def get_project_info(project):
    project_id = project["project"]["id"]
    project_title = project["project"]["title"]
    project_users = project["users"]
    return project_id, project_title, project_users


def get_user_info(user):
    user_id = user["user"]["id"]
    username = user["user"]["username"]
    user_tasks = user["tasks"]
    return user_id, username, user_tasks


def get_task_info(task):
    task_id = task["task"]["id"]
    task_title = task["task"]["title"]
    task_statuses = task["statuses"]
    return task_id, task_title, task_statuses


def get_status_info(status):
    status_label = status["status"]
    total_time = status["total_time"]
    return status_label, total_time


def generate_xlsx_report(report_data):
    wb = openpyxl.Workbook()
    ws = wb.active

    headers = ["Project ID", "Project Title", "User ID", "Username", "Task ID", "Task Title", "Status", "Total Time"]
    ws.append(headers)

    for col in ws.iter_cols(min_row=1, max_row=1, min_col=1, max_col=len(headers)):
        for cell in col:
            cell.font = Font(bold=True)

    for project in report_data:
        project_id, project_title, project_users = get_project_info(project)
        for user in project_users:
            user_id, username, user_tasks = get_user_info(user)
            for task in user_tasks:
                task_id, task_title, task_statuses = get_task_info(task)
                for status in task_statuses:
                    status_label, total_time = get_status_info(status)
                    ws.append(
                        [project_id, project_title, user_id, username, task_id, task_title, status_label, total_time]
                    )

    memory_object = BytesIO()
    wb.save(memory_object)
    memory_object.seek(0)
    return memory_object


class ReportBuilder:
    def __init__(self, track_items):
        self.track_items = track_items
        self.aggregate_total = False
        self.users_map = {}
        self.tasks_map = {}
        self.projects_map = {}

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

        project_ids = {item["project"] for item in self.track_items}
        projects = Project.objects.filter(id__in=project_ids).values("id", "title")
        self.projects_map = {p["id"]: p for p in projects}

    def __group_data(self):
        result_dict = {}
        for track_item in self.track_items:
            pid = track_item["project"]
            uid = track_item["user"]
            tid = track_item["task"]
            status = track_item.get("status")
            total = track_item["total"]

            project_entry = result_dict.setdefault(
                pid, {"project": self.projects_map.get(pid, {"id": pid, "title": "Unknown"}), "users": {}}
            )

            user_entry = project_entry["users"].setdefault(
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
        for project_data in result_dict.values():
            users_list = []
            for user_data in project_data["users"].values():
                user_data["tasks"] = list(user_data["tasks"].values())
                users_list.append(user_data)
            project_data["users"] = users_list
            result.append(project_data)
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

        self.aggregate = self.data.get("aggregate", False)
        if not self.aggregate:
            create_filter_from_data("status__in", "statuses")

        if self.user.is_staff:
            create_filter_from_data("user__userextension__project__in", "project_ids")
            create_filter_from_data("user__in", "user_ids")
        else:
            self.filters["user"] = self.user

        return self

    def build(self):
        return self.__aggregate_data(self.__build_queryset())

    def __build_queryset(self):
        queryset = Track.objects.filter(**self.filters).select_related(
            "user", "user__userextension", "user__userextension__project"
        )
        duration_expr = ExpressionWrapper(
            Case(When(time_to__isnull=True, then=Now()), default=F("time_to")) - F("time_from"),
            output_field=DurationField(),
        )
        return queryset.annotate(duration=duration_expr, project=F("user__userextension__project"))

    def __aggregate_data(self, built_queryset):
        if self.aggregate:
            return built_queryset.values("project", "user", "task").annotate(total=Sum("duration"))
        return built_queryset.values("project", "user", "task", "status").annotate(total=Sum("duration"))
