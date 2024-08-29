import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.core.cache import cache
import time
import asyncio

class RoomConsumer(AsyncWebsocketConsumer):
    async def check_rooms(self):
        while True:
            curr_time = int(time.time())
            if (curr_time - self.created_at > 1200) or (curr_time - self.last_msg_timestamp > 300):
                await self.channel_layer.group_send(self.room_id, { "type": "disconnect_everyone" })
                break
            await asyncio.sleep(1)
    
    async def connect(self):
        self.room_id = self.scope["url_route"]["kwargs"]["room_id"]
        self.last_msg_timestamp = int(time.time())
        rooms = cache.get("rooms", {})

        if self.room_id not in rooms:
            await self.close()
            return


        # todo: check if the user is connected to another room
        for user in rooms[self.room_id]["users"]:
            if user["id"] == self.scope["user"].id:
                await self.close()
                return

        await self.channel_layer.group_add(self.room_id, self.channel_name)
        
        if (int(rooms[self.room_id]["teamSize"]) * 2 == len(rooms[self.room_id]["users"])):
            await self.close()
            return

        await self.accept()
        user = {"username": self.scope["user"].username, "id": self.scope["user"].id, "pfp": "http://localhost:8000" + self.scope["user"].pfp.url, "banner": "http://localhost:8000" + self.scope["user"].banner.url}

        if (rooms[self.room_id]["teamSize"] == "1"):
            if (len(rooms[self.room_id]["users"]) == 0):
                rooms[self.room_id]["redTeam"][0] = user 
            else:
                rooms[self.room_id]["blueTeam"][0] = user
        else: # todo: fix this since it adds users to the redteam first then blue team
            for i, member in enumerate(rooms[self.room_id]["redTeam"]):
                if not member:
                    rooms[self.room_id]["redTeam"][i] = user
                    break
            else:
                for i, member in enumerate(rooms[self.room_id]["blueTeam"]):
                    if not member:
                        rooms[self.room_id]["blueTeam"][i] = user
                        break

        rooms[self.room_id]["users"].append(user)
        cache.set("rooms", rooms)
        
        if (self.scope["user"].id == rooms[self.room_id]["host"]["id"]):
            self.created_at = int(time.time())
            asyncio.create_task(self.check_rooms())
            
        await self.channel_layer.group_send(self.room_id, {"type": "user_join"})
    
    async def disconnect_everyone(self, event):
        await self.close()

    async def disconnect_user(self, event):
        rooms = cache.get("rooms", {})
        await self.send(text_data=json.dumps({"room_data": rooms[self.room_id]}))

    async def remove_user(self, user):
        rooms = cache.get("rooms", {})
        if (rooms.get(self.room_id) is None):
            return
        if (int(rooms[self.room_id]["host"]["id"]) == user.id):
            await self.channel_layer.group_send(self.room_id, { "type": "disconnect_everyone" })
            del rooms[self.room_id]
            cache.set("rooms", rooms)
            return
        for i, room_user in enumerate(rooms[self.room_id]["users"]):
            if (user.id == int(room_user["id"])):
                rooms[self.room_id]["users"].pop(i)
                break
        for i, red_team_entry in enumerate(rooms[self.room_id]["redTeam"]):
            if (red_team_entry and user.id == red_team_entry["id"]):
                rooms[self.room_id]["redTeam"][i] = {}
                break
        for i, blue_team_entry in enumerate(rooms[self.room_id]["blueTeam"]):
            if (blue_team_entry and user.id == blue_team_entry["id"]):
                rooms[self.room_id]["blueTeam"][i] = {}
                break
        cache.set("rooms", rooms)
        await self.channel_layer.group_send(self.room_id, { "type": "disconnect_user" })


    async def disconnect(self, close_code):
        user = self.scope["user"]
        await self.remove_user(user)
        await self.channel_layer.group_discard(self.room_id, self.channel_name)
    
    # todo: check if the user info is correct, compare it against the logged in user
    async def user_join(self, event):
        rooms = cache.get("rooms", {})
        await self.send(text_data=json.dumps({"room_data": rooms[self.room_id]}))
    
    async def gamemode_change(self, event):
        rooms = cache.get("rooms", {})
        gamemode = event["message"]

        if (self.scope["user"].id != rooms[self.room_id]["host"]["id"]):
            await self.send(text_data=json.dumps({"room_data": rooms[self.room_id]}))
            return

        if (gamemode not in ["pong", "hockey"]):
            await self.close()
            return
        
        rooms[self.room_id]["gamemode"] = gamemode
        
        cache.set("rooms", rooms)
        await self.send(text_data=json.dumps({"room_data": rooms[self.room_id]}))

    async def time_change(self, event):
        rooms = cache.get("rooms", {})
        time = event["message"]

        if (self.scope["user"].id != rooms[self.room_id]["host"]["id"]):
            await self.send(text_data=json.dumps({"room_data": rooms[self.room_id]}))
            return

        if (time not in ["3", "5"]):
            await self.close()
            return
        
        rooms[self.room_id]["time"] = time
        
        cache.set("rooms", rooms)
        await self.send(text_data=json.dumps({"room_data": rooms[self.room_id]}))

    async def customization_change(self, event):
        rooms = cache.get("rooms", {})
        customization = event["message"]

        if (self.scope["user"].id != rooms[self.room_id]["host"]["id"]):
            await self.send(text_data=json.dumps({"room_data": rooms[self.room_id]}))
            return

        if (customization not in ["hidden", "fastForward", ""]):
            await self.close()
            return
        
        rooms[self.room_id]["customization"] = customization
        
        cache.set("rooms", rooms)
        await self.send(text_data=json.dumps({"room_data": rooms[self.room_id]}))

    def find_host(self, room):
        host = room["host"]
        for i, red_entry in enumerate(room["redTeam"]):
            if red_entry == host:
                team_entry = room["redTeam"][i]
                room["redTeam"][i] = {}
                return team_entry
        
        for i, blue_entry in enumerate(room["blueTeam"]):
            if blue_entry == host:
                team_entry = room["blueTeam"][i]
                room["blueTeam"][i] = {}
                return team_entry
        return None

    # todo: refactor this
    def is_team_empty(self, team):
        empty_count = 0
        for entry in team:
            if not entry:
                empty_count += 1
        if (empty_count == len(team)):
            return True
        return False

    async def team_size_change(self, event):
        rooms = cache.get("rooms", {})
        
        if (self.scope["user"].id != rooms[self.room_id]["host"]["id"]):
            await self.send(text_data=json.dumps({"room_data": rooms[self.room_id]}))
            return
        
        if (event["message"] not in ["1", "2"]):
            await self.close()
            return
        
        if rooms[self.room_id]["teamSize"] == event["message"]:
            return
        
        # todo: maybe send an error message (?)
        if (len(rooms[self.room_id]["users"]) > 2):
            return
        
        rooms[self.room_id]["redTeam"] = [rooms[self.room_id]["host"], {}]
        
        if (len(rooms[self.room_id]["users"]) == 2):
            rooms[self.room_id]["blueTeam"] = [rooms[self.room_id]["users"][0] if rooms[self.room_id]["users"][0] != rooms[self.room_id]["host"] else rooms[self.room_id]["users"][1], {}]

        rooms[self.room_id]["teamSize"] = event["message"]
        
        cache.set("rooms", rooms)
        await self.send(text_data=json.dumps({"room_data": rooms[self.room_id]}))

    async def team_change(self, event):
        rooms = cache.get("rooms", {})
        
        if (self.scope["user"].id != rooms[self.room_id]["host"]["id"]):
            await self.send(text_data=json.dumps({"room_data": rooms[self.room_id]}))
            return
        
        red_team = event["message"]["redTeam"]
        blue_team = event["message"]["blueTeam"]

        # todo: on close, cleanup the room
        if (len(red_team) > 2 or len(blue_team) > 2):
            await self.close()
        
        # check if theres inconsistencies between the team switches
        for red_team_entry in red_team:
            if (red_team_entry and red_team_entry not in rooms[self.room_id]["users"]):
                await self.close()
                return

        for blue_team_entry in blue_team:
            if (blue_team_entry and blue_team_entry not in rooms[self.room_id]["users"]):
                await self.close()
                return

        rooms[self.room_id]["redTeam"] = red_team
        rooms[self.room_id]["blueTeam"] = blue_team
        
        cache.set("rooms", rooms)
        await self.send(text_data=json.dumps({"room_data": rooms[self.room_id]}))

    async def team_kick(self, event):
        rooms = cache.get("rooms", {})
        target_user = event["message"]["user"]
        if target_user not in rooms[self.room_id]["users"]:
            await self.close()
            return
        if (target_user["id"] == self.scope["user"].id):
            await self.close()
            return
        if (self.scope["user"].id != rooms[self.room_id]["host"]["id"]):
            await self.send(text_data=json.dumps({"room_data": rooms[self.room_id]}))
            return
        cache.set("rooms", rooms)
        await self.send(text_data=json.dumps({"room_data": rooms[self.room_id]}))

    async def room_name_change(self, event):
        rooms = cache.get("rooms", {})
        if (self.scope["user"].id != rooms[self.room_id]["host"]["id"]):
            await self.send(text_data=json.dumps({"room_data": rooms[self.room_id]}))
            return
        name = event["message"]
        if (len(name) > 25):
            return
        if (name.isascii() == False):
            return
        
        rooms[self.room_id]["name"] = name
        cache.set("rooms", rooms)
        
        await self.send(text_data=json.dumps({"room_data": rooms[self.room_id]}))


    async def receive(self, text_data):
        try:
            event = json.loads(text_data)
        except:
            await self.close()
            return
        if not all(key in event for key in ("type", "message")):
            await self.close()
            return

        rooms = cache.get("rooms", {})
        if (self.scope["user"].id != rooms[self.room_id]["host"]["id"]):
            return
        self.last_msg_timestamp = int(time.time())
        await self.channel_layer.group_send(self.room_id, {"type": event["type"], "message": event["message"]})