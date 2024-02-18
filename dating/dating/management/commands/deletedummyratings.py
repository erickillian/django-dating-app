# management/commands/randomly_rate_users.py
from django.core.management.base import BaseCommand
from random import choice
from django.contrib.auth import get_user_model
from dating.dating.models import Rating

UserProfile = get_user_model()


class Command(BaseCommand):
    help = "Deletes all ratings from generated users"

    def handle(self, *args, **kwargs):
        generated_users = UserProfile.objects.filter(generated_profile=True)
        generated_ratings = Rating.objects.filter(rater__in=generated_users)
        generated_ratings.delete()
