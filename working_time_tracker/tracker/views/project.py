from tracker.models import Project
from tracker.serializers.project import ProjectSerializer
from tracker.views.base import BaseModelViewSet


class ProjectViewSet(BaseModelViewSet):
    queryset = Project.objects.all()
    serializer_classes = {
        "default": ProjectSerializer,
        "list": ProjectSerializer,
        "retrieve": ProjectSerializer,
    }
