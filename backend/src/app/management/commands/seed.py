"""Comanda de seeding per omplir la base de dades amb dades de demo.

Crea categories, vendedors, productes i ressenyes per poder defensar el
projecte sense haver d'introduir-ho tot a mà.

Ús: python manage.py seed
"""
from django.contrib.auth.hashers import make_password
from django.core.management.base import BaseCommand

from app.models import Categoria, Producte, Ressenya, Usuari


CATEGORIES = ["Fruites", "Verdures", "Lactics", "Fleca"]


VENEDORS = [
    {
        "nom": "Fruites Mireia",
        "correu": "mireia@example.com",
        "telefon": 600111222,
        "ciutat": "Barcelona",
    },
    {
        "nom": "Forn Roca",
        "correu": "roca@example.com",
        "telefon": 600333444,
        "ciutat": "Barcelona",
    },
    {
        "nom": "Lacteos del Centro",
        "correu": "lacteos@example.com",
        "telefon": 600555666,
        "ciutat": "Madrid",
    },
    {
        "nom": "Horta Mediterrania",
        "correu": "horta@example.com",
        "telefon": 600777888,
        "ciutat": "Valencia",
    },
]


PRODUCTES = [
    {
        "nom": "Taronges de l'horta",
        "descripcio": "Taronges de proximitat, collides aquesta setmana.",
        "imatge": "https://images.unsplash.com/photo-1547514701-42782101795e?w=600",
        "preu": "2.50",
        "unitat": "kg",
        "categoria": "Fruites",
        "venedor": "mireia@example.com",
        "adreca": "Mercat de la Boqueria, La Rambla 91, 08001 Barcelona",
        "latitud": 41.3818,
        "longitud": 2.1717,
    },
    {
        "nom": "Maduixes del Maresme",
        "descripcio": "Maduixes dolces de cultiu local.",
        "imatge": "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600",
        "preu": "3.20",
        "unitat": "kg",
        "categoria": "Fruites",
        "venedor": "mireia@example.com",
        "adreca": "Carrer de Provença 250, 08008 Barcelona",
        "latitud": 41.3923,
        "longitud": 2.1610,
    },
    {
        "nom": "Pa de pages",
        "descripcio": "Pa fet amb massa mare i farina ecologica.",
        "imatge": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600",
        "preu": "3.80",
        "unitat": "ud",
        "categoria": "Fleca",
        "venedor": "roca@example.com",
        "adreca": "Carrer de Sants 124, 08028 Barcelona",
        "latitud": 41.3753,
        "longitud": 2.1349,
    },
    {
        "nom": "Coca de recapte",
        "descripcio": "Coca tradicional amb escalivada i tonyina.",
        "imatge": "https://images.unsplash.com/photo-1568051243851-f9b136146e97?w=600",
        "preu": "5.50",
        "unitat": "ud",
        "categoria": "Fleca",
        "venedor": "roca@example.com",
        "adreca": "Carrer de Sants 124, 08028 Barcelona",
        "latitud": 41.3753,
        "longitud": 2.1349,
    },
    {
        "nom": "Queso manchego curado",
        "descripcio": "Queso de oveja curado 12 meses.",
        "imatge": "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=600",
        "preu": "12.90",
        "unitat": "kg",
        "categoria": "Lactics",
        "venedor": "lacteos@example.com",
        "adreca": "Mercado de San Miguel, Plaza de San Miguel, 28005 Madrid",
        "latitud": 40.4154,
        "longitud": -3.7090,
    },
    {
        "nom": "Yogur natural artesano",
        "descripcio": "Yogur cremoso elaborado con leche fresca local.",
        "imatge": "https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=600",
        "preu": "1.80",
        "unitat": "ud",
        "categoria": "Lactics",
        "venedor": "lacteos@example.com",
        "adreca": "Calle Mayor 32, 28013 Madrid",
        "latitud": 40.4154,
        "longitud": -3.7110,
    },
    {
        "nom": "Tomates de la huerta",
        "descripcio": "Tomates valencianos recogidos esta manyana.",
        "imatge": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600",
        "preu": "2.10",
        "unitat": "kg",
        "categoria": "Verdures",
        "venedor": "horta@example.com",
        "adreca": "Mercat Central, Placa de la Ciutat de Bruges, 46001 Valencia",
        "latitud": 39.4733,
        "longitud": -0.3789,
    },
    {
        "nom": "Lechuga romana",
        "descripcio": "Lechuga fresca de cultivo ecologico.",
        "imatge": "https://images.unsplash.com/photo-1622205313162-be1d5712a43f?w=600",
        "preu": "1.20",
        "unitat": "ud",
        "categoria": "Verdures",
        "venedor": "horta@example.com",
        "adreca": "Carrer de Colon 12, 46004 Valencia",
        "latitud": 39.4699,
        "longitud": -0.3753,
    },
]


RESSENYES = [
    {"botiga": "mireia@example.com", "estrelles": 5, "comentari": "Fruita fresquissima, sempre de temporada."},
    {"botiga": "mireia@example.com", "estrelles": 4, "comentari": "Molt bon tracte i productes locals."},
    {"botiga": "roca@example.com", "estrelles": 5, "comentari": "El millor pa del barri."},
    {"botiga": "lacteos@example.com", "estrelles": 4, "comentari": "Queso con mucho sabor, recomendable."},
    {"botiga": "horta@example.com", "estrelles": 5, "comentari": "Verduras frescas a precio justo."},
]


class Command(BaseCommand):
    help = "Omple la BD amb categories, vendedors, productes i ressenyes de demo."

    def handle(self, *args, **options):
        # Crea les categories si no existeixen
        cats_per_nom = {}
        for nom in CATEGORIES:
            cat, _ = Categoria.objects.get_or_create(nom=nom)
            cats_per_nom[nom] = cat

        # Crea els vendedors amb la contrasenya hashejada
        venedors_per_correu = {}
        for v in VENEDORS:
            usuari, _ = Usuari.objects.get_or_create(
                correu=v["correu"],
                defaults={
                    "nom": v["nom"],
                    "contrasenya": make_password("demo1234"),
                    "telefon": v["telefon"],
                    "ciutat": v["ciutat"],
                    "rol": Usuari.Rols.vendedor,
                },
            )
            venedors_per_correu[v["correu"]] = usuari

        # Crea els productes
        for p in PRODUCTES:
            venedor = venedors_per_correu[p["venedor"]]
            categoria = cats_per_nom[p["categoria"]]
            Producte.objects.get_or_create(
                nom=p["nom"],
                vendedorFK=venedor,
                defaults={
                    "descripcio": p["descripcio"],
                    "imatge": p["imatge"],
                    "preu": p["preu"],
                    "unitat": p["unitat"],
                    "categoriaFK": categoria,
                    "ciutat": venedor.ciutat,
                    "adreca": p["adreca"],
                    "latitud": p["latitud"],
                    "longitud": p["longitud"],
                },
            )

        # Crea les ressenyes
        for r in RESSENYES:
            botiga = venedors_per_correu[r["botiga"]]
            Ressenya.objects.get_or_create(
                botigaFK=botiga,
                comentari=r["comentari"],
                defaults={"estrelles": r["estrelles"]},
            )

        self.stdout.write(
            self.style.SUCCESS(
                f"Seed correcte: {len(CATEGORIES)} categories, "
                f"{len(VENEDORS)} venedors, {len(PRODUCTES)} productes, "
                f"{len(RESSENYES)} ressenyes. Contrasenya demo: demo1234"
            )
        )
