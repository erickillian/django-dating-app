from django.contrib import admin
from .models import UserProfile, UserPicture

class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'first_name', 'last_name', 'gender', 'birth_date']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    list_filter = ['gender', 'sexual_orientation']

class UserPictureAdmin(admin.ModelAdmin):
    list_display = ['user_profile', 'image']
    search_fields = ['user_profile__username']

admin.site.register(UserProfile, UserProfileAdmin)
admin.site.register(UserPicture, UserPictureAdmin)
