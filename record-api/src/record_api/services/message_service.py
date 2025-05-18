from sqlmodel import select
from typing import Annotated
from fastapi import Depends
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

        return SaveMessageResponse(status="success")

    def get_messages(self, user_id_send: int, user_id_receive: int, page: int, size: int):
        stmt = (
            select(MessageModel)
                .where(MessageModel.user_id_send == user_id_send)
                .where(MessageModel.user_id_receive == user_id_receive)
                .order_by(MessageModel.message_id)
                .limit(size)
                .offset((page - 1) * size)
        )

        messages = self.session.exec(stmt).all()
        print(messages)
        return [MessageResponse.from_model(m) for m in messages]
    
def get_message_service(session: SessionDep):
    return MessageService(session=session)

MessageServiceDep = Annotated[MessageService, Depends(get_message_service)]