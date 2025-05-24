from django.contrib.auth.models import User
from rest_framework import serializers

from ..models import UserExtension
from .project_serializers import ProjectSimpleSerializer


class UserExtensionSerializer(serializers.ModelSerializer):
    """For retrieving"""

    class Meta:
        model = UserExtension
        fields = "__all__"


class UserExtensionDetailedSerializer(serializers.ModelSerializer):
    """For retrieving"""

    project = ProjectSimpleSerializer()

    class Meta:
        model = UserExtension
        fields = "__all__"


class UserExtensionNestedSerializer(serializers.ModelSerializer):
    """Is used in UserSerializer"""

    project = ProjectSimpleSerializer()

    class Meta:
        model = UserExtension
        fields = ["id", "project"]


class UserSerializer(serializers.ModelSerializer):
    extension = UserExtensionNestedSerializer(source="userextension", read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "extension"]


class UserSimpleSerializer(serializers.ModelSerializer):
    """Is used in TrackSerializer"""

    class Meta:
        model = User
        fields = ["id", "username"]
