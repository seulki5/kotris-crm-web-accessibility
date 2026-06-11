'use client';

import React, {useLayoutEffect} from 'react';
import {useRouter} from 'next/navigation';

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {useMoHeaderContext} from '@modules/context/MoHeaderContext';
import {RouteConfig} from '@modules/config/RouteConfig';
import {useLoadingContext} from '@modules/context/LoadingContext';

// components
import {DtNotFound, MoNotFound} from '@/app/not-found';


/**
 * @description: 없는 화면 입니다.
 * @screenID:    -
 */
export default function EmptyRootPage() {
	
	const router = useRouter();
	const {isMobile} = useScreenSizeContext();
	const {fncChangeMoHeader} = useMoHeaderContext();
	const {fncRouteStart} = useLoadingContext();

	useLayoutEffect(() => {
		if(isMobile) {
			fncChangeMoHeader({
				type: 'main',
				title: ''
			})
		}
	}, [isMobile])
	
	// 이동: 홈
	const fncGoHome = () => {
		const targetUri = RouteConfig.HOME.PATH;
		fncRouteStart(targetUri);
		router.replace(targetUri);
	}
	
	// 이동: 이전 페이지
	const fncGoBack = () => {
		router.back()
	}
	
	const fncHandlers = {
		goHome: fncGoHome,
		goBack: fncGoBack
	}
	
	const fncCallbackEvent = (fncName, variable, payload = {}) => {
		const fnc = fncHandlers[fncName];
		if (typeof fnc === 'function') return fnc(variable, payload);
	}
	
	if(isMobile) return (
		<MoNotFound
			fncCallbackEvent={fncCallbackEvent}
		/>
	);
	else return (
		<DtNotFound
			fncCallbackEvent={fncCallbackEvent}
		/>
	);
}
