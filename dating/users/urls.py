from graphene_django.views import GraphQLView
from django.urls import path, include
from .schema import schema
from rest_framework.authtoken.views import obtain_auth_token
from .views import *
from rest_framework.parsers import MultiPartParser, JSONParser
from rest_framework.decorators import action
from rest_framework.routers import DefaultRouter

# Create a router and register our viewset with it.
router = DefaultRouter()
router.register(r"prompts", UserPromptResponseViewSet)

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
    path(
        "pictures/<str:picture_id>/",
        UserPicturesView.as_view(),
    ),
    path("interests/search/", InterestSearchView.as_view(), name="interest-search"),
    path("prompts-list/", PromptListView.as_view(), name="prompt-list"),
    path("prompts-categories/", CategoryListView.as_view(), name="category-list"),
    path("", include(router.urls)),
]
