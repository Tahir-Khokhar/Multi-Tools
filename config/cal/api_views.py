from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import math

@csrf_exempt
def api_calculate(request):
    if request.method == 'POST':
        import json
        try:
            data = json.loads(request.body)
            expression = data.get('expression', '')
            result = eval(expression, {"__builtins__": {}}, {
                "sqrt": math.sqrt, "pow": pow, "abs": abs,
                "sin": math.sin, "cos": math.cos, "tan": math.tan,
                "pi": math.pi, "e": math.e, "log": math.log,
                "log10": math.log10, "factorial": math.factorial
            })
            return JsonResponse({"result": result})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    return JsonResponse({"error": "POST required"}, status=405)
