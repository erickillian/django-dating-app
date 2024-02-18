import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.db.models import Count
from django.contrib.auth.models import AnonymousUser
from .models import Match, Message
from rest_framework import serializers
from dating.users.serializers import UserProfileSerializer
from datetime import datetime
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer


def send_notification(user_id, message):
    """
    Sends a match notification to the specified user.
    """
    channel_layer = get_channel_layer()

    group_name = f"{user_id}"
    notification = {
        "type": "new_notification",
        "message": message,
    }
    async_to_sync(channel_layer.group_send)(group_name, notification)


class NotificationConsumer(AsyncWebsocketConsumer):
    active_connections = {}

    async def connect(self):
        # Check if user is authenticated
        if self.scope["user"].is_anonymous:
            # Reject the connection
            await self.close()
        else:
            user_id = str(self.scope["user"].id)
            self.user_group_name = user_id

            # Check if the user already has an active connection
            if self.active_connections.get(user_id):
                # User already connected, increment connection count
                self.active_connections[user_id] += 1
            else:
                # New connection, add user to group and set connection count to 1
                await self.channel_layer.group_add(
                    self.user_group_name, self.channel_name
                )
                self.active_connections[user_id] = 1

            # Accept the connection
            await self.accept()

    async def disconnect(self, close_code):
        # Remove the user from their group
        if hasattr(self, "user_group_name"):
            await self.channel_layer.group_discard(
                self.user_group_name, self.channel_name
            )

    # Handler for new match notifications
    async def new_notification(self, event):
        # Send the actual WebSocket message to the client
        print(event["message"], flush=True)
        await self.send(text_data=json.dumps(event["message"]))
