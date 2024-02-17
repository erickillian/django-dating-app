from rest_framework import serializers
from .models import Rating, Match, Conversation
from dating.users.serializers import UserProfileSerializer


class RatingSerializer(serializers.ModelSerializer):
    rater = UserProfileSerializer(read_only=True)

    class Meta:
        model = Rating
        fields = ["rater"]


class MatchSerializer(serializers.ModelSerializer):
    other_user = serializers.SerializerMethodField()

    def get_other_user(self, obj):
        user = self.context["request"].user
        if user == obj.user_one:
            return UserProfileSerializer(obj.user_two).data
        return UserProfileSerializer(obj.user_one).data

    class Meta:
        model = Match
        fields = ["other_user"]


class ConversationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conversation
        fields = "__all__"


class RateSerializer(serializers.Serializer):
    rated_user_id = serializers.IntegerField()
    action = serializers.ChoiceField(choices=["like", "dislike"])
