from django.urls import include, path

from .views import get_some_data

urlpatterns = [
    path('some_data', get_some_data, name='some_data')
]
