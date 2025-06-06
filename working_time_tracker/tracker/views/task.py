from django.utils import timezone

from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response

from tracker.models import Task, TaskStatus, Track, UserExtension
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
        "take": TaskSerializer,
        "accessible": TaskListSerializer,
        "my": TaskListSerializer,
    }

    @action(detail=True, methods=["post"])
    def take(self, request, pk=None):
        task = self.get_object()

        if task.assignee is not None:
            return Response(
                {"detail": "This task is already assigned to another user."}, status=status.HTTP_400_BAD_REQUEST
            )

        task.assignee = request.user
        task.status = TaskStatus.ON_HOLD
        task.save()
        serializer = self.get_serializer(task)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def refuse(self, request, pk=None):
        task = self.get_object()

        if task.assignee != request.user:
            return Response({"detail": "You can not access this task"}, status=status.HTTP_403_FORBIDDEN)

        task.assignee = None
        task.save()
        serializer = self.get_serializer(task)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def change_status(self, request, pk=None):
        task = self.get_object()

        if task.assignee != request.user:
            return Response({"detail": "You can not access this task"}, status=status.HTTP_403_FORBIDDEN)

        new_status = request.data.get("status")
        if new_status not in dict(TaskStatus.choices):
            return Response({"detail": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)

        now = timezone.now()

        try:
            active_track = task.tracks.get(user=request.user, time_to__isnull=True)
            active_track.time_to = now
            active_track.save()
        except Track.DoesNotExist:
            pass

        Track.objects.create(
            user=request.user,
            task=task,
            status=new_status,
            time_from=now,
        )

        task.status = new_status
        task.save()

        return Response({"detail": "Status changed successfully"}, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"])
    def accessible(self, request):
        user_extension = UserExtension.objects.get(user=request.user)

        if not user_extension.project:
            return Response([], status=status.HTTP_200_OK)

        tasks = Task.objects.filter(project=user_extension.project)
        serializer = self.get_serializer(tasks, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def my(self, request):
        tasks = Task.objects.filter(assignee=request.user)
        serializer = self.get_serializer(tasks, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def statuses(self, request):
        statuses = [{"key": choice[0], "label": choice[1]} for choice in TaskStatus.choices]
        return Response(statuses)
