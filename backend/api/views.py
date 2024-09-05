from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .auth import JWTAuth
from .serializers import UserSerializer, UserSerializerMe
from .models import User

@api_view(['GET'])
@authentication_classes([JWTAuth])
@permission_classes([IsAuthenticated])
def me(request):
    # todo : remove the frinds who blocked req.user
    serializer = UserSerializerMe(request.user);
    return Response(serializer.data)


@api_view(['GET'])
@authentication_classes([JWTAuth])
@permission_classes([IsAuthenticated])
def filter_users(request):
    query = request.GET["query"]
    data = User.objects.filter(username__icontains=query)
    users = UserSerializer(data, many=True)
    return Response({
        'detail' : users.data
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([JWTAuth])
@permission_classes([IsAuthenticated])
def get_user(req, userID) :
    user = User.objects.get(id=userID)
    print(user.block_list.all())
    if req.user in user.block_list.all() :
        return Response({
            "detail" : "Couldn't find that user"
        }, status=status.HTTP_404_NOT_FOUND)
    serializer = UserSerializer(user);
    return Response({
        "detail" : serializer.data
    }, status=status.HTTP_200_OK)