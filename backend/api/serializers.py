from rest_framework import serializers
from .models import User, Room
from django.core.validators import validate_email
from django.contrib.auth.hashers import make_password
from .models import FriendRequest

class NestedUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "pfp"]

class UserSerializerMe(serializers.ModelSerializer):
    friends = NestedUserSerializer(many=True)
    block_list = NestedUserSerializer(many=True)
    class Meta:
        model = User
        fields = ["id", "username", "banner", "pfp", "intra_id", "friends", "block_list", "date_joined", "email", "matches_won", "matches_played", "xp"]

class UserSerializer(serializers.ModelSerializer):
    friends = NestedUserSerializer(many=True)
    class Meta:
        model = User
        fields = ["id", "username", "banner", "pfp", "intra_id", "friends", "date_joined", "matches_won", "matches_played", "xp"]

class UserFriendsSerializer(serializers.ModelSerializer):
    friends = UserSerializer(many=True)
    class Meta :
        model  = User
        fields = ['friends']


class FriendRequestSerializer(serializers.ModelSerializer):
    from_user = UserSerializer()
    class Meta:
        model = FriendRequest
        fields = ["id", 'from_user']

class UserRegistrationSerializer(serializers.ModelSerializer):
    def validate(self, data):
        if (len(data["username"]) < 5):
            raise serializers.ValidationError("Username cannot have less than 5 characters.")
        if (len(data["username"]) > 20):
            raise serializers.ValidationError("Username cannot have more than 20 characeters.")
        # todo: add more password checks
        if (len(data["password"]) < 10):
            raise serializers.ValidationError("Password cannot have less than 10 characters")
        return data

    def create(self, validated_data):
        validated_data["password"] = make_password(validated_data.get("password"))
        return super(UserRegistrationSerializer, self).create(validated_data)

    class Meta:
        model = User
        fields = ['username', 'password', 'email']
        write_only_fields = ['password']

class UpdateProfileSerializer(serializers.ModelSerializer):
    def validate(self, data):
        if all(value is None for value in data.values()):
            raise serializers.ValidationError("Empty form")
        if ("username" in data and len(data["username"]) < 5):
            raise serializers.ValidationError("Username cannot have less than 5 characters.")
        if ("username" in data and len(data["username"]) > 20):
            raise serializers.ValidationError("Username cannot have more than 20 characeters.")
        if ("password" in data and len(data["password"]) < 10):
            raise serializers.ValidationError("Password cannot have less than 10 characters")
        return data
    def update(self, instance, validated_data):
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])
        return super().update(instance, validated_data)
    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'pfp', 'banner']
        write_only_fields = ['password']
        extra_kwargs = {
            'username': {'required': False},
            'email': {'required': False},
            'password': {'required': False},
            'pfp': {'required': False},
            'banner': {'required': False}
        }

class UserScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "pfp"]

class MatchSerializer(serializers.ModelSerializer):
    red_team = UserScoreSerializer(many=True, read_only=True)
    blue_team = UserScoreSerializer(many=True, read_only=True)
    players = UserScoreSerializer(many=True, read_only=True)
    class Meta:
        model = Room
        fields = ["players", 'id', 'host', 'red_team', 'blue_team', 'gamemode', 'time', 'team_size', 'customization', 'room_name', "red_team_score", "blue_team_score", "timestamp"]