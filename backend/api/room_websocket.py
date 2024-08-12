import json
from channels.generic.websocket import AsyncWebsocketConsumer

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

        # Assuming you have these functions that return the required data
        rooms_data = get_rooms_data()
        user_data = get_user_data()
        mode = get_mode()

        await self.send(text_data=json.dumps({
            'rooms_data': rooms_data,
            'user_data': user_data,
            'mode': mode
        }))

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        await self.send(text_data=json.dumps({
            'message': message
        }))