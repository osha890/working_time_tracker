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
        read_only_fields = ["id", "user"]


class UserExtensionDetailedSerializer(serializers.ModelSerializer):
    project = ProjectSerializer()

    class Meta:
        model = UserExtension
        fields = "__all__"
        read_only_fields = ["id", "user"]


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username"]
        read_only_fields = ["id", "extension"]


class UserListSerializer(serializers.ModelSerializer):
    extension = UserExtensionSerializer(source="userextension")

    class Meta:
        model = User
        fields = ["id", "username", "extension"]
        read_only_fields = ["id", "extension"]


class UserDetailedSerializer(serializers.ModelSerializer):
    extension = UserExtensionDetailedSerializer(source="userextension")

    class Meta:
        model = User
        fields = ["id", "username", "extension"]
        read_only_fields = ["id", "extension"]
