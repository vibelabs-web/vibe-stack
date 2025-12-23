# TRD: 바이브랩스 커뮤니티 (Vibelabs Community)

## 1. 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client (Browser)                         │
│                     React + TypeScript + Vite                    │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 │ HTTP/REST API
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Backend (FastAPI)                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Routers   │  │   Services  │  │   Models    │              │
│  │  (API 엔드  │  │  (비즈니스  │  │ (SQLAlchemy │              │
│  │   포인트)   │  │   로직)     │  │   ORM)      │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 │ SQLAlchemy ORM
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                        SQLite Database                           │
│                     (community.db 파일)                          │
└─────────────────────────────────────────────────────────────────┘
```

## 2. 기술 스택 상세

### 2.1 Backend - FastAPI (Python 3.11+)
| 구성요소 | 라이브러리 | 버전 | 용도 |
|----------|------------|------|------|
| 웹 프레임워크 | FastAPI | ^0.109.0 | REST API 서버 |
| ASGI 서버 | Uvicorn | ^0.27.0 | 개발/운영 서버 |
| ORM | SQLAlchemy | ^2.0.0 | 데이터베이스 ORM |
| 마이그레이션 | Alembic | ^1.13.0 | DB 스키마 마이그레이션 |
| 인증 | python-jose | ^3.3.0 | JWT 토큰 생성/검증 |
| 비밀번호 | passlib[bcrypt] | ^1.7.4 | 비밀번호 해싱 |
| 유효성 검사 | Pydantic | ^2.5.0 | 데이터 검증 및 직렬화 |
| CORS | fastapi.middleware.cors | 내장 | Cross-Origin 허용 |

### 2.2 Frontend - React (TypeScript)
| 구성요소 | 라이브러리 | 버전 | 용도 |
|----------|------------|------|------|
| 프레임워크 | React | ^18.2.0 | UI 라이브러리 |
| 빌드 도구 | Vite | ^5.0.0 | 빠른 개발 서버 및 빌드 |
| 언어 | TypeScript | ^5.3.0 | 타입 안정성 |
| 라우팅 | React Router | ^6.21.0 | SPA 라우팅 |
| HTTP 클라이언트 | Axios | ^1.6.0 | API 통신 |
| 상태 관리 | Zustand | ^4.4.0 | 전역 상태 관리 |
| 코드 하이라이팅 | react-syntax-highlighter | ^15.5.0 | 코드 블록 렌더링 |
| 마크다운 | react-markdown | ^9.0.0 | 마크다운 렌더링 |
| 아이콘 | Lucide React | ^0.303.0 | 아이콘 세트 |
| 스타일링 | CSS Modules | 내장 | 컴포넌트별 스타일 |

### 2.3 Database - SQLite
| 항목 | 내용 |
|------|------|
| 파일 위치 | `backend/community.db` |
| 특징 | 서버리스, 설정 불필요, 단일 파일 |
| 제한 사항 | 동시 쓰기 제한 (MVP 규모에서는 문제없음) |
| 마이그레이션 | Alembic을 통한 버전 관리 |

## 3. 프로젝트 구조

```
community/
├── backend/                    # FastAPI 백엔드
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py            # FastAPI 앱 진입점
│   │   ├── config.py          # 환경 설정
│   │   ├── database.py        # DB 연결 설정
│   │   ├── models/            # SQLAlchemy 모델
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── post.py
│   │   │   ├── comment.py
│   │   │   └── like.py
│   │   ├── schemas/           # Pydantic 스키마
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── post.py
│   │   │   ├── comment.py
│   │   │   └── like.py
│   │   ├── routers/           # API 라우터
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── users.py
│   │   │   ├── posts.py
│   │   │   ├── comments.py
│   │   │   ├── likes.py
│   │   │   └── ranking.py
│   │   ├── services/          # 비즈니스 로직
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   └── ...
│   │   └── utils/             # 유틸리티
│   │       ├── __init__.py
│   │       ├── security.py    # JWT, 해싱
│   │       └── deps.py        # 의존성 주입
│   ├── alembic/               # DB 마이그레이션
│   ├── tests/                 # 테스트
│   ├── requirements.txt
│   └── .env
│
├── frontend/                  # React 프론트엔드
│   ├── src/
│   │   ├── main.tsx          # 앱 진입점
│   │   ├── App.tsx           # 메인 앱 컴포넌트
│   │   ├── api/              # API 클라이언트
│   │   │   ├── client.ts     # Axios 인스턴스
│   │   │   ├── auth.ts
│   │   │   ├── posts.ts
│   │   │   └── ...
│   │   ├── components/       # 재사용 컴포넌트
│   │   │   ├── common/       # Button, Input, Card 등
│   │   │   ├── layout/       # Header, Footer, Layout
│   │   │   ├── post/         # PostCard, PostList 등
│   │   │   └── comment/      # CommentItem, CommentForm 등
│   │   ├── pages/            # 페이지 컴포넌트
│   │   │   ├── Home.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Profile.tsx
│   │   │   ├── PostDetail.tsx
│   │   │   ├── PostWrite.tsx
│   │   │   └── Ranking.tsx
│   │   ├── store/            # Zustand 스토어
│   │   │   └── authStore.ts
│   │   ├── hooks/            # 커스텀 훅
│   │   ├── styles/           # CSS 모듈
│   │   │   ├── globals.css
│   │   │   └── variables.css
│   │   ├── types/            # TypeScript 타입
│   │   └── utils/            # 유틸리티 함수
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── docs/                     # 문서
└── README.md
```

## 4. API 명세

### 4.1 인증 API (`/api/auth`)

| Method | Endpoint | 설명 | Request Body | Response |
|--------|----------|------|--------------|----------|
| POST | `/register` | 회원가입 | `{email, password, nickname}` | `{user, access_token}` |
| POST | `/login` | 로그인 | `{email, password}` | `{access_token, refresh_token}` |
| POST | `/logout` | 로그아웃 | - | `{message}` |
| POST | `/refresh` | 토큰 갱신 | `{refresh_token}` | `{access_token}` |

### 4.2 사용자 API (`/api/users`)

| Method | Endpoint | 설명 | 인증 | Response |
|--------|----------|------|------|----------|
| GET | `/me` | 내 정보 조회 | 필수 | `{user}` |
| PUT | `/me` | 내 정보 수정 | 필수 | `{user}` |
| PUT | `/me/password` | 비밀번호 변경 | 필수 | `{message}` |
| GET | `/{user_id}` | 사용자 프로필 조회 | 선택 | `{user, posts, stats}` |
| GET | `/{user_id}/posts` | 사용자 게시글 목록 | 선택 | `{posts[], total}` |

### 4.3 게시글 API (`/api/posts`)

| Method | Endpoint | 설명 | 인증 | Response |
|--------|----------|------|------|----------|
| GET | `/` | 게시글 목록 | 선택 | `{posts[], total, page}` |
| POST | `/` | 게시글 작성 | 필수 | `{post}` |
| GET | `/{post_id}` | 게시글 상세 | 선택 | `{post, comments[]}` |
| PUT | `/{post_id}` | 게시글 수정 | 필수(본인) | `{post}` |
| DELETE | `/{post_id}` | 게시글 삭제 | 필수(본인) | `{message}` |

**Query Parameters (GET /):**
- `page`: 페이지 번호 (기본값: 1)
- `limit`: 페이지당 개수 (기본값: 10, 최대: 50)
- `sort`: 정렬 기준 (`latest`, `popular`)
- `search`: 검색어 (제목, 내용)

### 4.4 댓글 API (`/api/posts/{post_id}/comments`)

| Method | Endpoint | 설명 | 인증 | Response |
|--------|----------|------|------|----------|
| GET | `/` | 댓글 목록 | 선택 | `{comments[]}` |
| POST | `/` | 댓글 작성 | 필수 | `{comment}` |
| PUT | `/{comment_id}` | 댓글 수정 | 필수(본인) | `{comment}` |
| DELETE | `/{comment_id}` | 댓글 삭제 | 필수(본인) | `{message}` |
| POST | `/{comment_id}/replies` | 대댓글 작성 | 필수 | `{comment}` |

### 4.5 좋아요 API (`/api/posts/{post_id}/like`)

| Method | Endpoint | 설명 | 인증 | Response |
|--------|----------|------|------|----------|
| POST | `/` | 좋아요 토글 | 필수 | `{liked, likes_count}` |
| GET | `/status` | 좋아요 상태 | 필수 | `{liked}` |

### 4.6 랭킹 API (`/api/ranking`)

| Method | Endpoint | 설명 | 인증 | Response |
|--------|----------|------|------|----------|
| GET | `/posts` | 인기 게시글 랭킹 | 선택 | `{posts[]}` |
| GET | `/users` | 인기 사용자 랭킹 | 선택 | `{users[]}` |

**Query Parameters:**
- `period`: 기간 (`daily`, `weekly`, `all`)
- `limit`: 개수 (기본값: 10)

## 5. 인증/보안 설계

### 5.1 JWT 토큰 구조
```python
# Access Token (만료: 30분)
{
    "sub": "user_id",          # 사용자 ID
    "exp": 1234567890,         # 만료 시간
    "iat": 1234567890,         # 발급 시간
    "type": "access"
}

