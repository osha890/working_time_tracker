from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response

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

    @action(detail=True, methods=["post"])
    def take(self, request, pk=None):
        task = self.get_object()

        if task.assignee is not None:
            return Response(
                {"detail": "This task is already assigned to another user."}, status=status.HTTP_400_BAD_REQUEST
            )

        task.assignee = request.user
        task.save()
        serializer = self.get_serializer(task)
        return Response(serializer.data, status=status.HTTP_200_OK)
