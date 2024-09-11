from django.db import models
from django.contrib.auth.models import AbstractUser

# django is way too bloated and using any custom User model would result in the admin
# pannel + auth support getting broken, we'll just inherit from AbstractUser
# instead and add our custom fields
class User(AbstractUser):
    username = models.CharField(max_length=20, unique=True, error_messages={"unique":"This username has been taken."})
    password = models.CharField(max_length=256) # sha-256 hashed
    email = models.EmailField(max_length=64, unique=True)
    intra_id = models.IntegerField(null=True, blank=True) # guaranteed to be unique
    pfp = models.ImageField(upload_to='profile_pictures/', null=True, blank=True, default='default.jpeg')
    banner = models.ImageField(upload_to='profile_pictures/', null=True, blank=True, default='default.jpeg')
    count_updates = models.IntegerField(default=2)
    can_update_on  = models.IntegerField(default=0)
    friends = models.ManyToManyField("self", symmetrical=True, related_name="friends_list", blank=True)
    block_list = models.ManyToManyField("self", symmetrical=False, related_name="blocked_list", blank=True)
    matches_played = models.IntegerField(default=0)
    matches_won = models.IntegerField(default=0)
    xp = models.IntegerField(default=0)
    online_status = models.BooleanField(default=0)
    unread_notifications = models.ManyToManyField('Notification', blank=True)
    class Meta:
        ordering = ['id']

class Room(models.Model):
    players = models.ManyToManyField(User, related_name="room_players")
    red_team = models.ManyToManyField(User, related_name="room_red_team")
    blue_team = models.ManyToManyField(User, related_name="room_blue_team")
    red_team_score = models.IntegerField(default=0)
    blue_team_score = models.IntegerField(default=0)
    host = models.CharField(max_length=20)
    room_name = models.CharField(max_length=20)
    team_size = models.IntegerField(default=1)
    gamemode = models.CharField(max_length=20)
    time = models.IntegerField(default=3)
    customization = models.CharField(default=3, null=True, blank=True)
    timestamp = models.IntegerField(default=0)

class FriendRequest(models.Model):
    from_user = models.ForeignKey(User, related_name="from_user", on_delete=models.CASCADE)
    to_user = models.ForeignKey(User, related_name="to_user", on_delete=models.CASCADE)

class Notification(models.Model):
    type = models.CharField(max_length=25)
    from_user = models.ForeignKey(User, on_delete=models.CASCADE)