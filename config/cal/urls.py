from django.urls import path
from . import views, api_views

urlpatterns = [
    path('', views.calculator, name='calculator'),
    path('api/calculate/', api_views.api_calculate, name='api_calculate'),
]
