from django.urls import re_path
from . import consumers
from . import room_websocket

websocket_urlpatterns = [
    re_path("/test", consumers.TestConsumer.as_asgi()),
    re_path('ws/game-selection/', room_websocket.GameConsumer.as_asgi()),
]