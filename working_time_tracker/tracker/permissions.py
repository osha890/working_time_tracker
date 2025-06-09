from rest_framework.permissions import BasePermission


class IsUnassigned(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.assignee is None


class IsAssignedToUser(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.assignee == request.user
