from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path("/test", consumers.TestConsumer.as_asgi()),
]