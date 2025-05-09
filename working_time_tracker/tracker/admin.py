from django.contrib.admin import ModelAdmin, register
from .models import TestExample


@register(TestExample)
class TestExampleAdmin(ModelAdmin):
    pass
