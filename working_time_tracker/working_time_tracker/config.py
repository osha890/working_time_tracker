from datetime import timedelta
import os


class JWTConfig:
    ACCESS_TOKEN_LIFETIME_SECONDS_VALUE = int(os.getenv("ACCESS_TOKEN_LIFETIME_SECONDS_VALUE", 600))  # 10 minutes
    REFRESH_TOKEN_LIFETIME_SECONDS_VALUE = int(os.getenv("REFRESH_TOKEN_LIFETIME_SECONDS_VALUE", 604700))  # 7 days

    @property
    def SIMPLE_JWT(self):
        return {
            "ACCESS_TOKEN_LIFETIME": timedelta(seconds=self.ACCESS_TOKEN_LIFETIME_SECONDS_VALUE),
            "REFRESH_TOKEN_LIFETIME": timedelta(seconds=self.REFRESH_TOKEN_LIFETIME_SECONDS_VALUE),
        }


class Config:
    AUTH_CONFIG = JWTConfig()


CONFIG = Config()
