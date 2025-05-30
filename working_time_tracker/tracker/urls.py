from django.urls import include, path
from rest_framework.routers import DefaultRouter

from tracker.views.project import ProjectViewSet
from tracker.views.task import TaskViewSet
from tracker.views.track import TrackViewSet
from tracker.views.user import UserExtensionViewSet, UserViewSet

router = DefaultRouter()
router.register("projects", ProjectViewSet)
router.register("users", UserViewSet)
router.register("user_extensions", UserExtensionViewSet)
router.register("tasks", TaskViewSet)
router.register("tracks", TrackViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
