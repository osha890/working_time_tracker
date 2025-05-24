from rest_framework import serializers

from ..models import Track
from .task_serializers import TaskSimpleSerializer
from .user_serializers import UserSerializer, UserSimpleSerializer


class TrackSerializer(serializers.ModelSerializer):
    user = UserSimpleSerializer()
    task = TaskSimpleSerializer()

    class Meta:
        model = Track
        fields = "__all__"


class TrackDetailedSerializer(serializers.ModelSerializer):
    """For retrieving"""

    user = UserSerializer()
    task = serializers.SerializerMethodField()

    class Meta:
        model = Track
        fields = "__all__"
