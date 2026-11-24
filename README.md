# MO:ON 🌙

일상을 정돈하는 라이프스타일 커뮤니티입니다. 일정관리, 소비기록, 자기관리, 다이어리, 운동 기록을 나눠요.

## 기술 스택
- React + Vite + MUI
- Supabase (Auth + Postgres + RLS) — 별도 백엔드 없이 프론트에서 직접 연결
- GitHub Pages (GitHub Actions 자동 배포)

## 로컬 실행
```bash
npm install
cp .env.example .env   # Supabase URL / anon(publishable) 키 입력
npm run dev
```

## 배포
`main` 브랜치에 push 하면 `.github/workflows/deploy.yml` 이 빌드 후 GitHub Pages 에 배포합니다.
저장소 Secrets 에 `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` 가 필요합니다.
