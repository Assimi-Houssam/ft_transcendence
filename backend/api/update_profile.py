from rest_framework.decorators import api_view, permission_classes
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import  User
from .serializers import UpdateProfileSerializer


# todo: ratelimit this
@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def update_profile(req):
    user = req.user
    old_passwd_conf = req.POST.get("confirm_password")
    if (user.intra_id != None and req.POST.get("password") != None):
        return Response({"detail": "Accounts created via 42 cannot update their passwords"}, status=status.HTTP_400_BAD_REQUEST)
    if (user.intra_id == None and not user.check_password(old_passwd_conf)):
        return Response({
            'detail': 'Incorrect password',
        }, status=status.HTTP_400_BAD_REQUEST)
    data = {}
    if req.POST.get("username"):
        data["username"] = req.POST.get("username")
    if req.POST.get("email"):
        data["email"] = req.POST.get("email")
    if req.POST.get("password"):
        data["password"] = req.POST.get("password")
    if req.FILES.get("pfp"):
        data["pfp"] = req.FILES.get("pfp")
    serializer = UpdateProfileSerializer(user, data=data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({
            'detail': 'Profile updated successfully',
        }, status=status.HTTP_200_OK)
    else:
        # errs = {'detail': []}
        # for err in serializer.errors:
        #     errs['detail'].extend(serializer.errors[err])
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
