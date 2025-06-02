from datetime import timedelta
import os


class JWTConfig:
    ACCESS_TOKEN_LIFETIME_VALUE = int(os.getenv("ACCESS_TOKEN_LIFETIME_VALUE", 10))
    ACCESS_TOKEN_LIFETIME_UNIT = os.getenv("ACCESS_TOKEN_LIFETIME_UNIT", "minutes").lower()

    REFRESH_TOKEN_LIFETIME_VALUE = int(os.getenv("REFRESH_TOKEN_LIFETIME_VALUE", 7))
    REFRESH_TOKEN_LIFETIME_UNIT = os.getenv("REFRESH_TOKEN_LIFETIME_UNIT", "days").lower()

    @property
    def SIMPLE_JWT(self):
        access_token_kwargs = {self.ACCESS_TOKEN_LIFETIME_UNIT: self.ACCESS_TOKEN_LIFETIME_VALUE}
        refresh_token_kwargs = {self.REFRESH_TOKEN_LIFETIME_UNIT: self.REFRESH_TOKEN_LIFETIME_VALUE}
        return {
            "ACCESS_TOKEN_LIFETIME": timedelta(**access_token_kwargs),
            "REFRESH_TOKEN_LIFETIME": timedelta(**refresh_token_kwargs),
        }


class Config:
    AUTH_CONFIG = JWTConfig()


CONFIG = Config()
