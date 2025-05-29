from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from tracker.models import UserExtension


@receiver(post_save, sender=User)
def create_user_extension(sender, instance, created, **kwargs):
    if created:
        UserExtension.objects.create(user=instance)
