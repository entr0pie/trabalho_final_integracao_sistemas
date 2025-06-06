from pydantic import BaseModel, Field
from src.record_api.model.message_model import MessageModel

class SaveMessageRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=500, description="O conteúdo da mensagem")
    userIdSend: int = Field(..., ge=1, description="Id do usuário que enviou a mensagem")
    userIdReceive: int = Field(..., ge=1, description="Id do usuário que recebeu a mensagem")

    def create_model(self) -> MessageModel:
        return MessageModel(message=self.message, user_id_send=self.userIdSend, user_id_receive=self.userIdReceive)

