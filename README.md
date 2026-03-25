
# PG_DEV_GUIDE_VIEW 프로젝트 계획

이 문서는 PG_DEV_GUIDE의 프론트엔드(View) 개발을 위한 기술 스택 및 구조를 정의합니다.

## 0. 중요 공지 (Relay Flow)
환경 문제로 인해 `scripts/relay.sh` 대신 **`scripts/relay.ps1` 사용을 강력히 권장**합니다. 자세한 내용은 `CODEX_RELAY_REPORT.md`를 참조하세요.

## 1. AI 협업 개발 워크플로우 (SOP)
1. `git pull` 후 Gemini CLI를 실행합니다.
2. Gemini에게 미션 설계를 요청하면 `MISSION.md`가 업데이트됩니다.
3. 아래 명령어를 통해 Codex가 작업을 수행하게 합니다.
   ```powershell
   powershell -ExecutionPolicy Bypass -File scripts/relay.ps1
   ```

## 2. 핵심 기술 스택

- **프로젝트 생성 및 빌드:** Vite
- **코어:** React, TypeScript
- **UI 프레임워크:** Material-UI (MUI)
- **스타일링:** Tailwind CSS
- **상태 관리:** Zustand
- **데이터 통신:** Axios, React-Query (TanStack Query)
- **라우팅:** React-Router
- **코드 품질:** ESLint & Prettier

## 2. 디렉토리 구조

```
src/
 ├─ api/    (axios + React Query)
 ├─ components/
 ├─ hooks/
 ├─ pages/
 ├─ store/  (Zustand)
 ├─ styles/ (Global styles, Theme)
 ├─ types/
 └─ utils/
```
