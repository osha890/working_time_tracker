from typing import Optional

from django.contrib.auth.models import User
from rest_framework.serializers import ModelSerializer
from rest_framework.viewsets import ModelViewSet
from tracker.models import Project, Task, Track, UserExtension
from tracker.serializers.task_serializers import (
    TaskDetailedSerializer,
    TaskListSerializer,
    TaskSerializer,
)
from tracker.serializers.track_serializers import (
    TrackDetailedSerializer,
    TrackListSerializer,
    TrackSerializer,
)
from tracker.serializers.user_serializers import (
    UserDetailedSerializer,
    UserExtensionDetailedSerializer,
    UserExtensionSerializer,
    UserListSerializer,
    UserSerializer,
)

from .serializers.project_serializers import (
    ProjectSerializer,
)


class BaseModelViewSet(ModelViewSet):
    serializer_classes: dict[str, Optional[ModelSerializer]] = {
        "default": None,
        "list": None,
        "retrieve": None,
    }

    def get_serializer_class(self):
        serializer_class = self.serializer_classes.get(self.action)
        if serializer_class is None:
            serializer_class = self.serializer_classes.get("default")
        return serializer_class


class ProjectViewSet(BaseModelViewSet):
    queryset = Project.objects.all()
    serializer_classes = {
        "default": ProjectSerializer,
        "list": ProjectSerializer,
        "retrieve": ProjectSerializer,
    }


class UserViewSet(BaseModelViewSet):
    queryset = User.objects.all()
    serializer_classes = {
        "default": UserSerializer,
        "list": UserListSerializer,
        "retrieve": UserDetailedSerializer,
    }


class UserExtensionViewSet(BaseModelViewSet):
    queryset = UserExtension.objects.all()
    serializer_classes = {
        "default": UserExtensionSerializer,
        "list": UserExtensionSerializer,
        "retrieve": UserExtensionDetailedSerializer,
    }


class TaskViewSet(BaseModelViewSet):
    queryset = Task.objects.all()
    serializer_classes = {
        "default": TaskSerializer,
        "list": TaskListSerializer,
        "retrieve": TaskDetailedSerializer,
    }


class TrackViewSet(BaseModelViewSet):
    queryset = Track.objects.all()
    serializer_classes = {
        "default": TrackSerializer,
        "list": TrackListSerializer,
        "retrieve": TrackDetailedSerializer,
    }
