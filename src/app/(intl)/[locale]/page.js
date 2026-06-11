'use client'

import React, {useEffect} from "react";
import {useLocale} from 'next-intl';
import {redirect, usePathname} from '@/i18n/navigation';

// modules
import {useScreenSizeContext} from "@modules/context/ScreenContext";
import {useMoHeaderContext} from "@modules/context/MoHeaderContext";
import {RouteIntlConfig} from "@modules/config/RouteConfig";
import {useScrollContext} from "@modules/context/ScrollContext";
import {useLoadingContext} from "@modules/context/LoadingContext";


/**
 * @description: 글로벌 언어 적용 화면(en, ja, zh) Page 영역입니다.
 * @screenID:    -
 * @screenPath:  -
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function IntlPage({children}) {
	
	// const t = useTranslations('discount');
	const {isMobile} = useScreenSizeContext();
	const {fncChangeMoHeader} = useMoHeaderContext();
	const {fncScrollToTop} = useScrollContext();
	
	const pathname = usePathname();
	const locale = useLocale();
	
	// Mobile Only: 모바일 헤더
	useEffect(() => {
		if(isMobile) {
			fncChangeMoHeader({
				type: 'main',
				title: ''
			})
		}
	}, [isMobile])
	
	useEffect(() => {
		fncScrollToTop();
		if(pathname === '/') {
			redirect({href: RouteIntlConfig.HOWTOUSE.PATH, locale: locale || 'en'});
		}
	}, [pathname])
	
	return (
		<>{children}</>
	)
}
