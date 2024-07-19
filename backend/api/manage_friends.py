from models import FriendRequest, User
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework import status

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def send_friend_request(req, userId):
    from_ = req.user
    to_ = User.objects.get(id=userId)
    data, created =  FriendRequest.objects.get_or_create(to_user=to_, from_user=from_)
    if created:
        return Response({
            'detail' : "Friend request sent successfuly"
        }, status=status.HTTP_201_CREATED)
    else:
        return Response({
            'detail' : "Friend request already sent"
        }, status=status.HTTP_208_ALREADY_REPORTED)


@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def accept_friend_request(req, requestId):
    friend_req = FriendRequest.objects.get(id=requestId)
    if friend_req.to_user == req.user:
        friend_req.to_user.friends.add(friend_req.from_user)
        friend_req.from_user.friends.add(friend_req.to_user)
        Response({
            'detail' : 'Request accepted successfuly'
        }, status=status.HTTP_200_OK)
    else:
        Response({
            'detail' : 'Request accepted successfuly'
        }, status=status.HTTP_406_NOT_ACCEPTABLE)
