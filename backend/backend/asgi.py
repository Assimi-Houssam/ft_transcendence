"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import django
django.setup()
from django.core.asgi import get_asgi_application
from api.middlewares import WSAuthMiddleware
from channels.routing import ProtocolTypeRouter, URLRouter
from api.routing import websocket_urlpatterns


application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket":
        WSAuthMiddleware(URLRouter(websocket_urlpatterns))
})