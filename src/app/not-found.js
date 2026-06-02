'use client'

import React, {useEffect} from "react";
import PropTypes from "prop-types";
import {useRouter} from "next/navigation";

// modules
import {useScreenSizeContext} from "@modules/context/ScreenContext";
import {useMoHeaderContext} from "@modules/context/MoHeaderContext";
import {RouteConfig} from "@modules/config/RouteConfig";

// components
import Button from "@components/common/Button";

// assets
import {Error404} from "@assets/icons/Svgs";
import Header from "@components/layout/Header";
import KoRootPage from "@/app/(ko)/page";
import Footer from "@components/layout/Footer";
import {useLoadingContext} from "@modules/context/LoadingContext";


/**
 * @description: 오류 화면 입니다.
 * @screenID:    UI-CRM-F278
 * @screenPath:  홈 > 오류
 * @author       $Author
 * @since        $Date
 * @version      $Revision
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function NotFound() {
	
	const router = useRouter();
	const {isMobile} = useScreenSizeContext();
	const {fncChangeMoHeader} = useMoHeaderContext();
	const {fncRouteStart} = useLoadingContext();
	
	useEffect(() => {
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
	
	if (isMobile) return (
		<>
			<Header currentLocale={"ko"}/>
			<div className={'flex-1 flex flex-col items-center'}>
				<MoNotFound
					fncCallbackEvent={fncCallbackEvent}
				/>
			</div>
			<Footer />
		</>
	);
	else return (
		<>
			<Header currentLocale={"ko"}/>
			<div className={'min-h-screen flex-1 flex flex-col items-center'}>
				<DtNotFound
					fncCallbackEvent={fncCallbackEvent}
				/>
			</div>
			<Footer/>
		</>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F278
 */
DtNotFound.propTypes = {
	fncCallbackEvent: PropTypes.func
};
export function DtNotFound({fncCallbackEvent}) {
	return (
		<main className={'body-wrap-832 flex-1 flex-col-center-center'} aria-labelledby={'page-name-dt'}>
			<div className={'flex-col-center mt-68 gap-16'}>
				<Error404 />
				<h1
					id={'page-name-dt'}
				    className={'text-heading-xl text-dynamic-text-neutral-primary font-bold'}
				>
					요청하신 페이지를 찾을 수 없어요
				</h1>
				<p className={'text-body-2xl text-dynamic-text-neutral-secondary font-medium -mt-6'}>
					페이지가 존재하지 않거나, 사용할 수 없습니다.<br/>
					입력하신 주소를 확인해주시길 바랍니다.
				</p>
			</div>
			<div className={'page-bottom-button-wrap'}>
				<Button
					theme={'secondary'}
					size={'xl'}
					text={'이전 페이지'}
					ariaLabel={'이전 페이지'}
					customStyle={'w-[240px]'}
					onClick={() => fncCallbackEvent('goBack')}
				/>
				<Button
					theme={'primary'}
					size={'xl'}
					text={'홈으로'}
					ariaLabel={'홈으로'}
					customStyle={'w-[240px]'}
					disabled={false}
					onClick={() => fncCallbackEvent('goHome')}
				/>
			</div>
		</main>
	)
}

/**
 * @description: Mobile
 * @screenID:    -
 */
MoNotFound.propTypes = {
	fncCallbackEvent: PropTypes.func
};
export function MoNotFound({fncCallbackEvent}) {
	return (
		<main className={'body-wrap-mobile-screen-height'} aria-labelledby={'page-name-mo'}>
			<div className={'flex-col-center justify-center flex-1 gap-16 page-bottom-space'}>
				<Error404 />
				<h1
					id={'page-name-mo'}
					className={'text-heading-lg text-dynamic-text-neutral-primary font-bold'}
				>
					요청하신 페이지를 찾을 수 없어요
				</h1>
				<p className={'text-body-lg text-dynamic-text-neutral-secondary font-medium text-center'}>
					페이지가 존재하지 않거나, 사용할 수 없습니다.<br/>
					입력하신 주소를 확인해주시길 바랍니다.
				</p>
			</div>
			<div className={'page-bottom-button-wrap'}>
				<Button
					theme={'secondary'}
					size={'lg'}
					text={'이전 페이지'}
					ariaLabel={'이전 페이지'}
					customStyle={'w-full'}
					onClick={() => fncCallbackEvent('goBack')}
				/>
				<Button
					theme={'primary'}
					size={'lg'}
					text={'홈으로'}
					ariaLabel={'홈으로'}
					customStyle={'w-full'}
					onClick={() => fncCallbackEvent('goHome')}
				/>
			</div>
		</main>
	)
}
