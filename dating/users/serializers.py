from datetime import datetime
import json
import requests

from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from ipware import get_client_ip
from phonenumber_field.serializerfields import PhoneNumberField
from rest_framework import serializers

from dating.users.models import UserProfile, IpAddress


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

        print(authenticate(phone_number=phone_number, password=password))
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
        user = UserProfile.objects.create_user(phone_number=phone_number)
        user.set_password(password)
        user.save()

        return user


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            "location",
            "sexual_orientation",
            "gender",
            "birth_date",
            "full_name",
            "height",
        ]
