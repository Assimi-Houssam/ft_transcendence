# game/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
import asyncio
from django.core.cache import cache

BOUNDARY_LEFT = 30
BOUNDARY_RIGHT = 1545
BOUNDARY_TOP = 30
BOUNDARY_BOTTOM = 516
PADDLE_WIDTH = 10
PADDLE_HEIGHT = 70
BALL_RADIUS = 15
BALL_RESET_X = 1545/2
BALL_RESET_Y = 516/2

class gameonline_v2(AsyncWebsocketConsumer):
    group_sizes = {}
    game_states = {}
    event_data = {}
    tosave = {}
    async def connect(self):
        self.room_group_name = self.scope['url_route']['kwargs']['room_id']
        rooms = cache.get('rooms')
        if rooms and self.room_group_name in rooms:
            self.tosave[self.room_group_name] = rooms[self.room_group_name]
            del rooms[self.room_group_name]
            cache.set('rooms', rooms)
        if self.room_group_name not in self.group_sizes:
            self.event_data[self.room_group_name] = {}
            asyncio.create_task(self.update_game())
            self.group_sizes[self.room_group_name] = 0
        # Check group size
        group_size = self.group_sizes[self.room_group_name]
        if group_size >= 4:
            self.close()
        self.game_states[self.room_group_name] = {
            "begin": False,
            "start": False,
            "finish": False,
            'ball_state': {
                'position': {"x": 1535/2, "y": 516/2},
                'velocity': {"x": 9, "y": 9},
                'radius': 10
            },
            'paddle1': {
                'position': {"x": 70, "y": 300},
                'width': 10,
                'height': 100,
                'velocity': {"x": 8, "y": 5},
                'up': False,
                'down': False
            },
            'paddle2': {
                'position': {"x": 70, "y": 400},
                'width': 10,
                'height': 100,
                'velocity': {"x": 8, "y": 5},
                'up': False,
                'down': False
            },
            'paddle3': {
                'position': {"x": 1510, "y": 300},
                'width': 10,
                'height': 100,
                'velocity': {"x": 8, "y": 5},
                'up': False,
                'down': False
            },
            'paddle4': {
                'position': {"x": 1510, "y": 400},
                'width': 10,
                'height': 100,
                'velocity': {"x": 8, "y": 5},
                'up': False,
                'down': False
            },
            'score': {"x": 0, "y": 0},
            'minute': 0,
            'second': 0,
            'distance': 1,
        }
        # Increment group size in memory
        self.group_sizes[self.room_group_name] += 1
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        # Decrement group size in memory
        self.game_states[self.room_group_name]["finish"] = True
        
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
    
    
    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
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
        min = text_data_json.get("minute")
        sec =  text_data_json.get("second")
        if(min != None and sec != None):
            self.game_states[self.room_group_name]["minute"] = text_data_json.get("minute")
            self.game_states[self.room_group_name]["second"] = text_data_json.get("second")
            self.game_states[self.room_group_name]["distance"] = text_data_json.get("distance")
           
    
    async def update_game(self):
        while True:
            if self.group_sizes[self.room_group_name] == 4:
                await self.update_gamestate()
            # Wait before the next update
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
                "minute": state["minute"],
                "second": state["second"],
                "distance": state["distance"],
                "finish": state["finish"]
            }
            await asyncio.gather(
                self.channel_layer.group_send(self.room_group_name, event_data),
                asyncio.sleep(0.0167),
            )
            if(self.game_states[self.room_group_name]["finish"]):
                break
    
    async def update_gamestate(self):
            state = self.game_states[self.room_group_name]
            ball_state = state["ball_state"]
            paddle1 = state["paddle1"]
            paddle2 = state["paddle2"]
            paddle3 = state["paddle3"]
            paddle4 = state["paddle4"]
            score = state["score"]
            begin = state["begin"]
            # Update position based on velocity
            if begin:
                ball_state["position"]["x"] += ball_state["velocity"]["x"]
                ball_state["position"]["y"] += ball_state["velocity"]["y"]
            posx = ball_state["position"]["x"]
            posy = ball_state["position"]["y"]
            # Check for collisions with boundaries
            if posx - BALL_RADIUS <= BOUNDARY_LEFT:
                ball_state["position"]["x"] = BALL_RESET_X
                ball_state["position"]["y"] = BALL_RESET_Y
                score["x"] += 1
            elif posx + BALL_RADIUS >= BOUNDARY_RIGHT:
                ball_state["position"]["x"] = BALL_RESET_X
                ball_state["position"]["y"] = BALL_RESET_Y
                score["y"] += 1
            if posy - BALL_RADIUS <= BOUNDARY_TOP or posy + BALL_RADIUS >= BOUNDARY_BOTTOM:
                ball_state["velocity"]["y"] *= -1  # Reverse Y velocity
            def check_collison(posx, posy, paddle):
                paddlcenter = paddle["position"]["y"] + PADDLE_HEIGHT / 2
                dx = abs(posx - (paddle["position"]["x"] + PADDLE_WIDTH / 2))
                dy = abs(posy - paddlcenter)
                return dx <= BALL_RADIUS and dy <= PADDLE_HEIGHT / 2
            # Check for collisions with paddles  i need to change this to a for loop and make it more dynamic
            if posx <= paddle1["position"]["x"] + PADDLE_WIDTH and ball_state["velocity"]["x"] < 0:
                if check_collison(posx, posy, paddle1) or check_collison(posx, posy, paddle2):
                    ball_state["velocity"]["x"] *= -1
            if posx >= paddle2["position"]["x"] and ball_state["velocity"]["x"] > 0:
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
            "finish": event.get("finish")
        }
        # Send message to WebSocket
        await self.send(text_data=json.dumps(data))
