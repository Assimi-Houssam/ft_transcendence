"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from api.routing import websocket_urlpatterns
from api.middlewares import WSAuthMiddleware

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket":
        WSAuthMiddleware(URLRouter(websocket_urlpatterns))
})