from rest_framework import serializers
from .models import Rating, Match, Message
from dating.users.models import UserProfile
from dating.users.serializers import UserProfileSerializer, BasicUserInfoSerializer
from django.contrib.auth import get_user_model

User = get_user_model()


class RatingSerializer(serializers.ModelSerializer):
    rater = UserProfileSerializer(read_only=True)

    class Meta:
        model = Rating
        fields = ["rater"]


class MatchSerializer(serializers.ModelSerializer):
    other_user = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()

    def get_other_user(self, obj):
        user = self.context["request"].user
        if user == obj.user_one:
            return UserProfileSerializer(obj.user_two).data
        return UserProfileSerializer(obj.user_one).data

    def get_last_message(self, obj):
        last_message = obj.messages.order_by("-time").first()
        if last_message:
            return MessageSerializer(last_message).data
        return None

    class Meta:
        model = Match
        fields = ["other_user", "last_message", "id"]


class RateSerializer(serializers.Serializer):
    rated_user_id = serializers.PrimaryKeyRelatedField(
        queryset=UserProfile.objects.all(), write_only=True, required=True
    )
    action = serializers.ChoiceField(choices=["like", "dislike"], required=True)


class MessageSerializer(serializers.ModelSerializer):
    user = BasicUserInfoSerializer(source="sender")

    class Meta:
        model = Message
        fields = ["time", "user", "message"]


class SendMessageSerializer(serializers.Serializer):
    type = serializers.ChoiceField(choices=["message", "typing"])
    message = serializers.CharField(allow_blank=True, required=False)
    is_typing = serializers.BooleanField(default=False, required=False)
