from rest_framework import serializers
from tracker.models import Track

from .task_serializers import TaskDetailedSerializer, TaskSimpleSerializer
from .user_serializers import UserDetailedSerializer, UserSimpleSerializer


class TrackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Track
        fields = "__all__"


class TrackSimpleSerializer(serializers.ModelSerializer):
    user = UserSimpleSerializer()
    task = TaskSimpleSerializer()

    class Meta:
        model = Track
        fields = "__all__"


class TrackDetailedSerializer(serializers.ModelSerializer):
    user = UserDetailedSerializer()
    task = TaskDetailedSerializer()

    class Meta:
        model = Track
        fields = "__all__"
