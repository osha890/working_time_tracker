from django.db import transaction
from django.utils import timezone

from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from tracker.models import Task, TaskStatus, UserExtension
from tracker.permissions import IsAssignedToUser, IsUnassigned
from tracker.serializers.task import (
    TaskDetailedSerializer,
    TaskListSerializer,
    TaskSerializer,
)
from tracker.serializers.track import TrackSerializer
from tracker.services import close_active_track
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

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated, IsUnassigned])
    def take(self, request, pk=None):
        task = self.get_object()
        user = request.user

        new_status = TaskStatus.IN_PROGRESS

        with transaction.atomic():
            task.assignee = user
            task.status = new_status
            task.save()

        TrackSerializer().create(
            {
                "user": user,
                "task": task,
                "status": new_status,
                "time_from": timezone.now(),
            }
        )
        serializer = self.get_serializer(task)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated, IsAssignedToUser])
    def refuse(self, request, pk=None):
        task = self.get_object()
        user = request.user

        close_active_track(task, user)
        task.assignee = None
        task.save()
        serializer = self.get_serializer(task)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated, IsAssignedToUser])
    def change_status(self, request, pk=None):
        task = self.get_object()
        user = request.user

        new_status = request.data.get("status")
        if new_status not in dict(TaskStatus.choices):
            return Response({"detail": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)

        close_active_track(task, user)

        TrackSerializer().create(
            {
                "user": user,
                "task": task,
                "status": new_status,
                "time_from": timezone.now(),
            }
        )

        task.status = new_status
        task.save()

        return Response({"detail": "Status changed successfully"}, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def accessible(self, request):
        user_extension = UserExtension.objects.select_related("project").get(user=request.user)

        if not user_extension.project:
            return Response([], status=status.HTTP_200_OK)

        tasks = Task.objects.filter(project=user_extension.project)
        serializer = self.get_serializer(tasks, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def my(self, request):
        tasks = Task.objects.filter(assignee=request.user)
        serializer = self.get_serializer(tasks, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def statuses(self, request):
        statuses = [{"key": choice[0], "label": choice[1]} for choice in TaskStatus.choices]
        return Response(statuses)
