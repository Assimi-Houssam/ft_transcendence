from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import  User
import datetime


@api_view(['POST'])
def updateProfile(req):
    try:
        user_id = req.POST['user_id'];
        if not req.user.is_authenticated:
            return Response({
                'ok' : False,
                'message' : 'User is not logged in',
            })
        user = User.objects.get(id=user_id);
        if not(user.intra_id) and  not(user.check_password(req.POST['confirm_password'])) :
            return Response({
                'ok' : False,
                'message' : 'Incorrect password',
            })
        # update the user
        user.first_name = req.POST['user_firstname']
        user.last_name = req.POST['user_lastname']
        user.username = req.POST['user_name']
        user.email = req.POST['user_email']
        if 'user_password' in req.POST and req.POST['user_password'] != '' and not(user.intra_id):
            user.set_password(req.POST['user_password'])
        if req.FILES.get('user_pfp'):
            user.pfp = req.FILES['user_pfp']
        user.save()
        return Response({
            'ok' : True,
            'message' : 'Profile updated successfully',
        })
    except Exception as e:
        return Response({
            'ok' : False,
            'message' : str(e),
        })
