from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response

from tracker.models import Project
from tracker.serializers.project.project_detailed_serializer import (
    ProjectDetailedSerializer,
)
from tracker.serializers.project.project_serializer import ProjectSerializer
from tracker.views.base import BaseModelViewSet


class ProjectViewSet(BaseModelViewSet):
    queryset = Project.objects.all()
    serializer_classes = {
        "default": ProjectSerializer,
        "list": ProjectSerializer,
        "retrieve": ProjectDetailedSerializer,
        "my_project": ProjectDetailedSerializer,
    }

    @action(detail=False, methods=["get"], url_path="my-project")
    def my_project(self, request):
        user = request.user

        if not hasattr(user, "userextension") or not user.userextension.project:
            return Response({"detail": "No project"}, status=status.HTTP_404_NOT_FOUND)

        project = user.userextension.project
        serializer = self.get_serializer(project)
        return Response(serializer.data)
