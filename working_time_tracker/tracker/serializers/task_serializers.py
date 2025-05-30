from django.core.exceptions import ValidationError as DjValidationError
from rest_framework import serializers
from rest_framework.exceptions import ValidationError as DRFValidationError

from tracker.models import Task
from tracker.serializers.project_serializers import (
    ProjectSerializer,
)
from tracker.serializers.user_serializers import (
    UserDetailedSerializer,
    UserListSerializer,
)


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = "__all__"
        read_only_fields = [
            "id",
        ]

    def validate(self, data):
        data = super().validate(data)
        instance = Task(**data)

        try:
            instance.clean()
        except DjValidationError as e:
            raise DRFValidationError(e.messages)

        return data


class TaskListSerializer(serializers.ModelSerializer):
    assignee = UserListSerializer()
    reporter = UserListSerializer()
    project = ProjectSerializer()

    class Meta:
        model = Task
        fields = "__all__"
        read_only_fields = [
            "id",
        ]


class TaskDetailedSerializer(serializers.ModelSerializer):
    assignee = UserDetailedSerializer()
    reporter = UserDetailedSerializer()
    project = ProjectSerializer()

    class Meta:
        model = Task
        fields = "__all__"
        read_only_fields = [
            "id",
        ]
