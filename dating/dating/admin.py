from django.contrib import admin
from .models import Rating, Match, Conversation

# Register your models here.
admin.site.register(Rating)
admin.site.register(Match)
admin.site.register(Conversation)
