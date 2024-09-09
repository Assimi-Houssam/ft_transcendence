from django.urls import re_path
from . import consumers
from .pongv1 import PongV1
from .pongv2 import PongV2
from .hockey import Hockey
from .notifications import NotificationConsumer

websocket_urlpatterns = [
    re_path(r'ws/room/(?P<room_id>\w+)/$', consumers.RoomConsumer.as_asgi()),
    re_path(r'^ws/game/onlinev1/(?P<room_id>\w+)/$', PongV1.as_asgi()),
    re_path(r'^ws/game/onlinev2/(?P<room_id>\w+)/$', PongV2.as_asgi()),
    re_path(r'^ws/game/hockey/(?P<room_id>\w+)/$', Hockey.as_asgi()),
    re_path(r"ws/cable/", NotificationConsumer.as_asgi())
]