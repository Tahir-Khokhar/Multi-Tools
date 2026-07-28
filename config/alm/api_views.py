from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Alarm

@csrf_exempt
def api_alarms(request):
    if request.method == 'GET':
        alarms = list(Alarm.objects.filter(is_active=True).values('id', 'time', 'label'))
        return JsonResponse({"alarms": alarms})
    return JsonResponse({"error": "GET required"}, status=405)

@csrf_exempt
def api_alarm_create(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        alarm = Alarm.objects.create(
            time=data.get('time'),
            label=data.get('label', 'Alarm'),
            is_active=True
        )
        return JsonResponse({"id": alarm.id, "time": alarm.time, "label": alarm.label})
    return JsonResponse({"error": "POST required"}, status=405)

@csrf_exempt
def api_alarm_delete(request, alarm_id):
    if request.method == 'DELETE':
        try:
            alarm = Alarm.objects.get(id=alarm_id)
            alarm.is_active = False
            alarm.save()
            return JsonResponse({"success": True})
        except Alarm.DoesNotExist:
            return JsonResponse({"error": "Not found"}, status=404)
    return JsonResponse({"error": "DELETE required"}, status=405)
