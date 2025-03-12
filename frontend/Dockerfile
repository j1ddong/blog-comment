# 1. 빌드 단계
FROM node:18-alpine AS builder
WORKDIR /app

# 패키지 파일 복사 및 종속성 설치
COPY package.json package-lock.json ./
RUN npm install

# 소스 파일 복사 및 빌드
COPY . .
RUN npm run build

# 2. 실행 단계
FROM node:18-alpine
WORKDIR /app

# 빌드된 파일 복사
COPY --from=builder /app ./

# 포트 노출
EXPOSE 3000

# Next.js 실행 명령어
CMD ["npm", "start"]