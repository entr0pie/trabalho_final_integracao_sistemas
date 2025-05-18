from fastapi import APIRouter
from src.record_api.model.database import SessionDep

def is_database_online(session: SessionDep):
    try:
        session.connection()
        return True
    except Exception as e:
        print(e)
        return False
    
health_router = APIRouter(prefix="/health")

@health_router.get("", summary="Verifica a saúde da aplicação", tags=["Health"])
def get_health(session: SessionDep):
    database_status = is_database_online(session)
    
    return {
        "status": "UP" if database_status else "DOWN",
        "detail": {
            "database": database_status
        } 
    }
