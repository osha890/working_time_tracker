from django.contrib.auth.models import User
from rest_framework import serializers

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
        fields = ["user", "project"]


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = "__all__"


class TrackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Track
        fields = "__all__"
