from rest_framework import serializers

from ..models import Project


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = "__all__"


class ProjectSimpleSerializer(serializers.ModelSerializer):
    """Is used in UserExtensionNestedSerializer"""

    class Meta:
        model = Project
        fields = ["id", "title"]
