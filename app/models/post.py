from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(Text)
    image_url = Column(String, nullable=True)
    category_id = Column(Integer, nullable=True) # Assuming category logic exists or is optional
    
    author_id = Column(String(36), ForeignKey("users.id"))
    author = relationship("User", back_populates="posts")
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    likes_count = Column(Integer, default=0)
    comments_count = Column(Integer, default=0)
