# File: dating/users/management/commands/loadprompts.py

from django.core.management.base import BaseCommand, CommandError
import json
import os
from django.conf import settings
from dating.users.models import Prompt


class Command(BaseCommand):
    help = "Load prompts from a JSON file into the database"

    def add_arguments(self, parser):
        default_path = os.path.join(
            settings.BASE_DIR, "dating", "users", "data", "prompts.json"
        )
        parser.add_argument(
            "--json",
            type=str,
            help="Path to the prompts JSON file",
            default=default_path,
        )

    def handle(self, *args, **options):
        file_path = options["json"]
        try:
            with open(file_path, "r") as file:
                prompts_data = json.load(file)
                i = 0
                for prompt_text in prompts_data:
                    prompt, created = Prompt.objects.get_or_create(text=prompt_text)
                    if created:
                        self.stdout.write(
                            self.style.SUCCESS(f"Added new prompt: {prompt}")
                        )
                        i += 1
                    else:
                        self.stdout.write(
                            self.style.WARNING(f"Prompt already exists: {prompt}")
                        )
                self.stdout.write(self.style.SUCCESS(f"Added {i} new prompts"))
        except FileNotFoundError:
            self.stdout.write(self.style.ERROR(f"File {file_path} not found"))
            raise CommandError(f"File {file_path} not found")
