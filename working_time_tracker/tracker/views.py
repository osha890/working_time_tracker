from django.contrib.auth.models import User
from rest_framework.viewsets import ModelViewSet

from .models import Project, Task, Track, UserExtension
from .serializers.project_serializers import (
    ProjectDetailedSerializer,
    ProjectListSerializer,
    ProjectSerializer,
)
from .serializers.task_serializers import (
    TaskDetailedSerializer,
    TaskListSerializer,
    TaskSerializer,
)
from .serializers.track_serializers import (
    TrackDetailedSerializer,
    TrackListSerializer,
    TrackSerializer,
)
from .serializers.user_serializers import (
    UserDetailedSerializer,
    UserExtensionDetailedSerializer,
    UserExtensionSerializer,
    UserExtensionSimpleSerializer,
    UserListSerializer,
    UserSerializer,
)


class ProjectViewSet(ModelViewSet):
    queryset = Project.objects.all()

    def get_serializer_class(self):
        if self.action == "retrieve":
            return ProjectDetailedSerializer
        elif self.action == "list":
            return ProjectListSerializer
        return ProjectSerializer


class UserViewSet(ModelViewSet):
    queryset = User.objects.all()

    def get_serializer_class(self):
        if self.action == "retrieve":
            return UserDetailedSerializer
        elif self.action == "list":
            return UserListSerializer
        return UserSerializer


class UserExtensionViewSet(ModelViewSet):
    queryset = UserExtension.objects.all()

    def get_serializer_class(self):
        if self.action == "retrieve":
            return UserExtensionDetailedSerializer
        elif self.action == "list":
            return UserExtensionSimpleSerializer
        return UserExtensionSerializer


class TaskViewSet(ModelViewSet):
    queryset = Task.objects.all()

    def get_serializer_class(self):
        if self.action == "retrieve":
            return TaskDetailedSerializer
        elif self.action == "list":
            return TaskListSerializer
        return TaskSerializer


class TrackViewSet(ModelViewSet):
    queryset = Track.objects.all()

    def get_serializer_class(self):
        if self.action == "retrieve":
            return TrackDetailedSerializer
        elif self.action == "list":
            return TrackListSerializer
        return TrackSerializer
