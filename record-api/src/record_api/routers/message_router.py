from fastapi import APIRouter
from fastapi import Body
from src.record_api.dtos.save_message_request import SaveMessageRequest
from src.record_api.dtos.save_message_response import SaveMessageResponse
from src.record_api.dtos.message_response import MessageResponse
from src.record_api.services.message_service import MessageServiceDep

message_router = APIRouter(prefix='/messages')

@message_router.post("", summary="Salva uma nova mensagem", tags=["Mensagens"])
def save_message(service: MessageServiceDep, data: SaveMessageRequest = Body()) -> SaveMessageResponse:
    return service.save_message(data)

@message_router.get("", summary="Busca as mensagens de uma determinada conversa", tags=["Mensagens"])
def get_messages(service: MessageServiceDep, user_id_send: int, user_id_receive: int, page: int, size: int) -> list[MessageResponse]:
    return service.get_messages(user_id_send, user_id_receive, page, size)

