import jwt
from datetime import datetime, timedelta

from django.conf import settings
from django.contrib.auth.hashers import check_password, make_password
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .geocoding import geocode_address
from .models import Product, Review, TokenJWT, User
from .serializers import (
    LoginSerializer,
    ProductSerializer,
    ProfileUpdateSerializer,
    RegisterSerializer,
    ReviewSerializer,
)


# ── Funcions auxiliars ────────────────────────────────────────

def autenticar(email, password):
    try:
        user = User.objects.get(email=email)
        if check_password(password, user.password):
            return user
    except User.DoesNotExist:
        pass
    return None


def generar_token(user):
    payload = {
        "user_id": user.id,
        "email": user.email,
        "exp": datetime.utcnow() + timedelta(hours=24),
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")


def usuari_actual(request):
    # Llegeix el JWT del header Authorization: Bearer <token>
    header = request.META.get("HTTP_AUTHORIZATION", "")
    if not header.startswith("Bearer "):
        return None

    token = header.split(" ", 1)[1]
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

    try:
        return User.objects.get(id=payload["user_id"])
    except User.DoesNotExist:
        return None


def dades_usuari(user):
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "phone": user.phone,
        "city": user.city,
        "role": user.role,
    }


# ── Vistes API (DRF) ─────────────────────────────────────────

@api_view(["POST"])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=400)

    data = serializer.validated_data
    if User.objects.filter(email=data["email"]).exists():
        return Response({"email": "Aquest email ja està registrat."}, status=400)

    user = User.objects.create(
        name=data["name"],
        email=data["email"],
        password=make_password(data["password"]),
        phone=data.get("phone", ""),
        city=data["city"],
        role=data["role"],
    )

    token = generar_token(user)
    TokenJWT.objects.create(user=user, token=token)
    return Response(
        {"token": token, "user": dades_usuari(user)},
        status=201,
    )


@api_view(["POST"])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=400)

    email = serializer.validated_data["email"]
    password = serializer.validated_data["password"]
    user = autenticar(email, password)

    if user is None:
        return Response({"detail": "Credencials incorrectes"}, status=401)

    token = generar_token(user)
    TokenJWT.objects.create(user=user, token=token)
    return Response({"token": token, "user": dades_usuari(user)})


@api_view(["GET", "POST"])
def products(request):
    if request.method == "GET":
        all_products = Product.objects.all()
        serializer = ProductSerializer(all_products, many=True)
        return Response(serializer.data)

    # POST: cal estar autenticat i ser seller
    user = usuari_actual(request)
    if user is None:
        return Response({"detail": "Authentication required."}, status=401)
    if user.role != "seller":
        return Response({"detail": "Only sellers can add products."}, status=403)

    serializer = ProductSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=400)

    address = serializer.validated_data["address"]
    coords = geocode_address(address)
    if coords is None:
        return Response(
            {"address": "Address not found, please check it"},
            status=400,
        )

    latitude, longitude = coords
    product = serializer.save(
        owner=user,
        city=user.city,
        latitude=latitude,
        longitude=longitude,
    )
    return Response(ProductSerializer(product).data, status=201)


@api_view(["GET", "POST"])
def reviews(request):
    if request.method == "GET":
        store_id = request.query_params.get("store_id")
        if store_id:
            store_reviews = Review.objects.filter(store_id=store_id)
        else:
            store_reviews = Review.objects.all()
        serializer = ReviewSerializer(store_reviews, many=True)
        return Response(serializer.data)

    # POST: cal estar autenticat
    user = usuari_actual(request)
    if user is None:
        return Response({"detail": "Authentication required."}, status=401)

    serializer = ReviewSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=400)

    review = serializer.save(author=user)
    return Response(ReviewSerializer(review).data, status=201)


@api_view(["GET", "PUT"])
def profile(request):
    user = usuari_actual(request)
    if user is None:
        return Response({"detail": "Authentication required."}, status=401)

    if request.method == "GET":
        return Response(dades_usuari(user))

    # PUT: update name, phone, city
    serializer = ProfileUpdateSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=400)

    data = serializer.validated_data
    if "name" in data:
        user.name = data["name"]
    if "phone" in data:
        user.phone = data["phone"]
    if "city" in data:
        user.city = data["city"]
    user.save()

    return Response(dades_usuari(user))
