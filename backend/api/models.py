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

CATEGORY_CHOICES = [
    ("Fruits", "Fruits"),
    ("Vegetables", "Vegetables"),
    ("Dairy", "Dairy"),
    ("Bakery", "Bakery"),
]

UNIT_CHOICES = [
    ("kg", "kg"),
    ("g", "g"),
    ("L", "L"),
    ("ud", "ud"),          # unidad / pieza
    ("docena", "docena"),  # 12 unidades (huevos, etc.)
    ("manojo", "manojo"),  # bunch (hierbas, espárragos)
    ("bandeja", "bandeja"),
]


class User(models.Model):
    name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)  # sempre guardat com a hash
    phone = models.CharField(max_length=20, blank=True)
    city = models.CharField(max_length=50, choices=SPAIN_CITIES)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default="client")

    def __str__(self):
        return f"{self.email} ({self.role})"


class TokenJWT(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Token de {self.user.email}"


class Product(models.Model):
    title = models.CharField(max_length=120)
    description = models.TextField(blank=True)
    image = models.URLField(blank=True)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    unit = models.CharField(max_length=10, choices=UNIT_CHOICES, default="kg")
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="products")
    city = models.CharField(max_length=50, choices=SPAIN_CITIES)
    address = models.CharField(max_length=255)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} — {self.owner.name}"


class Review(models.Model):
    estrellas = models.PositiveSmallIntegerField()
    comentario = models.TextField()
    fecha = models.DateTimeField(auto_now_add=True)
    store = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="reviews",
        limit_choices_to={"role": "seller"},
    )
    author = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="written_reviews",
    )

    class Meta:
        ordering = ["-fecha"]

    def __str__(self):
        return f"{self.store.name} · {self.estrellas}★"
