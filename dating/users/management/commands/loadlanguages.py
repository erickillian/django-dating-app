# File: dating/users/management/commands/loadlanguages.py

from django.core.management.base import BaseCommand, CommandError
import json
import os
from django.conf import settings
from dating.users.models import Language


class Command(BaseCommand):
    help = "Load languages from a JSON file into the database"

    def add_arguments(self, parser):
        default_path = os.path.join(
            settings.BASE_DIR, "dating", "users", "data", "languages.json"
        )
        parser.add_argument(
            "--json",
            type=str,
            help="Path to the languages JSON file",
            default=default_path,
        )

    def handle(self, *args, **options):
        file_path = options["json"]
        try:
            with open(file_path, "r") as file:
                languages_data = json.load(file)
                i = 0
                for language_name in languages_data:
                    language, created = Language.objects.get_or_create(
                        name=language_name
                    )
                    if created:
                        self.stdout.write(
                            self.style.SUCCESS(f"Added new language: {language}")
                        )
                        i += 1
                    else:
                        self.stdout.write(
                            self.style.WARNING(f"language already exists: {language}")
                        )
                self.stdout.write(self.style.SUCCESS(f"Added {i} new languages"))
        except FileNotFoundError:
            self.stdout.write(self.style.ERROR(f"File {file_path} not found"))
            raise CommandError(f"File {file_path} not found")
