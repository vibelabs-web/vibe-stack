@echo off
chcp 65001 >nul
cd /d "%~dp0"

REM Python 설치 확인
python --version >nul 2>&1
if errorlevel 1 (
    echo Python이 설치되어 있지 않습니다.
    echo.
    echo 설치 방법:
    echo   1. https://www.python.org/downloads/ 에서 다운로드
    echo   2. 또는 winget install Python.Python.3.12
    echo.
    echo 설치 시 "Add Python to PATH" 옵션을 반드시 체크하세요!
    echo.
    pause
    exit /b 1
)

REM venv가 없으면 생성하고 의존성 설치
if not exist "venv" (
    echo venv가 없습니다. 가상환경을 생성합니다...
    python -m venv venv
    call venv\Scripts\activate
    echo 의존성을 설치합니다...
    pip install pydantic[email]
    pip install -r requirements.txt
    echo 데이터베이스를 초기화합니다...
    python -c "from app.database import engine, Base; from app.models import user, post; Base.metadata.create_all(bind=engine)"
) else (
    call venv\Scripts\activate
)

REM DB 파일이 없으면 테이블 생성
if not exist "sql_app.db" (
    echo 데이터베이스를 초기화합니다...
    python -c "from app.database import engine, Base; from app.models import user, post; Base.metadata.create_all(bind=engine)"
)

uvicorn app.main:app --reload --port 8000
