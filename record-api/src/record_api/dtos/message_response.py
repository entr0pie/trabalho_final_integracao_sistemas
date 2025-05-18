
from pydantic import BaseModel, Field
from src.record_api.model.message_model import MessageModel

class MessageResponse(BaseModel):
    message: str = Field(..., min_length=1, max_length=500, description="O conteúdo da mensagem")

    @staticmethod
    def from_model(model: MessageModel):
        return MessageResponse(message=model.message)
    