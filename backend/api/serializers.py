from rest_framework import serializers
from .models import User
from django.core.validators import validate_email
from django.contrib.auth.hashers import make_password


class UserRegistrationSerializer(serializers.ModelSerializer):
    def validate(self, data):
        if (len(data["username"]) < 5):
            raise serializers.ValidationError("username cannot have less than 5 characters.")
        if (len(data["username"]) > 20):
            raise serializers.ValidationError("username cannot have more than 20 characeters.")
        # if (data["password"] == data["username"]):
        #     raise serializers.ValidationError("password cannot be the same as the username")
        if (len(data["password"]) < 10):
            raise serializers.ValidationError("password cannot have less than 10 characters")
        # todo: call validate_password
        return data

    def create(self, validated_data):
        validated_data["password"] = make_password(validated_data.get("password"))
        return super(UserRegistrationSerializer, self).create(validated_data)

    class Meta:
        model = User
        fields = ['username', 'password', 'email']
        write_only_fields = ['password']
