# File: dating/users/management/commands/loadinterests.py

from django.core.management.base import BaseCommand, CommandError
import json
import os
from django.conf import settings
from dating.users.models import Interest


class Command(BaseCommand):
    help = "Load interests from a JSON file into the database"

    def add_arguments(self, parser):
        default_path = os.path.join(
            settings.BASE_DIR, "dating", "users", "data", "interests.json"
        )
        parser.add_argument(
            "--json",
            type=str,
            help="Path to the interests JSON file",
            default=default_path,
        )

    def handle(self, *args, **options):
        file_path = options["json"]
        try:
            with open(file_path, "r") as file:
                interests_data = json.load(file)
                i = 0
                for interest_name in interests_data:
                    interest, created = Interest.objects.get_or_create(
                        name=interest_name
                    )
                    if created:
                        self.stdout.write(
                            self.style.SUCCESS(f"Added new interest: {interest}")
                        )
                        i += 1
                    else:
                        self.stdout.write(
                            self.style.WARNING(f"Interest already exists: {interest}")
                        )
                self.stdout.write(self.style.SUCCESS(f"Added {i} new interests"))
        except FileNotFoundError:
            self.stdout.write(self.style.ERROR(f"File {file_path} not found"))
            raise CommandError(f"File {file_path} not found")
