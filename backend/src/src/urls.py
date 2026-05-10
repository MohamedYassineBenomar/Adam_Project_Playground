# Rutes de nivell de projecte: admin de Django + totes les rutes de la nostra app
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("app.urls")),
]
