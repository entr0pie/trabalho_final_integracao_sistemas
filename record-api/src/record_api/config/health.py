from fastapi import APIRouter, Depends
from src.record_api.config.env import SettingsDep
from src.record_api.model.database import SessionDep
from src.record_api.config.redis_client import redis_client  # CORREÇÃO AQUI ✅

health_router = APIRouter(prefix="/health")

def is_database_online(session: SessionDep):
    try:
        session.connection()
        return True
    except Exception as e:
        print("[DB ERROR]", e)
        return False

def is_redis_online() -> bool:
    try:
        redis_client.ping()  
        return True
    except Exception as e:
        print("[REDIS ERROR]", e)
        return False

@health_router.get("", summary="Verifica a saúde da aplicação", tags=["Health"])
def get_health(session: SessionDep, settings: SettingsDep):
    db_status = is_database_online(session)
    redis_status = is_redis_online()

    return {
        "status": "UP" if db_status and redis_status else "DOWN",
        "detail": {
            "database": db_status,
            "redis": redis_status
        }
    }
