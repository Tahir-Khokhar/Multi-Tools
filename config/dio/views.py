from django.shortcuts import render

def dino_game(request):
    return render(request, 'dio/dino.html')
