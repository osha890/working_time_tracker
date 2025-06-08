from rest_framework import serializers

from tracker.models import TaskStatus


class ReportSerializer(serializers.Serializer):
    statuses = serializers.ListField(child=serializers.ChoiceField(choices=TaskStatus.choices), required=False)
    user_ids = serializers.ListField(child=serializers.IntegerField(), required=False)
    task_ids = serializers.ListField(child=serializers.IntegerField(), required=False)
