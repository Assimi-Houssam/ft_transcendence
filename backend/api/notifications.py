from channels.generic.websocket import AsyncWebsocketConsumer
import json

"""
user = {"username": username, "id": id, "pfp": pfp_url}

type: RoomInvite
from: user
gameMode: "pong" / "hockey"
gameSize: 1 / 2
roomId: roomId


type: FriendRequest
from: user

type: AcceptedFriendRequest
from: user
"""

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = self.scope["user"].id
        await self.accept()
        await self.channel_layer.group_add(str(self.user_id), self.channel_name)

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(str(self.user_id), self.channel_name)
        pass
    
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