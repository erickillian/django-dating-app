# management/commands/randomly_rate_users.py
from django.core.management.base import BaseCommand
from random import choice
from django.contrib.auth import get_user_model
from dating.users.models import UserProfile

UserProfile = get_user_model()


class Command(BaseCommand):
    help = "Deletes all generated users"

    def handle(self, *args, **kwargs):
        users = UserProfile.objects.filter(generated_profile=True)
        users.delete()
        self.stdout.write(self.style.SUCCESS("All generated users have been deleted"))
