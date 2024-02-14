from django.contrib.auth.models import User
from rest_framework import serializers

from datetime import datetime
import json
import requests

from django.conf import settings
from django.contrib.auth import authenticate
from rest_framework import serializers

from dj_rest_auth.serializers import LoginSerializer
from allauth.account import app_settings as allauth_settings
from allauth.account.adapter import get_adapter
from ipware import get_client_ip

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


class CustomLoginSerializer(LoginSerializer):
    captcha = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        ip_address = get_client_ip(self.context["request"])[0]
        if not validate_captcha(attrs["captcha"], ip_address):
            raise serializers.ValidationError("Bad Captcha Request")

        response = super().validate(attrs)
        save_ip_address(response["user"], ip_address)
        return response


class RegisterSerializer(serializers.ModelSerializer):
    captcha = serializers.CharField(required=True, write_only=True)

    def validate_password1(self, password):
        return get_adapter().clean_password(password)

    def validate(self, data):
        if data["password1"] != data["password2"]:
            raise serializers.ValidationError("The two password fields didn't match.")

        return data

    def save(self, request):
        ip_address = get_client_ip(request)[0]
        if not validate_captcha(self.validated_data.get("captcha", ""), ip_address):
            raise serializers.ValidationError("Bad Captcha Request")

        user = super().save(request)
        save_ip_address(user, ip_address)
        return user

    class Meta:
        model = UserProfile
        fields = ["username", "email", "password1", "password2", "captcha"]


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "password", "phone"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
