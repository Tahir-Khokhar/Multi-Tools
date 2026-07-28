from django.urls import path
from . import views, api_views

urlpatterns = [
    path('', views.dino_game, name='dino_game'),
    path('api/score/', api_views.api_dino_score, name='api_dino_score'),
]
