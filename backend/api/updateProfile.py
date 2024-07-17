from rest_framework.decorators import api_view, permission_classes
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import  User
from .serializers import UpdateProfileSerializer


@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def updateProfile(req):
    try:
        user_id = req.POST['user_id'];
        user = User.objects.get(id=user_id);
        if not(user.intra_id) and  not(user.check_password(req.POST['confirm_password'])) :
            return Response({
                'detail' : 'Incorrect password',
            }, status=status.HTTP_400_BAD_REQUEST)
        # update the user
        data = {
            'username' : req.POST['username'],
            'email' : req.POST['email'],
        }
        serializer = UpdateProfileSerializer(user, data=data)
        if serializer.is_valid():
            if 'password' in req.POST and req.POST['password'] != '' and not(user.intra_id):
                user.set_password(req.POST['password'])
            if req.FILES.get('pfp'):
                user.pfp = req.FILES.get('pfp')
            serializer.save()
            return Response({
                'detail' : 'Profile updated successfully',
            }, status=status.HTTP_200_OK)
        else :
            errs = {'detail': []}
            for err in serializer.errors:
                errs['detail'].extend(serializer.errors[err])
            return Response(errs, status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        return Response({
            'detail' : 'User not found',
        }, status=status.HTTP_400_BAD_REQUEST)
