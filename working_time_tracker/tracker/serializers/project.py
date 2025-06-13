from rest_framework import serializers

from tracker.models import Project
from tracker.serializers.task import TaskDetailedSerializer


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = "__all__"
        read_only_fields = [
            "id",
        ]


class ProjectDetailedSerializer(serializers.ModelSerializer):
    tasks = TaskDetailedSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = "__all__"
        read_only_fields = ["id", "tasks"]
