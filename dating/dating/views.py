from rest_framework.views import APIView
from rest_framework import generics
from .models import Rating, Match, Conversation
from .serializers import RatingSerializer, MatchSerializer, ConversationSerializer
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from rest_framework.response import Response
from rest_framework import status
from ..users.serializers import UserProfileSerializer
from ..users.models import UserProfile


# Updated views for Rating
class LikeList(generics.ListCreateAPIView):
    serializer_class = RatingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Rating.objects.filter(rated=user, rating="like")


class LikeDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = RatingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Rating.objects.filter(rated=user, rating="like")


class MatchList(generics.ListCreateAPIView):
    serializer_class = MatchSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Match.objects.filter(Q(user_one=user) | Q(user_two=user))


class MatchDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MatchSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Match.objects.filter(Q(user_one=user) | Q(user_two=user)).order_by(
            last_message_time="-"
        )


class ConversationList(generics.ListCreateAPIView):
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Conversation.objects.filter(
            match__in=Match.objects.filter(Q(user_one=user) | Q(user_two=user))
        )


class ConversationDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Conversation.objects.filter(
            match__in=Match.objects.filter(Q(user_one=user) | Q(user_two=user))
        )


class NextProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        # Get a list of users who have not been rated by the current user
        already_rated = Rating.objects.filter(rater=user).values_list(
            "rated", flat=True
        )
        next_profile = (
            UserProfile.objects.exclude(id__in=already_rated)
            .exclude(id=user.id)
            .first()
        )

        if next_profile:
            return Response(UserProfileSerializer(next_profile).data)
        else:
            return Response(
                {"message": "No more profiles available"},
                status=status.HTTP_404_NOT_FOUND,
            )


class SwipeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        rated_user_id = request.data.get("rated_user_id")
        action = request.data.get("action")  # 'like' or 'dislike'

        if action not in ["like", "dislike"]:
            return Response(
                {"message": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            rated_user = UserProfile.objects.get(id=rated_user_id)
            Rating.objects.create(rater=user, rated=rated_user, rating=action)
            return Response({"message": "Action recorded"})

        except UserProfile.DoesNotExist:
            return Response(
                {"message": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )
