
## KOTRIS NextJS Package Build Guide 0.1

<br/>

### 1. kotris-template 기준 변경 목록

빌드방식 : standalone 방식으로 처리 (폐쇄망 package repository 관리 이슈)

> - .env.production  (.env.development은 필요에 맞춰 수정)
> - next.config.js
> - package.json

<br/>

### 2. `next.config.js` 변경사항

```javascript
const nextConfig = {
	...
	output: 'standalone',
	...
}

module.exports = nextConfig;
```

<br/>

### 3. `package.json` 변경사항

`post` prefix를 사용하여 `next run build` 빌드 이후 `standalone`  방식에 맞춰 디렉터리 copy 처리

`build:win`으로 windows의 경우 `xcopy`로 처리하도록 빌드 커맨드 분리

```json
{
	...
	"scripts": {
		"build:win": "next build",  
		"postbuild:win": "xcopy /E /I /Y .next\\static .next\\standalone\\.next\\static && xcopy /E /I /Y public .next\\standalone\\public",  
		"build": "next build",  
		"postbuild":  "cp -r .next/static .next/standalone/.next/static && cp -r public .next/standalone/public",
	}
	...
}
```

<br/>

### 4. `.env.production` 및 소스 수정

기존 template `NEXT_PUBLIC_API_URL` 환경변수 값을 빌드 이후 runtime 시점에 조정할 수 있도록 수정

`NEXT_PUBLIC` prefix를 제거하여 runtime 시점 컨테이너의 `.env` 파일을 기준으로 조정 가능 (`API_URL`)

대신 클라이언트 접근이 불가하며 runtime 시점에 동적으로 적용시키기 위해서는 `server action component` 내부에 해당 변수를 사용해야한다.


```
# kotris-fcs-web 프로젝트 .env.production 기준 작성

NEXT_PUBLIC_PROJECT_NAME=광역운임시스템  
NEXT_PUBLIC_SYSTEM_CODE=FCS  
  
# 동적 처리를 위해 API_URL은 서버 변수로만 설정 (클라이언트 접근 불가)  
API_URL=http://kotris-fcs-api:8081/api/fcs  
NEXT_PUBLIC_BASE_URL=http://kotris-fcs-web:3000  
  
JOB_SCHEDULER_API_URL=http://kotris-fcs-batch:8081/api/cmn
```
<br/>

```javascript
"use server"

/* 반드시 서버 컴포넌트 함수 내부에서 env 변수를 호출해야함 */

export async function apiCall(url = '', params = null) {
	const API_ROOT_URL = process.env.API_URL || 'http://localhost:8080';
	...
	return await apiActionCall(`${API_ROOT_URL}/${url}`, params);
}
```