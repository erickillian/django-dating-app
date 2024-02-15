from graphene_django.views import GraphQLView
from django.urls import path
from .schema import schema
from rest_framework.authtoken.views import obtain_auth_token
from .views import login_user, register_user, logout_user, UserProfileView

urlpatterns = [
    path("graphql/", GraphQLView.as_view(graphiql=True, schema=schema)),
    path("auth/login", view=login_user),
    path("auth/register", view=register_user),
    path("auth/logout", view=logout_user),
    path("profile", UserProfileView.as_view(), name="user-profile"),
]
