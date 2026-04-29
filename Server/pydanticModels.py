from pydantic import BaseModel
from typing import List, Literal, Optional

class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str
    related_file: Optional[str] = None

class RepoChunks(BaseModel):
    repo_id: str
    repo_name: str
    file_path: str
    content: str
    chunk_index: int
    language: Optional[str] = None

class repoUrl(BaseModel):
    url: str