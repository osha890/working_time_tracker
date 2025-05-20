from django.contrib.auth.models import User
from django.db import models


class Project(models.Model):
    title = models.CharField(max_length=50)  # type: ignore
    description = models.TextField(null=True, blank=True)  # type: ignore

    def __str__(self):
        return self.title


class UserExtension(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)  # type: ignore
    project = models.ForeignKey(  # type: ignore
        Project, on_delete=models.SET_NULL, null=True, blank=True, related_name="user_extensions"
    )

    def __str__(self):
        return self.user.username


class Task(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="tasks")  # type: ignore
    user = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name="tasks"  # type: ignore
    )
    title = models.CharField(max_length=50)  # type: ignore
    description = models.TextField(null=True, blank=True)  # type: ignore
    is_in_progress = models.BooleanField(default=False)  # type: ignore
    is_completed = models.BooleanField(default=False)  # type: ignore

    def __str__(self):
        return self.title


class Track(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tracks")  # type: ignore
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="tracks")  # type: ignore
    is_in_progress = models.BooleanField()  # type: ignore
    time_from = models.DateTimeField()  # type: ignore
    time_to = models.DateTimeField(null=True, blank=True)  # type: ignore
