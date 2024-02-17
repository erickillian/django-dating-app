# management/commands/randomly_rate_users.py
from django.core.management.base import BaseCommand
from random import choice
from dating.dating.models import Rating, Match
from django.db.models import Q
from django.contrib.auth import get_user_model
from dating.dating.views import get_potential_matches_filter

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
                rated = potential_matches.first()
                action = choice(["like", "dislike"])
                Rating.objects.create(rater=rater, rated=rated, rating=action)
                ratings_created += 1
                self.stdout.write(
                    self.style.SUCCESS(f"User {rater.id} {action}d user {rated.id}")
                )
                # Check for mutual 'like' to create a Match object
                if action == "like":
                    # Check if 'rater' liked 'rated'
                    rater_liked_rated = Rating.objects.filter(
                        rater=rater, rated=rated, rating="like"
                    )

                    # Check if 'rated' liked 'rater'
                    rated_liked_rater = Rating.objects.filter(
                        rater=rated, rated=rater, rating="like"
                    )

                    # If both are true, it's a mutual like
                    if rater_liked_rated.exists() and rated_liked_rater.exists():
                        rater_liked_rated.delete()
                        rated_liked_rater.delete()
                        # Create a Match object
                        Match.objects.create(user_one=rater, user_two=rated)
                        matches_created += 1
                        self.stdout.write(
                            self.style.SUCCESS(
                                f"Match created between user {rater.id} and user {rated.id}"
                            )
                        )

            else:
                generated_users = generated_users.exclude(id=rater.id)
                continue

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully created {ratings_created} random ratings  with {matches_created} matches"
            )
        )
