from django.contrib import admin

from .models import Product, Review, TokenJWT, User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("email", "name", "role", "city")
    list_filter = ("role", "city")
    search_fields = ("email", "name")


@admin.register(TokenJWT)
class TokenJWTAdmin(admin.ModelAdmin):
    list_display = ("user", "created_at")


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("title", "owner", "city", "category", "price", "created_at")
    list_filter = ("category", "city")
    search_fields = ("title", "description", "address")


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("store", "author", "estrellas", "fecha")
    list_filter = ("estrellas",)
