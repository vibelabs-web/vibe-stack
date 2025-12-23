from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class PostBase(BaseModel):
    title: str
    content: str
    image_url: Optional[str] = None
    category_id: Optional[int] = None

class PostCreate(PostBase):
    pass

class PostUpdate(PostBase):
    pass

class Post(PostBase):
    id: int
    author_id: int
    created_at: datetime
    likes_count: int
    comments_count: int
    
    class Config:
        orm_mode = True

# Avoid circular imports for author field if possible, or use simple schema
class PostList(Post):
    author: Optional['UserBase'] = None

from app.schemas.user import UserBase
PostList.update_forward_refs()
