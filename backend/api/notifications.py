from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .serializers import NotificationSerializer
import time
import json
from .utils import is_valid_chat_inp

class NotificationConsumer(AsyncWebsocketConsumer):
    @database_sync_to_async
    def update_user_status(self, user, status):
        user.refresh_from_db()
        user.online_status = status
        user.save()

    @database_sync_to_async
    def get_and_clear_unread_notifications(self, user):
        notifications = user.unread_notifications
        serializer = NotificationSerializer(notifications, many=True)
        user.unread_notifications.clear()
        return serializer.data
    
    async def connect(self):
        self.user_id = self.scope["user"].id
        await self.accept()
        await self.channel_layer.group_add(str(self.user_id), self.channel_name)
        await self.update_user_status(self.scope["user"], 1)

        notifications = await self.get_and_clear_unread_notifications(self.scope["user"])
        for notification in notifications:
            await self.send(text_data=json.dumps({"notification": notification}))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(str(self.user_id), self.channel_name)
        await self.update_user_status(self.scope["user"], 0)
    
    async def notification_received(self, event):
        await self.send(text_data=json.dumps({"notification": event["message"]}))


    @database_sync_to_async
    def check_user_block(self, receiver, sender_username):
        receiver.refresh_from_db()
        block_list = receiver.block_list.all()
        for user in block_list:
            if (user.username == sender_username):
                return True
        return False

    async def message_received(self, event):
        message_info = event["message"]
        if (is_valid_chat_inp(message_info["message"]) == False):
            return
        is_blocked = await self.check_user_block(self.scope["user"], message_info["from"]["username"])
        if is_blocked:
            return
        await self.send(text_data=json.dumps({"from": message_info["from"], "message": message_info["message"]}))

    async def receive(self, text_data):
        try:
            event = json.loads(text_data)
        except:
            await self.close()
            return
        if (event.get("type") == "notification_received"):
            await self.channel_layer.group_send(str(self.user_id), {"type": event["type"], "message": event["message"]})
        if (event.get("message")):
            message = {
                "from": {
                    "id": self.scope["user"].id,
                    "username": self.scope["user"].username,
                    "pfp": self.scope["user"].pfp.url
                },
                "message": event["message"],
                "time": int(time.time())
            }
            await self.channel_layer.group_send(str(event.get("userId")), {"type": "message_received", "message": message})