import json
from channels.generic.websocket import AsyncWebsocketConsumer
import asyncio
import time
from django.core.cache import cache
from channels.db import database_sync_to_async
from .models import User, Room



BOUNDARY_LEFT = 30
BOUNDARY_RIGHT = 1545
BOUNDARY_TOP = 30
BOUNDARY_BOTTOM = 516
PADDLE_WIDTH = 10
PADDLE_HEIGHT = 45
BALL_RADIUS = 15
BALL_RESET_X = 1545/2
BALL_RESET_Y = 516/2
V_RESET_X = 10
V_RESET_Y = 7
class gameonline(AsyncWebsocketConsumer):
    group_sizes = {}
    game_states = {}
    tosave = {}

    async def connect(self):
        self.room_group_name = self.scope['url_route']['kwargs']['room_id']
        rooms = cache.get('rooms')
        self.user = await database_sync_to_async(User.objects.get)(id=self.scope['user'].id)
        print(self.user.id)
        if rooms and self.room_group_name in rooms:
            self.tosave[self.room_group_name] = rooms[self.room_group_name]
            del rooms[self.room_group_name]
            cache.set('rooms', rooms)
        if self.room_group_name not in self.group_sizes:
            asyncio.create_task(self.update_game())
            self.group_sizes[self.room_group_name] = 0
            self.game_states[self.room_group_name] = {
                "finish": False,
                "begin": False,
                "start": False,
                "pause": False,
                'ball_state': {
                    'position': {"x": 1535/2, "y": 516/2},
                    'velocity': {"x": 10, "y": 7},
                    'radius': 10
                },
                'paddle1': {
                    'position': {"x": 70, "y": 300},
                    'width': 10,
                    'height': 60,
                    'velocity': {"x": 8, "y": 4},
                    'pause_req' : 0,
                    'channelname': {"id": None, "send": None, "user": None},
                },
                'paddle2': {
                    'position': {"x": 1510, "y": 300},
                    'width': 10,
                    'height': 60,
                    'velocity': {"x": 8, "y": 4},
                    'pause_req' : 0,
                    'channelname': {"id": None, "send": None, "user": None},
                },
                'score': {"x": 0, "y": 0},
                'minute': 0,
                'second': 0,
                'distance': 1,
                'winner' : {},
                'WinnerScor': 0,
                'LoserScor': 0,
            }
        # Check group size
        group_size = self.group_sizes[self.room_group_name]
        if group_size >= 2:
            await self.close()
            return
        # Increment group size in memory
        self.group_sizes[self.room_group_name] += 1
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        self.game_states[self.room_group_name]["finish"] = True
        if self.game_states[self.room_group_name]["paddle1"]["channelname"]["id"] == self.channel_name:
            self.game_states[self.room_group_name]["winner"] = self.game_states[self.room_group_name]["paddle2"]["channelname"]["user"]
        else:
            self.game_states[self.room_group_name]["winner"] = self.game_states[self.room_group_name]["paddle1"]["channelname"]["user"]
        # Decrement group size in memory
        self.group_sizes[self.room_group_name] -= 1
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
        # Close the connection
        await self.close()
        if self.group_sizes[self.room_group_name] == 0:
            del self.game_states[self.room_group_name]
            del self.group_sizes[self.room_group_name]
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "padle_state",
                "finish": True
            })
    
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
                # await database_sync_to_async(match_history.save())
                await database_sync_to_async(self.user.match.add)(match_history)
                # await database_sync_to_async(self.user.save)()
                print("Match saved", self.user.id)

            except Exception as e:
                print(f"An error occurred: {e}")

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        # if(text_data_json.get("finish") == 'True'):
        #     self.save_state(self)
        channel_name = text_data_json.get("send")
        if channel_name != None:
            self.game_states[self.room_group_name][f"paddle{channel_name[-1]}"]["channelname"]["id"] = self.channel_name
            self.game_states[self.room_group_name][f"paddle{channel_name[-1]}"]["channelname"]["send"] = channel_name
            self.game_states[self.room_group_name][f"paddle{channel_name[-1]}"]["channelname"]["user"] = self.user
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
            paddle_key = f"paddle{player[-1]}"
            if(pause == 'True' and self.game_states[self.room_group_name][paddle_key]["pause_req"] == 0):
                self.game_states[self.room_group_name][paddle_key]["pause_req"] = 1\
                
        min = text_data_json.get("minute")
        sec =  text_data_json.get("second")
        if(min != None and sec != None):
            self.game_states[self.room_group_name]["minute"] = text_data_json.get("minute")
            self.game_states[self.room_group_name]["second"] = text_data_json.get("second")
            self.game_states[self.room_group_name]["distance"] = text_data_json.get("distance")

    async def update_game(self):
        while True:
            state = self.game_states[self.room_group_name]
            paddle1 = state["paddle1"]
            paddle2 = state["paddle2"]
            pause = state["pause"]
            def handle_pause_timer(paddle, game_states, room_group_name):
                if pause and paddle["pause_req"] == 3:
                    elapsed_time = time.time() - paddle["pause_timer"]
                    if elapsed_time >= 10:
                        game_states[room_group_name]["pause"] = False
                        paddle["pause_req"] = 4
            handle_pause_timer(paddle1, self.game_states, self.room_group_name)
            handle_pause_timer(paddle2, self.game_states, self.room_group_name)
            await self.update_gamestate()
            state = self.game_states[self.room_group_name]
            ball_state = state["ball_state"]
            paddle1 = state["paddle1"]
            paddle2 = state["paddle2"]
            score = state["score"]
            pause = state["pause"]
            if(state["distance"] == 0):
                self.game_states[self.room_group_name]["finish"] = True
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "padle_state",
                        "finish": True
                    })
                if score["x"] > score["y"]:
                    self.game_states[self.room_group_name]["winner"] =  self.game_states[self.room_group_name]["winner"]["paddle1"]["channelname"]["user"]
                elif score["x"] > score["y"]:
                    self.game_states[self.room_group_name]["winner"] = self.game_states[self.room_group_name]["winner"]["paddle2"]["channelname"]["user"]
                else:
                    self.game_states[self.room_group_name]["winner"] = None
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
                        "minute": state["minute"],
                        "second": state["second"],
                        "distance": state["distance"],
                        "finish": state["finish"]
                    }
                ),
                asyncio.sleep(0.0167),
            )
            if self.game_states[self.room_group_name]["finish"]:
                print(self.user.id)
                break

       
    
    async def update_gamestate(self):
            state = self.game_states[self.room_group_name]
            ball_state = state["ball_state"]
            paddle1 = state["paddle1"]
            paddle2 = state["paddle2"]
            score = state["score"]
            begin = state["begin"]
            pause = state["pause"]

            def handle_pause_request(paddle, game_states, room_group_name):
                if paddle["pause_req"] == 1:
                    paddle["pause_req"] = 3
                    game_states[room_group_name]["pause"] = True
                    paddle["pause_timer"] = time.time()
               
            if pause == False:
                # Update position based on velocity
                if begin:
                    ball_state["position"]["x"] += ball_state["velocity"]["x"]
                    ball_state["position"]["y"] += ball_state["velocity"]["y"]
                posx = ball_state["position"]["x"]
                posy = ball_state["position"]["y"]
                # Check for collisions with boundaries
                if posx - BALL_RADIUS <= BOUNDARY_LEFT:
                    ball_state["velocity"]["x"] = V_RESET_X
                    ball_state["velocity"]["y"] = V_RESET_Y
                    ball_state["position"]["x"] = BALL_RESET_X
                    ball_state["position"]["y"] = BALL_RESET_Y
                    score["x"] += 1
                    handle_pause_request(paddle1, self.game_states, self.room_group_name)
                    handle_pause_request(paddle2, self.game_states, self.room_group_name)
                elif posx + BALL_RADIUS >= BOUNDARY_RIGHT:
                    ball_state["velocity"]["x"] = V_RESET_X
                    ball_state["velocity"]["y"] = V_RESET_Y
                    ball_state["position"]["x"] = BALL_RESET_X
                    ball_state["position"]["y"] = BALL_RESET_Y
                    score["y"] += 1
                    handle_pause_request(paddle1, self.game_states, self.room_group_name)
                    handle_pause_request(paddle2, self.game_states, self.room_group_name)
                if posy - BALL_RADIUS <= BOUNDARY_TOP or posy + BALL_RADIUS >= BOUNDARY_BOTTOM:
                    ball_state["velocity"]["y"] *= -1  # Reverse Y velocity
                # Check for collisions with paddles
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
        keys = ["message", "start", "paddle1", "paddle2", "positionx", "positiony", "score1", "score2", "pause", "minute", "second", "distance", "finish", "velocityx", "velocityy"]
        event_data = {key: event.get(key) for key in keys}

        # Send message to WebSocket
        await self.send(text_data=json.dumps(event_data))



# check if id correct -> if correct connect  -> start playing when group size =2 if group size 1 let 
        #player who stayed win and disconnect both players save to database the winner and loser
        #delete the room from group size and game state and redis