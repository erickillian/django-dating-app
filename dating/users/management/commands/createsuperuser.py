from django.contrib.auth.management.commands import createsuperuser
from django.core.management import CommandError


class Command(createsuperuser.Command):
    def handle(self, *args, **options):
        options.setdefault("interactive", False)
        phone_number = options.get("phone_number")
        password = options.get("password")
        database = options.get("database")

        if not phone_number or not password:
            raise CommandError(
                "You must use --phone_number and --password with --noinput."
            )

        user_data = {
            "phone_number": phone_number,
            "password": password,
        }

        self.UserModel._default_manager.db_manager(database).create_superuser(
            **user_data
        )
        if options.get("verbosity", 0) >= 1:
            self.stdout.write("Superuser created successfully.")
