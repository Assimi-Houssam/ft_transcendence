from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import UserRegistrationSerializer
from .models import User
import requests
import random
import os
import uuid
import json
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from .auth import JWTAuth
from django.core.cache import cache
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer


@api_view(['POST'])
@authentication_classes([JWTAuth])
@permission_classes([IsAuthenticated])
def create_room(request):
    user = request.user
    rooms = cache.get("rooms", {})
    for room in rooms.values():
        if (room["host"]["id"] == user.id):
            return Response({"detail": "User has already created a room"}, status=status.HTTP_403_FORBIDDEN)
    host_dict = {"id": user.id, "username": user.username, "pfp": "http://localhost:8000" + user.pfp.url, "banner": "http://localhost:8000" + user.banner.url}
    room_id = str(uuid.uuid4()).replace("-", "")
    room_data = {
        "id": room_id,
        "name": user.username + "'s room",
        "teamSize": "1",
        "time": "3",
        "gamemode": "pong",
        "customization": "",
        "host": host_dict,
        "users": [],
        "redTeam": [{}] * 4,
        "blueTeam": [{}] * 4,
        "started": "false"
    }
    rooms[room_id] = room_data
    cache.set("rooms", rooms)
    return Response(json.dumps(room_data))


@api_view(["GET"])
@authentication_classes([JWTAuth])
@permission_classes([IsAuthenticated])
def list_rooms(request):
    rooms = cache.get('rooms', {})
    return Response(json.dumps(list(rooms.values())))


# todo: check if the user exists
@api_view(["POST"])
@authentication_classes([JWTAuth])
@permission_classes([IsAuthenticated])
def invite_user(request):
    print(f"req data: {request.data}")
    rooms = cache.get("rooms", {})
    room_id = request.data["roomId"]
    user_id = request.data["userId"]
    if (rooms.get(room_id) is None):
        return Response(json.dumps({"detail": "Room does not exist!"}), status=status.HTTP_400_BAD_REQUEST)
    room = rooms[room_id]
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        str(user_id),
        {
            "type": "notification_received",
            "message": {
                "type": "RoomInvite",
                "from_user": {
                    "username": request.user.username,
                    "id": request.user.id,
                    "pfp": request.user.pfp.url
                },
                "roomData": room
            },
        }
    )
    return Response(json.dumps({"detail": "Invite sent!"}))