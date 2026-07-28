from django.contrib import admin
from .models import Alarm

@admin.register(Alarm)
class AlarmAdmin(admin.ModelAdmin):
    list_display = ['time', 'label', 'is_active', 'is_ringing']
    list_filter = ['is_active', 'is_ringing']
    search_fields = ['label', 'time']
