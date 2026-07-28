from django.http import JsonResponse

def api_dino_score(request):
    if request.method == 'GET':
        score = request.session.get('dino_high_score', 0)
        return JsonResponse({"high_score": score})
    elif request.method == 'POST':
        data = request.POST
        score = int(data.get('score', 0))
        current = request.session.get('dino_high_score', 0)
        if score > current:
            request.session['dino_high_score'] = score
            return JsonResponse({"new_high_score": True, "high_score": score})
        return JsonResponse({"new_high_score": False, "high_score": current})
    return JsonResponse({"error": "GET/POST required"}, status=405)
