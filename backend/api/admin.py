from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ("email", "username", "role", "city", "is_staff")
    list_filter = ("role", "city", "is_staff")
    search_fields = ("email", "username")
    fieldsets = UserAdmin.fieldsets + (
        ("Mercat Local", {"fields": ("phone", "city", "role")}),
    )
