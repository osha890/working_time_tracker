from django.contrib.admin import ModelAdmin, display, register

from tracker.models import Project, Task, Track, UserExtension


@register(Project)
class ProjectAdmin(ModelAdmin):
    pass


@register(UserExtension)
class UserExtensionAdmin(ModelAdmin):
    list_display = ["user", "project"]


@register(Task)
class TaskAdmin(ModelAdmin):
    list_display = ["title", "project", "assignee"]


@register(Track)
class TrackAdmin(ModelAdmin):
    list_display = ["id_with_label", "user", "task"]

    @display(description="ID")
    def id_with_label(self, obj):
        return f"Track object({obj.id})"
