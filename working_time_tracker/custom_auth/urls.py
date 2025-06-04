from django.urls import path

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from custom_auth.views import LogoutView, RegisterView

urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("token/", TokenObtainPairView.as_view()),
    path("token/refresh/", TokenRefreshView.as_view()),
    path("logout/", LogoutView.as_view()),
]
