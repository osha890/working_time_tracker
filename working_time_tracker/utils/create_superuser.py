import os
import sys

import django
from django.contrib.auth import get_user_model

sys.path.append("/app/working_time_tracker")

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "working_time_tracker.settings")
django.setup()


User = get_user_model()

username = os.getenv("DJANGO_SUPERUSER_USERNAME")
password = os.getenv("DJANGO_SUPERUSER_PASSWORD")

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username=username, password=password)  # type: ignore
