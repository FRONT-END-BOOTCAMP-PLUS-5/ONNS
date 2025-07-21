# 옷늘날씨 (ONNS)

> “오늘 날씨 뭐 입지?”  
> 실시간 체감온도와 사용자들의 옷차림 데이터를 기반으로  
> 기온별 코디를 공유하고 참고할 수 있는 날씨 OOTD 커뮤니티입니다.

---

## 목차
- [프로젝트 목표](#프로젝트-목표)  
  - [사용자 관점](#사용자-관점)  
  - [개발자 관점](#개발자-관점)  
- [기술 스택](#기술-스택)  
- [핵심 기능 요약](#핵심-기능-요약)  
- [디렉토리 구조](#디렉토리-구조)  
- [설치 및 실행](#설치-및-실행)  
- [환경 변수](#환경-변수)  
- [API 문서](#api-문서)  
- [팀원 소개](#팀원-소개)  
- [기여하기](#기여하기)  

---

## 프로젝트 목표

> **“기온과 체감온도에 따라 사람들이 실제로 입은 옷차림을 공유하고 참고할 수 있는 커뮤니티”** 를 구현합니다.

### 사용자 관점
- 오늘 날씨에 맞는 **실제 코디**를 쉽게 참고  
- 사람들의 옷차림 데이터를 통해 **기온별 스타일 레퍼런스** 구축  
- **체감온도와 실제 옷차림의 간극**을 줄이는 서비스 제공  

### 개발자 관점
- **협업과 유지보수가 용이한 구조** (Clean Architecture, Git Flow) 적용 학습  
- **Next.js 15 / TypeScript / Tailwind CSS / Supabase** 핵심 기술 역량 강화  
- **PR 리뷰, Issue 기반 작업 분배** 등 팀 개발 워크플로우 경험  
- Figma 디자인 시안과 **동일한 UI** 구현 및 **REST API 명세** 문서화  

---

## 기술 스택

| 영역        | 사용 기술                                                        |
| --------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Frontend    | Next.js 15 (App Router), React, TypeScript, Tailwind CSS, Axios, Zustand                                                                       |
| Backend     | Supabase (PostgreSQL, Storage), 외부 날씨 API, GeoLocation API  |
| Styling     | Tailwind CSS                                                  |
| Dev Tools   | ESLint, Prettier, Husky, Commitlint, Git Flow                 |
| 배포         | Vercel                                                        |

---

## 핵심 기능 요약

| 시스템     | 주요 기능                                                                                                                   |
| ---------- | --------------------------------------------------------------------------------------------------------------------------- |
| 회원       | 가입, 로그인, 프로필 조회/수정, 탈퇴                                                                                       |
| OOTD       | 작성·수정·삭제, 목록/상세 조회, 날씨 정보 표시, 정렬(최신/좋아요), 필터(계절/체감온도)                                      |
| 좋아요     | 등록/삭제, 내가 좋아요한 글 조회                                                                                             |
| 댓글       | 등록·조회·수정·삭제                                                                                                        |
| 날씨       | 외부 API 호출 → 체감온도 저장, 메인에 오늘 날씨 표시                                                                         |
| 마이페이지 | 내가 작성한 글 / 좋아요한 글 목록 조회                                                                                       |

---

## 디렉토리 구조

```plaintext
ONNS/
├── (backend)/                  # Clean Architecture 백엔드 레이어 (DTO, Use Cases 등)
├── .github/                    # GitHub 워크플로우 및 이슈 템플릿
├── .husky/                     # Git hooks
├── app/                        # Next.js App Router (페이지 및 컴포넌트)
│   ├── ootd/                   # OOTD 관련 페이지 및 컴포넌트
│   ├── mypage/                 # 마이페이지 컴포넌트
│   └── …  
├── hooks/                      # 커스텀 React Hooks
├── lib/                        # 공용 라이브러리 유틸
├── public/                     # 정적 자산 (이미지, 아이콘)
│   └── assets/
├── stores/                     # Zustand 전역 상태 관리
├── types/                      # TypeScript 타입 정의
├── utils/                      # Axios 인스턴스, API 헬퍼 함수
├── OOTD-Permissions-Test.postman_collection.json  # Postman API 컬렉션
├── next.config.ts              # Next.js 설정
├── middleware.ts               # Next.js 미들웨어
├── vercel.json                 # Vercel 배포 설정
├── package.json                # 종속성 및 스크립트 정의
└── tsconfig.json               # TypeScript 설정
