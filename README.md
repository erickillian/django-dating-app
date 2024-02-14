
# Django Dating App

To start first install [Docker](https://docs.docker.com/engine/install/) on the system you are using

To run web application run the following docker commands
```
sudo docker compose up -d --build
sudo docker compose exec web python3 manage.py makemigrations
sudo docker compose exec web python3 manage.py migrate
```

To create a superuser for the backend so that you can use the Django ORM run the following command:
```
sudo docker compose exec web python3 manage.py createsuperuser
```

To run api endpoint test cases run
```
sudo docker compose exec web python3 manage.py test
```