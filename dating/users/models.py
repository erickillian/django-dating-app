from django.db import models
from django.core.validators import RegexValidator, MinValueValidator, MaxValueValidator
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from PIL import Image
import os
from django.core.exceptions import ValidationError
from datetime import date
import uuid
from .constants import *


class CustomUserManager(BaseUserManager):
    def create_user(self, phone_number, password):
        if not phone_number:
            raise ValueError("The Phone Number must be set")
        user = self.model(phone_number=phone_number)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, phone_number, password):
        user = self.create_user(phone_number, password)
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)
        return user


class Prompt(models.Model):
    PROMPT_TYPES = [
        ("Personal Insights & Reflections", "Personal Insights & Reflections"),
        ("Passions & Interests", "Passions & Interests"),
        ("Experiences & Adventures", "Experiences & Adventures"),
        ("Favorites & Preferences", "Favorites & Preferences"),
        ("Goals & Aspirations", "Goals & Aspirations"),
        ("Values & Beliefs", "Values & Beliefs"),
        ("Cultural & Social Insights", "Cultural & Social Insights"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    text = models.CharField(max_length=255, unique=True)
    type = models.CharField(
        max_length=32,
        choices=PROMPT_TYPES,
        default="Favorites & Preferences",
    )

    def __str__(self):
        return self.text


class Interest(models.Model):
    name = models.CharField(max_length=100, unique=True)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    def __str__(self):
        return self.name


class UserProfile(AbstractUser):
    # Remove the original username field
    username = None
    first_name = None
    last_name = None
    email = None

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    full_name = models.CharField(max_length=50, blank=True)

    # Personal Information
    birth_date = models.DateField(null=True, blank=True)
    gender = models.CharField(
        max_length=20,
        choices=[("Male", "Male"), ("Female", "Female"), ("Other", "Other")],
        blank=True,
    )
    sexual_orientation = models.CharField(
        max_length=20,
        choices=[
            ("Straight", "Straight"),
            ("Gay", "Gay"),
            ("Bisexual", "Bisexual"),
            ("Other", "Other"),
        ],
        blank=True,
    )
    location = models.CharField(max_length=100, blank=True)
    height = models.IntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(100), MaxValueValidator(250)],
    )  # Height in cm

    # Contact Information
    phone_regex = RegexValidator(
        regex=r"^\+?1?\d{9,15}$",
        message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.",
    )
    phone_number = models.CharField(
        validators=[phone_regex],
        max_length=17,
        blank=False,
        unique=True,
    )
    generated_profile = models.BooleanField(default=False)

    interests = models.ManyToManyField(Interest, blank=True, related_name="users")

    @property
    def num_likes(self):
        return self.ratings_received.filter(rating="like").count()

    @property
    def num_matches(self):
        return self.matches_user_one.count() + self.matches_user_two.count()

    @property
    def num_pictures(self):
        return self.profile_pictures.count()

    @property
    def num_prompts(self):
        return self.prompts.count()

    @property
    def num_interests(self):
        return self.interests.count()

    @property
    def age(self):
        if self.birth_date:
            today = date.today()
            return (
                today.year
                - self.birth_date.year
                - (
                    (today.month, today.day)
                    < (self.birth_date.month, self.birth_date.day)
                )
            )
        return None

    @property
    def profile_completeness(self):
        info_fields_weight = 0.4
        pictures_weight = 0.3
        prompts_weight = 0.2
        interests_weight = 0.1

        completeness = 0.0
        info_fields = [
            self.full_name,
            self.birth_date,
            self.height,
            self.sexual_orientation,
            self.gender,
        ]

        for field in info_fields:
            if field:
                completeness += info_fields_weight / len(info_fields)

        completeness += pictures_weight * (
            min(self.num_pictures, MAX_ACTIVE_PICTURES) / MAX_ACTIVE_PICTURES
        )
        completeness += prompts_weight * (self.num_prompts / MAX_PROMPTS)
        completeness += interests_weight * (self.interests.count() / MAX_INTERESTS)

        return round(completeness * 100)

    USERNAME_FIELD = "phone_number"
    REQUIRED_FIELDS = []
    objects = CustomUserManager()

    def __str__(self):
        if self.full_name:
            return f"{self.full_name} - {self.phone_number}"
        return f"{self.phone_number}"


def validate_file_extension(value):
    ext = os.path.splitext(value.name)[1]
    valid_extensions = [".jpg", ".jpeg"]
    if not ext.lower() in valid_extensions:
        raise ValidationError("Unsupported file extension.")


class UserPicture(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_profile = models.ForeignKey(
        UserProfile, related_name="profile_pictures", on_delete=models.CASCADE
    )
    image = models.ImageField(upload_to="profile_pics")
    active = models.BooleanField(default=False)
    order = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.user_profile}'s picture"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        # Open the image and resize it
        img = Image.open(self.image.path)

        # Resize the image to 1024x1024
        img = img.resize((1024, 1024), Image.BILINEAR)

        # Convert to JPG
        rgb_img = img.convert("RGB")

        # Save the image back to the same path
        rgb_img.save(self.image.path, format="JPEG", quality=95)


class UserPromptResponse(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        UserProfile,
        on_delete=models.CASCADE,
        related_name="prompts",
    )
    prompt = models.ForeignKey(
        Prompt, on_delete=models.CASCADE, related_name="user_responses"
    )
    response = models.TextField()
    order = models.IntegerField(null=False, blank=False, default=0)

    class Meta:
        unique_together = ("user", "prompt")
        verbose_name = "User Prompt Response"
        verbose_name_plural = "User Prompt Responses"

    def __str__(self):
        # Truncate response for display
        return f"{self.user} - {self.prompt.text[:50]}...: {self.response[:30]}..."


class IpAddress(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        UserProfile, related_name="user_ip_addresses", on_delete=models.CASCADE
    )
    ip_address = models.GenericIPAddressField()
    first_login = models.DateTimeField(auto_now=True)
    last_login = models.DateTimeField(auto_now=True)
