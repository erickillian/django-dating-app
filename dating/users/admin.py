from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import UserChangeForm, UserCreationForm
from django import forms
from .models import UserProfile, UserPicture, IpAddress


class MyUserChangeForm(UserChangeForm):
    class Meta(UserChangeForm.Meta):
        model = UserProfile
        fields = "__all__"  # Specify the fields you want to include


class MyUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = UserProfile
        fields = "__all__"  # Specify the fields you want to include


class UserProfileAdmin(BaseUserAdmin):
    form = MyUserChangeForm
    add_form = MyUserCreationForm

    list_display = [
        "phone_number",
        "full_name",
        "gender",
        "birth_date",
    ]
    search_fields = ["phone_number", "first_name", "last_name"]
    list_filter = ["gender", "sexual_orientation"]
    fieldsets = (
        (None, {"fields": ("phone_number", "password")}),
        (
            "Personal info",
            {
                "fields": (
                    "full_name",
                    "gender",
                    "birth_date",
                )
            },
        ),  # Update as per your model fields
        # Remove or modify sections that are not applicable to your model
    )
    search_fields = ("phone_number", "full_name")  # Update as per your model fields
    ordering = ("phone_number",)  # Update as per your model fields
    filter_horizontal = ()


admin.site.register(UserProfile, UserProfileAdmin)
admin.site.register(UserPicture)
admin.site.register(IpAddress)
