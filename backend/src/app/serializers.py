"""Serialitzadors de l'app Mercat Local.

ModelSerializer per a CRUD de Categoria, Producte, Ressenya i Usuari.
Serializer pla per als endpoints que no escriuen directament un model
(login). Cada serializer afegeix un Meta amb el model i els fields/exclude.
"""
from rest_framework import serializers

from .models import Categoria, Producte, Ressenya, Usuari


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = "__all__"


class UsuariSerializer(serializers.ModelSerializer):
    # Mai retornem la contrasenya (ni en hash) cap al frontend
    class Meta:
        model = Usuari
        exclude = ["contrasenya", "favorits"]


# Per al registre necessitem rebre la contrasenya en text pla per hashejar-la
class RegistreSerializer(serializers.ModelSerializer):
    contrasenya = serializers.CharField(write_only=True, min_length=4)

    class Meta:
        model = Usuari
        fields = ["nom", "correu", "contrasenya", "telefon", "ciutat", "rol"]


class LoginSerializer(serializers.Serializer):
    # Login: només camps d'entrada, no toca cap model directament
    correu = serializers.EmailField(required=True)
    contrasenya = serializers.CharField(required=True)


# Per editar el perfil només permetem canviar nom, telèfon i ciutat
class PerfilSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuari
        fields = ["nom", "telefon", "ciutat"]


class ProducteSerializer(serializers.ModelSerializer):
    # Camps derivats per facilitar el render al frontend (read-only)
    nom_botiga = serializers.CharField(source="vendedorFK.nom", read_only=True)
    correu_botiga = serializers.CharField(source="vendedorFK.correu", read_only=True)
    telefon_botiga = serializers.IntegerField(
        source="vendedorFK.telefon", read_only=True
    )
    nom_categoria = serializers.CharField(source="categoriaFK.nom", read_only=True)

    class Meta:
        model = Producte
        fields = [
            "id",
            "nom",
            "descripcio",
            "imatge",
            "preu",
            "unitat",
            "categoriaFK",
            "nom_categoria",
            "vendedorFK",
            "nom_botiga",
            "correu_botiga",
            "telefon_botiga",
            "ciutat",
            "adreca",
            "latitud",
            "longitud",
            "created_at",
        ]
        read_only_fields = [
            "ciutat",
            "latitud",
            "longitud",
            "created_at",
            "vendedorFK",
        ]

    # Validació personalitzada: només els vendedors poden ser owners
    def validate_vendedorFK(self, usuari):
        if usuari.rol != Usuari.Rols.vendedor:
            raise serializers.ValidationError(
                "Només un Vendedor pot afegir productes"
            )
        return usuari


class RessenyaSerializer(serializers.ModelSerializer):
    nom_autor = serializers.CharField(source="autorFK.nom", read_only=True)

    class Meta:
        model = Ressenya
        fields = [
            "id",
            "botigaFK",
            "estrelles",
            "comentari",
            "data",
            "nom_autor",
        ]
        read_only_fields = ["data", "nom_autor"]
