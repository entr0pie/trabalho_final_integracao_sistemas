from fastapi import FastAPI
from src.record_api.routers.message_router import message_router
from src.record_api.config.health import health_router

app = FastAPI(
    title="record-api",
    description="Serviço para a armazenar as mensagens dos usuários",
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