from rest_framework import serializers

from .models import Product, Review


class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField(required=True, max_length=150)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, min_length=4)
    phone = serializers.CharField(required=False, allow_blank=True, max_length=20)
    city = serializers.CharField(required=True, max_length=50)
    role = serializers.CharField(required=True, max_length=10)


class LoginSerializer(serializers.Serializer):
    email = serializers.CharField(required=True)
    password = serializers.CharField(required=True)


class ProfileUpdateSerializer(serializers.Serializer):
    name = serializers.CharField(required=False, max_length=150)
    phone = serializers.CharField(required=False, allow_blank=True, max_length=20)
    city = serializers.CharField(required=False, max_length=50)


class ProductSerializer(serializers.ModelSerializer):
    store_name = serializers.CharField(source="owner.name", read_only=True)
    store_id = serializers.IntegerField(source="owner.id", read_only=True)
    phone = serializers.CharField(source="owner.phone", read_only=True)

    class Meta:
        model = Product
        fields = (
            "id",
            "title",
            "description",
            "image",
            "price",
            "unit",
            "category",
            "address",
            "latitude",
            "longitude",
            "city",
            "store_id",
            "store_name",
            "phone",
            "created_at",
        )
        read_only_fields = ("city", "latitude", "longitude", "created_at")


class ReviewSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source="author.name", read_only=True)

    class Meta:
        model = Review
        fields = ("id", "store", "estrellas", "comentario", "fecha", "author_name")
        read_only_fields = ("fecha", "author_name")
