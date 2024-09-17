from .models import FriendRequest, User, Notification
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import FriendRequestSerializer, UserFriendsSerializer
from .auth import JWTAuth
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
import time

max_friends = 200

@api_view(['POST'])
@authentication_classes([JWTAuth])
@permission_classes([IsAuthenticated])
def send_friend_request(req, userId):
    from_user = req.user
    to_user = User.objects.get(id=userId)
    if (from_user == to_user) or (to_user in from_user.friends.all()) :
        return Response({
            "detail" : "You cannot send a request to this user"
        }, status=status.HTTP_406_NOT_ACCEPTABLE)
    if from_user.friends.count() >= max_friends :
        return Response({
            "detail" : "You cannot add more friends; you've reached the maximum."
        },  status=status.HTTP_429_TOO_MANY_REQUESTS)
    data, created =  FriendRequest.objects.get_or_create(to_user=to_user, from_user=from_user)
    if created:
        if (to_user.online_status == 0):
            print("user is offline, appending to his unread notis")
            notification = Notification.objects.create(type="AcceptedFriendRequest", from_user=from_user)
            to_user.unread_notifications.add(notification)
            to_user.save()
        else:
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                str(to_user.id),
                {
                    "type": "notification_received",
                    "message": {
                        "type": "ReceivedFriendRequest",
                        "from_user": {
                            "username": from_user.username,
                            "id": from_user.id,
                            "pfp": from_user.pfp.url
                        },
                        "timestamp": int(time.time())
                    },
                }
            )
        return Response({
            'detail' : "Friend request sent successfuly"
        }, status=status.HTTP_201_CREATED)
    else:
        return Response({
            'detail' : "Friend request already sent"
        }, status=status.HTTP_208_ALREADY_REPORTED)


@api_view(['POST'])
@authentication_classes([JWTAuth])
@permission_classes([IsAuthenticated])
def accept_friend_request(req, requestId):
    friend_req = FriendRequest.objects.get(id=requestId)
    if req.user.friends.count() > max_friends :
        return Response({
            'detail' : "You cannot accept more friends, you've hit the maximum."
        }, status=status.HTTP_429_TOO_MANY_REQUESTS)
    if friend_req.to_user == req.user:
        friend_req.to_user.friends.add(friend_req.from_user)
        friend_req.from_user.friends.add(friend_req.to_user)
        friend_req.delete()
        if (friend_req.from_user.online_status == 0):
            print("user is offline, appending to his unread notis")
            notification = Notification.objects.create(type="AcceptedFriendRequest", from_user=friend_req.to_user)
            friend_req.from_user.unread_notifications.add(notification)
            friend_req.from_user.save()
        else:
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                str(friend_req.from_user.id),
                {
                    "type": "notification_received",
                    "message": {
                        "type": "AcceptedFriendRequest",
                        "from_user": {
                            "username": friend_req.to_user.username,
                            "id": friend_req.to_user.id,
                            "pfp": friend_req.to_user.pfp.url
                        },
                        "timestamp": int(time.time())
                    },
                }
            )
        return Response({
            'detail' : 'Request accepted successfully'
        }, status=status.HTTP_200_OK)
    else:
        return Response({
            'detail' : 'Request was not accepted'
        }, status=status.HTTP_406_NOT_ACCEPTABLE)


@api_view(['GET'])
@authentication_classes([JWTAuth])
@permission_classes([IsAuthenticated])
def friend_requests(req):
    user = req.user
    friend = FriendRequest.objects.filter(to_user=user).select_related("from_user")
    requests = FriendRequestSerializer(friend, many=True)
    if not requests:
        return Response({'detail' : 'No requests'}, status=status.HTTP_200_OK)
    return Response(requests.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@authentication_classes([JWTAuth])
@permission_classes([IsAuthenticated])
def get_friends(req) :
    user = req.user
    friends = UserFriendsSerializer(user.friends.all(), many=True)
    return Response({
        'detail' : friends.data
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
@authentication_classes([JWTAuth])
@permission_classes([IsAuthenticated])
def unfriend(req, userID) : 
    user = User.objects.get(id=userID)
    if user in req.user.friends.all() :
        req.user.friends.remove(user);
        return Response({"detail" : "User removed from your friend list"}, status=status.HTTP_200_OK)
    return Response({"detail" : "faild to remove friend"}, status=status.HTTP_406_NOT_ACCEPTABLE)