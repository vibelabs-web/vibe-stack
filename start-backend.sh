#!/bin/bash
cd "$(dirname "$0")"

# venv가 없으면 생성하고 의존성 설치
if [ ! -d "venv" ]; then
    echo "venv가 없습니다. 가상환경을 생성합니다..."
    python3 -m venv venv
    source venv/bin/activate
    echo "의존성을 설치합니다..."
    pip install -r requirements.txt
    pip install pydantic[email]
else
    source venv/bin/activate
fi

uvicorn app.main:app --reload --port 8000
