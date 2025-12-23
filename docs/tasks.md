# TASKS: AI 코딩 파트너 개발 경로

이 문서는 AI 코딩 파트너가 즉시 개발을 시작할 수 있도록 설계된 마일스톤 기반 프롬프트 세트입니다.

## 기술 스택
- **Backend:** FastAPI (Python 3.11+)
- **Frontend:** React + TypeScript + Vite
- **Database:** SQLite + SQLAlchemy
- **인증:** JWT (python-jose)

---

## [M0: 프로젝트 초기 설정]

**컨텍스트:** 개발 환경을 구축하고 기본 프로젝트 구조를 생성합니다.

### Backend 설정
- [x] Python 가상환경 생성 및 활성화
- [x] `requirements.txt` 생성 및 패키지 설치
  ```
  fastapi==0.109.0
  uvicorn==0.27.0
  sqlalchemy==2.0.25
  alembic==1.13.1
  python-jose[cryptography]==3.3.0
  passlib[bcrypt]==1.7.4
  pydantic==2.5.3
  pydantic-settings==2.1.0
  python-multipart==0.0.6
  ```
- [x] FastAPI 앱 진입점 (`app/main.py`) 생성
- [x] CORS 미들웨어 설정
- [x] SQLite 데이터베이스 연결 설정 (`app/database.py`)
- [x] 환경 변수 설정 (`app/config.py`, `.env`)

### Frontend 설정
- [x] Vite + React + TypeScript 프로젝트 생성
- [x] 필수 패키지 설치
  ```
  npm install axios react-router-dom zustand
  npm install react-markdown react-syntax-highlighter
  npm install lucide-react
  npm install -D @types/react-syntax-highlighter
  ```
- [x] 프로젝트 구조 생성 (pages, components, api, store, styles)
- [x] Axios 인스턴스 설정 (`src/api/client.ts`)
- [x] 전역 CSS 변수 설정 (`src/styles/variables.css`)

