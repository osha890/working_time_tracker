from rest_framework import serializers
from tracker.models import Track
from tracker.serializers.task_serializers import (
    TaskDetailedSerializer,
    TaskListSerializer,
)
from tracker.serializers.user_serializers import (
    UserDetailedSerializer,
    UserListSerializer,
)


class TrackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Track
        fields = "__all__"


class TrackListSerializer(serializers.ModelSerializer):
    user = UserListSerializer()
    task = TaskListSerializer()

    class Meta:
        model = Track
        fields = "__all__"


class TrackDetailedSerializer(serializers.ModelSerializer):
    user = UserDetailedSerializer()
    task = TaskDetailedSerializer()

    class Meta:
        model = Track
        fields = "__all__"
