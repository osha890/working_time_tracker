from django.contrib.auth.models import User

from tracker.models import UserExtension
from tracker.serializers.user_serializers import (
    UserDetailedSerializer,
    UserExtensionDetailedSerializer,
    UserExtensionSerializer,
    UserListSerializer,
    UserSerializer,
)
from tracker.views.base_views import BaseModelViewSet


class UserViewSet(BaseModelViewSet):
    queryset = User.objects.all()
    serializer_classes = {
        "default": UserSerializer,
        "list": UserListSerializer,
        "retrieve": UserDetailedSerializer,
    }


class UserExtensionViewSet(BaseModelViewSet):
    queryset = UserExtension.objects.all()
    serializer_classes = {
        "default": UserExtensionSerializer,
        "list": UserExtensionSerializer,
        "retrieve": UserExtensionDetailedSerializer,
    }
