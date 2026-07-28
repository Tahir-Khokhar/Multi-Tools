from django.http import JsonResponse

def api_root(request):
    return JsonResponse({
        "message": "MultiTool API",
        "endpoints": {
            "calculator": "/api/calculator/",
            "alarms": "/api/alarms/",
            "snake-score": "/api/snake-score/",
            "dino-score": "/api/dino-score/"
        }
    })

def api_calculator(request):
    return JsonResponse({
        "endpoint": "POST /cal/api/calculate/",
        "body": {"expression": "2+2*3"},
        "returns": {"result": 8}
    })

def api_alarms(request):
    return JsonResponse({
        "endpoints": {
            "list": "GET /alm/api/alarms/",
            "create": "POST /alm/api/alarms/create/",
            "delete": "DELETE /alm/api/alarms/delete/<id>/"
        }
    })

def api_snake_score(request):
    return JsonResponse({
        "endpoints": {
            "get": "GET /sng/api/score/",
            "post": "POST /sng/api/score/"
        }
    })

def api_dino_score(request):
    return JsonResponse({
        "endpoints": {
            "get": "GET /dio/api/score/",
            "post": "POST /dio/api/score/"
        }
    })
