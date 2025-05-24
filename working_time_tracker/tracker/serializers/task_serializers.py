from django.core.exceptions import ValidationError as DjValidationError
from rest_framework import serializers
from rest_framework.exceptions import ValidationError as DRFValidationError

from ..models import Task
from .project_serializers import ProjectSimpleSerializer
from .user_serializers import UserSerializer, UserSimpleSerializer


class TaskSerializer(serializers.ModelSerializer):
    user = UserSimpleSerializer(read_only=True)

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
    """For retrieving"""

    user = UserSerializer()
    project = ProjectSimpleSerializer()

    class Meta:
        model = Task
        fields = "__all__"


class TaskSimpleSerializer(serializers.ModelSerializer):
    """Is used in TrackSerializer"""

    class Meta:
        model = Task
        fields = ["id", "title"]


class TaskSerializerWSimpleUser(serializers.ModelSerializer):
    """Is used in TTrackDetailedSerializer"""

    user = UserSimpleSerializer()

    class Meta:
        model = Task
        fields = ["id", "title"]
