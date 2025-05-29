from django.contrib.auth.models import User
from rest_framework import serializers
from tracker.models import UserExtension
from tracker.serializers.project_serializers import (
    ProjectSerializer,
)


class UserExtensionSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserExtension
        fields = "__all__"


class UserExtensionDetailedSerializer(serializers.ModelSerializer):
    project = ProjectSerializer()

    class Meta:
        model = UserExtension
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username"]


class UserListSerializer(serializers.ModelSerializer):
    extension = UserExtensionSerializer(source="userextension")

    class Meta:
        model = User
        fields = ["id", "username", "extension"]


class UserDetailedSerializer(serializers.ModelSerializer):
    extension = UserExtensionDetailedSerializer(source="userextension")

    class Meta:
        model = User
        fields = ["id", "username", "extension"]
