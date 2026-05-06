from django.contrib.auth.models import AbstractUser
from django.db import models


SPAIN_CITIES = [
    ("Barcelona", "Barcelona"),
    ("Madrid", "Madrid"),
    ("Valencia", "Valencia"),
    ("Sevilla", "Sevilla"),
    ("Zaragoza", "Zaragoza"),
    ("Málaga", "Málaga"),
    ("Murcia", "Murcia"),
    ("Palma", "Palma"),
    ("Bilbao", "Bilbao"),
    ("Granada", "Granada"),
]

ROLE_CHOICES = [
    ("client", "Client"),
    ("seller", "Seller"),
]


class User(AbstractUser):
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)
    city = models.CharField(max_length=50, choices=SPAIN_CITIES)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default="client")

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return f"{self.email} ({self.role})"
