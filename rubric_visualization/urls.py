"""rubric_visualization URL Configuration
"""
from django.contrib import admin
from django.urls import include, path


urlpatterns = [
    # path('accounts/', include('django.contrib.auth.urls')),
    path('', include('frontend.urls')),
    path('admin/', admin.site.urls),
    path('data/', include('rubric_data.urls')),
    path('oauth/', include('canvas_oauth.urls')),
    path('lti/', include('lti_provider.urls')),
]
