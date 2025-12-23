from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserUpdate, UserResponse
from app.utils.deps import get_current_user

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("/ranking", response_model=List[UserResponse])
def get_user_ranking(
    period: str = Query("weekly", description="Period for ranking: daily, weekly, all"),
    db: Session = Depends(get_db)
):
    """
    Get user ranking based on activity (posts count, etc.)
    For now, returns users ordered by creation date as a placeholder
    """
    users = db.query(User).filter(User.is_active == True).limit(10).all()
    return users

@router.get("/me", response_model=UserResponse)
def read_user_me(current_user: User = Depends(get_current_user)):
    """
    Get current user profile
    """
    return current_user

@router.put("/me", response_model=UserResponse)
def update_user_me(
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update current user profile
    """
    # Check nickname uniqueness if being updated
    if user_update.nickname and user_update.nickname != current_user.nickname:
        existing_user = db.query(User).filter(User.nickname == user_update.nickname).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="이미 사용 중인 닉네임입니다."
            )
    
    # Update fields
    # Using exclude_unset=True to only update fields that were actually sent
    update_data = user_update.model_dump(exclude_unset=True)
    
    for key, value in update_data.items():
        setattr(current_user, key, value)
    
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    
    return current_user

@router.get("/{user_id}", response_model=UserResponse)
def read_user_by_id(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user) # Login required to view profiles? Let's say yes for now
):
    """
    Get specific user profile by ID
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="사용자를 찾을 수 없습니다."
        )
    return user
