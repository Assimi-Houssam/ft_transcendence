from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import UserRegistrationSerializer
from .models import User
import requests
import random
import os

@api_view(['POST'])
def register(request):
    user = UserRegistrationSerializer(data=request.data)
    if user.is_valid():
        user.save()
        return Response({
            'detail': 'User created successfully'
        }, status=status.HTTP_201_CREATED)
    errs = {'detail': []}
    for err in user.errors:
        errs['detail'].extend(user.errors[err])
    return Response(errs, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")
    user = authenticate(username=username, password=password)
    if user == None:
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_403_FORBIDDEN)
    # once a token is generated for a user, it'll always be able to log the user in, even if the user changes the password etc
    # todo: possibly start blacklisting tokens on logout/password change (but that kind of breaks jwt's purpose)
    token = AccessToken.for_user(user)
    resp = Response({"detail": "Logged in successfully"})
    resp.set_cookie("access_token", str(token), httponly=True)
    return resp

@api_view(['POST'])
def logout(request):
    token = request.COOKIES.get("access_token") or None
    if token == None:
        return Response({"detail": "Not logged in"}, status=status.HTTP_400_BAD_REQUEST)
    response = Response({"detail": "Logged out successfully"})
    response.delete_cookie('access_token')
    return response

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
        print(f"resp: {r.text}")
        return Response({"detail": "An error occured fetching an access token from 42"}, status=status.HTTP_400_BAD_REQUEST)
    access_token = r.json()["access_token"]
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    r = requests.get(me_endpoint, headers=headers)
    if (r.status_code != requests.codes.ok):
        print(f"an error has occured fetching user info, access_token: {access_token}")
        return Response({"detail": "An error occured fetching user info from 42"}, status=status.HTTP_400_BAD_REQUEST)
    user_info = r.json()
    intra_login = user_info['login']
    intra_email = user_info['email']
    intra_id = user_info['id']
    # check if the 42 account is already registered
    try:
        intra_user = User.objects.get(intra_id=intra_id)
        # user already has an account created with his intra, return his token
        token = AccessToken.for_user(intra_user)
        print(f"intra user logging in: {intra_user.username}")
        resp = Response({"detail", "Logged in successfully"})
        resp.set_cookie("access_token", str(token), httponly=True)
        return resp
    # user has not created an account with his intra, create a new one for him
    except User.DoesNotExist:
        try:
            intra_user = User.objects.get(username=intra_login)
            # the user's intra login is already taken, we append a random number for this user to create a unique username
            new_login = intra_login + str(random.randint(0, 100))
            user = User.objects.create(username=new_login, email=intra_email, intra_id=intra_id)
            token = AccessToken.for_user(user)
            resp = Response({"detail", "Logged in successfully"})
            print(f"intra user registering in: {user.username}")
            resp.set_cookie("access_token", str(token), httponly=True)
            return resp
            # return Response({"refresh": str(tokens), "access": str(tokens.access_token)})
        except User.DoesNotExist:
            # username not taken, create a normal account and return a refresh token
            user = User.objects.create(username=intra_login, email=intra_email, intra_id=intra_id)
            print(f"intra user logging in: {user.username}")
            token = AccessToken.for_user(user)
            resp = Response({"detail", "Logged in successfully"})
            resp.set_cookie("access_token", str(token), httponly=True)
            return resp


class JWTAuth(JWTAuthentication):
    def authenticate(self, request):        
        raw_token = request.COOKIES.get("access_token") or None
        if raw_token is None:
            return None
        validated_token = self.get_validated_token(raw_token)
        return self.get_user(validated_token), validated_token