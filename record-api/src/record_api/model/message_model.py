from sqlmodel import SQLModel, Field

class MessageModel(SQLModel, table=True):
    __tablename__ = "message"

    message_id: int = Field(default=None, primary_key=True)
    message: str = Field(nullable=False)
    userIdSend: int = Field(nullable=False)
    userIdReceive: int = Field(nullable=False)
