from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """
    Central app config, loaded from environment variables / .env.
    Add JWT or provider settings here only if the mocked auth is replaced.
    """
    database_url: str = "sqlite:///./app.db"
    cors_origins: str = "http://localhost:3000"

    class Config:
        env_file = ".env"


settings = Settings()
