from django.urls import path

from . import consumers

websocket_urlpatterns = [
    path("ws/dating/", consumers.NotificationConsumer.as_asgi()),
]
