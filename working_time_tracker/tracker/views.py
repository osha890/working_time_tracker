from django.contrib.auth.models import User
from rest_framework.viewsets import ModelViewSet

from .models import Project, Task, Track, UserExtension
from .serializers.project_serializers import (
    ProjectDetailedSerializer,
    ProjectSerializer,
    ProjectSimpleSerializer,
)
from .serializers.task_serializers import (
    TaskDetailedSerializer,
    TaskSerializer,
    TaskSimpleSerializer,
)
from .serializers.track_serializers import (
    TrackDetailedSerializer,
    TrackSerializer,
    TrackSimpleSerializer,
)
from .serializers.user_serializers import (
    UserDetailedSerializer,
    UserExtensionDetailedSerializer,
    UserExtensionSerializer,
    UserExtensionSimpleSerializer,
    UserSerializer,
    UserSimpleSerializer,
)


class ProjectViewSet(ModelViewSet):
    queryset = Project.objects.all()

    def get_serializer_class(self):
        if self.action == "retrieve":
            return ProjectDetailedSerializer
        elif self.action == "list":
            return ProjectSimpleSerializer
        return ProjectSerializer


class UserViewSet(ModelViewSet):
    queryset = User.objects.all()

    def get_serializer_class(self):
        if self.action == "retrieve":
            return UserDetailedSerializer
        elif self.action == "list":
            return UserSimpleSerializer
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
            return TaskSimpleSerializer
        return TaskSerializer


class TrackViewSet(ModelViewSet):
    queryset = Track.objects.all()

    def get_serializer_class(self):
        if self.action == "retrieve":
            return TrackDetailedSerializer
        elif self.action == "list":
            return TrackSimpleSerializer
        return TrackSerializer
