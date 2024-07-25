from .models import FriendRequest, User
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework import status
from .serializers import FriendRequestSerializer

max_requests = 100
max_friends  = 100

def is_reached_max_requests(from_user) :
    requests = FriendRequest.objects.filter(from_user=from_user).all();
    if len(requests) >= max_requests :
        return True
    return False

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def send_friend_request(req, userId):
    from_ = req.user
    to_ = User.objects.get(id=userId)
    if (from_ == to_) or (to_ in from_.friends.all()) :
        return Response({
            "detail" : "You cannot send a request to this user"
        }, status=status.HTTP_406_NOT_ACCEPTABLE)
    if is_reached_max_requests(from_):
        return Response({
            "detail" : "You cannot add more friends; you've reached the maximum requests"
        },  status=status.HTTP_429_TOO_MANY_REQUESTS)
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
    if req.user.friends.count() > max_friends :
        return Response({
            'detail' : "You cannot accept more friends, you've hit the maximum."
        }, status=status.HTTP_429_TOO_MANY_REQUESTS)
    if friend_req.to_user == req.user:
        friend_req.to_user.friends.add(friend_req.from_user)
        friend_req.from_user.friends.add(friend_req.to_user)
        friend_req.delete()
        return Response({
            'detail' : 'Request accepted successfuly'
        }, status=status.HTTP_200_OK)
    else:
        return Response({
            'detail' : 'Request was not accepted'
        }, status=status.HTTP_406_NOT_ACCEPTABLE)


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def friend_requests(req):
    user = req.user
    friend = FriendRequest.objects.filter(to_user=user).select_related("from_user")
    requests = FriendRequestSerializer(friend, many=True)
    if not requests:
        return Response({'detail' : 'No requests'}, status=status.HTTP_200_OK)
    return Response(requests.data, status=status.HTTP_200_OK)