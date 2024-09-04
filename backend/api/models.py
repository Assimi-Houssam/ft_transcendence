from django.db import models
from django.contrib.auth.models import AbstractUser
import time

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
    friends = models.ManyToManyField("User", blank=True)
    class Meta:
        ordering = ['id']

class FriendRequest(models.Model):
    from_user = models.ForeignKey(User, related_name="from_user", on_delete=models.CASCADE)
    to_user = models.ForeignKey(User, related_name="to_user", on_delete=models.CASCADE)