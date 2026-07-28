from django.shortcuts import render
from .models import Alarm

def alarm_clock(request):
    alarms = Alarm.objects.filter(is_active=True)
    return render(request, 'alm/alarm.html', {'alarms': alarms})
