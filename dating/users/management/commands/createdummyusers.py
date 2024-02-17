from django.core.management.base import BaseCommand, CommandError
from faker import Faker
from django.core.exceptions import ValidationError
from django.core.files import File
from io import BytesIO
import requests
from PIL import Image
from dating.users.models import (
    UserProfile,
    UserPicture,
)

fake = Faker()


def get_fake_image():
    response = requests.get("https://thispersondoesnotexist.com")
    if response.status_code == 200:
        return Image.open(BytesIO(response.content))
    else:
        raise Exception("Could not fetch image")


def create_profile_pictures(user_profile, num_pics):
    for i in range(num_pics):
        img = get_fake_image()
        img_io = BytesIO()
        img.save(img_io, format="JPEG", quality=95)
        img_io.seek(0)
        img_file = File(img_io, name=f"{user_profile.phone_number}_pic_{i}.jpg")

        UserPicture.objects.create(
            user_profile=user_profile, image=img_file, in_profile=True, profile_order=i
        )


class Command(BaseCommand):
    help = "Create a specified number of fake users with profile pictures"

    def add_arguments(self, parser):
        parser.add_argument(
            "--num_users",
            type=int,
            default=10,
            help="The number of fake users to create (default: 10)",
        )
        parser.add_argument(
            "--num_pictures",
            type=int,
            default=1,
            help="The number of profile pictures per user (default: 1)",
        )

    def handle(self, *args, **kwargs):
        num_users = kwargs["num_users"]
        num_pictures = kwargs["num_pictures"]
        created_count = 0

        while created_count < num_users:
            try:
                fake_phone_number = f"+{fake.random_number(digits=10, fix_len=True)}"

                if UserProfile.objects.filter(phone_number=fake_phone_number).exists():
                    continue

                fake_password = fake.password(
                    length=10,
                    special_chars=True,
                    digits=True,
                    upper_case=True,
                    lower_case=True,
                )
                fake_user = UserProfile.objects.create_user(
                    phone_number=fake_phone_number, password=fake_password
                )

                fake_user.full_name = fake.name()
                fake_user.birth_date = fake.date_of_birth(
                    minimum_age=18, maximum_age=90
                )
                fake_user.gender = fake.random_element(
                    elements=("Male", "Female", "Other")
                )
                fake_user.sexual_orientation = fake.random_element(
                    elements=("Straight", "Gay", "Bisexual", "Other")
                )
                fake_user.location = fake.city()
                fake_user.height = fake.random_int(min=150, max=200)
                fake_user.save()

                self.stdout.write(self.style.SUCCESS(f"User created: {fake_user}"))

                # Create profile pictures for this user
                create_profile_pictures(fake_user, num_pictures)

                created_count += 1
            except ValidationError as e:
                self.stdout.write(self.style.ERROR(f"Error creating user: {e}"))
            except Exception as e:
                raise CommandError(f"Error occurred: {e}")

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully created {created_count} fake users with profile pictures."
            )
        )


# Example usage
# python manage.py your_command_name 50 6
# This will create 50 users each with 6 profile pictures
