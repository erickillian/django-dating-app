from datetime import datetime
import json
import requests

from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from ipware import get_client_ip
from phonenumber_field.serializerfields import PhoneNumberField
from rest_framework import serializers

from dating.users.models import (
    UserProfile,
    UserPicture,
    IpAddress,
    Prompt,
    Interest,
    UserPromptResponse,
)
import operator
from .constants import *


def validate_captcha(response, ip_address):
    if settings.DEBUG:
        return True

    data = {
        "response": response,
        "secret": settings.HCAPTCHA_SECRET_KEY,  # Moved secret to settings for security
        "remoteip": ip_address,
    }
    response = requests.post("https://hcaptcha.com/siteverify", data=data)
    response_json = json.loads(response.text)
    return response_json["success"]


def save_ip_address(user, ip_address):
    ip_addresses = IpAddress.objects.filter(user=user, ip_address=ip_address)
    if ip_addresses.exists():
        ip_addresses[0].last_login = datetime.now()
        ip_addresses[0].save()
    else:
        IpAddress.objects.create(user=user, ip_address=ip_address)


class LoginSerializer(serializers.ModelSerializer):
    phone_number = PhoneNumberField()
    captcha = serializers.CharField(required=True, write_only=True)

    class Meta:
        model = UserProfile
        fields = ["phone_number", "captcha", "password"]
        write_only_fields = ["password"]

    def validate(self, attrs):
        phone_number = attrs.get("phone_number")
        password = attrs.get("password")
        captcha = attrs.get("captcha")
        ip_address = get_client_ip(self.context["request"])[0]

        # Validate Captcha
        if not validate_captcha(captcha, ip_address):
            raise serializers.ValidationError("Bad Captcha Request")

        # Validate if user exists with given phone number
        if not UserProfile.objects.filter(phone_number=phone_number).exists():
            raise serializers.ValidationError("Invalid Phone Number or Password")

        if authenticate(phone_number=phone_number, password=password) is None:
            raise serializers.ValidationError(
                "Could not authenticate with provided credentials"
            )

        save_ip_address(UserProfile.objects.get(phone_number=phone_number), ip_address)
        return attrs


class RegisterSerializer(serializers.ModelSerializer):
    phone_number = PhoneNumberField()
    captcha = serializers.CharField(required=True, write_only=True)

    class Meta:
        model = UserProfile
        fields = ["phone_number", "captcha", "password"]
        write_only_fields = ["password"]

    def validate(self, attrs):
        captcha = attrs.get("captcha")
        password = attrs.get("password")
        ip_address = get_client_ip(self.context["request"])[0]

        # Validate Captcha
        if not validate_captcha(captcha, ip_address):
            raise serializers.ValidationError("Bad Captcha Request")

        phone_number = attrs.get("phone_number")
        # Validate if user does not exist with given phone number
        if UserProfile.objects.filter(phone_number=phone_number).exists():
            raise serializers.ValidationError(
                "An account with this phone number already exists"
            )

        validate_password(password)
        return attrs

    def create(self, validated_data):
        phone_number = validated_data["phone_number"]
        password = validated_data["password"]  # Get the password from validated_data

        # Create a new user instance and set the password

        user = UserProfile.objects.create_user(phone_number=phone_number, password="")
        user.set_password(password)
        user.save()

        return user


class UserPictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPicture
        fields = ["id", "image"]
        read_only_fields = ["id"]


class ProfilePictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPicture
        fields = ["id", "active", "order", "image"]
        extra_kwargs = {"order": {"required": True}}


class PromptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prompt
        fields = "__all__"


class PromptResponseSerializer(serializers.ModelSerializer):
    prompt = serializers.CharField(source="prompt.text")

    class Meta:
        model = UserPromptResponse
        fields = ["id", "prompt", "response"]
        read_only_fields = ["id", "prompt"]


class CreatePromptResponseSerializer(serializers.ModelSerializer):
    prompt = serializers.PrimaryKeyRelatedField(queryset=Prompt.objects.all())

    class Meta:
        model = UserPromptResponse
        fields = ["prompt", "response"]

    def create(self, validated_data):
        # Prevent the user from creating a prompt if it already exists
        user = self.context["request"].user
        prompt = validated_data["prompt"]
        if UserPromptResponse.objects.filter(user=user, prompt=prompt).exists():
            raise serializers.ValidationError("User has already answered this prompt.")
        return UserPromptResponse.objects.create(**validated_data, user=user)


class InterestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interest
        fields = "__all__"


class UserProfileSerializer(serializers.ModelSerializer):
    pictures = serializers.SerializerMethodField()
    # Add shared fields directly into the base class
    sexual_orientation = serializers.CharField()
    gender = serializers.CharField()
    age = serializers.IntegerField()
    full_name = serializers.CharField()
    height = serializers.IntegerField()
    interests = serializers.ListSerializer(
        child=serializers.CharField(), required=False
    )
    prompts = PromptResponseSerializer(many=True, required=False)

    class Meta:
        model = UserProfile
        fields = [
            "id",
            "pictures",
            "sexual_orientation",
            "gender",
            "age",
            "full_name",
            "height",
            "interests",
            "prompts",
        ]
        read_only_fields = ["id", "age"]

    def get_pictures(self, obj):
        pictures = UserPicture.objects.filter(
            active=True, user_profile__id=obj.id
        ).order_by("order")[:MAX_ACTIVE_PICTURES]
        return UserPictureSerializer(pictures, many=True).data

    def validate_interests(self, value):
        if len(value) > MAX_INTERESTS:
            print("THIS HAPPENED!", flush=True)
            raise serializers.ValidationError(
                f"You can have a maximum of {MAX_INTERESTS} interests."
            )
        return value

    def update(self, instance, validated_data):
        # Handle the interests separately
        interests_data = validated_data.pop("interests", None)

        # Update the UserProfile instance with other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Handle updating interests here
        if interests_data is not None:
            # Clear existing interests or find a way to update them
            instance.interests.clear()  # Assuming a ManyToMany relationship
            for interest_name in interests_data:
                interest_obj, created = Interest.objects.get_or_create(
                    name=interest_name
                )
                instance.interests.add(interest_obj)

        return instance

    def to_representation(self, instance):
        """
        Convert the interest model instances to their names for representation.
        """
        ret = super().to_representation(instance)
        ret["interests"] = [interest.name for interest in instance.interests.all()]
        return ret


class MyUserProfileSerializer(UserProfileSerializer):
    class Meta(UserProfileSerializer.Meta):
        fields = UserProfileSerializer.Meta.fields + [
            "location",
            "birth_date",
            "num_likes",
            "num_matches",
        ]


class MinimalUserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ["id", "full_name"]
        read_only_fields = ["id"]


class BasicUserInfoSerializer(serializers.ModelSerializer):
    first_picture = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = [
            "full_name",
            "id",
            "first_picture",
        ]
        read_only_fields = ["id", "age"]

    def get_first_picture(self, obj):
        picture = (
            UserPicture.objects.filter(active=True, user_profile__id=obj.id)
            .order_by("order")
            .first()
        )
        return picture.image.url


class SelectedPicturesSerializer(serializers.Serializer):
    selected_pictures = serializers.ListField(child=serializers.IntegerField())
