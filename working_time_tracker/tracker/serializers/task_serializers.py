from django.core.exceptions import ValidationError as DjValidationError
from rest_framework import serializers
from rest_framework.exceptions import ValidationError as DRFValidationError

from ..models import Task
from .project_serializers import ProjectDetailedSerializer, ProjectSimpleSerializer
from .user_serializers import UserDetailedSerializer, UserSimpleSerializer


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = "__all__"

    def validate(self, data):
        data = super().validate(data)
        instance = Task(**data)

        try:
            instance.clean()
        except DjValidationError as e:
            raise DRFValidationError(e.messages)

        return data


class TaskSimpleSerializer(serializers.ModelSerializer):
    user = UserSimpleSerializer()
    project = ProjectSimpleSerializer()

    class Meta:
        model = Task
        fields = "__all__"


class TaskDetailedSerializer(serializers.ModelSerializer):
    user = UserDetailedSerializer()
    project = ProjectDetailedSerializer()

    class Meta:
        model = Task
        fields = "__all__"
