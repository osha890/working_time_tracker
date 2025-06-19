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


class IsAdminOrAssignedToProject(BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user

        if user.is_staff:
            return True
        return hasattr(user, "userextension") and user.userextension.project == obj
