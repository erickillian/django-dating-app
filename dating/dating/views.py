from rest_framework.views import APIView
from rest_framework import generics
from .models import Rating, Match, Message
from .serializers import (
    RatingSerializer,
    MatchSerializer,
    MessageSerializer,
    RateSerializer,
)
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from rest_framework.response import Response
from rest_framework import status
from ..users.serializers import UserProfileSerializer
from ..users.models import UserProfile
from .consumers import send_notification


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


class MatchMessageList(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        match_id = self.kwargs.get("match_id")
        user = self.request.user
        return Message.objects.filter(
            Q(match_id=match_id) & (Q(match__user_one=user) | Q(match__user_two=user))
        )


def get_potential_matches_filter(user):
    # Get the current user's sexual orientation and gender preferences
    user_orientation = user.sexual_orientation
    user_gender = user.gender

    # Define potential matches based on user preferences
    potential_matches_filter = Q()
    if user_orientation == "Straight":
        if user_gender == "Male":
            potential_matches_filter = Q(gender="Female") & ~Q(sexual_orientation="Gay")
        elif user_gender == "Female":
            potential_matches_filter = Q(gender="Male") & ~Q(sexual_orientation="Gay")
    elif user_orientation == "Gay":
        potential_matches_filter = Q(gender=user_gender) & Q(sexual_orientation="Gay")
    elif user_orientation == "Bisexual":
        # Include all genders and orientations except 'Other', if needed
        potential_matches_filter = ~Q(gender="Other") | ~Q(sexual_orientation="Other")

    # Exclude users who have already been rated by the current user
    already_rated = Rating.objects.filter(rater=user).values_list("rated", flat=True)

    # Retrieve and flatten the list of matched user IDs, excluding the current user's ID
    already_matched = Match.objects.filter(
        Q(user_one=user) | Q(user_two=user)
    ).values_list("user_one_id", "user_two_id")

    matched_user_ids = set(sum(already_matched, ())).difference([user.id])

    potential_matches_filter &= ~Q(id__in=already_rated) & ~Q(id__in=matched_user_ids)

    # Exclude the current user themselves
    potential_matches_filter &= ~Q(id=user.id)

    return potential_matches_filter


class NextProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        potential_matches_filter = get_potential_matches_filter(request.user)

        # Select the next profile considering sexual orientation and gender preferences
        next_profile = UserProfile.objects.filter(potential_matches_filter).first()

        if next_profile:
            return Response(UserProfileSerializer(next_profile).data)
        else:
            return Response(
                {"message": "No more profiles available"},
                status=status.HTTP_404_NOT_FOUND,
            )


def handle_rate(action, rater, rated):
    matched = False

    # Check for mutual 'like' to create a Match object
    if action == "like":
        # Check if 'rated' liked 'rater'
        rated_liked_rater = Rating.objects.filter(
            rater=rated, rated=rater, rating="like"
        )

        # If both are true, it's a mutual like
        if rated_liked_rater.exists():
            rated_liked_rater.delete()
            matched = True

    if matched:
        m = Match.objects.create(user_one=rater, user_two=rated)
        send_notification(
            rated.id,
            {
                "type": "new_match",
                "user": UserProfileSerializer(rater).data,
                "match_id": m.id,
            },
        )
        send_notification(
            rater.id,
            {
                "type": "new_match",
                "user": UserProfileSerializer(rated).data,
            },
        )
    else:
        Rating.objects.create(rater=rater, rated=rated, rating=action)
        if action == "like":
            send_notification(
                rated.id,
                {
                    "type": "like",
                    "user": UserProfileSerializer(rater).data,
                },
            )

    return matched


class RateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = RateSerializer(data=request.data)
        if serializer.is_valid():
            rated_user_id = serializer.validated_data.get("rated_user_id")
            action = serializer.validated_data.get("action")

            try:
                rated_user = UserProfile.objects.get(id=rated_user_id)
                handle_rate(action, request.user, rated_user)
                return Response({"message": "Successfully rated user"})
            except UserProfile.DoesNotExist:
                return Response(
                    {"message": "User not found"}, status=status.HTTP_404_NOT_FOUND
                )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
