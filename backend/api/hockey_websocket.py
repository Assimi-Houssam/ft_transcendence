import json

from channels.generic.websocket import AsyncWebsocketConsumer
from django.core.cache import cache


class hockeygame(AsyncWebsocketConsumer):
    group_sizes = {}
    tosave = {}
    game_states = {}
    async def connect(self):
        self.room_group_name = self.scope['url_route']['kwargs']['room_id']
        rooms = cache.get('rooms')
        if rooms and self.room_group_name in rooms:
            self.tosave[self.room_group_name] = rooms[self.room_group_name]
            self.group_sizes[self.room_group_name] = 0      
            del rooms[self.room_group_name]
            cache.set('rooms', rooms)
        # Initialize the group size if it doesn't exist
        if self.group_sizes[self.room_group_name] >= 2 or self.room_group_name not in self.group_sizes:
            await self.close()
        else:
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            self.group_sizes[self.room_group_name] += 1
            await self.accept()     
    
    async def disconnect(self, close_code):
        if self.room_group_name in self.group_sizes:
            self.group_sizes[self.room_group_name] -= 1
        
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        if(self.group_sizes[self.room_group_name] == 0):
            del self.group_sizes[self.room_group_name]
            del self.game_states[self.room_group_name]
            del self.tosave[self.room_group_name]
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'data_transfer',
                'finish': True, 
                'sender_channel': self.channel_name,
            }
        )
        await self.close()
    
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        user = text_data_json.get('user', None)
        player1_x = text_data_json.get('player1_x', None)
        player1_y = text_data_json.get('player1_y', None)
        player2_x = text_data_json.get('player2_x', None)
        player2_y = text_data_json.get('player2_y', None)
        ball_x = text_data_json.get('ball_x', None)
        ball_y = text_data_json.get('ball_y', None)
        score1 = text_data_json.get('score1', None)
        score2 = text_data_json.get('score2', None)


        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'data_transfer',
                'player1_x': player1_x,
                'player1_y': player1_y,
                'player2_x': player2_x,
                'player2_y': player2_y,
                'ball_x': ball_x,
                'ball_y': ball_y,
                'user': user,
                'score1': score1,
                'score2': score2,
                'sender_channel': self.channel_name,
            }
        )

    async def data_transfer(self, event):
        if event['sender_channel'] == self.channel_name:
            return

        data = {
            'player1_x': event.get('player1_x'),
            'player1_y': event.get('player1_y'),
            'player2_x': event.get('player2_x'),
            'player2_y': event.get('player2_y'),
            'ball_x': event.get('ball_x'),
            'ball_y': event.get('ball_y'),
            'user': event.get('user'),
            'score1': event.get('score1'),
            'score2': event.get('score2'),
            'finish': event.get('finish'),
        }
        filtered_data = {k: v for k, v in data.items() if v is not None}
        
        await self.send(text_data=json.dumps(filtered_data))