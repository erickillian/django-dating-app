from graphene_django.views import GraphQLView
from django.urls import path
from .schema import schema
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('graphql/', GraphQLView.as_view(graphiql=True, schema=schema)),
]