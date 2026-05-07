from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .geocoding import geocode_address
from .models import Product, Review
from .serializers import (
    ProductSerializer,
    ProfileUpdateSerializer,
    RegisterSerializer,
    ReviewSerializer,
    UserSerializer,
)


@api_view(["POST"])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=400)

    user = serializer.save()
    token, _ = Token.objects.get_or_create(user=user)
    return Response(
        {"token": token.key, "user": UserSerializer(user).data},
        status=201,
    )


@api_view(["POST"])
def login(request):
    email = request.data.get("email")
    password = request.data.get("password")

    if not email or not password:
        return Response(
            {"detail": "Email and password are required."},
            status=400,
        )

    user = authenticate(request, username=email, password=password)
    if user is None:
        return Response({"detail": "Invalid credentials."}, status=401)

    token, _ = Token.objects.get_or_create(user=user)
    return Response(
        {"token": token.key, "user": UserSerializer(user).data}
    )


@api_view(["GET", "POST"])
def products(request):
    if request.method == "GET":
        all_products = Product.objects.all()
        serializer = ProductSerializer(all_products, many=True)
        return Response(serializer.data)

    # POST: only authenticated sellers can create products
    if not request.user.is_authenticated:
        return Response({"detail": "Authentication required."}, status=401)
    if request.user.role != "seller":
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
        owner=request.user,
        city=request.user.city,
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

    # POST: only authenticated users can leave a review
    if not request.user.is_authenticated:
        return Response({"detail": "Authentication required."}, status=401)

    serializer = ReviewSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=400)

    review = serializer.save(author=request.user)
    return Response(ReviewSerializer(review).data, status=201)


@api_view(["GET", "PUT"])
def profile(request):
    if not request.user.is_authenticated:
        return Response({"detail": "Authentication required."}, status=401)

    if request.method == "GET":
        return Response(UserSerializer(request.user).data)

    # PUT: update name, phone, city
    serializer = ProfileUpdateSerializer(
        request.user, data=request.data, partial=True
    )
    if not serializer.is_valid():
        return Response(serializer.errors, status=400)

    serializer.save()
    return Response(UserSerializer(request.user).data)
