from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .geocoding import geocode_address
from .models import Product, Review, User
from .serializers import (
    ProductSerializer,
    ProfileUpdateSerializer,
    RegisterSerializer,
    ReviewSerializer,
    UserSerializer,
)


def _auth_payload(user):
    token, _ = Token.objects.get_or_create(user=user)
    return {"token": token.key, "user": UserSerializer(user).data}


@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    return Response(_auth_payload(user), status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get("email")
    password = request.data.get("password")
    if not email or not password:
        return Response(
            {"detail": "Email and password are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = authenticate(request, username=email, password=password)
    if user is None:
        return Response(
            {"detail": "Invalid credentials."},
            status=status.HTTP_401_UNAUTHORIZED,
        )
    return Response(_auth_payload(user))


@api_view(["GET", "POST"])
def products(request):
    if request.method == "GET":
        qs = Product.objects.select_related("owner").all()
        return Response(ProductSerializer(qs, many=True).data)

    if not request.user.is_authenticated:
        return Response(
            {"detail": "Authentication required."},
            status=status.HTTP_401_UNAUTHORIZED,
        )
    if request.user.role != "seller":
        return Response(
            {"detail": "Only sellers can add products."},
            status=status.HTTP_403_FORBIDDEN,
        )

    serializer = ProductSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    address = serializer.validated_data["address"]
    coords = geocode_address(address)
    if coords is None:
        return Response(
            {"address": "Address not found, please check it"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    lat, lng = coords
    product = serializer.save(
        owner=request.user,
        city=request.user.city,
        latitude=lat,
        longitude=lng,
    )
    return Response(
        ProductSerializer(product).data, status=status.HTTP_201_CREATED
    )


@api_view(["GET", "POST"])
def reviews(request):
    if request.method == "GET":
        store_id = request.query_params.get("store_id")
        qs = Review.objects.select_related("author", "store")
        if store_id:
            qs = qs.filter(store_id=store_id)
        return Response(ReviewSerializer(qs, many=True).data)

    if not request.user.is_authenticated:
        return Response(
            {"detail": "Authentication required."},
            status=status.HTTP_401_UNAUTHORIZED,
        )
    serializer = ReviewSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    review = serializer.save(author=request.user)
    return Response(ReviewSerializer(review).data, status=status.HTTP_201_CREATED)


@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
def profile(request):
    if request.method == "GET":
        return Response(UserSerializer(request.user).data)

    serializer = ProfileUpdateSerializer(
        request.user, data=request.data, partial=True
    )
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(UserSerializer(request.user).data)
