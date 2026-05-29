from sqlmodel import Relationship, SQLModel, Field
from typing import List, Optional, Literal
from datetime import datetime, timezone
from enum import Enum

class RoleEnum(str, Enum):
    user = "user"
    assistant = "assistant"

class Conversation(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    repo_name: str

    user_id: int = Field(
        foreign_key="user.id"
    )

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    user: Optional["User"] = Relationship(
        back_populates="conversations"
    )

    messages: List["Message"] = Relationship(
        back_populates="conversation"
    )

class Message(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    conversation_id: int = Field(foreign_key="conversation.id")

    role: RoleEnum
    content: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    conversation: Optional["Conversation"] = Relationship(back_populates="messages")

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str
    email: str
    password_hash: str
    conversations: List[Conversation] = Relationship(back_populates="user")    