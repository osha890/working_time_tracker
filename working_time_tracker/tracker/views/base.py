from typing import Optional

from rest_framework.serializers import ModelSerializer
from rest_framework.viewsets import ModelViewSet


class BaseModelViewSet(ModelViewSet):
    serializer_classes: dict[str, Optional[ModelSerializer]] = {
        "default": None,
        "list": None,
        "retrieve": None,
    }

    def get_serializer_class(self):
        serializer_class = self.serializer_classes.get(self.action)
        if serializer_class is None:
            serializer_class = self.serializer_classes.get("default")
        return serializer_class
