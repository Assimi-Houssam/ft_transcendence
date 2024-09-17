from channels.generic.websocket import AsyncWebsocketConsumer
from .serializers import NotificationSerializer, UserScoreSerializer
import json
import time
from channels.db import database_sync_to_async
from .utils import is_valid_input

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        #since the room is always general
       self.room_group_name = "chat_general"

       #add the user to the "general" room group
       await self.channel_layer.group_add(
        "general",
        self.channel_name
       )

       #accept the websocket connection
       await self.accept()
    
    async def disconnect(self, close_code):
        #remove the user from the "general" room group on disconnect
        await self.channel_layer.group_discard(
            "general",
            self.channel_name
        )
    
    #receive message from websocket
    async def receive(self, text_data):
        print(f"text data: {text_data}")
        #Parse the message data received from the client
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        print(f"Message received: {message}")
        if (message is None) or (len(message) > 100) or (is_valid_input(message) == False):
            print(f"Invalid message received: {message}")
            return
        
        username = self.scope['user'].username
        user_id = self.scope['user'].id
        msg_time = int(time.time())

        #send message to the group
        await self.channel_layer.group_send(
            "general", {
                'type': 'chat_message',
                'message' : message,
                'username': username,
                'user_id': user_id,
                'time': msg_time
            }
        )
    @database_sync_to_async
    def check_user_block(self, receiver, sender_username):
        block_list = receiver.block_list.all()
        for user in block_list:
            if (user.username == sender_username):
                return True
        return False
    # Receive message from the group
    async def chat_message(self, event):
        message = event['message']
        username = event['username']
        time = event['time']
        id = event["user_id"]

        # check if the user is blocked
        is_blocked = await self.check_user_block(self.scope["user"], username)
        if is_blocked:
            return

        #Send the message to the websocket
        await self.send(text_data=json.dumps(
            {
                'time': time,
                'username': username,
                'message': message,
                "user_id": id
            }
        ))