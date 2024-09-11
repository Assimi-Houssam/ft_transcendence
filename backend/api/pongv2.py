# game/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
import asyncio
from django.core.cache import cache
import time
from channels.db import database_sync_to_async
from .models import Room, User
from django.db.models import F


BOUNDARY_LEFT = 30
BOUNDARY_RIGHT = 1545
BOUNDARY_TOP = 30
BOUNDARY_BOTTOM = 516
PADDLE_WIDTH = 10
PADDLE_HEIGHT = 70
HALF_PADDLE_HEIGHT = 35
HALF_PADDLE_WIDTH = 5
BALL_RADIUS = 15
BALL_RESET_X = 773
BALL_RESET_Y = 258


class PongV2(AsyncWebsocketConsumer):
    game_states = {}
    event_data = {}
    tosave = {}
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
        if self.room_group_name not in self.game_states:
            self.event_data[self.room_group_name] = {}
            asyncio.create_task(self.update_game())
        if any(user.get("id") == self.user.id for user in self.tosave[self.room_group_name]["users"]):
            self.close()
        self.game_states[self.room_group_name] = {
            "begin": False,
            "start": False,
            "finish": False,
            'ball_state': {
                'position': {"x": 1535/2, "y": 516/2},
                'velocity': {"x": 9, "y": 7},
            },
            'paddle1': {
                'position': {"x": 70, "y": 300},
            },
            'paddle2': {
                'position': {"x": 70, "y": 400},
            },
            'paddle3': {
                'position': {"x": 1510, "y": 300},

            },
            'paddle4': {
                'position': {"x": 1510, "y": 400},
            },
            'score': {"x": 0, "y": 0},
            'blue_pause': 0,
            'blue_pause_time': 0,
            'red_pause': 0,
            'red_pause_time': 0,
            'pause': False,
        }
        
        if self.tosave[self.room_group_name]['customization'] == "fastForward":
            self.game_states[self.room_group_name]["ball_state"]["velocity"]["x"] = 14
            self.game_states[self.room_group_name]["ball_state"]["velocity"]["y"] = 10
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

        
    def is_winner(self, user_id, red_team, blue_team, red_team_score, blue_team_score):
        red_team_ids = [player['id'] for player in red_team if player]
        blue_team_ids = [player['id'] for player in blue_team if player]

        if red_team_score > blue_team_score:
            winning_team_ids = red_team_ids
        elif blue_team_score > red_team_score:
            winning_team_ids = blue_team_ids
        else:
            return False
        return user_id in winning_team_ids
        
    async def save_state(self):
        self.game_states[self.room_group_name]["finish"] = True
        state = self.game_states[self.room_group_name]
        room = self.tosave[self.room_group_name]
        host_user = room['host']['username']
        red_team_usernames = room['redTeam']
        blue_team_usernames = room['blueTeam']
        players = room['users']

        red_team_ids = [player['id'] for player in red_team_usernames if player]
        red_team_usernames_db = await database_sync_to_async(User.objects.filter)(id__in=red_team_ids)

        blue_team_ids = [player['id'] for player in blue_team_usernames if player]
        blue_team_usernames_db = await database_sync_to_async(User.objects.filter)(id__in=blue_team_ids)

        player_ids = [player['id'] for player in players]
        players_db = await database_sync_to_async(list)(User.objects.filter(id__in=player_ids))
        
        for player in players_db:
            if self.is_winner(player.id, red_team_usernames, blue_team_usernames, state["score"]["x"], state["score"]["y"]):
                player.matches_won = F('matches_won') + 1
            player.matches_played = F('matches_played') + 1
            if player.id in red_team_ids:
                player.xp = F('xp') + state["score"]["x"]
            elif player.id in blue_team_ids:
                player.xp = F('xp') + state["score"]["y"]
            await database_sync_to_async(player.save)()

        try:
            match_history = await database_sync_to_async(Room.objects.create)(
                host=host_user,
                red_team_score=state["score"]["x"],
                blue_team_score=state["score"]["y"],
                gamemode=room["gamemode"],
                time=room["time"],
                team_size=room["teamSize"],
                customization=room["customization"],
                room_name=room["name"],
                timestamp=int(time.time())
            )

            await database_sync_to_async(match_history.players.set)(players_db)
            await database_sync_to_async(match_history.red_team.set)(red_team_usernames_db)
            await database_sync_to_async(match_history.blue_team.set)(blue_team_usernames_db)
            await database_sync_to_async(match_history.save)()
        except Exception as e:
            print(f"An error occurred: {e}, Score not saved")
            pass
            

    async def disconnect(self, close_code):
        self.game_states[self.room_group_name]["finish"] = True
        
        await self.channel_layer.group_send(
        self.room_group_name,
        {
            "type": "desconnect_evryone",
        })
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
    
    async def desconnect_evryone(self, event):
        await self.close(4500)
    
    
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        if text_data_json.get("pause", False) == True:
            if any(user.get("id") == self.user.id for user in self.tosave[self.room_group_name]["blueTeam"]):
                self.game_states[self.room_group_name]["blue_pause"] = 1
            elif any(user.get("id") == self.user.id for user in self.tosave[self.room_group_name]["redTeam"]):
                self.game_states[self.room_group_name]["red_pause"] = 1
        startgame = text_data_json.get("startgame")
        begin = text_data_json.get("begin")
        if startgame == 'True':
            self.game_states[self.room_group_name]["start"] = 'go'
            startgame = False
        if begin == 'go':
            self.game_states[self.room_group_name]["begin"] = True
        player = text_data_json.get("sender")
        if player:
            paddle_key = f"paddle{player[-1]}"  
            if paddle_key in self.game_states[self.room_group_name]:
                self.game_states[self.room_group_name][paddle_key]["position"]["y"] = text_data_json.get(paddle_key)
            if text_data_json.get("pause") == True:
                if paddle_key == "paddle1" or paddle_key == "paddle2" and self.game_states[self.room_group_name]["blue_pause"] == 0:
                    self.game_states[self.room_group_name]["blue_pause"] = 1
                if paddle_key == "paddle3" or paddle_key == "paddle4" and self.game_states[self.room_group_name]["red_pause"] == 0:
                    self.game_states[self.room_group_name]["red_pause"] = 1
            

    def handle_pause_timer(self,pause_time, pause_req , room_group_name):
        if self.game_states[room_group_name][pause_req] == 3:
            elapsed_time = time.time() - self.game_states[room_group_name][pause_time]
            if elapsed_time >= 10:
                self.game_states[room_group_name]["pause"] = False
                self.game_states[room_group_name][pause_req] = 4
    
    async def update_game(self):
        distance = 2
        chrono = time.time() + (int(self.tosave[self.room_group_name]['time']) * 60)
        self.goal = False
        self.cooldown = 0
        while True:
            if self.game_states[self.room_group_name]["begin"]:
                self.handle_pause_timer("blue_pause_time","blue_pause",self.room_group_name)
                self.handle_pause_timer("red_pause_time","red_pause",self.room_group_name)
                await self.update_gamestate()
            if self.game_states[self.room_group_name]["pause"] == True:
                chrono = time.time() + distance
            else:    
                now = time.time()
                distance = chrono - now
                minutes,seconds = divmod(distance, 60)
                minutes = int(minutes)
                seconds = int(seconds)
            if(distance <= 0):
                self.game_states[self.room_group_name]["finish"] = True
                await self.save_state()
                await asyncio.sleep(1)
                break
            state = self.game_states[self.room_group_name]
            ball_state = state["ball_state"]
            paddle1 = state["paddle1"]
            paddle2 = state["paddle2"]
            paddle3 = state["paddle3"]
            paddle4 = state["paddle4"]
            score = state["score"]
            event_data = {
                "type": "padle_state",
                "positionx": ball_state["position"]["x"],
                "positiony": ball_state["position"]["y"],
                "paddle1": paddle1["position"]["y"],
                "paddle2": paddle2["position"]["y"],
                "paddle3": paddle3["position"]["y"],
                "paddle4": paddle4["position"]["y"],
                "start": self.game_states[self.room_group_name]["start"],
                "score1": score["x"],
                "score2": score["y"],
                "minute": minutes,
                "second": seconds,
                "distance": distance,
                "finish": state["finish"],
                "pause": state["pause"]
            }
            await asyncio.gather(
                self.channel_layer.group_send(self.room_group_name, event_data),
                asyncio.sleep(0.0167),
            )
            if(self.game_states[self.room_group_name]["finish"]):
                break
    
    def handle_pause_request(self, pause_time, pause_req, room_group_name):
        if self.game_states[room_group_name][(pause_req)] == 1:
            self.game_states[room_group_name][pause_req] = 3
            self.game_states[room_group_name]["pause"] = True
            self.game_states[room_group_name][pause_time] = time.time()
    
    async def update_gamestate(self):
            state = self.game_states[self.room_group_name]
            ball_state = state["ball_state"]
            paddle1 = state["paddle1"]
            paddle2 = state["paddle2"]
            paddle3 = state["paddle3"]
            paddle4 = state["paddle4"]
            begin = state["begin"]
            if self.goal == True:
                if self.cooldown < time.time():
                    self.goal = False

            if begin:
                if not state["pause"]:
                    if self.goal == False:
                        ball_state["position"]["x"] += ball_state["velocity"]["x"]
                        ball_state["position"]["y"] += ball_state["velocity"]["y"]
            posx = ball_state["position"]["x"]
            posy = ball_state["position"]["y"]
            if posx - BALL_RADIUS <= BOUNDARY_LEFT:
                ball_state["position"]["x"] = BALL_RESET_X
                ball_state["position"]["y"] = BALL_RESET_Y
                self.game_states[self.room_group_name]["score"]["x"] += 1
                self.handle_pause_request("blue_pause_time","blue_pause",self.room_group_name)
                self.handle_pause_request("red_pause_time","red_pause",self.room_group_name)
                self.goal = True
                self.cooldown = time.time() + 0.5
            elif posx + BALL_RADIUS >= BOUNDARY_RIGHT:
                ball_state["position"]["x"] = BALL_RESET_X
                ball_state["position"]["y"] = BALL_RESET_Y
                self.game_states[self.room_group_name]["score"]["x"] += 1
                self.handle_pause_request("blue_pause_time","blue_pause",self.room_group_name)
                self.handle_pause_request("red_pause_time","red_pause",self.room_group_name)
                self.goal = True
                self.cooldown = time.time() + 0.5
            if posy - BALL_RADIUS <= BOUNDARY_TOP or posy + BALL_RADIUS >= BOUNDARY_BOTTOM:
                ball_state["velocity"]["y"] *= -1  # Reverse Y velocity
            def check_collison(posx, posy, paddle):
                paddlcenter = paddle["position"]["y"] + int(HALF_PADDLE_HEIGHT)
                dx = abs(posx - (paddle["position"]["x"] + HALF_PADDLE_WIDTH))
                dy = abs(posy - paddlcenter)
                return dx <= BALL_RADIUS and dy <= HALF_PADDLE_HEIGHT
            if posx <= paddle1["position"]["x"] + PADDLE_WIDTH and ball_state["velocity"]["x"] < 0:
                  if check_collison(posx, posy, paddle1) or check_collison(posx, posy, paddle2):
                    ball_state["velocity"]["x"] *= -1
            if posx >= paddle3["position"]["x"] and ball_state["velocity"]["x"] > 0:
                if check_collison(posx, posy, paddle3) or check_collison(posx, posy, paddle4):
                    ball_state["velocity"]["x"] *= -1
    async def padle_state(self, event):
        data = {
            "message": event.get("message"),
            "start": event.get("start"),
            "paddle1": event.get("paddle1"),
            "paddle2": event.get("paddle2"),
            "paddle3": event.get("paddle3"),
            "paddle4": event.get("paddle4"),
            "positionx": event.get("positionx"),
            "positiony": event.get("positiony"),
            "score1": event.get("score1"),
            "score2": event.get("score2"),
            "minute": event.get("minute"),
            "second": event.get("second"),
            "distance": event.get("distance"),
            "finish": event.get("finish"),
            "pause": event.get("pause")
        }
        await self.send(text_data=json.dumps(data))