# Refresh Token (만료: 7일)
{
    "sub": "user_id",
    "exp": 1234567890,
    "iat": 1234567890,
    "type": "refresh"
}
```

### 5.2 비밀번호 보안
- 해싱 알고리즘: bcrypt (salt 자동 생성)
- 최소 8자, 영문+숫자 조합 필수
- 평문 비밀번호는 절대 저장/로깅하지 않음

### 5.3 CORS 설정
```python
origins = [
    "http://localhost:5173",  # Vite 개발 서버
    "http://localhost:3000",  # 대체 포트
]
```

## 6. 권한 모델 (Role & Policy)

| 역할 | 설명 | 권한 |
|------|------|------|
| 비로그인 사용자 | 게스트 | 글/댓글 조회, 랭킹 조회 |
| 일반 사용자 | 가입된 사용자 | 글 CRUD, 댓글 CRUD, 좋아요, 프로필 관리 |
| 관리자 (Admin) | 운영자 | 모든 글/댓글 관리, 사용자 관리 (MVP 이후) |

## 7. 비기능적 요구사항

| 항목 | 목표 | 구현 방법 |
|------|------|-----------|
| 성능 | API 응답 200ms 이내 | 인덱스 최적화, 페이지네이션 |
| 가용성 | 99% 이상 | ngrok 재연결 스크립트 |
| 보안 | OWASP Top 10 대응 | SQL Injection 방지(ORM), XSS 방지(React) |
| 접근성 | WCAG 2.1 AA | 고대비 텍스트, 키보드 네비게이션 |
| 반응형 | 모바일 지원 | CSS 미디어 쿼리 (768px, 1024px) |

## 8. 개발 환경 설정

### 8.1 Backend 실행
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 8.2 Frontend 실행
```bash
cd frontend
npm install
npm run dev  # http://localhost:5173
```

### 8.3 환경 변수 (.env)
```env
# Backend
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///./community.db
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Frontend
VITE_API_URL=http://localhost:8000/api
```

## 9. 외부 도구 연동

### 9.1 ngrok (로컬 서버 노출)
```bash
ngrok http 8000  # Backend API
ngrok http 5173  # Frontend (필요시)
```

### 9.2 개발 도구
- API 문서: FastAPI 자동 생성 (`/docs`, `/redoc`)
- DB 확인: SQLite Browser 또는 DBeaver
