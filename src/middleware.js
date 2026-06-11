import { NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware';
import {routing} from '@/i18n/routing';

const intlMiddleware = createMiddleware(routing);

export function middleware(request) {

	const url = request.nextUrl.clone()
	const { pathname } = url
	const [, firstSegment] = pathname.split('/')

	// 두 글자 프리픽스일 때만 로케일 검사
	if (/^[a-z]{2}$/.test(firstSegment) && !['my'].includes(firstSegment)) {
		if (routing.locales.includes(firstSegment)) {
			// 지원 언어면 intl 미들웨어 실행
			return intlMiddleware(request)
		} else {
			// 그 외 두 글자면 홈으로 리다이렉트
			url.pathname = '/'
			return NextResponse.redirect(url)
		}
	}

	const validKoPaths = [
		'login',
		'join',
		'find',
		'about',
		'guide',
		'terms',
		'my',
		'support',
		'withdrawal',
		'alarm',
		'sitemap',
		'mblank',
		'mpad',
		'mlogin',
		'cert',
		'extrn',
		'form',
		'mcert',
	];
	const isStatic = pathname.startsWith('/_next/') ||
		pathname.startsWith('/favicon') ||
		pathname.startsWith('/form') ||
		pathname.endsWith('.js') ||
		pathname.endsWith('.png') ||
		pathname.endsWith('.css');

	if (!isStatic && pathname.startsWith('/')) {
		const splited = pathname.split('/');
		if (splited && !validKoPaths.includes(splited[1])) {
			url.pathname = '/error'
			return NextResponse.rewrite(url)
		}
	}

	// ko 페이지(또는 일반 페이지)는 그대로 통과
	const response = NextResponse.next();

	// pathname
	response.cookies.set('pathname', url.pathname);

	// searchParams
	const queryString = url.searchParams.toString();
	response.cookies.set('searchParams', queryString || '');

	return response;
}

export const config = {
	matcher: ['/:locale/:path*']
};
