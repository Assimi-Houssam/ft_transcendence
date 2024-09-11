from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import User
import json

class NotificationConsumer(AsyncWebsocketConsumer):
    @database_sync_to_async
    def update_user_status(self, user, status):
        user.online_status = status
        user.save()

    async def connect(self):
        self.user_id = self.scope["user"].id
        await self.accept()
        await self.channel_layer.group_add(str(self.user_id), self.channel_name)
        await self.update_user_status(self.scope["user"], 1)

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(str(self.user_id), self.channel_name)
        await self.update_user_status(self.scope["user"], 0)
    
    async def notification_received(self, event):
        await self.send(text_data=json.dumps({"notification": event["message"]}))

    async def receive(self, text_data):
        try:
            event = json.loads(text_data)
        except:
            await self.close()
            return
        await self.channel_layer.group_send(str(self.user_id), {"type": event["type"], "message": event["message"]})
        pass