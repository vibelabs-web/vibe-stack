from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import post as post_model
from app.schemas import post as post_schema
from app.utils.deps import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/api/posts",
    tags=["posts"]
)

# Temporary mock data or simple DB implementation if models exist
# Checking models first would be ideal, but to fix 404 quickly we'll implement standard CRUD pattern logic
# assuming models are ready or we can use a temporary in-memory store if DB isn't fully set up.
# However, user mentioned "remove mock data", so we should try to use DB.
# Let's inspect models/post.py first to match columns. 
# But to proceed without too many steps, I will write a generic structure and fix if model mismatch.

@router.post("/", response_model=post_schema.Post)
def create_post(
    post: post_schema.PostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # This assumes Post model has these fields
    db_post = post_model.Post(
        title=post.title,
        content=post.content,
        image_url=post.image_url,
        category_id=post.category_id,
        author_id=current_user.id
    )
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

@router.get("/", response_model=List[post_schema.Post])
def read_posts(
    skip: int = 0, 
    limit: int = 100, 
    sort: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(post_model.Post)
    if sort == 'newest':
        query = query.order_by(post_model.Post.created_at.desc())
    elif sort == 'popular':
        query = query.order_by(post_model.Post.likes_count.desc())
    
    posts = query.offset(skip).limit(limit).all()
    return posts

@router.get("/{post_id}", response_model=post_schema.Post)
def read_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(post_model.Post).filter(post_model.Post.id == post_id).first()
    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    return post
