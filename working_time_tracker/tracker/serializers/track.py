from rest_framework import serializers

from tracker.models import Track
from tracker.serializers.task import (
    TaskDetailedSerializer,
    TaskListSerializer,
)
from tracker.serializers.user import (
    UserDetailedSerializer,
    UserListSerializer,
)


class TrackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Track
        fields = "__all__"
        read_only_fields = [
            "id",
        ]


class TrackListSerializer(serializers.ModelSerializer):
    user = UserListSerializer()
    task = TaskListSerializer()

    class Meta:
        model = Track
        fields = "__all__"
        read_only_fields = [
            "id",
        ]

    def get_fields(self):
        fields = super().get_fields()
        fields["status_display"] = serializers.CharField(source="get_status_display", read_only=True)
        return fields


class TrackDetailedSerializer(serializers.ModelSerializer):
    user = UserDetailedSerializer()
    task = TaskDetailedSerializer()

    class Meta:
        model = Track
        fields = "__all__"
        read_only_fields = [
            "id",
        ]

    def get_fields(self):
        fields = super().get_fields()
        fields["status_display"] = serializers.CharField(source="get_status_display", read_only=True)
        return fields
