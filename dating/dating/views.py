from rest_framework.views import APIView
from rest_framework import generics
from .models import Rating, Match, Conversation
from .serializers import (
    RatingSerializer,
    MatchSerializer,
    ConversationSerializer,
    RateSerializer,
)
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

        # Get the current user's sexual orientation and gender preferences
        user_orientation = user.sexual_orientation
        user_gender = user.gender

        # Define potential matches based on user preferences
        potential_matches_filter = Q()
        if user_orientation == "Straight":
            if user_gender == "Male":
                potential_matches_filter = Q(gender="Female") & ~Q(
                    sexual_orientation="Gay"
                )
            elif user_gender == "Female":
                potential_matches_filter = Q(gender="Male") & ~Q(
                    sexual_orientation="Gay"
                )
        elif user_orientation == "Gay":
            potential_matches_filter = Q(gender=user_gender) & Q(
                sexual_orientation="Gay"
            )
        elif user_orientation == "Bisexual":
            # Include all genders and orientations except 'Other', if needed
            potential_matches_filter = ~Q(gender="Other") | ~Q(
                sexual_orientation="Other"
            )

        # Get a list of users who have not been rated by the current user
        already_rated = Rating.objects.filter(rater=user).values_list(
            "rated", flat=True
        )

        # Select the next profile considering sexual orientation and gender preferences
        next_profile = (
            UserProfile.objects.exclude(id__in=already_rated)
            .exclude(id=user.id)
            .filter(potential_matches_filter)
            .first()
        )

        if next_profile:
            return Response(UserProfileSerializer(next_profile).data)
        else:
            return Response(
                {"message": "No more profiles available"},
                status=status.HTTP_404_NOT_FOUND,
            )


class RateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = RateSerializer(data=request.data)
        if serializer.is_valid():
            rated_user_id = serializer.validated_data.get("rated_user_id")
            action = serializer.validated_data.get("action")

            try:
                rated_user = UserProfile.objects.get(id=rated_user_id)
                Rating.objects.create(
                    rater=request.user, rated=rated_user, rating=action
                )
                return Response({"message": "Action recorded"})
            except UserProfile.DoesNotExist:
                return Response(
                    {"message": "User not found"}, status=status.HTTP_404_NOT_FOUND
                )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
