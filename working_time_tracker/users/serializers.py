from django.contrib.auth.models import User
from rest_framework.serializers import CharField, ModelSerializer


class RegisterSerializer(ModelSerializer):
    password = CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "password"]

    def create(self, validated_data):
        user = User.objects.create_user(username=validated_data["username"], password=validated_data["password"])
        return user
