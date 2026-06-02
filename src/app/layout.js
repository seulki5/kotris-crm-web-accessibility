import React, {Suspense} from 'react';
import {cookies, headers} from 'next/headers';
import {userAgent} from 'next/server';
import PropTypes from 'prop-types';
import Script from 'next/script';
import {QueryClientProvider} from '@tanstack/react-query';

// modules
import {ThemeProvider} from '@modules/context/ThemeContext';
import {ScreenSizeProvider} from '@modules/context/ScreenContext';
import {MoHeaderProvider} from '@modules/context/MoHeaderContext';
import {metaData} from '@/lib/manifest';
import {isMobileUserAgent} from '@/lib/ua';
import {ScrollProvider} from '@modules/context/ScrollContext';
import {LoadingProvider} from '@modules/context/LoadingContext';
import {queryClient} from '@modules/services/QueryProvider';
import {PopProvider} from '@modules/context/PopContext';
import {WebviewProvider} from '@modules/context/WebviewContext';
import {UserProvider} from '@modules/context/UserContext';

// components
import Loading from "@/app/loading";

// styles
import 'react-calendar/dist/Calendar.css';
import '@/styles/globals.css';

// meta
export const metadata = {
	title: metaData.title,
	description: metaData.description,
	icons: metaData.icons,
	manifest: metaData.manifest
};
export const viewport = {
	width: 'device-width',
	initialScale: 1,
	maximumScale: 2,
	userScalable: true,
	viewportFit: 'contain',
}


/**
 * @description: RootPage SSR 영역입니다.
 * @screenID:    -
 * @screenPath:  -
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
RootLayout.propTypes = {
	children: PropTypes.any,
}
export default async function RootLayout({children}) {

	const cookieStore = await cookies();
	const headerStore = await headers();

	// 테마 설정 유지
	const cookieTheme = cookieStore.get('crm-theme')?.value || 'light';

	// 화면 사이즈 유지
	const ua = userAgent({headers: headerStore});
	const isMobileUa = isMobileUserAgent(ua);
	const cookieViewport = cookieStore.get('crm-viewport')?.value || null;
	let initialIsMobile = isMobileUa;
	if (cookieViewport) {
		initialIsMobile = cookieViewport === 'mobile';
	}

	const mobileOkUrl = process.env.MOBILE_OK_URL;

	return (
		<html lang={'ko'} data-theme={cookieTheme}>
		<body className={'h-[100dvh] min-h-[100dvh] overflow-hidden'}>
			{/* Context */}
			<QueryClientProvider client={queryClient}>
				<LoadingProvider>
					<ScreenSizeProvider initialIsMobile={initialIsMobile}>
						<PopProvider>
							<UserProvider>
								<ThemeProvider initialTheme={cookieTheme}>
									<MoHeaderProvider>
										<WebviewProvider>
											<ScrollProvider>
												<Suspense fallback={<Loading/>}>
													{children}
												</Suspense>
											</ScrollProvider>
										</WebviewProvider>
									</MoHeaderProvider>
								</ThemeProvider>
							</UserProvider>
						</PopProvider>
					</ScreenSizeProvider>
				</LoadingProvider>
			</QueryClientProvider>

			{/* nFilter */}
			<Script strategy={'beforeInteractive'} src={'/nfilter/js/open_nFilter.js'}/>
			<Script strategy={'beforeInteractive'} src={'/nfilter/js/secretUtil.js'}/>
			{/* 드림시큐리티 */}
			{
				mobileOkUrl ? (
					<Script strategy={'beforeInteractive'} src={mobileOkUrl}/>
				) : <></>
			}
		</body>
		</html>
	);
}
