import json
from sqlmodel import select
from typing import Annotated
from fastapi import Depends

from src.record_api.config.redis_client import redis_client
from src.record_api.dtos.save_message_request import SaveMessageRequest
from src.record_api.dtos.save_message_response import SaveMessageResponse
from src.record_api.dtos.message_response import MessageResponse
from src.record_api.model.database import SessionDep
from src.record_api.model.message_model import MessageModel

class MessageService:
    def __init__(self, session: SessionDep):
        self.session = session

    def save_message(self, data: SaveMessageRequest) -> SaveMessageResponse:
        model = data.create_model()
        self.session.add(model)
        self.session.commit()
        self.session.refresh(model)  # necessário para obter o message_id gerado

        # Invalida cache relacionado
        pattern = f"messages:{data.userIdSend}:{data.userIdReceive}*"
        for key in redis_client.scan_iter(pattern):
            redis_client.delete(key)

        return SaveMessageResponse(status="success", message_id=model.message_id)

    def get_messages(self, userIdSend: int, userIdReceive: int, page: int, size: int):
        cache_key = f"messages:{userIdSend}:{userIdReceive}:{page}:{size}"

        cached_data = redis_client.get(cache_key)
        if cached_data:
            return json.loads(cached_data)

        stmt = (
            select(MessageModel)
            .where(MessageModel.user_id_send == userIdSend)
            .where(MessageModel.user_id_receive == userIdReceive)
            .order_by(MessageModel.message_id)
            .limit(size)
            .offset((page - 1) * size)
        )

        messages = self.session.exec(stmt).all()
        result = [MessageResponse.from_model(m) for m in messages]
        redis_client.setex(cache_key, 60, json.dumps([r.dict() for r in result]))

        return result


def get_message_service(session: SessionDep):
    return MessageService(session=session)

MessageServiceDep = Annotated[MessageService, Depends(get_message_service)]
