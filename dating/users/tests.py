# tests.py

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase
from django.contrib.auth import get_user_model


class AuthTestCase(APITestCase):
    def setUp(self):
        User = get_user_model()
        User.objects.all().delete()
        self.client = APIClient()
        self.register_url = reverse("rest_register")
        self.login_url = reverse("rest_login")
        self.logout_url = reverse("rest_logout")

        # User data for registration
        self.registration_data = {
            "username": "testuser",
            "email": "test@example.com",
            "password1": "some_strong_psw",
            "password2": "some_strong_psw",
        }

        # User data for login
        self.login_data = {"username": "testuser", "password": "some_strong_psw"}

    def test_registration(self):
        # Test user registration
        response = self.client.post(
            self.register_url, self.registration_data, format="json"
        )
        print(
            "\nRESPONSE DATA FROM REGISTRATION:", response.data
        )  # Add this line to debug
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            "key" in response.data
        )  # Default response includes the auth token 'key'

    def test_login(self):
        # First, register the user
        self.client.post(self.register_url, self.registration_data, format="json")

        # Test user login
        response = self.client.post(self.login_url, self.login_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(
            "key" in response.data
        )  # Default response includes the auth token 'key'

    def test_logout(self):
        # First, register the user
        response = self.client.post(
            self.register_url, self.registration_data, format="json"
        )
        # print(response.data)  # Add this line to debug
        token = response.data["key"]
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token)

        # Test user logout
        response = self.client.post(self.logout_url, {})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def tearDown(self):
        # Clean up any created user instances
        User = get_user_model()
        User.objects.all().delete()
