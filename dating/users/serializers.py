from datetime import datetime
import json
import requests

from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from ipware import get_client_ip
from phonenumber_field.serializerfields import PhoneNumberField
from rest_framework import serializers

from dating.users.models import *
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
        ip_address = get_client_ip(self.context["request"])[0]
        save_ip_address(user, ip_address)

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
    prompt_id = serializers.UUIDField(source="id", read_only=True)
    prompt = serializers.CharField(source="text")
    category = serializers.CharField(source="type")

    class Meta:
        model = Prompt
        fields = ["prompt_id", "prompt", "category"]


class PromptResponseSerializer(serializers.ModelSerializer):
    prompt = serializers.PrimaryKeyRelatedField(
        queryset=Prompt.objects.all(), write_only=True, required=False
    )
    prompt_id = serializers.UUIDField(source="prompt.id", read_only=True)

    class Meta:
        model = UserPromptResponse
        fields = ["id", "prompt", "response", "prompt_id"]
        read_only_fields = ["id", "prompt_id"]

    def create(self, validated_data):
        if validated_data["user"].prompts.count() >= MAX_PROMPTS:
            raise serializers.ValidationError(
                f"You can only have a maximum of {MAX_PROMPTS} prompts."
            )

        return UserPromptResponse.objects.create(**validated_data)

    def to_representation(self, instance):
        """
        Object instance -> Dict of primitive datatypes.
        """
        ret = super().to_representation(instance)
        ret["prompt"] = instance.prompt.text
        return ret


class InterestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interest
        fields = "__all__"


class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = "__all__"


class NationalitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Nationality
        fields = "__all__"


class UserProfileSerializer(serializers.ModelSerializer):
    pictures = serializers.SerializerMethodField()
    sexual_orientation = serializers.CharField(allow_blank=True)
    gender = serializers.CharField(allow_blank=True)
    age = serializers.IntegerField()
    full_name = serializers.CharField(allow_blank=True)
    height = serializers.IntegerField(allow_null=True)
    interests = serializers.SlugRelatedField(
        slug_field="name", queryset=Interest.objects.all(), many=True, required=False
    )
    languages = serializers.SlugRelatedField(
        slug_field="name", queryset=Language.objects.all(), many=True, required=False
    )
    nationalities = serializers.SlugRelatedField(
        slug_field="name", queryset=Nationality.objects.all(), many=True, required=False
    )
    prompts = PromptResponseSerializer(many=True, required=False)

    class Meta:
        model = UserProfile
        visability_fields = [
            field + "_visible" for field in UserProfile.visability_fields
        ]
        fields = [
            "id",
            "pictures",
            "sexual_orientation",
            "gender",
            "age",
            "full_name",
            "height",
            "interests",
            "languages",
            "nationalities",
            "prompts",
            "occupation",
            "education",
            "looking_for",
            "eye_color",
            "hair_color",
            "ethnicity",
        ]
        read_only_fields = ["id", "age"]

    def get_pictures(self, obj):
        pictures = UserPicture.objects.filter(
            active=True, user_profile__id=obj.id
        ).order_by("order")[:MAX_ACTIVE_PICTURES]
        return UserPictureSerializer(pictures, many=True).data

    def validate_languages(self, value):
        if len(value) > MAX_LANGUAGES:
            raise serializers.ValidationError(
                f"You can have a maximum of {MAX_LANGUAGES} languages."
            )
        return value

    def validate_nationalities(self, value):
        if len(value) > MAX_NATIONALITIES:
            raise serializers.ValidationError(
                f"You can have a maximum of {MAX_NATIONALITIES} nationalities."
            )
        return value

    def update(self, instance, validated_data):
        m2m_fields = ["interests", "languages", "nationalities"]

        # Standard fields update
        standard_fields = {
            key: value for key, value in validated_data.items() if key not in m2m_fields
        }
        for attr, value in standard_fields.items():
            setattr(instance, attr, value)
        instance.save()

        # Simplified handling for many-to-many fields
        for field in m2m_fields:
            if field in validated_data:
                getattr(instance, field).set(validated_data[field])

        return instance

    def to_full_representation(self, instance):
        return super().to_representation(instance)

    def to_representation(self, instance):
        # Start with the standard representation
        representation = super().to_representation(instance)

        # For each field, check if it's marked as not visible and remove it
        for field_name in UserProfileSerializer.Meta.visability_fields:
            if not instance.__getattribute__(field_name):
                representation.pop(field_name.split("_visible")[0], None)

        # Remove empty fields
        for field in self.Meta.fields:
            if field in representation and (
                representation[field] == "" or representation[field] is None
            ):
                representation.pop(field, None)

        return representation


class MyUserProfileSerializer(UserProfileSerializer):
    birth_date = serializers.DateField(required=False, allow_null=True)
    what_others_see = serializers.SerializerMethodField()

    class Meta(UserProfileSerializer.Meta):

        fields = (
            UserProfileSerializer.Meta.fields
            + [
                "location",
                "birth_date",
                "num_likes",
                "num_matches",
                "profile_completeness",
                "what_others_see",
            ]
            + UserProfileSerializer.Meta.visability_fields
        )

    def get_what_others_see(self, obj):
        return UserProfileSerializer(obj).data

    def to_representation(self, instance):
        return super().to_full_representation(instance)


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
    selected_pictures = serializers.ListField(
        child=serializers.UUIDField(format="hex_verbose")
    )