**인수 조건:**
- `uvicorn app.main:app --reload`로 백엔드 서버 실행 확인 (http://localhost:8000)
- `npm run dev`로 프론트엔드 서버 실행 확인 (http://localhost:5173)
- `/docs`에서 FastAPI Swagger UI 접근 가능

**레퍼런스:** [TRD - 프로젝트 구조](trd.md), [Design System](design_system.md)

---

## [M1: 디자인 시스템 및 공통 컴포넌트]

**컨텍스트:** PRD의 목표와 Design System의 토큰을 기반으로 UI 기초를 구축합니다.

### 작업 목록
- [x] CSS 변수로 디자인 토큰 정의
  - Primary: `#FF8A3D` (vibe-orange)
  - Secondary: `#4CAF50` (warm-green)
  - Surface: `#F9FAFB` (soft-gray)
  - Text: `#2D3748` (deep-blue)
  - Feedback: `#E53E3E` (heart-red)
- [x] 공통 컴포넌트 생성
  - `Button` (Primary, Secondary, Ghost 변형)
  - `Input`, `Textarea`
  - `Card`
  - `Modal`
  - `Toast`
- [x] `Layout` 컴포넌트 생성 (Header, Footer 포함)
- [x] 반응형 레이아웃 CSS (768px, 1024px 브레이크포인트)

**인수 조건:**
- 모든 디자인 토큰이 CSS 변수로 등록됨
- 버튼 호버 시 살짝 떠오르는 효과 적용
- 모바일/태블릿/데스크톱 레이아웃 전환 확인

**레퍼런스:** [Design System](design_system.md)

---

## [M2: 회원가입/로그인/로그아웃 (FEAT-AUTH)]

**컨텍스트:** 사용자 인증 시스템을 구현합니다.

### Backend API
- [x] `User` SQLAlchemy 모델 생성 (`app/models/user.py`)
- [x] Pydantic 스키마 생성 (`app/schemas/user.py`)
  - `UserCreate`: email, password, nickname
  - `UserResponse`: id, email, nickname, bio, avatar_url, created_at
  - `Token`: access_token, refresh_token, token_type
- [x] 보안 유틸리티 (`app/utils/security.py`)
  - 비밀번호 해싱 (bcrypt)
  - JWT 토큰 생성/검증
- [x] 인증 라우터 (`app/routers/auth.py`)
  - `POST /api/auth/register` - 회원가입
  - `POST /api/auth/login` - 로그인
  - `POST /api/auth/logout` - 로그아웃
  - `POST /api/auth/refresh` - 토큰 갱신
- [x] 이메일/닉네임 중복 체크 API
- [x] 의존성 주입 (`app/utils/deps.py`)
  - `get_current_user`: JWT에서 사용자 추출
  - `get_current_user_optional`: 선택적 인증

### Frontend
- [x] 인증 상태 관리 (`src/store/authStore.ts`)
  - Zustand로 user, token, isAuthenticated 관리
- [x] 회원가입 페이지 (`src/pages/Register.tsx`)
  - 실시간 유효성 검사
  - 이메일/닉네임 중복 체크
- [x] 로그인 페이지 (`src/pages/Login.tsx`)
- [x] Header에 로그인 상태 표시
- [x] 로그아웃 기능
- [ ] Protected Route 구현 (로그인 필요 페이지 보호)

**인수 조건:**
- 회원가입 후 자동 로그인 및 메인 페이지 이동
- 잘못된 로그인 시 다정한 에러 메시지 표시
- 토큰 만료 시 자동 갱신 또는 로그아웃

**레퍼런스:** [PRD - 8.1~8.3](prd.md), [User Flow - 인증 플로우](user_flow.md)

---

## [M3: 프로필 관리 (FEAT-PROFILE)]

**컨텍스트:** 사용자 프로필 조회 및 수정 기능을 구현합니다.

### Backend API
- [x] 사용자 라우터 (`app/routers/users.py`)
  - `GET /api/users/me` - 내 정보 조회
  - `PUT /api/users/me` - 내 정보 수정
  - `PUT /api/users/me/password` - 비밀번호 변경
  - `GET /api/users/{user_id}` - 사용자 프로필 조회
  - `GET /api/users/{user_id}/posts` - 사용자 게시글 목록

### Frontend
- [x] 프로필 페이지 (`src/pages/Profile.tsx`)
  - 프로필 카드 (닉네임, 자기소개, 프로필 이미지)
  - 통계 (작성 글 수, 받은 좋아요 수)
  - 탭: 내가 쓴 글 / 좋아요한 글
- [x] 프로필 수정 모달
- [ ] 비밀번호 변경 모달

**인수 조건:**
- 본인 프로필에서만 수정 버튼 표시
- 프로필 수정 후 즉시 반영
- 비밀번호 변경 시 현재 비밀번호 확인

**레퍼런스:** [PRD - 8.4](prd.md), [User Flow - 프로필 플로우](user_flow.md)

---

## [M4: TIL 게시판 CRUD (FEAT-POST)]

**컨텍스트:** Database Design과 User Flow의 '글쓰기' 여정을 구현합니다.

### Backend API
- [ ] `Post` SQLAlchemy 모델 생성 (`app/models/post.py`)
- [ ] Pydantic 스키마 생성 (`app/schemas/post.py`)
  - `PostCreate`: title, content
  - `PostUpdate`: title, content (optional)
  - `PostResponse`: id, title, content, author, likes_count, comments_count, created_at
  - `PostListResponse`: posts[], total, page
- [ ] 게시글 라우터 (`app/routers/posts.py`)
  - `GET /api/posts` - 게시글 목록 (페이지네이션, 정렬)
  - `POST /api/posts` - 게시글 작성
  - `GET /api/posts/{post_id}` - 게시글 상세
  - `PUT /api/posts/{post_id}` - 게시글 수정
  - `DELETE /api/posts/{post_id}` - 게시글 삭제 (soft delete)
- [ ] 조회수 증가 로직

### Frontend
- [ ] 메인 페이지 / 게시글 목록 (`src/pages/Home.tsx`)
  - 카드 레이아웃
  - 정렬 옵션 (최신순/인기순)
  - 페이지네이션 또는 무한 스크롤
- [ ] 게시글 카드 컴포넌트 (`src/components/post/PostCard.tsx`)
- [ ] 글쓰기 페이지 (`src/pages/PostWrite.tsx`)
  - 마크다운 에디터
  - 미리보기 기능
  - 임시저장 (localStorage)
- [ ] 글 상세 페이지 (`src/pages/PostDetail.tsx`)
  - 마크다운 렌더링
  - 코드 블록 하이라이팅
- [ ] 글 수정 페이지

**인수 조건:**
- 게시글 저장 시 DB에 UUID와 함께 정상 기록됨
- 코드 블록이 syntax highlighting과 함께 예쁘게 보임
- 본인 글만 수정/삭제 가능

**레퍼런스:** [Database Design](database_design.md), [User Flow - 게시판 플로우](user_flow.md)

---

## [M5: 댓글 및 대댓글 (FEAT-COMMENT)]

**컨텍스트:** 정서적 유대를 위한 응원 댓글 시스템을 구현합니다.

### Backend API
- [ ] `Comment` SQLAlchemy 모델 생성 (`app/models/comment.py`)
  - `parent_id` 필드로 대댓글 지원
- [ ] Pydantic 스키마 생성 (`app/schemas/comment.py`)
- [ ] 댓글 라우터 (`app/routers/comments.py`)
  - `GET /api/posts/{post_id}/comments` - 댓글 목록 (대댓글 포함)
  - `POST /api/posts/{post_id}/comments` - 댓글 작성
  - `POST /api/posts/{post_id}/comments/{comment_id}/replies` - 대댓글 작성
  - `PUT /api/posts/{post_id}/comments/{comment_id}` - 댓글 수정
  - `DELETE /api/posts/{post_id}/comments/{comment_id}` - 댓글 삭제
- [ ] 대댓글 깊이 제한 (1단계만 허용)
- [ ] 게시글의 `comments_count` 업데이트

### Frontend
- [ ] 댓글 목록 컴포넌트 (`src/components/comment/CommentList.tsx`)
- [ ] 댓글 아이템 컴포넌트 (`src/components/comment/CommentItem.tsx`)
  - 대댓글 들여쓰기 표시
  - 답글 버튼
- [ ] 댓글 작성 폼 (`src/components/comment/CommentForm.tsx`)
- [ ] 인라인 댓글 수정

**인수 조건:**
- 댓글 작성 시 새로고침 없이 화면에 즉시 반영
- 대댓글은 1단계까지만 허용
- 본인 댓글만 수정/삭제 가능

**레퍼런스:** [PRD - 8.6](prd.md), [Database Design - COMMENTS](database_design.md)

---

## [M6: 좋아요 시스템 (FEAT-LIKE)]

**컨텍스트:** 응원의 마음을 전하는 좋아요 기능을 구현합니다.

### Backend API
- [ ] `Like` SQLAlchemy 모델 생성 (`app/models/like.py`)
  - UNIQUE 제약조건 (post_id, user_id)
- [ ] 좋아요 라우터 (`app/routers/likes.py`)
  - `POST /api/posts/{post_id}/like` - 좋아요 토글
  - `GET /api/posts/{post_id}/like/status` - 좋아요 상태 확인
- [ ] 게시글의 `likes_count` 업데이트 (트리거 또는 서비스 로직)

### Frontend
- [ ] 좋아요 버튼 컴포넌트 (`src/components/common/LikeButton.tsx`)
  - 하트 아이콘 (Lucide)
  - 좋아요 시 애니메이션
  - 낙관적 업데이트
- [ ] 글 상세 페이지에 좋아요 버튼 통합
- [ ] 글 카드에 좋아요 수 표시

**인수 조건:**
- 좋아요 중복 클릭 방지 (토글 방식)
- 좋아요 클릭 시 즉시 UI 반영 (낙관적 업데이트)
- 비로그인 시 로그인 유도

**레퍼런스:** [PRD - 8.7](prd.md), [Database Design - LIKES](database_design.md)

---

## [M7: 랭킹 시스템 (FEAT-RANKING)]

**컨텍스트:** 성취감을 느낄 수 있는 랭킹 시스템을 구현합니다.

### Backend API
- [ ] 랭킹 라우터 (`app/routers/ranking.py`)
  - `GET /api/ranking/posts` - 인기 게시글 랭킹
  - `GET /api/ranking/users` - 인기 사용자 랭킹
- [ ] 기간별 필터링 (daily, weekly, all)
- [ ] 랭킹 쿼리 최적화 (인덱스 활용)

### Frontend
- [ ] 랭킹 페이지 (`src/pages/Ranking.tsx`)
  - 기간 선택 탭 (일간/주간/전체)
  - 게시글/사용자 탭 전환
- [ ] 랭킹 카드 컴포넌트
  - 순위 배지
  - 게시글: 제목, 작성자, 좋아요 수
  - 사용자: 닉네임, 프로필 이미지, 받은 좋아요 수

**인수 조건:**
- 랭킹이 기간에 따라 올바르게 정렬됨
- 상위 10개 표시
- 클릭 시 해당 게시글/프로필로 이동

**레퍼런스:** [PRD - 8.8](prd.md), [Database Design - 랭킹 쿼리](database_design.md)

---

## [M8: 마무리 및 배포 준비]

**컨텍스트:** 최종 점검과 ngrok 배포를 진행합니다.

### 작업 목록
- [ ] 반응형 디자인 검증 (모바일, 태블릿, 데스크톱)
- [ ] 에러 처리 통합 (Toast 메시지)
- [ ] 로딩 상태 UI 추가
- [ ] 404 페이지
- [ ] 접근성 검증 (키보드 네비게이션, 고대비)
- [ ] API 문서 확인 (/docs)
- [ ] ngrok 설정 및 테스트
  ```bash
  ngrok http 8000
  ```
- [ ] 프론트엔드 빌드 및 정적 파일 서빙

**인수 조건:**
- ngrok URL을 통해 모바일 기기에서 정상 접속
- 모든 기능이 정상 작동
- 에러 발생 시 친절한 메시지 표시

**레퍼런스:** [TRD - ngrok 연동](trd.md), [PRD - 비기능 요구사항](prd.md)

---

## 체크리스트 요약

| 마일스톤 | 주요 기능 | 상태 |
|----------|-----------|------|
| M0 | 프로젝트 초기 설정 | ⬜ |
| M1 | 디자인 시스템 | ⬜ |
| M2 | 회원가입/로그인/로그아웃 | ⬜ |
| M3 | 프로필 관리 | ⬜ |
| M4 | 게시판 CRUD | ⬜ |
| M5 | 댓글/대댓글 | ⬜ |
| M6 | 좋아요 | ⬜ |
| M7 | 랭킹 | ⬜ |
| M8 | 마무리 및 배포 | ⬜ |

---

## 개발 순서 권장사항

1. **M0 → M1**: 기본 환경과 UI 기초를 먼저 구축
2. **M2 → M3**: 인증 시스템 완성 후 프로필 기능 추가
3. **M4**: 핵심 기능인 게시판 구현
4. **M5 → M6**: 상호작용 기능 추가
5. **M7**: 동기부여를 위한 랭킹 시스템
6. **M8**: 최종 점검 및 배포

각 마일스톤은 독립적으로 테스트 가능해야 하며, 완료 후 다음 마일스톤으로 진행합니다.
