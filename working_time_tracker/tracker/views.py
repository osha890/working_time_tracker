from django.contrib.auth.models import User
from rest_framework.viewsets import ModelViewSet

from .models import Project, Task, Track, UserExtension
from .serializers import (
    ProjectSerializer,
    TaskDetailedSerializer,
    TaskSerializer,
    TrackDetailedSerializer,
    TrackSerializer,
    UserExtensionDetailedSerializer,
    UserExtensionSerializer,
    UserSerializer,
)


class ProjectViewSet(ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserExtensionViewSet(ModelViewSet):
    queryset = UserExtension.objects.all()

    def get_serializer_class(self):
        if self.action == "retrieve":
            return UserExtensionDetailedSerializer
        return UserExtensionSerializer


class TaskViewSet(ModelViewSet):
    queryset = Task.objects.all()

    def get_serializer_class(self):
        if self.action == "retrieve":
            return TaskDetailedSerializer
        return TaskSerializer


class TrackViewSet(ModelViewSet):
    queryset = Track.objects.all()

    def get_serializer_class(self):
        if self.action == "retrieve":
            return TrackDetailedSerializer
        return TrackSerializer
