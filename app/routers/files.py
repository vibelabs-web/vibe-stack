from fastapi import APIRouter, UploadFile, File, HTTPException
import shutil
import os
import uuid
from typing import List

router = APIRouter(prefix="/api/files", tags=["files"])

UPLOAD_DIR = "uploads"
# Ensure directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="이미지 파일만 업로드 가능합니다.")
    
    # Generate unique filename
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    # Save file
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail="파일 저장 중 오류가 발생했습니다.")
    
    # Return URL (Relative URL)
    # The frontend will prepend the backend base URL or we can return user-friendly path
    # Since we'll mount /uploads at root or /static, let's assume root /uploads
    return {"url": f"/uploads/{unique_filename}"}
