from django.urls import path, include

from . import views

urlpatterns = [
    path('', views.dynamic_form, name='home'),
    path('registration/', include('registration.urls')),
]