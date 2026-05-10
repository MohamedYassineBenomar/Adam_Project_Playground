from django.contrib.auth.hashers import make_password
from django.core.management.base import BaseCommand

from api.models import Product, Review, User


SELLERS = [
    {
        "name": "Fruites Mireia",
        "email": "mireia@example.com",
        "phone": "+34 600 111 222",
        "city": "Barcelona",
    },
    {
        "name": "Forn Roca",
        "email": "roca@example.com",
        "phone": "+34 600 333 444",
        "city": "Barcelona",
    },
    {
        "name": "Lácteos del Centro",
        "email": "lacteos@example.com",
        "phone": "+34 600 555 666",
        "city": "Madrid",
    },
    {
        "name": "Horta Mediterrània",
        "email": "horta@example.com",
        "phone": "+34 600 777 888",
        "city": "Valencia",
    },
]

PRODUCTS = [
    {
        "title": "Taronges de l'horta",
        "description": "Taronges de proximitat, collides aquesta setmana.",
        "image": "https://images.unsplash.com/photo-1547514701-42782101795e?w=600",
        "price": "2.50",
        "unit": "kg",
        "category": "Fruits",
        "owner_email": "mireia@example.com",
        "address": "Mercat de la Boqueria, La Rambla 91, 08001 Barcelona",
        "latitude": 41.3818,
        "longitude": 2.1717,
    },
    {
        "title": "Maduixes del Maresme",
        "description": "Maduixes dolces de cultiu local.",
        "image": "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600",
        "price": "3.20",
        "unit": "kg",
        "category": "Fruits",
        "owner_email": "mireia@example.com",
        "address": "Carrer de Provença 250, 08008 Barcelona",
        "latitude": 41.3923,
        "longitude": 2.1610,
    },
    {
        "title": "Pa de pagès",
        "description": "Pa fet amb massa mare i farina ecològica.",
        "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600",
        "price": "3.80",
        "unit": "ud",
        "category": "Bakery",
        "owner_email": "roca@example.com",
        "address": "Carrer de Sants 124, 08028 Barcelona",
        "latitude": 41.3753,
        "longitude": 2.1349,
    },
    {
        "title": "Coca de recapte",
        "description": "Coca tradicional amb escalivada i tonyina.",
        "image": "https://images.unsplash.com/photo-1568051243851-f9b136146e97?w=600",
        "price": "5.50",
        "unit": "ud",
        "category": "Bakery",
        "owner_email": "roca@example.com",
        "address": "Carrer de Sants 124, 08028 Barcelona",
        "latitude": 41.3753,
        "longitude": 2.1349,
    },
    {
        "title": "Queso manchego curado",
        "description": "Queso de oveja curado 12 meses.",
        "image": "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=600",
        "price": "12.90",
        "unit": "kg",
        "category": "Dairy",
        "owner_email": "lacteos@example.com",
        "address": "Mercado de San Miguel, Plaza de San Miguel, 28005 Madrid",
        "latitude": 40.4154,
        "longitude": -3.7090,
    },
    {
        "title": "Yogur natural artesano",
        "description": "Yogur cremoso elaborado con leche fresca local.",
        "image": "https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=600",
        "price": "1.80",
        "unit": "ud",
        "category": "Dairy",
        "owner_email": "lacteos@example.com",
        "address": "Calle Mayor 32, 28013 Madrid",
        "latitude": 40.4154,
        "longitude": -3.7110,
    },
    {
        "title": "Tomates de la huerta",
        "description": "Tomates valencianos recogidos esta mañana.",
        "image": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600",
        "price": "2.10",
        "unit": "kg",
        "category": "Vegetables",
        "owner_email": "horta@example.com",
        "address": "Mercat Central, Plaça de la Ciutat de Bruges, 46001 Valencia",
        "latitude": 39.4733,
        "longitude": -0.3789,
    },
    {
        "title": "Lechuga romana",
        "description": "Lechuga fresca de cultivo ecológico.",
        "image": "https://images.unsplash.com/photo-1622205313162-be1d5712a43f?w=600",
        "price": "1.20",
        "unit": "ud",
        "category": "Vegetables",
        "owner_email": "horta@example.com",
        "address": "Carrer de Colón 12, 46004 Valencia",
        "latitude": 39.4699,
        "longitude": -0.3753,
    },
]

REVIEWS = [
    {"store_email": "mireia@example.com", "estrellas": 5, "comentario": "Fruita fresquíssima, sempre de temporada."},
    {"store_email": "mireia@example.com", "estrellas": 4, "comentario": "Molt bon tracte i productes locals."},
    {"store_email": "roca@example.com", "estrellas": 5, "comentario": "El millor pa del barri."},
    {"store_email": "lacteos@example.com", "estrellas": 4, "comentario": "Queso con mucho sabor, recomendable."},
    {"store_email": "horta@example.com", "estrellas": 5, "comentario": "Verduras frescas a precio justo."},
]


class Command(BaseCommand):
    help = "Seed the database with demo sellers, products and reviews."

    def handle(self, *args, **options):
        sellers_by_email = {}

        for seller in SELLERS:
            user, created = User.objects.get_or_create(
                email=seller["email"],
                defaults={
                    "name": seller["name"],
                    "password": make_password("demo1234"),
                    "phone": seller["phone"],
                    "city": seller["city"],
                    "role": "seller",
                },
            )
            sellers_by_email[seller["email"]] = user

        for product in PRODUCTS:
            owner = sellers_by_email[product["owner_email"]]
            Product.objects.get_or_create(
                title=product["title"],
                owner=owner,
                defaults={
                    "description": product["description"],
                    "image": product["image"],
                    "price": product["price"],
                    "unit": product["unit"],
                    "category": product["category"],
                    "city": owner.city,
                    "address": product["address"],
                    "latitude": product["latitude"],
                    "longitude": product["longitude"],
                },
            )

        for review in REVIEWS:
            store = sellers_by_email[review["store_email"]]
            Review.objects.get_or_create(
                store=store,
                comentario=review["comentario"],
                defaults={"estrellas": review["estrellas"]},
            )

        self.stdout.write(
            self.style.SUCCESS(
                f"Seeded {len(SELLERS)} sellers, "
                f"{len(PRODUCTS)} products, {len(REVIEWS)} reviews. "
                "Demo seller password: demo1234"
            )
        )
