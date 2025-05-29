from django.urls import include, path
from rest_framework.routers import DefaultRouter
from tracker.views import (
    ProjectViewSet,
    TaskViewSet,
    TrackViewSet,
    UserExtensionViewSet,
    UserViewSet,
)

router = DefaultRouter()
router.register("projects", ProjectViewSet)
router.register("users", UserViewSet)
router.register("user_extensions", UserExtensionViewSet)
router.register("tasks", TaskViewSet)
router.register("tracks", TrackViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
