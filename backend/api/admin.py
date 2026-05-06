from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Product, Review, User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ("email", "username", "role", "city", "is_staff")
    list_filter = ("role", "city", "is_staff")
    search_fields = ("email", "username")
    fieldsets = UserAdmin.fieldsets + (
        ("Mercat Local", {"fields": ("phone", "city", "role")}),
    )


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("title", "owner", "city", "category", "price", "created_at")
    list_filter = ("category", "city")
    search_fields = ("title", "description", "address")


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("store", "author", "estrellas", "fecha")
    list_filter = ("estrellas",)
