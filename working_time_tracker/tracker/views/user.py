from django.contrib.auth.models import User

from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from tracker.models import UserExtension
from tracker.serializers.user import (
    CurrentUserSerializer,
    UserDetailedSerializer,
    UserExtensionDetailedSerializer,
    UserExtensionSerializer,
    UserListSerializer,
    UserSerializer,
)
from tracker.views.base import BaseModelViewSet


class UserViewSet(BaseModelViewSet):
    queryset = User.objects.all()
    serializer_classes = {
        "default": UserSerializer,
        "list": UserListSerializer,
        "retrieve": UserDetailedSerializer,
    }

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def me(self, request):
        serializer = CurrentUserSerializer(request.user)
        return Response(serializer.data)


class UserExtensionViewSet(BaseModelViewSet):
    queryset = UserExtension.objects.select_related("project").all()
    serializer_classes = {
        "default": UserExtensionSerializer,
        "list": UserExtensionSerializer,
        "retrieve": UserExtensionDetailedSerializer,
    }
