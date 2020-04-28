from django.shortcuts import render
from canvas_oauth.oauth import get_oauth_token

def index(request):
    access_token = get_oauth_token(request)
    return render(request, 'frontend/index.html')
