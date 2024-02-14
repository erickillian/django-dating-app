from django.db import models
from django.core.validators import RegexValidator, MinValueValidator, MaxValueValidator
from django.contrib.auth.models import AbstractUser


class UserProfile(AbstractUser):
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
    phone_number = models.CharField(validators=[phone_regex], max_length=17, blank=True)

    # User preferences
    # dating_intention = models.CharField(max_length=50, choices=[('Long Term', 'Long Term'), ('Casual', 'Casual'), ('Friendship', 'Friendship'), ('Other', 'Other')], blank=True)
    # children = models.CharField(max_length=50, choices=[('Want Children', 'Want Children'), ('Do Not Want Children', 'Do Not Want Children'), ('Open to Discussion', 'Open to Discussion')], blank=True)
    # family_plans = models.CharField(max_length=100, blank=True)  # Open-ended
    # drug_use = models.CharField(max_length=50, choices=[('Never', 'Never'), ('Sometimes', 'Sometimes'), ('Regularly', 'Regularly')], blank=True)
    # smoking = models.BooleanField(null=True)  # True for smoker, False for non-smoker
    # marijuana_use = models.BooleanField(null=True)
    # drinking = models.CharField(max_length=50, choices=[('Never', 'Never'), ('Socially', 'Socially'), ('Regularly', 'Regularly')], blank=True)
    # political_views = models.CharField(max_length=100, blank=True)  # Open-ended or choices
    # education_level = models.CharField(max_length=100, choices=[('High School', 'High School'), ('Bachelor', 'Bachelor'), ('Master', 'Master'), ('Doctorate', 'Doctorate'), ('Other', 'Other')], blank=True)
    # sexual_preference = models.CharField(max_length=20, choices=[('Men', 'Men'), ('Women', 'Women'), ('Both', 'Both'), ('Other', 'Other')], blank=True)
    # max_distance = models.IntegerField(null=True, blank=True)  # Maximum distance in km
    # age_range = models.CharField(max_length=50, blank=True)  # Example: "25-35"
    # ethnicity = models.CharField(max_length=100, blank=True)  # Open-ended or choices
    # religion = models.CharField(max_length=100, blank=True)  # Open-ended or choices

    def __str__(self):
        return self.username


class UserPicture(models.Model):
    user_profile = models.ForeignKey(
        UserProfile, related_name="profile_pictures", on_delete=models.CASCADE
    )
    image = models.ImageField(upload_to="profile_pics")

    def __str__(self):
        return f"{self.user_profile.user.username}'s picture"


class IpAddress(models.Model):
    user = models.ForeignKey(
        UserProfile, related_name="user_ip_addresses", on_delete=models.CASCADE
    )
    ip_address = models.GenericIPAddressField()
    first_login = models.DateTimeField(auto_now=True)
    last_login = models.DateTimeField(auto_now=True)