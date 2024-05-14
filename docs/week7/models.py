from pydantic import BaseModel
from datetime import datetime

class Member(BaseModel):
    id: int
    name: str
    username: str

class MemberData(BaseModel):
    data: Member | None

class UpdateNameRequest(BaseModel):
    name: str

class UpdateMessageRequest(BaseModel):
    message_id: int
    new_content: str

class DeleteMessageRequest(BaseModel):
    message_id: int

class MessageContent(BaseModel):
    content: str

class Message(BaseModel):
    id: int
    content: str
    member_id: int

