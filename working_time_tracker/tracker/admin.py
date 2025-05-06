from django.contrib import admin
from .models import TestExample


@admin.register(TestExample)
class TestExampleAdmin(admin.ModelAdmin):
    pass
