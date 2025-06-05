
from pydantic import BaseModel, Field
from src.record_api.model.message_model import MessageModel

class MessageResponse(BaseModel):
    message_id: int = Field(..., description="ID da mensagem")
    message: str = Field(..., min_length=1, max_length=500, description="O conteúdo da mensagem")
    userIdSend: int = Field(..., description="Id do usuário que enviou a mensagem")
    userIdReceive: int = Field(..., description="Id do usuário que recebeu a mensagem")

    @staticmethod
    def from_model(model: MessageModel):
        # Mapeia os campos do seu MessageModel (SQLModel) para o MessageResponse (Pydantic)
        return MessageResponse(
            message_id=model.message_id,
            message=model.message,
            userIdSend=model.userIdSend,    # Mapeando userIdSend para user_id_send
            userIdReceive=model.userIdReceive # Mapeando userIdReceive para user_id_receive
        )
    