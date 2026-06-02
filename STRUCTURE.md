# KOTRIS 프로젝트 구조

## 📁 디렉토리 구조

```
src/
├── app/                    # Next.js 앱 라우터
│   ├── layout.js           # 루트 레이아웃
│   ├── page.js             # 루트 페이지
│   ├── global-loading.js   # 전역 로딩 페이지
│   │
│   ├── api/                # API
│   │
│   ├── component/          # chart, editor, grid, shared 등 공통 컴포넌트 확인 페이지
│   │
│   ├── login/              # 로그인
│   │   └── page.js         # 로그인 페이지
│   │
│   └── sample/             # 샘플 페이지
│       ├── dashboard/      # 대시보드 예제
│       │   └── page.js     # 대시보드 페이지
│       │
│       ├── members/        # 회원 관리 예제
│       │   └── page.js     # 회원 관리 페이지
│       │
│       ├── statistics/     # 통계 예제
│       │   └── page.js     # 통계 페이지
│       │
│       └── example/        # API 호출 예제
│           ├── action/     # Server Actions 예제
│           ├── client/     # 클라이언트 사이드 로직 예제
│           └── page.js     # API 예제 페이지
│
├── assets/                 # 정적 자산 (이미지, 아이콘 등)
│   └── fonts/              # 폰트 파일 (.ttf, .woff2)
│   └── indicators/         # 카테고리 bullet
│       └── NoticeBullet.js # 공지사항 bullet
│       └── TaskState.js    # 테이블 bullet
│   └── Svgs.js             # SVG 아이콘 컴포넌트
│
├── components/             # 공통 컴포넌트 모음
│   ├── chart/              # 차트 관련 컴포넌트
│   ├── common/             # 공통 컴포넌트
│   ├── composite/          # 공통 컴포넌트를 조합하여 만든 컴포넌트
│   ├── layout/             # 레이아웃 컴포넌트
│   └── modal/              # 모달 컴포넌트
│
├── lib/                    
│   └── manifest.js             # favicon 및 앱 아이콘 설정
│
├── modules/                    # 모듈
│   ├── config/                 # 설정
│   │   └── GnbConfig.js        # 메뉴 설정
│   │   └── RouteConfig.js      # 라우트 설정
│   └── context/                # Context API
│       └── ThemeContext.js     # 테마 관리 Context
│       └── ParameterContext.js # 파라미터 관리 Context
│       └── LoginContext.js     # 로그인 관리 Context
│
├── stories/                    # 스토리북 문서
│
└── styles/                 # 스타일
    └── page/               # 페이지 스타일
    └── globals.css         # 전역 스타일 (Tailwind CSS)

```

## 📱 페이지 구조

### 1. 대시보드 (`/dashboard`)

- 실시간 현황판

  - 시스템 상태 모니터링
    - 실시간 그래프
    - 작업명, 날짜, 상태 모니터링
    - 각 현황 및 로그
  - 주요 지표 표시
    - 주요 기능별 사용량 통계
  - 알림 현황
    - 신규 알림 카운트
    - 알람 상태 및 목록

- 공지사항 섹션

  - 공지 목록
    - 제목, 작성일 표시

- 배치 작업 모니터링

  - 배치 상태
    - 진행 중인 배치 작업 목록
    - 작업 진행상태 표시
    - 실행 시간 계산

### 2. 회원 관리 (`/members`)

- 회원 검색

  - 고급 검색 필터
    - 이름, ID, 메일 등 검색
    - 가입기간 범위 검색
    - 조회 분류, 카드유형, 상태 필터링

- 회원 목록

  - 기본 정보 표시
    - 이름, ID, 메일, 가입일, 최근 접속일
  - 데이터 관리
    - 페이지당 행 수 설정
    - 페이지 이동
  - 회원 등록
    - 팝업 형식으로 회원 등록

### 3. 통계 (`/statistics`)

- 회원 통계

  - 가입 추이 (Column Line Chart)

    - 월별 가입자 수 (컬럼 차트)
    - 증가율 추이 (라인 차트)
    - 전월 대비 증감률
    - 목표 달성률 표시

  - 분포도 분석 (Nested Pie Chart)

    - 중첩 원형 차트
    - 카테고리별 비율
    - 세부 항목 분류
    - 인터랙티브 차트

  - chart, sheet 형식 통계 표시

    - Pie Chart 형식
    - Label 값을 보여주는 Sheet 형식

  - 기간별 조회

    - 일간/주간/월간 선택
    - 기간 커스터마이징
    - 날짜 범위 지정

  - 회원 통계

    - 회원 수
    - 회원 수 증감률
    - 누적 회원 수치

### 4. Toast UI (`/toastUi`)

- Grid 예제
- Chart 예제
- 컴포넌트 활용 예시

## 🔐 인증 시스템

### 로그인 프로세스

1. 사용자 인증
2. 세션 관리

## 🎨 UI/UX 가이드라인

### 테마 구성

- Light/Dark 모드 지원
- 커스텀 테마 (Skyblue, Purple, Red, Orange, Green)
- CSS 변수 기반 스타일링

### 스타일 가이드라인

- Tailwind CSS 활용
- 반응형 디자인
- 접근성 고려
- 일관된 컴포넌트 스타일링
