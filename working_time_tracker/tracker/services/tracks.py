from django.utils import timezone

from tracker.models import Track


def close_active_track(task, user):
    try:
        active_track = task.tracks.get(user=user, time_to__isnull=True)
        active_track.time_to = timezone.now()
        active_track.save()
    except Track.DoesNotExist:
        pass
