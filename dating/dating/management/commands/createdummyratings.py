# management/commands/randomly_rate_users.py
from django.core.management.base import BaseCommand
from random import choice
from django.contrib.auth import get_user_model
from dating.dating.views import get_potential_matches_filter, handle_rate

UserProfile = get_user_model()


class Command(BaseCommand):
    help = "Randomly makes users like or dislike other users and creates dummy matches"

    def add_arguments(self, parser):
        parser.add_argument(
            "--num_ratings",
            type=int,
            help="Number of random ratings to create",
            required=True,
        )

    def handle(self, *args, **kwargs):
        num_ratings = kwargs["num_ratings"]
        generated_users = UserProfile.objects.filter(generated_profile=True)
        all_users = UserProfile.objects.all()
        ratings_created = 0
        matches_created = 0

        while ratings_created < num_ratings:
            if generated_users.exists() == False:
                self.stdout.write(
                    self.style.WARNING(
                        "No more possible ratings for generated users. Exiting."
                    )
                )
                break

            rater = choice(generated_users)
            potential_matches = all_users.filter(get_potential_matches_filter(rater))
            if potential_matches:
                rated = choice(potential_matches)
                action = choice(["like"])  # choice(["like", "dislike"])

                created_match = handle_rate(action, rater, rated)
                if created_match:
                    matches_created += 1
                    self.stdout.write(
                        self.style.SUCCESS(
                            f"User {rater} and user {rated} have matched"
                        )
                    )

                ratings_created += 1
                self.stdout.write(
                    self.style.SUCCESS(f"User {rater} {action}d user {rated}")
                )

            else:
                generated_users = generated_users.exclude(id=rater.id)
                continue

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully created {ratings_created} random ratings with {matches_created} matches"
            )
        )
