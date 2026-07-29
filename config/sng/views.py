from django.shortcuts import render

def snake_game(request):
    return render(request, 'sng/snake.html')
