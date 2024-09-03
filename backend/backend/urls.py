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
from api import views, update_profile, auth, manage_friends, rooms
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path("me", views.me),
    path("users/filter", views.filter_users),
    path("register", auth.register),
    path("oauth-login", auth.oauth_login),
    path("login", auth.login),
    path("logout", auth.logout),
    path('admin/', admin.site.urls),
    path("user/update", update_profile.update_profile),
    path("user/block/<int:userID>", manage_friends.block_user), 
    path("user/<int:userID>", views.get_user),
    path("friends/send_request/<int:userId>", manage_friends.send_friend_request),
    path("friends/accept_request/<int:requestId>", manage_friends.accept_friend_request),
    path("friends/requests", manage_friends.friend_requests),
    path("friends/all", manage_friends.get_friends),

    path("rooms/create", rooms.create_room),
    path("rooms/list", rooms.list_rooms)
]
# add the static files url
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
