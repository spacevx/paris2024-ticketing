# config/urls.py
from django.contrib import admin
from django.urls import path, include, reverse_lazy
from django.contrib.auth import views as auth_views
from mainapp.views import AdminView, UpdateEventView, CreateEventView, DeleteEventView

urlpatterns = [
    path('myadmin/', include(([
        path('', AdminView.as_view(), name='my_admin'),
        path('login/', auth_views.LoginView.as_view(template_name='admin/login.html'), name='login'),
        path('logout/', auth_views.LogoutView.as_view(next_page='myadmin:login'), name='logout'),  # Modifiez cette ligne
        path('update-event/', UpdateEventView.as_view(), name='update-event'),
        path('event/create/', CreateEventView.as_view(), name='create-event'),
        path('event/<int:pk>/delete/', DeleteEventView.as_view(), name='delete-event'),
    ], 'myadmin'))),
   
    path('admin/', admin.site.urls),
    path('api/', include('mainapp.urls')),
]