# Coding Convention & AI Collaboration Guide

## 1. 핵심 원칙
- **"신뢰하되, 검증하라(Don't trust, verify)":** AI가 생성한 코드는 반드시 로컬 환경에서 실행하여 PRD의 '다정함'과 '플레이풀' 원칙을 준수하는지 확인합니다.
- **"코드의 소유권은 나에게":** 모든 결정의 최종 책임은 김코딩(사용자)에게 있음을 잊지 않습니다.

## 2. 기술 스택 및 스타일 규칙
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (Strict Mode)
- **Styling:** Vanilla CSS 기반의 모듈화 (BEM 패턴 권장)
- **Naming:** 
    - 컴포넌트는 PascalCase (예: `TilCard.tsx`)
    - 함수/변수는 camelCase (예: `getPostList`)
    - CSS 클래스는 kebab-case (예: `.vibe-button--primary`)

## 3. AI 소통 원칙 
- **"하나의 채팅, 하나의 마일스톤":** 작업을 잘게 쪼개어 AI에게 전달합니다 (예: "로그인 기능만 먼저 구현해줘").
- **명확한 컨텍스트:** 질문 시 관련 파일(`prd.md`, `trd.md`)의 내용을 레퍼런스로 제공합니다.
- **오류 해결:** 에러 발생 시 로그 전체를 복사하여 AI에게 전달하고, "왜 이런 일이 발생했는지" 비기술적 언어로 설명을 요청합니다.

## 4. 코드 품질 및 보안 체크리스트
- [ ] 하드코딩된 API Key가 있는가? (반드시 `.env` 사용)
- [ ] 사용자 입력값에 대한 검증(Validation)이 이루어지는가?
- [ ] 버튼 크기가 모바일 터치에 충분히 큰가 (최소 44x44px)?
- [ ] 말투가 PRD에 정의된 '다정다감한 해요체'인가?

## 5. 테스트 및 디버깅 워크플로우
1. 기능 구현 후 `npm run dev` 실행.
2. PC 브라우저 검사 도구로 모바일 뷰 확인.
3. 에러 발생 시 AI에게 `/fix` 명령과 함께 로그 전달.
4. 완성 시 `git commit -m "feat: TIL 게시판 CRUD 완성"`으로 기록.
