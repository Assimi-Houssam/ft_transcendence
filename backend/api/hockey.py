import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.core.cache import cache
from channels.db import database_sync_to_async
from .models import Room


class Hockey(AsyncWebsocketConsumer):
    tosave = {}
    game_states = {}
    async def connect(self):
        self.room_group_name = self.scope['url_route']['kwargs']['room_id']
        self.user = self.scope['user']
        rooms = cache.get('rooms')
        if rooms and self.room_group_name in rooms:
            if (rooms[self.room_group_name]["started"] == "false"):
                await self.close()
                return
            self.tosave[self.room_group_name] = rooms[self.room_group_name]
            del rooms[self.room_group_name]
            cache.set('rooms', rooms)
            self.game_states[self.room_group_name] = {
                'score': {'x': 0, 'y': 0},
                'finish': False,
            }
        if not any(user.get('id') == self.user.id for user in self.tosave[self.room_group_name]['users']):
            await self.close()
        else:
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            await self.accept()     
    
    async def disconnect(self, close_code):
        
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'disconnect_evryone',
            }
        )
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
    
    async def disconnect_evryone(self, event):
        await self.close(4500)
        
    async def save_state(self):
        self.game_states[self.room_group_name]["finish"] = True
        state = self.game_states[self.room_group_name]
        room = self.tosave[self.room_group_name]
        host_user = room['host']['username']
        red_team_usernames = room['redTeam']
        blue_team_usernames = room['blueTeam']
        players = room['users']
        try:
            match_history = await database_sync_to_async(Room.objects.create)(
                players=players,
                red_team=red_team_usernames,
                blue_team=blue_team_usernames,
                host=host_user,
                red_team_score=state["score"]["y"],
                blue_team_score=state["score"]["x"],
                gamemode=room["gamemode"],
                time=room["time"],
                team_size=room["teamSize"],
                customization=room["customization"],
                room_name=room["name"],
            )
            await database_sync_to_async(match_history.save)()
            print("Match saved", self.user.id)
        except Exception as e:
            print(f"An error occurred: {e}")

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
        finish = text_data_json.get('finish', None)
        if finish == True and self.user.id == self.tosave[self.room_group_name]['host']['id']:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'data_transfer',
                    'finish': True,
                    'sender_channel': 'none',
                }
            )
            # savng in data base
            await self.save_state()
            await self.close()
            return
        elif finish == True:
            await self.close()
            return


    

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