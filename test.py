from pprint import pprint

user1 = {"username": "host", "id": "1", "pfp": "idk", "banner": "idk"}
user2 = {"username": "user2", "id": "2", "pfp": "idk", "banner": "idk"}
user3 = {"username": "user3", "id": "3", "pfp": "idk", "banner": "idk"}
user4 = {"username": "user4", "id": "4", "pfp": "idk", "banner": "idk"}

room = {
    "host": user1,
    "teamSize": "2",
    "redTeam": [user3, {}],
    "blueTeam": [user1, user2],
    "users": [user1, user2, user3]
}

def switch_team_size():
    pass


def find_host():
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

def is_team_empty(team):
    empty_count = 0
    for entry in team:
        if not entry:
            empty_count += 1
    if (empty_count == len(team)):
        return True
    return False

def resize_teams(new_size):
    if (new_size not in ["1", "2"]):
        print("invalid new size")
        return
    if room["teamSize"] != new_size:
        if (len(room["users"]) > 2):
            print("resizing will kick users")
            return
        if is_team_empty(room["redTeam"]):
            print("moving host to redTeam")
            host = find_host()
            room["redTeam"][0] = host
            room["blueTeam"][0], room["blueTeam"][1] = room["blueTeam"][1], room["blueTeam"][0]
        
        

resize_teams("1")
pprint(room)  
