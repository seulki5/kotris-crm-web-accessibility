import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
	// 적용 가능 글로벌 언어 목록
	locales: ['en', 'ja', 'zh'],
	// 기본 글로벌 언어
	defaultLocale: 'en',
	// intl 페이지에선 항상 접두어 사용
	localePrefix: 'always',
	// 루트(ko 페이지)에 자동 리다이렉트 금지
	localeDetection: false
});
