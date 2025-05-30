from tracker.models import Track
from tracker.serializers.track_serializers import (
    TrackDetailedSerializer,
    TrackListSerializer,
    TrackSerializer,
)
from tracker.views.base_views import BaseModelViewSet


class TrackViewSet(BaseModelViewSet):
    queryset = Track.objects.all()
    serializer_classes = {
        "default": TrackSerializer,
        "list": TrackListSerializer,
        "retrieve": TrackDetailedSerializer,
    }
