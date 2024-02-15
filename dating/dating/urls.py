from django.urls import path
from .views import (
    LikeList,
    LikeDetail,
    MatchList,
    MatchDetail,
    ConversationList,
    ConversationDetail,
)

urlpatterns = [
    path("likes/", LikeList.as_view(), name="like-list"),
    path("likes/<int:pk>/", LikeDetail.as_view(), name="like-detail"),
    path("matches/", MatchList.as_view(), name="match-list"),
    path("matches/<int:pk>/", MatchDetail.as_view(), name="match-detail"),
    path("conversations/", ConversationList.as_view(), name="conversation-list"),
    path(
        "conversations/<int:pk>/",
        ConversationDetail.as_view(),
        name="conversation-detail",
    ),
]
