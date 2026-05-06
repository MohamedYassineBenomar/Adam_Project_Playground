from django.urls import path

from . import views

urlpatterns = [
    path("register", views.register),
    path("login", views.login),
    path("products", views.products),
    path("reviews", views.reviews),
    path("profile", views.profile),
]
