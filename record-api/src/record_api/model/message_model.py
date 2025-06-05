from sqlmodel import SQLModel, Field

class MessageModel(SQLModel, table=True):
    __tablename__ = "message"

    message_id: int = Field(default=None, primary_key=True)
    message: str = Field(nullable=False)
    user_id_send: int = Field(nullable=False)
    user_id_receive: int = Field(nullable=False)
