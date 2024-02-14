import graphene
from graphene_django import DjangoObjectType
from .models import UserProfile

class UserProfileType(DjangoObjectType):
    class Meta:
        model = UserProfile
        # If you want to restrict the fields that can be queried, you can add:
        # fields = ('id', 'username', 'email', 'first_name', 'last_name')

class Query(graphene.ObjectType):
    all_user_profiles = graphene.List(UserProfileType)
    user_profile = graphene.Field(UserProfileType, id=graphene.Int())

    def resolve_all_user_profiles(self, info, **kwargs):
        # You can add more complex filtering here if needed
        return UserProfile.objects.all()

    def resolve_user_profile(self, info, id):
        # Optionally, handle the case where id is None or not found
        return UserProfile.objects.get(pk=id)

# Finally, create the schema
schema = graphene.Schema(query=Query)
