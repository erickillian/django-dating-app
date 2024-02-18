# management/commands/randomly_rate_users.py
from django.core.management.base import BaseCommand
from random import choice
from django.contrib.auth import get_user_model
from dating.dating.models import Rating

UserProfile = get_user_model()


class Command(BaseCommand):
    help = "Deletes all ratings and matches from generated users"

    def handle(self, *args, **kwargs):
        ratings = Rating.objects.all()
        ratings.delete()
        users = UserProfile.objects.all()
        users.update(num_likes=0)
        self.stdout.write(self.style.SUCCESS("All ratings have been deleted"))
