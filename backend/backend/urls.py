"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from api import views, updateProfile
from rest_framework_simplejwt import views as jwt_views


urlpatterns = [
    path("me", views.me),
    path("register", views.register),
    path("oauth-login", views.oauth_login),
    path("login", jwt_views.TokenObtainPairView.as_view()),
    path("login/refresh", jwt_views.TokenRefreshView.as_view()),
    path('admin/', admin.site.urls),
    # update user profile endpoints
    path("user/update", updateProfile.updateProfile),
]
