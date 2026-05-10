# Registre dels models al panell d'administració de Django
from django.contrib import admin

from .models import Categoria, Producte, Ressenya, TokenJWT, Usuari


@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ("nom",)


@admin.register(Usuari)
class UsuariAdmin(admin.ModelAdmin):
    list_display = ("correu", "nom", "rol", "ciutat")
    list_filter = ("rol", "ciutat")
    search_fields = ("correu", "nom")


@admin.register(TokenJWT)
class TokenJWTAdmin(admin.ModelAdmin):
    list_display = ("usuari", "created_at")


@admin.register(Producte)
class ProducteAdmin(admin.ModelAdmin):
    list_display = ("nom", "vendedorFK", "ciutat", "categoriaFK", "preu", "unitat")
    list_filter = ("categoriaFK", "ciutat")
    search_fields = ("nom", "descripcio", "adreca")


@admin.register(Ressenya)
class RessenyaAdmin(admin.ModelAdmin):
    list_display = ("botigaFK", "autorFK", "estrelles", "data")
    list_filter = ("estrelles",)
