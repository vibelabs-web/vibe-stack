# Design System: Vibe & Warmth

'듀오링고'와 '당근마켓'에서 영감을 받은 **플레이풀(Playful)** 디자인 시스템입니다.

## 1. 디자인 원칙
- **친절함:** 날카로운 모서리보다 둥근 모서리(Radius) 사용.
- **생동감:** 정적인 컬러보다 채도가 높은 포인트 컬러 활용.
- **가독성:** 초보자를 위해 폰트 크기를 키우고 줄 간격을 넉넉히 확보.

## 2. 디자인 토큰 (Core Tokens)
| 구분 | 토큰명 | 값 | 용도 |
|---|---|---|---|
| **Primary** | `vibe-orange` | `#FF8A3D` | 메인 버튼, 포인트, 열정 상징 |
| **Secondary** | `warm-green` | `#4CAF50` | 성장, 성공, 응원 메시지 |
| **Surface** | `soft-gray` | `#F9FAFB` | 배경색, 카드 배경 |
| **Text** | `deep-blue` | `#2D3748` | 기본 텍스트 (가독성 중점) |
| **Feedback** | `heart-red` | `#E53E3E` | 좋아요, 배지 |

## 3. 타이포그래피 (Typography)
- **기본 폰트:** Sans-serif (Pretendard 또는 Inter 권장)
- **Heading:** 1.5rem (24px) / Bold / 다정하고 힘 있는 제목
- **Body:** 1rem (16px) / Regular / 읽기 편한 본문
- **Code:** 0.9rem (14px) / Fira Code (가독성 좋은 고정폭 폰트)

## 4. 컴포넌트 라이브러리 (Components)
### [Button]
- **Primary:** `vibe-orange` 배경, 둥근 모서리(12px), 호버 시 살짝 떠오르는 효과.
- **Ghost:** 테두리만 있는 스타일, 취소나 보조 액션용.

### [Input / Textarea]
- 입력 시 `vibe-orange`로 테두리가 강조되며, "오늘 무엇을 배우셨나요?" 같은 placeholder 노출.

### [Progress Card]
- 김코딩의 학습 연속성을 보여주는 캐릭터와 상태 바 포함.

## 5. 접근성 가이드
- **대비비:** 모든 텍스트와 배경의 대비비 4.5:1 이상 유지.
- **포커스:** 키보드 이동 시 확실한 오렌지색 아웃라인 노출.
- **이미지:** 모든 마스코트 이미지에 `alt` 태그 필수.
