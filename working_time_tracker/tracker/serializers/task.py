from django.core.exceptions import ValidationError as DjValidationError
from rest_framework import serializers
from rest_framework.exceptions import ValidationError as DRFValidationError

from tracker.models import Task
from tracker.serializers.project import (
    ProjectSerializer,
)
from tracker.serializers.user import (
    UserDetailedSerializer,
    UserListSerializer,
)


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = "__all__"
        read_only_fields = [
            "id",
            "reporter",
        ]

    def validate(self, data):
        data = super().validate(data)
        instance = Task(**data)

        try:
            instance.clean()
        except DjValidationError as e:
            raise DRFValidationError(e.messages)

        return data

    def create(self, validated_data):
        user = self.context["request"].user
        validated_data["reporter"] = user
        return super().create(validated_data)


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

    def get_fields(self):
        fields = super().get_fields()
        fields["status_display"] = serializers.CharField(source="get_status_display", read_only=True)
        return fields


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

    def get_fields(self):
        fields = super().get_fields()
        fields["status_display"] = serializers.CharField(source="get_status_display", read_only=True)
        return fields
