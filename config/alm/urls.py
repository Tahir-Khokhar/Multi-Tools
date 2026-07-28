from django.urls import path
from . import views, api_views

urlpatterns = [
    path('', views.alarm_clock, name='alarm_clock'),
    path('api/alarms/', api_views.api_alarms, name='api_alarms'),
    path('api/alarms/create/', api_views.api_alarm_create, name='api_alarm_create'),
    path('api/alarms/delete/<int:alarm_id>/', api_views.api_alarm_delete, name='api_alarm_delete'),
]
