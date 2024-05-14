from pydantic import BaseModel

class UpdateNameRequest(BaseModel):
    name: str

class UpdateMessageRequest(BaseModel):
    message_id: int
    new_content: str

class DeleteMessageRequest(BaseModel):
    message_id: int




