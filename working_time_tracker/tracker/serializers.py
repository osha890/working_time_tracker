from django.contrib.auth.models import User
from django.core.exceptions import ValidationError as DjValidationError
from rest_framework import serializers
from rest_framework.exceptions import ValidationError as DRFValidationError

from .models import Project, Task, Track, UserExtension


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username"]


class UserExtensionSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserExtension
        fields = "__all__"


class UserExtensionDetailedSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    project = ProjectSerializer()

    class Meta:
        model = UserExtension
        fields = "__all__"


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


class TaskDetailedSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    project = ProjectSerializer()

    class Meta:
        model = Task
        fields = "__all__"


class TrackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Track
        fields = "__all__"


class TrackDetailedSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    task = TaskDetailedSerializer()

    class Meta:
        model = Track
        fields = "__all__"
