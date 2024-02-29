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
from .serializers import SendMessageSerializer


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
        # Check if the user_group_name attribute is set
        if hasattr(self, "user_group_name"):
            user_id = self.user_group_name

            # Decrement the connection count
            if self.active_connections.get(user_id):
                self.active_connections[user_id] -= 1

                # If no more connections, remove user from active connections
                if self.active_connections[user_id] == 0:
                    del self.active_connections[user_id]

            # Remove the user from their group
            await self.channel_layer.group_discard(
                self.user_group_name, self.channel_name
            )

    # Handler for new match notifications
    async def new_notification(self, event):
        # Send the actual WebSocket message to the client
        await self.send(text_data=json.dumps(event["message"]))


class MessageConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.match_id = self.scope["url_route"]["kwargs"]["match_id"]
        self.match_group_name = f"match_{self.match_id}"

        # Check if user is part of the match
        if await self.is_user_in_match(self.scope["user"], self.match_id):
            await self.channel_layer.group_add(self.match_group_name, self.channel_name)
            await self.accept()
        else:
            await self.close()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.match_group_name, self.channel_name)

    async def receive(self, text_data):
        serializer = SendMessageSerializer(data=json.loads(text_data))

        if serializer.is_valid():
            message_type = serializer.validated_data.get("type")

            if message_type == "message":
                await self.handle_message(serializer.validated_data)
            elif message_type == "typing":
                await self.handle_typing(serializer.validated_data)
        # else:
        #     # Handle invalid data
        #     print("Invalid data received:", serializer.errors)

    async def handle_message(self, text_data_json):
        message = text_data_json["message"]
        if await self.is_user_in_match(self.scope["user"], self.match_id):
            await self.save_message(self.scope["user"], self.match_id, message)
            await self.channel_layer.group_send(
                self.match_group_name,
                {
                    "type": "chat_message",
                    "message": message,
                    "user": self.scope["user"].id,
                },
            )

    async def handle_typing(self, text_data_json):
        is_typing = text_data_json["is_typing"]
        if await self.is_user_in_match(self.scope["user"], self.match_id):
            await self.channel_layer.group_send(
                self.match_group_name,
                {
                    "type": "typing_notification",
                    "user": self.scope["user"].username,
                    "is_typing": is_typing,
                },
            )

    async def typing_notification(self, event):
        user = event["user"]
        is_typing = event["is_typing"]

        await self.send(
            text_data=json.dumps(
                {
                    "type": "typing",
                    "user": user,
                    "is_typing": is_typing,
                }
            )
        )

    async def chat_message(self, event):
        message = event["message"]
        user = event["user"]

        await self.send(
            text_data=json.dumps(
                {
                    "type": "chat_message",
                    "message": message,
                    "user": user,
                    "time": datetime.now().isoformat(),
                }
            )
        )

    @database_sync_to_async
    def save_message(self, user, match_id, message):
        match = Match.objects.get(id=match_id)
        match.last_message_time = datetime.now()
        match.save()
        Message.objects.create(sender=user, match=match, message=message)

    @database_sync_to_async
    def is_user_in_match(self, user, match_id):
        match = Match.objects.filter(id=match_id)
        return (
            match.filter(user_one=user).exists() or match.filter(user_two=user).exists()
        )
