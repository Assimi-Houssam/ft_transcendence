from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .auth import JWTAuth
from .serializers import MatchSerializer
from .models import Room


@api_view(['GET'])
@authentication_classes([JWTAuth])
@permission_classes([IsAuthenticated])
def get_user_scores(req, user_id):
    user_scores_raw = Room.objects.all()
    print(f"raw_obj: {user_scores_raw}")
    user_scores = MatchSerializer(user_scores_raw, many=True)
    print(f"user scores: {user_scores.data}")
    return Response({"matches": user_scores.data})