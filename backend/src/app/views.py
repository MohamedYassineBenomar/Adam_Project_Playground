"""Vistes de l'app Mercat Local — només funcions amb @api_view.

Segueix el patró JWT explicat a classe (jwt_drf_amb_user.pdf):
- autenticar(correu, contrasenya): substitueix authenticate() de Django
- generar_token(usuari): construeix el payload i el signa amb PyJWT
- usuari_des_del_token(request): llegeix el JWT del header
  Authorization: Bearer <token>, el verifica amb jwt.decode() i retorna
  l'instància d'Usuari o None.

Els noms dels endpoints segueixen la convenció DRF (list, retrieve,
create, update, destroy) prefixats amb el recurs quan es repeteixen.
"""
import jwt
from datetime import datetime, timedelta

from django.conf import settings
from django.contrib.auth.hashers import check_password, make_password
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .geocoding import geocode_address
from .models import Categoria, Producte, Ressenya, TokenJWT, Usuari
from .serializers import (
    CategoriaSerializer,
    LoginSerializer,
    PerfilSerializer,
    ProducteSerializer,
    RegistreSerializer,
    RessenyaSerializer,
    UsuariSerializer,
)


# ── Funcions auxiliars ────────────────────────────────────────

def autenticar(correu, contrasenya):
    """Substitueix authenticate() de Django.
    Busca l'usuari pel correu i verifica la contrasenya amb check_password.
    """
    try:
        usuari = Usuari.objects.get(correu=correu)
        if check_password(contrasenya, usuari.contrasenya):
            return usuari
    except Usuari.DoesNotExist:
        pass
    return None


def generar_token(usuari):
    """Construeix el payload del JWT i el signa amb la SECRET_KEY del projecte."""
    payload = {
        "usuari_id": usuari.id,
        "correu": usuari.correu,
        "exp": datetime.utcnow() + timedelta(hours=24),
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")


def usuari_des_del_token(request):
    """Llegeix el JWT del header Authorization: Bearer <token> i retorna
    l'usuari corresponent, o None si el token no existeix, ha caducat o
    és invàlid.
    """
    header = request.headers.get("Authorization", "")
    if not header.startswith("Bearer "):
        return None
    token = header.split(" ")[1]
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        return Usuari.objects.get(id=payload["usuari_id"])
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
    except Usuari.DoesNotExist:
        return None


# ── Autenticació: registre i login ────────────────────────────

@api_view(["POST"])
def registre(request):
    # Crea un usuari nou; hashegem la contrasenya abans de desar-la
    serializer = RegistreSerializer(data=request.data)
    if serializer.is_valid():
        validated = serializer.validated_data
        validated["contrasenya"] = make_password(validated["contrasenya"])
        usuari = Usuari.objects.create(**validated)
        token = generar_token(usuari)
        TokenJWT.objects.create(usuari=usuari, token=token)
        return Response(
            {"token": token, "usuari": UsuariSerializer(usuari).data},
            status=status.HTTP_201_CREATED,
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def login(request):
    # Comprova credencials amb autenticar() i emet un nou JWT
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        correu = serializer.validated_data["correu"]
        contrasenya = serializer.validated_data["contrasenya"]
        usuari = autenticar(correu, contrasenya)
        if usuari is None:
            return Response(
                {"error": "Credencials incorrectes"},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        token = generar_token(usuari)
        TokenJWT.objects.create(usuari=usuari, token=token)
        return Response(
            {"token": token, "usuari": UsuariSerializer(usuari).data}
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ── Categoria ─────────────────────────────────────────────────

@api_view(["GET"])
def list_categories(request):
    # Llista totes les categories per emplenar el dropdown del frontend
    categories = Categoria.objects.all()
    serializer = CategoriaSerializer(categories, many=True)
    return Response(serializer.data)


# ── Producte ──────────────────────────────────────────────────

@api_view(["GET"])
def list_productes(request):
    # Llista pública de tots els productes
    productes = Producte.objects.all()
    serializer = ProducteSerializer(productes, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def retrieve_producte(request, pk):
    try:
        producte = Producte.objects.get(pk=pk)
    except Producte.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    serializer = ProducteSerializer(producte)
    return Response(serializer.data)


@api_view(["POST"])
def create_producte(request):
    # Cal estar autenticat i ser vendedor per afegir productes
    usuari = usuari_des_del_token(request)
    if usuari is None:
        return Response(
            {"error": "Token requerit"}, status=status.HTTP_401_UNAUTHORIZED
        )
    if usuari.rol != Usuari.Rols.vendedor:
        return Response(
            {"error": "Només els venedors poden crear productes"},
            status=status.HTTP_403_FORBIDDEN,
        )

    serializer = ProducteSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Geocodifiquem l'adreça amb Nominatim per obtenir lat/lng
    adreca = serializer.validated_data["adreca"]
    coords = geocode_address(adreca)
    if coords is None:
        return Response(
            {"adreca": "Adreça no trobada, comprova-la"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    latitud, longitud = coords
    producte = serializer.save(
        vendedorFK=usuari,
        ciutat=usuari.ciutat,
        latitud=latitud,
        longitud=longitud,
    )
    return Response(
        ProducteSerializer(producte).data, status=status.HTTP_201_CREATED
    )


# ── Ressenya ──────────────────────────────────────────────────

@api_view(["GET"])
def list_ressenyes(request):
    # Si rebem botiga_id per query param, filtrem per aquella botiga
    botiga_id = request.query_params.get("botiga_id")
    if botiga_id:
        ressenyes = Ressenya.objects.filter(botigaFK_id=botiga_id)
    else:
        ressenyes = Ressenya.objects.all()
    serializer = RessenyaSerializer(ressenyes, many=True)
    return Response(serializer.data)


@api_view(["POST"])
def create_ressenya(request):
    # Cal estar autenticat per deixar una ressenya
    usuari = usuari_des_del_token(request)
    if usuari is None:
        return Response(
            {"error": "Token requerit"}, status=status.HTTP_401_UNAUTHORIZED
        )
    serializer = RessenyaSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    ressenya = serializer.save(autorFK=usuari)
    return Response(
        RessenyaSerializer(ressenya).data, status=status.HTTP_201_CREATED
    )


# ── Perfil de l'usuari ────────────────────────────────────────

@api_view(["GET"])
def retrieve_perfil(request):
    # Retorna les dades de l'usuari autenticat
    usuari = usuari_des_del_token(request)
    if usuari is None:
        return Response(
            {"error": "Token requerit"}, status=status.HTTP_401_UNAUTHORIZED
        )
    return Response(UsuariSerializer(usuari).data)


@api_view(["PUT"])
def update_perfil(request):
    # Permet editar nom, telefon i ciutat (correu i rol no editables)
    usuari = usuari_des_del_token(request)
    if usuari is None:
        return Response(
            {"error": "Token requerit"}, status=status.HTTP_401_UNAUTHORIZED
        )
    serializer = PerfilSerializer(usuari, data=request.data, partial=True)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    serializer.save()
    return Response(UsuariSerializer(usuari).data)
