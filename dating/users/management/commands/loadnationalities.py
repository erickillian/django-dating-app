# File: dating/users/management/commands/loadnationalities.py

from django.core.management.base import BaseCommand, CommandError
import json
import os
from django.conf import settings
from dating.users.models import Nationality


class Command(BaseCommand):
    help = "Load nationalities from a JSON file into the database"

    def add_arguments(self, parser):
        default_path = os.path.join(
            settings.BASE_DIR, "dating", "users", "data", "nationalities.json"
        )
        parser.add_argument(
            "--json",
            type=str,
            help="Path to the nationalities JSON file",
            default=default_path,
        )

    def handle(self, *args, **options):
        file_path = options["json"]
        try:
            with open(file_path, "r") as file:
                nationalities_data = json.load(file)
                i = 0
                for nationality_name in nationalities_data:
                    nationality, created = Nationality.objects.get_or_create(
                        name=nationality_name
                    )
                    if created:
                        self.stdout.write(
                            self.style.SUCCESS(f"Added new nationality: {nationality}")
                        )
                        i += 1
                    else:
                        self.stdout.write(
                            self.style.WARNING(
                                f"nationality already exists: {nationality}"
                            )
                        )
                self.stdout.write(self.style.SUCCESS(f"Added {i} new nationalities"))
        except FileNotFoundError:
            self.stdout.write(self.style.ERROR(f"File {file_path} not found"))
            raise CommandError(f"File {file_path} not found")
