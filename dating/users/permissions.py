# permissions.py
from rest_framework import permissions


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Custom permission to only allow owners of an account to edit it, or admin users.
    """

    def has_object_permission(self, request, view, obj):
        # Admins can view or edit any account
        if request.user and request.user.is_staff:
            return True

        # Only allow owners to view or edit their account
        return obj == request.user
