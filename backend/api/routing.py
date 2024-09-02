from django.urls import re_path
from . import consumers
from .pingpongv1_websocket import gameonline
from .pingpongv2_websocket import gameonline_v2
from .hockey_websocket import hockeygame

websocket_urlpatterns = [
    re_path(r'ws/room/(?P<room_id>\w+)/$', consumers.RoomConsumer.as_asgi()),
    re_path(r'^ws/game/onlinev1/(?P<room_id>\w+)/$', gameonline.as_asgi()),
    re_path(r'^ws/game/onlinev2/(?P<room_id>\w+)/$', gameonline_v2.as_asgi()),
    re_path(r'^ws/game/hockey/(?P<room_id>\w+)/$', hockeygame.as_asgi()),
]