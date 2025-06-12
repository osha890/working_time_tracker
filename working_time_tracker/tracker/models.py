from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone


class Project(models.Model):
    title = models.CharField(max_length=50)
    description = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.title


class UserExtension(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    project = models.ForeignKey(
        Project, on_delete=models.SET_NULL, null=True, blank=True, related_name="user_extensions"
    )

    def __str__(self):
        return self.user.username


class TaskStatus(models.TextChoices):
    TO_DO = "TO_DO", "To Do"
    REJECTED = "REJECTED", "Rejected"
    COMPLETED = "COMPLETED", "Completed"
    ON_HOLD = "ON_HOLD", "On Hold"
    IN_PROGRESS = "IN_PROGRESS", "In Progress"
    IN_REVIEW = "IN_REVIEW", "In Review"
    IN_QA = "IN_QA", "In QA"

    @staticmethod
    def get_active_statuses():
        return {
            TaskStatus.IN_PROGRESS,
            TaskStatus.IN_REVIEW,
            TaskStatus.IN_QA,
        }


class Task(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="tasks")
    reporter = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reported_tasks")
    assignee = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="assigned_tasks")
    title = models.CharField(max_length=50)
    description = models.TextField(null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=TaskStatus.choices,
        default=TaskStatus.TO_DO,
    )
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.title

    def clean(self):
        if self.assignee:
            user_extension = self.assignee.userextension
            if user_extension.project_id != self.project_id:
                raise ValidationError("User can only be assigned to tasks from his project")


class Track(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tracks")
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="tracks")
    status = models.CharField(
        max_length=20,
        choices=TaskStatus.choices,
    )
    time_from = models.DateTimeField()
    time_to = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Track object({self.pk})"
