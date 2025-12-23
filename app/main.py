from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config import settings
from app.routers import auth, users, files

app = FastAPI(title=settings.PROJECT_NAME)

from fastapi.staticfiles import StaticFiles
from app.routers import auth, users, files

app = FastAPI(title=settings.PROJECT_NAME)

# Mount uploads directory to serve static files
import os
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    print(f"Validation Error: {exc.body}")
    print(f"Errors: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors(), "body": exc.body},
    )

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(files.router)


# CORS Middleware setup
origins = [
    "http://localhost:5173",  # React dev server
    "http://localhost:8000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:8000",
    "http://localhost:8005",
    "http://127.0.0.1:8005",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Vibelabs Community API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}
