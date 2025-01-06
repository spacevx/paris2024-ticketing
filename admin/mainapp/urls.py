# mainapp/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='auth_register'),
    path('login/', views.LoginView.as_view(), name='auth_login'),

    path('stadiums/', views.StadiumView.as_view(), name='stadiums-list'),  # Liste tous les stades
    path('teams/', views.TeamView.as_view(), name='teams-list'),  # Liste toutes les équipes
]