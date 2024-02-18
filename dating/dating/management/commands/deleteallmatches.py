# management/commands/randomly_rate_users.py
from django.core.management.base import BaseCommand
from random import choice
from django.contrib.auth import get_user_model
from dating.dating.models import Match

UserProfile = get_user_model()


class Command(BaseCommand):
    help = "Deletes all ratings and matches from generated users"

    def handle(self, *args, **kwargs):
        matches = Match.objects.all()
        matches.delete()
        users = UserProfile.objects.all()
        users.update(num_matches=0)
        self.stdout.write(self.style.SUCCESS("All matches have been deleted"))
