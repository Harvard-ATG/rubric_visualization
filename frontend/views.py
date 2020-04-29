from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from rubric_visualization.decorators import require_canvas_oauth_token


@login_required
@require_canvas_oauth_token
def index(request, **kwargs):
    return render(request, 'frontend/index.html')
