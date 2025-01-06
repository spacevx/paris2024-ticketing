from django.urls import path
from .views import stadiums

# Un exemple de endpoint qui renverait les stades... Si la vue était faite :)
urlpatterns = (
    path("api/stadiums", stadiums),
)
