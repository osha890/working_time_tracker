from django.urls import include, path
from rest_framework.routers import DefaultRouter

from tracker.views.project_views import ProjectViewSet
from tracker.views.task_views import TaskViewSet
from tracker.views.track_views import TrackViewSet
from tracker.views.user_views import UserExtensionViewSet, UserViewSet

router = DefaultRouter()
router.register("projects", ProjectViewSet)
router.register("users", UserViewSet)
router.register("user_extensions", UserExtensionViewSet)
router.register("tasks", TaskViewSet)
router.register("tracks", TrackViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
