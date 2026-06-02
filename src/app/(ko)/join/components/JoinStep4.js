'use client'

import React from 'react';
import PropTypes from "prop-types";
import {useRouter} from "next/navigation";

// modules
import {useScreenSizeContext} from "@modules/context/ScreenContext";
import {RouteConfig} from "@modules/config/RouteConfig";
import {useLoadingContext} from "@modules/context/LoadingContext";

// components
import TemplateResult from "@components/composite/TemplateResult";
import {useWebContext} from "@modules/context/WebviewContext";


/**
 * @description: 회원 가입 Step4 화면 입니다.
 * @screenID:    UI-CRM-F204, UI-CRM-F413
 * @screenPath:  홈 > 회원가입
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function JoinStep4() {
	
	const router = useRouter();
	const {isMobile} = useScreenSizeContext();
	const {fncRouteStart} = useLoadingContext();

	// 이동: 홈
	const fncGoHome = () => {
		const targetUri = RouteConfig.HOME.PATH;
		fncRouteStart(targetUri);
		router.replace(targetUri);
	}
	
	// 이동: 로그인
	const fncGoLogin = () => {
		const targetUri = RouteConfig.LOGIN.PATH;
		fncRouteStart(targetUri);
		router.replace(targetUri);
	}
	
	const fncHandlers = {
		goHome: fncGoHome,
		goLogin: fncGoLogin
	}
	
	const fncCallbackEvent = (fncName, variable, payload = {}) => {
		const fnc = fncHandlers[fncName];
		if (typeof fnc === 'function') return fnc(variable, payload);
	}
	
	if (isMobile) {
		return (
			<MoJoinStep4 fncCallbackEvent={fncCallbackEvent} />
		);
	} else {
		return (
			<DtJoinStep4 fncCallbackEvent={fncCallbackEvent} />
		);
	}
	
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F413
 */
DtJoinStep4.propTypes = {
	fncCallbackEvent: PropTypes.func,
};
export function DtJoinStep4({fncCallbackEvent}) {
	return (
		<TemplateResult
			screen={'desktop'}
			title={'회원가입이 완료되었습니다!'}
			subTitle={`지하철, 버스, 기차, 유통 결제까지\nRail+카드 하나로 즐기세요!`}
			animationSrc={require('@assets/animations/join_complete.json')}
			buttonText={'홈으로'}
			buttonAriaLabel={'홈으로 이동'}
			onDone={() => fncCallbackEvent('goHome')}
		/>
	)
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F204
 */
MoJoinStep4.propTypes = {
	fncCallbackEvent: PropTypes.func,
};
export function MoJoinStep4({fncCallbackEvent}) {

	const {isAccApp} = useWebContext();

	const fncOnClickButton = () => {
		if(isAccApp) {
			fncCallbackEvent('goLogin')
		} else {
			fncCallbackEvent('goHome')
		}
	}

	return (
		<TemplateResult
			screen={'mobile'}
			title={'회원가입이 완료되었습니다!'}
			subTitle={`지하철, 버스, 기차, 유통 결제까지\nRail+카드 하나로 즐기세요!`}
			animationSrc={require('@assets/animations/join_complete.json')}
			buttonText={isAccApp ? '로그인 하기' : '홈으로'}
			buttonAriaLabel={isAccApp ? '로그인 하기' : '홈으로'}
			onDone={fncOnClickButton}
		/>
	)
}
