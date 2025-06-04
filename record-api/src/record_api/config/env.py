from typing import Annotated
from fastapi import Depends
from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

class Settings(BaseSettings):
    database_uri: str
    redis_host: str       
    redis_port: int       

    model_config = SettingsConfigDict(env_file=".env")

@lru_cache
def get_env():
    return Settings()

SettingsDep = Annotated[Settings, Depends(get_env)]
