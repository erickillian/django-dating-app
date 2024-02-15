from django.contrib.auth.models import AnonymousUser
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import LoginSerializer, RegisterSerializer, UserProfileSerializer
from .models import UserProfile
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import viewsets
from rest_framework.views import APIView


@api_view(["POST"])
def login_user(request):
    serializer = LoginSerializer(data=request.data, context={"request": request})

    if serializer.is_valid():
        user = UserProfile.objects.get(
            phone_number=serializer.validated_data["phone_number"]
        )
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key})
    else:
        return Response(serializer.errors, status=400)


@api_view(["POST"])
def logout_user(request):
    # Check if the request.user is an AnonymousUser
    if isinstance(request.user, AnonymousUser):
        return Response(
            {"detail": "You are not logged in."}, status=status.HTTP_400_BAD_REQUEST
        )

    # Retrieve and delete the user's auth token
    try:
        token = Token.objects.get(user=request.user)
        token.delete()
        return Response(
            {"detail": "Successfully logged out."}, status=status.HTTP_200_OK
        )
    except Token.DoesNotExist:
        # Handle the case where the token is not found
        return Response(
            {"detail": "Token not found, or already logged out."},
            status=status.HTTP_400_BAD_REQUEST,
        )


@api_view(["POST"])
def register_user(request):
    serializer = RegisterSerializer(data=request.data, context={"request": request})

    if serializer.is_valid():
        serializer.save()  # This will call the `create` method of your serializer
        user = UserProfile.objects.get(
            phone_number=serializer.validated_data["phone_number"]
        )
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key})
    else:
        return Response(serializer.errors, status=400)


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            serializer = UserProfileSerializer(request.user)
            return Response(serializer.data)
        except UserProfile.DoesNotExist:
            return Response(
                {"detail": "User profile not found."}, status=status.HTTP_404_NOT_FOUND
            )

    def put(self, request):
        try:
            serializer = UserProfileSerializer(
                request.user, data=request.data, partial=True
            )
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except UserProfile.DoesNotExist:
            return Response(
                {"detail": "User profile not found."}, status=status.HTTP_404_NOT_FOUND
            )
