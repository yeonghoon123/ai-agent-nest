# AI Agent Nest.js Project

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

본 프로젝트는 조현영 지음의 **"Node.js Nest.js 교과서"** 책을 기반으로 학습하고 개발하는 NestJS 백엔드 애플리게이션입니다. 

---

## 📚 학습 및 참고 도서
- **도서명**: Node.js Nest.js 교과서
- **저자**: 조현영 지음
- **목적**: NestJS의 구조적 설계 방식을 학습하고, 이를 활용하여 AI Agent 기능을 제공하는 웹 서버를 구축합니다.

---

## 🛠️ 기술 스택
- **Backend**: NestJS (v10.x+)
- **Language**: TypeScript
- **Runtime**: Node.js
- **Configuration**: `@nestjs/config`
- **Environment Management**: `.env`

---

## 📁 프로젝트 구조
```text
src/
├── ai/                 # AI 관련 서비스 및 프로바이더를 담당하는 모듈
│   ├── interfaces/     # 인터페이스 정의
│   ├── providers/      # AI 연동을 위한 상세 프로바이더 구현
│   ├── ai.module.ts    # AI 모듈 정의
│   └── ai.service.ts   # AI 비즈니스 로직
├── config/             # 환경 변수 및 설정 파일을 관리하는 모듈
│   └── configuration.ts
├── app.controller.ts   # 메인 컨트롤러
├── app.module.ts       # 루트 애플리게이션 모듈
├── app.service.ts      # 루트 서비스
└── main.ts             # 애플리게이션 진입점
```

---

## 🚀 시작하기

### 1. 의존성 패키지 설치
```bash
$ npm install
```

### 2. 환경 변수 설정
프로젝트 루트 디렉토리에 `.env` 파일을 생성하고 필요한 환경 변수 설정을 추가합니다. (예: API 키, 포트 번호 등)
```env
PORT=3000
# AI 관련 환경 변수 설정 추가
```

### 3. 애플리게이션 실행
```bash
# 개발 모드 (Hot-reload 활성화)
$ npm run start:dev

# 프로덕션 빌드
$ npm run build

# 프로덕션 모드 실행
$ npm run start:prod
```

### 4. 테스트 실행
```bash
# 유닛 테스트
$ npm run test

# e2e 테스트
$ npm run test:e2e
```

---

## 📄 라이선스
This project is licensed under the MIT License.
