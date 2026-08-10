from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    app_name: str = "STWNO Anwendung Backend"
    database_url: str
    frontend_url: str
    environment: str = "development"  # Use "production" in production usage
    log_level: str = "INFO"
    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    smtp_host: str = "mailhog"
    smtp_port: int = 1025
    smtp_username: str | None = None
    smtp_password: str | None = None
    smtp_use_tls: bool = False
    smtp_from_email: str = "stwno.app@gmail.com" # only for testing
    
settings = Settings()
