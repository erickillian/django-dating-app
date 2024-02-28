from django.core.management.base import BaseCommand, CommandError
import json
import os
from django.conf import settings
from dating.users.models import Prompt


class Command(BaseCommand):
    help = "Load prompts from a JSON file into the database and assign prompt types"

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

    def get_prompt_type(self, prompt_text, prompt_classification):
        for prompt_type, prompts in prompt_classification.items():
            if prompt_text in prompts:
                return prompt_type
        return (
            "Favorites & Preferences"  # Default type if not found in the classification
        )

    def handle(self, *args, **options):
        file_path = options["json"]
        try:
            with open(file_path, "r") as file:
                prompts_data = json.load(file)

                i = 0
                for prompt_type in prompts_data:
                    prompt_texts = prompts_data[prompt_type]
                    for prompt_text in prompt_texts:
                        prompt, created = Prompt.objects.get_or_create(
                            text=prompt_text, type=prompt_type
                        )
                        if created:
                            self.stdout.write(
                                self.style.SUCCESS(
                                    f"Added new prompt: {prompt} with type {prompt_type}"
                                )
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
