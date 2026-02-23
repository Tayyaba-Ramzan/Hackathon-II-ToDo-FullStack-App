from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application configuration settings loaded from environment variables."""

    database_url: str
    host: str = "0.0.0.0"
    port: int = 8000

    # JWT Authentication Settings
    jwt_secret: str
    jwt_algorithm: str = "HS256"
    jwt_expiration_hours: int = 1

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
