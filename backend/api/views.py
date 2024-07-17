from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from .serializers import UserRegistrationSerializer
from rest_framework.response import Response
from rest_framework import status
from .models import User
import requests
import random
import os

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def me(request):
    user = request.user
    return Response({
        "first_name": user.first_name,
        "last_name": user.last_name,
        "username": user.username, 
        "email": user.email, 
        "id": user.id, 
        "intra_id": user.intra_id, 
        "pfp": user.pfp.url
    })

@api_view(['POST'])
def register(request):
    user = UserRegistrationSerializer(data=request.data)
    if user.is_valid():
        user.save()
        return Response({
            'detail': 'User created successfully'
        }, status=status.HTTP_201_CREATED)
    errs = {'error': []}
    for err in user.errors:
        errs['error'].extend(user.errors[err])
    return Response(errs, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def oauth_login(request):
    access_token_endpoint = "https://api.intra.42.fr/oauth/token"
    me_endpoint = "https://api.intra.42.fr/v2/me"
    print(f"code: {request.data['code']}")
    params = {
        "grant_type": "authorization_code",
        "code": request.data["code"],
        "state": request.data["state"],
        "redirect_uri": "http://localhost/login",
        "client_id": os.getenv("INTRA_UID"),
        "client_secret": os.getenv("INTRA_SECRET")
    }
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    r = requests.post(access_token_endpoint, data=params, headers=headers)
    if (r.status_code != requests.codes.ok):
        print("an error has occured")
        return Response({"error": "An error occured fetching an access token from 42", "detail": r.text})
    access_token = r.json()["access_token"]
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    r = requests.get(me_endpoint, headers=headers)
    if (r.status_code != requests.codes.ok):
        print(f"an error has occured fetching user info, access_token: {access_token}")
        return Response({"error": "An error occured fetching user info from 42"})
    user_info = r.json()
    intra_login = user_info['login']
    intra_email = user_info['email']
    intra_id = user_info['id']
    # check if the 42 account is already registered
    try:
        intra_user = User.objects.get(intra_id=intra_id)
        # user already has an account created with his intra, return his token
        tokens = RefreshToken.for_user(intra_user)
        return Response({"refresh": str(tokens), "access": str(tokens.access_token)})
    # user has not created an account with his intra, create a new one for him
    except User.DoesNotExist:
        try:
            intra_user = User.objects.get(username=intra_login)
            # the user's intra login is already taken, we append a random number for this user to create a unique username
            new_login = intra_login + str(random.randint(0, 100))
            user = User.objects.create(username=new_login, email=intra_email, intra_id=intra_id)
            tokens = RefreshToken.for_user(user)
            return Response({"refresh": str(tokens), "access": str(tokens.access_token)})
        except User.DoesNotExist:
            # username not taken, create a normal account and return a refresh token
            user = User.objects.create(username=intra_login, email=intra_email, intra_id=intra_id)
            tokens = RefreshToken.for_user(user)
            return Response({"refresh": str(tokens), "access": str(tokens.access_token)})
