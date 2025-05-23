from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.db import models


class Project(models.Model):
    title = models.CharField(max_length=50)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.title


class UserExtension(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    project = models.ForeignKey(
        Project, on_delete=models.SET_NULL, null=True, blank=True, related_name="user_extensions"
    )

    def __str__(self):
        return self.user.username


class Task(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="tasks")
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="tasks")
    title = models.CharField(max_length=50)
    description = models.TextField(null=True, blank=True)
    is_in_progress = models.BooleanField(default=False)
    is_completed = models.BooleanField(default=False)

    def __str__(self):
        return self.title

    def clean(self):
        if self.user:
            user_extension = self.user.userextension
            if user_extension.project_id != self.project_id:
                raise ValidationError("User can only be assigned to tasks from his project")


class Track(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tracks")
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="tracks")
    is_in_progress = models.BooleanField()
    time_from = models.DateTimeField()
    time_to = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Track object({self.pk})"
