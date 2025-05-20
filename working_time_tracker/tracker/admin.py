from django.contrib.admin import ModelAdmin, register

from .models import Project, Task, Track, UserExtension


@register(Project)
class ProjectAdmin(ModelAdmin):
    pass


@register(UserExtension)
class UserExtensionAdmin(ModelAdmin):
    pass


@register(Task)
class TaskAdmin(ModelAdmin):
    pass


@register(Track)
class TrackAdmin(ModelAdmin):
    pass
