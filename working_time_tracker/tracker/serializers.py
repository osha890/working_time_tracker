from rest_framework import serializers

from .models import Project, Task, Track, UserExtension


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = "__all__"


class UserExtensionSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserExtension
        fields = "__all__"


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = "__all__"


class TrackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Track
        fields = "__all__"
