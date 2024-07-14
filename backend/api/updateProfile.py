from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Profile, User

@api_view(['PUT'])
def updateProfile(req):
    try:
        # get the user
        user_id = req.data['user_id']; #need to defined in the request 
        # check first if is user logged in
        if not req.user.is_authenticated:
            return Response({
                'ok' : False,
                'message' : 'User is not logged in',
            })
        user = User.objects.get(id=user_id);
        if not(user.intra_id) and  not(user.check_password(req.data['confirm_password'])) :
            return Response({
                'ok' : False,
                'message' : 'Incorrect password',
            })
        # update the user
        user.first_name = req.data['user_firstname']
        user.last_name = req.data['user_lastname']
        user.username = req.data['user_name']
        user.email = req.data['user_email']
        if 'user_password' in req.data and req.data['user_password'] != '' and not(user.intra_id):
            user.set_password(req.data['user_password'])
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
