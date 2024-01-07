from django.db import models
import string, random

def generate_unique_code():
    """
    This function generates a unique code for the room
    Returns:
        Number: _the unique code_
    """
    length = 6
    while True:
        code = ''.join(random.choices(string.ascii_uppercase, k=length))        
        if Room.objects.filter(code=code).count() == 0:
            break
        return code

# Create your models here.
class Room(models.Model):
    """
    This is the Room model class, it is used to store data about music rooms
    """
    code = models.CharField(max_length=8, default="", unique=True)
    host = models.CharField(max_length=50, unique=True)
    guest_can_pause = models.BooleanField(null=False, default=False)
    votes_to_skip = models.IntegerField(null=False, default=2)
    created_at = models.DateTimeField(auto_now_add=True)
    