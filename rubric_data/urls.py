from django.urls import include, path

from .views import course_data

urlpatterns = [
    path('<int:course_id>/', course_data, name='course_data')
]
