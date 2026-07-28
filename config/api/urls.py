from django.urls import path
from . import views

urlpatterns = [
    path('', views.api_root, name='api_root'),
    path('calculator/', views.api_calculator, name='api_calculator'),
    path('alarms/', views.api_alarms, name='api_alarms'),
    path('snake-score/', views.api_snake_score, name='api_snake_score'),
    path('dino-score/', views.api_dino_score, name='api_dino_score'),
]
