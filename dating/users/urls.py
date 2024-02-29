from graphene_django.views import GraphQLView
from django.urls import path
from .schema import schema
from rest_framework.authtoken.views import obtain_auth_token
from .views import *
from rest_framework.parsers import MultiPartParser, JSONParser
from rest_framework.decorators import action

urlpatterns = [
    path("graphql/", GraphQLView.as_view(graphiql=True, schema=schema)),
    path("auth/login", view=login_user),
    path("auth/register", view=register_user),
    path("auth/logout", view=logout_user),
    path(
        "profile",
        MyUserProfileView.as_view(),
    ),
    path("upload-picture/", PictureUploadView.as_view(), name="upload-picture"),
    path(
        "select-pictures/",
        ProfilePictureSelectionView.as_view(),
        name="select-profile-pictures",
    ),
    path(
        "pictures/",
        UserPicturesView.as_view(),
    ),
    path("pictures/<int:picture_id>/", UserPicturesView.as_view()),
    path("interests/search/", InterestSearchView.as_view(), name="interest-search"),
    path("prompts/", PromptListView.as_view(), name="prompt-list"),
    path("prompts/categories/", CategoryListView.as_view(), name="category-list"),
    path(
        "prompts/create/",
        CreatePromptResponseView.as_view(),
        name="user-prompt-response",
    ),
]
