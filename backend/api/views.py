from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .auth import JWTAuth

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
