from django.contrib.auth.models import AnonymousUser
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import (
    LoginSerializer,
    RegisterSerializer,
    UserProfileSerializer,
    UserPictureSerializer,
    ProfilePictureSerializer,
)
from .models import UserProfile, UserPicture
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.decorators import action
from django.db import transaction


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


class PictureUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = UserPictureSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user_profile=request.user)
            request.user.num_pictures += 1
            request.user.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProfilePictureSelectionView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        selected_pictures = request.data.get("selected_pictures", [])

        if len(selected_pictures) > 6:
            return Response(
                {"detail": "Cannot select more than 6 pictures."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        UserPicture.objects.filter(user_profile=request.user).update(in_profile=False)
        for order, picture_id in enumerate(selected_pictures):
            try:
                picture = UserPicture.objects.get(
                    id=picture_id, user_profile=request.user
                )
                picture.in_profile = True
                picture.profile_order = order
                picture.save()
            except UserPicture.DoesNotExist:
                return Response(
                    {"detail": f"Picture ID {picture_id} not found."},
                    status=status.HTTP_404_NOT_FOUND,
                )

        request.user.num_active_pictures = len(selected_pictures)
        request.user.save()
        return Response({"detail": "Profile pictures updated."})


class UserPicturesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_pictures = UserPicture.objects.filter(user_profile=request.user)
        serializer = ProfilePictureSerializer(user_pictures, many=True)
        return Response(serializer.data)

    def delete(self, request, picture_id):
        try:
            picture = UserPicture.objects.get(id=picture_id, user_profile=request.user)
            picture.delete()
            request.user.num_pictures -= 1
            request.user.save()
            return Response(
                {"detail": "Picture deleted."}, status=status.HTTP_204_NO_CONTENT
            )
        except UserPicture.DoesNotExist:
            return Response(
                {"detail": "Picture not found."}, status=status.HTTP_404_NOT_FOUND
            )
