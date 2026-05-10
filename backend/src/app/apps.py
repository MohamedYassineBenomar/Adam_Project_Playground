from django.apps import AppConfig


# Configuració de l'única app del projecte: 'app'
class AppConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "app"
