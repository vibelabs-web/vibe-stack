@echo off
cd /d "%~dp0"

REM venv가 없으면 생성하고 의존성 설치
if not exist "venv" (
    echo venv가 없습니다. 가상환경을 생성합니다...
    python -m venv venv
    call venv\Scripts\activate
    echo 의존성을 설치합니다...
    pip install -r requirements.txt
    pip install pydantic[email]
) else (
    call venv\Scripts\activate
)

uvicorn app.main:app --reload --port 8000
