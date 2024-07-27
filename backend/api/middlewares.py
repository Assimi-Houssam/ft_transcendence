from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

class WSAuthMiddleware:
    def __init__(self, app):
        self.app = app

    @database_sync_to_async
    def get_user(self, user_id):
        User = get_user_model()
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return None

    async def __call__(self, scope, receive, send):
        headers = dict(scope['headers'])
        if b"cookie" not in headers:
            await send({'type': 'websocket.close','code': 1000})
            return
        cookies = headers[b"cookie"].decode()
        token = next((cookie.split('=')[1] for cookie in cookies.split('; ') if cookie.startswith("access_token")), None)
        if (token == None):
            await send({'type': 'websocket.close','code': 1000})
            return
        try:
            UntypedToken(token)
        except (InvalidToken, TokenError):
            await send({'type': 'websocket.close','code': 1000})
            return
        decoded_token = UntypedToken(token).payload
        user = await self.get_user(decoded_token["user_id"])
        if (user == None):
            await send({'type': 'websocket.close','code': 1000})
            return
        scope["user"] = user
        return await self.app(scope, receive, send)
