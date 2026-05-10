# Rutes de l'app Mercat Local. Cada URL apunta a una funció @api_view de views.py
from django.urls import path

from . import views

urlpatterns = [
    # Autenticació
    path("api/registre/", views.registre, name="registre"),
    path("api/login/", views.login, name="login"),
    # Categories
    path("api/categories/", views.list_categories, name="list_categories"),
    # Productes
    path("api/productes/", views.list_productes, name="list_productes"),
    path("api/productes/<int:pk>/", views.retrieve_producte, name="retrieve_producte"),
    path("api/productes/add/", views.create_producte, name="create_producte"),
    # Ressenyes
    path("api/ressenyes/", views.list_ressenyes, name="list_ressenyes"),
    path("api/ressenyes/add/", views.create_ressenya, name="create_ressenya"),
    # Perfil
    path("api/perfil/", views.retrieve_perfil, name="retrieve_perfil"),
    path("api/perfil/update/", views.update_perfil, name="update_perfil"),
]
