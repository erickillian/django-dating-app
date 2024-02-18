from django.urls import path
from .views import (
    LikeList,
    LikeDetail,
    MatchList,
    MatchDetail,
    NextProfileView,
    RateView,
    MatchMessageList,
)

urlpatterns = [
    path("likes/", LikeList.as_view(), name="like-list"),
    path("likes/<int:pk>/", LikeDetail.as_view(), name="like-detail"),
    path("matches/", MatchList.as_view(), name="match-list"),
    path("matches/<int:pk>/", MatchDetail.as_view(), name="match-detail"),
    path(
        "matches/<int:match_id>/messages",  # Updated parameter name
        MatchMessageList.as_view(),
        name="match-messages",
    ),
    path("next/", NextProfileView.as_view(), name="next-profile"),
    path("rate/", RateView.as_view(), name="rate-profile"),
]
