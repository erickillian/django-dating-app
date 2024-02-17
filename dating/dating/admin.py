from django.contrib import admin
from .models import Rating, Match, Message

# Register your models here.
admin.site.register(Rating)
admin.site.register(Match)
admin.site.register(Message)
