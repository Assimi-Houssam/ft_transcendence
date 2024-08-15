from rest_framework.decorators import api_view, permission_classes
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .serializers import UpdateProfileSerializer
from .auth import JWTAuth
import datetime


def limit_user_updates(user):
    today_date = datetime.date.today()
    if user.count_updates == 0 and user.can_update_on != today_date:
        user.count_updates = 2
        user.can_update_on = today_date
    elif user.count_updates == 0:
        return False
    user.save()
    return True



@api_view(['POST'])
@authentication_classes([JWTAuth])
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
    fields = ["username", "email", "password"];
    for field in fields :
        if req.POST.get(field):
            data[field] = req.POST.get(field)
    if req.FILES.get("banner") :
        data["banner"] = req.FILES.get("banner")
        print("panner ---> ", data["banner"])
    if req.FILES.get("pfp"):
        data["pfp"] = req.FILES.get("pfp")
    serializer = UpdateProfileSerializer(user, data=data, partial=True)
    # if not limit_user_updates(user):
    #     return Response({
    #         'detail': 'You have reached the maximum number of updates for today',
    #     }, status=status.HTTP_400_BAD_REQUEST)
    if serializer.is_valid():
        user.count_updates -= 1
        print("serializer ---> ", serializer)
        serializer.save()
        return Response({
            'detail': 'Profile updated successfully',
        }, status=status.HTTP_200_OK)
    else:
        errs = {'detail': []}
        for err in serializer.errors:
            errs['detail'].extend(serializer.errors[err])
        return Response(errs, status=status.HTTP_400_BAD_REQUEST)