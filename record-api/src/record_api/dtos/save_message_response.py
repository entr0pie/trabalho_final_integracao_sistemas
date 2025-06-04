from pydantic import BaseModel, Field
from typing import Optional

class SaveMessageResponse(BaseModel):
    status: str = Field(..., min_length=1, max_length=64, description="Status da mensagem")
    message_id: Optional[int] = Field(None, description="ID da mensagem salva")
