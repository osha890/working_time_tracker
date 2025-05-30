from tracker.models import Task
from tracker.serializers.task import (
    TaskDetailedSerializer,
    TaskListSerializer,
    TaskSerializer,
)
from tracker.views.base import BaseModelViewSet


class TaskViewSet(BaseModelViewSet):
    queryset = Task.objects.all()
    serializer_classes = {
        "default": TaskSerializer,
        "list": TaskListSerializer,
        "retrieve": TaskDetailedSerializer,
    }
