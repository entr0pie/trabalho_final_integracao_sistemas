
from pydantic import BaseModel, Field

class SaveMessageResponse(BaseModel):
    status: str = Field(..., min_length=1, max_length=64, description="Status da mensagens")