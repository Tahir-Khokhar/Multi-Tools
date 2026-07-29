from django.urls import path
from . import views, api_views

urlpatterns = [
    path('', views.snake_game, name='snake_game'),
    path('api/score/', api_views.api_high_score, name='api_high_score'),
]
