from sqlmodel import SQLModel
from fastapi import FastAPI

from src.record_api.model.database import get_engine
from src.record_api.routers.message_router import message_router
from src.record_api.config.health import health_router
from src.record_api.config.env import Settings

app = FastAPI(
    title="record-api",
    description="Serviço para armazenar as mensagens dos usuários",
    version="1.0.0",
    contact={
        "name": "Coda Fofo",
        "email": "caiohporcel@gmail.com"
    },
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

app.include_router(health_router)
app.include_router(message_router)

# Criação automática das tabelas no banco
@app.on_event("startup")
def on_startup():
    settings = Settings()
    engine = get_engine(settings)
    SQLModel.metadata.create_all(engine)
