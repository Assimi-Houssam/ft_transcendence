from .models import User
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import FriendRequest
from .serializers import FriendRequestSerializer, UserFriendsSerializer, UserSerializerMe
from .auth import JWTAuth
from django.db.models import Q

@api_view(["POST"])
@authentication_classes([JWTAuth])
@permission_classes([IsAuthenticated])
def block(req, userID):
  user_to_block = User.objects.get(id=userID)
  if user_to_block in req.user.block_list.all() or req.user in user_to_block.block_list.all():
    return Response({
      "detail" : "faild to block this user"
    }, status=status.HTTP_208_ALREADY_REPORTED)
  blocked_user_reqs = FriendRequest.objects.filter(from_user=user_to_block)
  user_reqs = FriendRequest.objects.filter(from_user=req.user)
  if blocked_user_reqs.exists() :
    blocked_user_reqs.delete()
  if user_reqs.exists() :
      user_reqs.delete()
  req.user.friends.remove(user_to_block)
  req.user.block_list.add(user_to_block)
  return Response({
    "detail" : "User blocked successfuly"
  }, status=status.HTTP_201_CREATED)

@api_view(["POST"])
@authentication_classes([JWTAuth])
@permission_classes([IsAuthenticated])
def unblock(req, userID) :
  user_to_unblock = User.objects.get(id=userID)
  if user_to_unblock in req.user.block_list.all() :
    req.user.block_list.remove(user_to_unblock)
    return Response({
      "detail" : "User unblocked successfuly"
    }, status=status.HTTP_200_OK)
  return Response({
    "detail" : "Cannot unblock this user"
  }, status=status.HTTP_403_FORBIDDEN)