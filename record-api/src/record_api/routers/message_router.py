from fastapi import APIRouter, Depends, Query
from src.record_api.services.message_service import get_message_service
from src.record_api.dtos.save_message_request import SaveMessageRequest
from src.record_api.dtos.save_message_response import SaveMessageResponse
from src.record_api.dtos.message_response import MessageResponse
from typing import List
from src.record_api.services.message_service import MessageService

message_router = APIRouter(prefix="/messages", tags=["Messages"])

@message_router.post("", response_model=SaveMessageResponse, summary="Salva uma nova mensagem")
def save_message(
    data: SaveMessageRequest,
    service: MessageService = Depends(get_message_service)
):
    return service.save_message(data)

@message_router.get("", response_model=List[MessageResponse], summary="Lista mensagens entre dois usuários")
def get_messages(
    userIdSend: int = Query(..., description="ID do usuário remetente"),
    userIdReceive: int = Query(..., description="ID do usuário destinatário"),
    page: int = Query(1, ge=1, description="Número da página"),
    size: int = Query(10, ge=1, le=100, description="Tamanho da página"),
    service: MessageService = Depends(get_message_service)
):
    return service.get_messages(userIdSend, userIdReceive, page, size)