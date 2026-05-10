"""Models del projecte Mercat Local.

Defineix les entitats principals: Categoria, Usuari (amb dos rols),
Producte (amb FK a Categoria i a Usuari), Ressenya (FK a la botiga) i
TokenJWT (FK a Usuari) per guardar els tokens generats al login.

Les opcions de rol, ciutat i unitat es defineixen amb TextChoices per
restringir els valors acceptats. Els camps que requereixen rang
(telèfon, estrelles) usen validators MinValueValidator/MaxValueValidator.
"""
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Categoria(models.Model):
    # Categoria del producte (Fruites, Verdures, Làctics, Fleca, ...)
    nom = models.CharField(max_length=30, unique=True)

    def __str__(self):
        return self.nom


class Usuari(models.Model):
    # Rols disponibles: vendedor pot afegir productes, comprador només navega
    class Rols(models.TextChoices):
        vendedor = "Vendedor"
        comprador = "Comprador"

    # Llista de ciutats d'Espanya disponibles per a usuari/producte
    class Ciutats(models.TextChoices):
        barcelona = "Barcelona"
        madrid = "Madrid"
        valencia = "Valencia"
        sevilla = "Sevilla"
        zaragoza = "Zaragoza"
        malaga = "Malaga"
        murcia = "Murcia"
        palma = "Palma"
        bilbao = "Bilbao"
        granada = "Granada"

    nom = models.CharField(max_length=50)
    correu = models.EmailField(max_length=100, unique=True)
    contrasenya = models.CharField(max_length=255)  # guarda el hash, mai text pla
    telefon = models.IntegerField(
        validators=[MinValueValidator(100000000), MaxValueValidator(999999999)]
    )
    ciutat = models.CharField(
        max_length=20,
        choices=Ciutats.choices,
        default=Ciutats.barcelona,
    )
    rol = models.CharField(
        max_length=10,
        choices=Rols.choices,
        default=Rols.comprador,
    )

    # Relació N:N: cada usuari pot tenir molts productes favorits, i cada
    # producte pot estar als favorits de molts usuaris
    favorits = models.ManyToManyField(
        "Producte", blank=True, related_name="favorit_de"
    )

    def __str__(self):
        return f"{self.correu} ({self.rol})"


class TokenJWT(models.Model):
    # Cada token emès al login es guarda per poder auditar i revocar
    usuari = models.ForeignKey(Usuari, on_delete=models.CASCADE)
    token = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Token de {self.usuari.correu}"


class Producte(models.Model):
    # Unitats de venda més habituals als mercats de proximitat espanyols
    class Unitats(models.TextChoices):
        kg = "kg"
        g = "g"
        litre = "L"
        unitat = "ud"
        docena = "docena"

    nom = models.CharField(max_length=80)
    descripcio = models.TextField(blank=True)
    imatge = models.URLField(blank=True)
    preu = models.DecimalField(
        max_digits=8, decimal_places=2, validators=[MinValueValidator(0)]
    )
    unitat = models.CharField(
        max_length=10, choices=Unitats.choices, default=Unitats.kg
    )
    # FKs amb sufix "FK" segons la convenció de la guia d'estil
    categoriaFK = models.ForeignKey(Categoria, on_delete=models.CASCADE)
    vendedorFK = models.ForeignKey(
        Usuari, on_delete=models.CASCADE, related_name="productes"
    )
    ciutat = models.CharField(max_length=20, choices=Usuari.Ciutats.choices)
    adreca = models.CharField(max_length=255)
    latitud = models.FloatField(null=True, blank=True)
    longitud = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.nom} — {self.vendedorFK.correu}"


class Ressenya(models.Model):
    # Ressenyes lligades a la botiga (vendedor), no a un producte concret
    estrelles = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comentari = models.TextField()
    data = models.DateTimeField(auto_now_add=True)
    botigaFK = models.ForeignKey(
        Usuari,
        on_delete=models.CASCADE,
        related_name="ressenyes",
        limit_choices_to={"rol": Usuari.Rols.vendedor},
    )
    autorFK = models.ForeignKey(
        Usuari,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="ressenyes_escrites",
    )

    class Meta:
        ordering = ["-data"]

    def __str__(self):
        return f"{self.botigaFK.nom} · {self.estrelles}★"
