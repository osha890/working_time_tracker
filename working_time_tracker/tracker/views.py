from rest_framework.viewsets import ModelViewSet

from .models import Project, Task, Track, UserExtension
from .serializers import (
    ProjectSerializer,
    TaskSerializer,
    TrackSerializer,
    UserExtensionSerializer,
)


class ProjectViewSet(ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


class UserExtensionViewSet(ModelViewSet):
    queryset = UserExtension.objects.all()
    serializer_class = UserExtensionSerializer


class TaskViewSet(ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer


class TrackViewSet(ModelViewSet):
    queryset = Track.objects.all()
    serializer_class = TrackSerializer
