from rest_framework.permissions import BasePermission


class IsUnassigned(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.assignee is None


class IsAssignedToUser(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.assignee == request.user


class IsOwnerOrAdmin(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.is_staff or obj.user == request.user
