import json
from channels.generic.websocket import AsyncWebsocketConsumer
import asyncio
import time
from django.core.cache import cache
from channels.db import database_sync_to_async
from .models import User, Room



BOUNDARY_LEFT = 40
BOUNDARY_RIGHT = 1535
BOUNDARY_TOP = 30
BOUNDARY_BOTTOM = 516
PADDLE_WIDTH = 10
PADDLE_HEIGHT = 55
BALL_RADIUS = 15
BALL_RESET_X = 1545/2
BALL_RESET_Y = 516/2
V_RESET_X = 10
V_RESET_Y = 7


class PongV1(AsyncWebsocketConsumer):
    game_states = {}
    tosave = {}
    async def connect(self):
        self.room_group_name = self.scope['url_route']['kwargs']['room_id']
        rooms = cache.get('rooms')
        self.user = self.scope['user']
        if rooms and self.room_group_name in rooms:
            if (rooms[self.room_group_name]["started"] == "false"):
                await self.close()
                return
            self.tosave[self.room_group_name] = rooms[self.room_group_name]
            del rooms[self.room_group_name]
            cache.set('rooms', rooms)
        if self.room_group_name not in self.game_states:
            asyncio.create_task(self.update_game())
            self.game_states[self.room_group_name] = {
                "finish": False,
                "begin": False,
                "start": False,
                "pause": False,
                'ball_state': {
                    'position': {"x": BALL_RESET_X, "y": BALL_RESET_Y},
                    'velocity': {"x": 10, "y": 7},
                },
                'paddle1': {
                    'id' : 0,
                    'position': {"x": 70, "y": 300},
                    'pause_req' : 0,
                },
                'paddle2': {
                    'id' : 0,
                    'position': {"x": 1510, "y": 300},
                    'pause_req' : 0,
                },
                'score': {"x": 0, "y": 0},
                "costume": False,
            }
            if self.tosave[self.room_group_name]['customization'] == "fastForward":
                self.game_states[self.room_group_name]["ball_state"]["velocity"]["x"] = 14
                self.game_states[self.room_group_name]["ball_state"]["velocity"]["y"] = 10
        user_in_group = any(user['id'] == self.user.id for user in self.tosave[self.room_group_name]['users'])
        if not user_in_group:
            await self.close()
            return
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        self.game_states[self.room_group_name]["finish"] = True
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "disconnect_evryone",

            })
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
                await database_sync_to_async(match_history.save())
                print("Match saved", self.user.id)
            except Exception as e:
                print(f"An error occurred: {e}")

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        
        if(text_data_json.get("costume") == 'True'):
            self.game_states[self.room_group_name]["costume"] = True
        startgame = text_data_json.get("startgame")
        begin = text_data_json.get("begin")
        if startgame == 'True':
            self.game_states[self.room_group_name]["start"] = 'go'
            startgame = False
        if begin == 'go':
            self.game_states[self.room_group_name]["begin"] = True
        
        player = text_data_json.get("sender")
        if(player != None):
            paddle_key = f"paddle{player[-1]}"
            if paddle_key in self.game_states[self.room_group_name]:
                pad = text_data_json.get(paddle_key)
                if pad != None:
                    self.game_states[self.room_group_name][paddle_key]["position"]["y"] = pad
        pause = text_data_json.get("pause")
        if(pause != None):
            if(pause == 'true' and self.game_states[self.room_group_name][paddle_key]["pause_req"] == 0):
                self.game_states[self.room_group_name][paddle_key]["pause_req"] = 1
                

    def handle_pause_timer(self,paddle, game_states, room_group_name):
        if  paddle["pause_req"] == 3:
            elapsed_time = time.time() - paddle["pause_timer"]
            if elapsed_time >= 10:
                game_states[room_group_name]["pause"] = False
                paddle["pause_req"] = 4

    async def update_game(self):
        distance = 5
        chrono = time.time() + int(self.tosave[self.room_group_name]['time']) * 60
        while True:
            state = self.game_states[self.room_group_name]
            paddle1 = state["paddle1"]
            paddle2 = state["paddle2"]
            if(paddle1["pause_req"] == 2 or paddle2["pause_req"] == 2):
                chrono = time.time() + distance
            else:
                now = time.time()
                distance = chrono - now
                minutes,seconds = divmod(distance, 60)
                minutes = int(minutes)
                seconds = int(seconds)
            pause = state["pause"]
            self.handle_pause_timer(paddle1, self.game_states, self.room_group_name)
            self.handle_pause_timer(paddle2, self.game_states, self.room_group_name)
            await self.update_gamestate()
            state = self.game_states[self.room_group_name]
            ball_state = state["ball_state"]
            paddle1 = state["paddle1"]
            paddle2 = state["paddle2"]
            score = state["score"]
            pause = state["pause"]
            if(distance <= 0):
                self.game_states[self.room_group_name]["finish"] = True
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "padle_state",
                        "finish": True
                    })
                break
            await asyncio.gather(
                self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "padle_state",
                        "positionx": ball_state["position"]["x"],
                        "positionx": ball_state["position"]["x"],
                        "positiony": ball_state["position"]["y"],
                        "velocityx": ball_state["velocity"]["x"],
                        "velocityy": ball_state["velocity"]["y"],
                        "paddle1": paddle1["position"]["y"],
                        "paddle2": paddle2["position"]["y"],
                        "start": self.game_states[self.room_group_name]["start"],
                        "score1": score["x"],
                        "score2": score["y"],
                        "pause": pause,
                        "minute": minutes,
                        "second": seconds,
                        "distance": distance,
                        "finish": state["finish"]
                    }
                ),
                asyncio.sleep(0.0167),
            )
            if self.game_states[self.room_group_name]["finish"]:
                await asyncio.sleep(0.1)
                await self.save_state()
                break

       
    def handle_pause_request(self, paddle, game_states, room_group_name):
        if paddle["pause_req"] == 1:
            paddle["pause_req"] = 3
            game_states[room_group_name]["pause"] = True
            paddle["pause_timer"] = time.time()
    
    async def sign(self,x):
        if x < 0:
            return -1
        elif x > 0:
            return 1
        
    
    async def update_gamestate(self):
            state = self.game_states[self.room_group_name]
            ball_state = state["ball_state"]
            paddle1 = state["paddle1"]
            paddle2 = state["paddle2"]
            score = state["score"]
            begin = state["begin"]
            pause = state["pause"]

               
            if pause == False:
                if begin:
                    if self.game_states[self.room_group_name]["costume"] == True:
                        ball_state["velocity"]["x"] += (2 * self.sign(int(ball_state["velocity"]["x"]))) 
                        ball_state["velocity"]["y"] += (1 * self.sign(int(ball_state["velocity"]["y"])))
                    ball_state["position"]["x"] += ball_state["velocity"]["x"]
                    ball_state["position"]["y"] += ball_state["velocity"]["y"]
                posx = ball_state["position"]["x"]
                posy = ball_state["position"]["y"]
                if posx - BALL_RADIUS <= BOUNDARY_LEFT:
                    ball_state["position"]["x"] = BALL_RESET_X
                    ball_state["position"]["y"] = BALL_RESET_Y
                    score["x"] += 1
                    self.handle_pause_request(paddle1, self.game_states, self.room_group_name)
                    self.handle_pause_request(paddle2, self.game_states, self.room_group_name)
                    await asyncio.sleep(0.5)
                elif posx + BALL_RADIUS >= BOUNDARY_RIGHT:
                    ball_state["position"]["x"] = BALL_RESET_X
                    ball_state["position"]["y"] = BALL_RESET_Y
                    score["y"] += 1
                    self.handle_pause_request(paddle1, self.game_states, self.room_group_name)
                    self.handle_pause_request(paddle2, self.game_states, self.room_group_name)
                    await asyncio.sleep(0.5)
                if posy - BALL_RADIUS <= BOUNDARY_TOP or posy + BALL_RADIUS >= BOUNDARY_BOTTOM:
                    ball_state["velocity"]["y"] *= -1  # Reverse Y velocity
                if posx <= paddle1["position"]["x"] + PADDLE_WIDTH and ball_state["velocity"]["x"] < 0:
                    paddlcenter1y = paddle1["position"]["y"] + PADDLE_HEIGHT / 2    
                    dx = abs(posx - (paddle1["position"]["x"] + PADDLE_WIDTH / 2))
                    dy = abs(posy - paddlcenter1y)
                    if dx <= BALL_RADIUS and dy <= PADDLE_HEIGHT / 2:
                        ball_state["velocity"]["x"] *= -1
                if posx >= paddle2["position"]["x"] and ball_state["velocity"]["x"] > 0:
                    paddlcenter2y = paddle2["position"]["y"] + PADDLE_HEIGHT / 2
                    dx = abs(posx - (paddle2["position"]["x"] + PADDLE_WIDTH / 2))
                    dy = abs(posy - paddlcenter2y)
                    if dx <= BALL_RADIUS and dy <= PADDLE_HEIGHT / 2:
                        ball_state["velocity"]["x"] *= -1

    async def padle_state(self, event):
        keys = ["start", "paddle1", "paddle2", "positionx", "positiony", "score1", "score2", "pause", "minute", "second", "distance", "finish", "velocityx", "velocityy"]
        event_data = {key: event.get(key) for key in keys}

        await self.send(text_data=json.dumps(event_data))