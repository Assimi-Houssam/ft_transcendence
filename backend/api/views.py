from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .auth import JWTAuth
from .serializers import UserSerializer
from .models import User

@api_view(['GET'])
@authentication_classes([JWTAuth])
@permission_classes([IsAuthenticated])
def me(request):
    user = request.user
    return Response({
        "username": user.username, 
        "email": user.email, 
        "id": user.id, 
        "intra_id": user.intra_id, 
        "pfp": user.pfp.url
    })


@api_view(['GET'])
@authentication_classes([JWTAuth])
@permission_classes([IsAuthenticated])
def filter_users(request) :
    query = request.GET["query"]
    data = User.objects.filter(username__icontains=query)
    users = UserSerializer(data, many=True)
    return Response({
        'detail' : users.data
    }, status=status.HTTP_200_OK)
