from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Profile, User

@api_view(['PUT'])
def updateProfile(req):
    # get the user
    # user = req.data['user_id']; #need to defined in the request 
    password = req.data['confirm_password'];
    # user = User.objects.get(user=user);

    # if not user.check_password(password):
    #     return Response({
    #         'ok' : False,
    #         'message' : 'Password is incorrect'
    #     }, status=400);
    
    return Response({
        'ok' : True,
        'message' : 'Profile updated successfully',
        'data' : {
            'username' : req.data['user_name'],
        }
    })