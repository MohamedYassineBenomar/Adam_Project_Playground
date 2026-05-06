from rest_framework import serializers

from .models import Product, Review, User


class UserSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="username")

    class Meta:
        model = User
        fields = ("id", "name", "email", "phone", "city", "role")


class RegisterSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="username")
    password = serializers.CharField(write_only=True, min_length=4)

    class Meta:
        model = User
        fields = ("name", "email", "password", "phone", "city", "role")

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class ProfileUpdateSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="username")

    class Meta:
        model = User
        fields = ("name", "phone", "city")


class ProductSerializer(serializers.ModelSerializer):
    store_name = serializers.CharField(source="owner.username", read_only=True)
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
    author_name = serializers.CharField(source="author.username", read_only=True)

    class Meta:
        model = Review
        fields = ("id", "store", "estrellas", "comentario", "fecha", "author_name")
        read_only_fields = ("fecha", "author_name")
