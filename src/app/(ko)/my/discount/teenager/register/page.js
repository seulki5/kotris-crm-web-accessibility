'use client'

import React, {useLayoutEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {useRouter} from 'next/navigation';
import {useMutation} from "@tanstack/react-query";

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {useMoHeaderContext} from '@modules/context/MoHeaderContext';
import {RouteConfig} from '@modules/config/RouteConfig';
import {useLoadingContext} from '@modules/context/LoadingContext';
import {usePopContext} from "@modules/context/PopContext";
import {useApi} from "@modules/services/useApi";
import {apiCreateDiscountTeen} from "@/app/_actions/mypage.action";
import {validate, VALIDATE_RULES} from "@modules/utils/ValidateUtils";
import {useScrollContext} from "@modules/context/ScrollContext";
import {useUserContext} from "@modules/context/UserContext";
import {apiTerms} from "@/app/_actions/common.action";

// components
import Breadcrumb from '@components/layout/Breadcrumb';
import DiscountTeenRegisterStep1 from '@/app/(ko)/my/discount/teenager/register/components/DiscountTeenRegisterStep1';
import DiscountTeenRegisterStep2 from '@/app/(ko)/my/discount/teenager/register/components/DiscountTeenRegisterStep2';


/**
 * @description: (회원) 국가신분증 등록/수정 화면 입니다.
 * @screenID:    UI-CRM-F241, UI-CRM-F273, UI-CRM-F475, UI-CRM-F514
 * @screenPath:  홈 > 마이페이지 > 할인등록 > 국가신분증 등록/수정
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function MyDiscountTeenRegister() {

	const router = useRouter();
	const {isMobile} = useScreenSizeContext();
	const {fncChangeMoHeader} = useMoHeaderContext();
	const {fncScrollToTop} = useScrollContext();
	const {fncShowPop, fncClosePop, fncErrorPop} = usePopContext();
	const {jsonApiAction} = useApi();
	const {fncRouteStart} = useLoadingContext();
	const {fncEncode} = useUserContext();

	// 파라미터
	const [valid, setValid] = useState({});
	const [params, setParams] = useState({
		cardNoEncpt: '',
		custBrdt: '',
		agrePii: false,
	});

	// 결과
	const [resCreate, setResCreate] = useState(null);

	// --Api
	// 등록
	const {mutate: mutCreateDiscountTeen} = useMutation({
		mutationKey: ['mutCreateDiscountTeen'],
		mutationFn: (payload) => jsonApiAction(apiCreateDiscountTeen, {
			...payload,
			memberYn: 'Y',
			__localHandle: true
		}),
		onSuccess: (res) => {
			if(res?.res > 0) {
				setResCreate(res);
			} else {
				fncErrorPop();
			}
		},
		onError: (error) => {
			fncShowPop({
				mainText: error.message,
				primaryText: '확인',
				onClickPrimary: () => fncClosePop(),
			});
		}
	})

	// 조회(할인등록 개인정보 수집 및 이용)
	const {mutate: mutQueryDscnPii, data: termDscnPii} = useMutation({
		mutationKey: ['mutQueryDscnPii'],
		mutationFn: (payload) => jsonApiAction(apiTerms, payload),
	})

	useLayoutEffect(() => {
		if(isMobile) {
			fncChangeMoHeader({
				type: 'back',
				title: '국가신분증 등록 / 수정'
			})
		}
	}, [isMobile])

	useLayoutEffect(() => {
		if(process.env.NEXT_PUBLIC_PII_DSCNT) {
			mutQueryDscnPii({trmsTypeCd: process.env.NEXT_PUBLIC_PII_DSCNT});
		}
	}, []);

	// 값 체크 제거
	const fncDelValid = (key) => {
		if(!key) return;
		setValid(prev => {
			const base = prev ?? {}
			return Object.fromEntries(
				Object.entries(base).filter(([k]) => k !== key)
			)
		});
	}

	// 입력
	const fncChangeInput = (e) => {
		if(Object.keys(valid).length) fncDelValid(e.target.id);
		setParams({
			...params,
			[e.target.id]: e.target.value
		})
	}

	// 등록/수정
	const fncSave = async () => {
		const rules = {
			cardNoEncpt: [
				{type: VALIDATE_RULES.CARD_NO},
			],
			custBrdt: [
				{type: VALIDATE_RULES.NUMERIC},
				{type: VALIDATE_RULES.MIN_LENGTH, value: 8},
				{type: VALIDATE_RULES.MAX_LENGTH, value: 8},
				{type: VALIDATE_RULES.MIN_AGE, value: 9},
				{type: VALIDATE_RULES.MAX_AGE, value: 18}
			]
		}

		const res = validate(params, rules);
		if(Object.keys(res).length === 0) {
			const encoded = await fncEncode(params.cardNoEncpt);
			if(!encoded) return;
			mutCreateDiscountTeen({
				cardNoEncpt: encoded,
				custBrdt: params.custBrdt
			})
		} else {
			setValid(res);
			fncScrollToTop();
		}
	}

	// 약관 동의 업데이트
	const fncUpdateObj = (obj) => {
		setParams({
			...params,
			...obj
		})
	}

	// 이동: 이전
	const fncGoBack = () => {
		router.back();
	}

	// 이동: 홈
	const fncGoHome = () => {
		const targetUri = RouteConfig.HOME.PATH;
		fncRouteStart(targetUri);
		router.replace(targetUri);
	}

	const fncHandlers = {
		goHome: fncGoHome,
		goBack: fncGoBack,
		changeInput: fncChangeInput,
		save: fncSave,
		updateObj: fncUpdateObj,
	}

	const fncCallbackEvent = (fncName, variable, payload = {}) => {
		const fnc = fncHandlers[fncName];
		if (typeof fnc === 'function') return fnc(variable, payload);
	}

	if (isMobile) return (
		<MoMyDiscountTeenRegister
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...params,
				valid,
				result: resCreate,
				termDscnPii
			}}
		/>
	);
	else return (
		<DtMyDiscountTeenRegister
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...params,
				valid,
				result: resCreate,
				termDscnPii
			}}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F241, UI-CRM-F273
 */
DtMyDiscountTeenRegister.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function DtMyDiscountTeenRegister({data, fncCallbackEvent}) {
	return (
		<main id={'my'} className={'body-wrap-618'} aria-labelledby={'page-name-dt'}>
			{
				data.result?.res === undefined && (
					<>
						<Breadcrumb addPaths={[]} />
						<h1 id={'page-name-dt'} className={'page-title'}>
							국가신분증 등록
						</h1>
						<p className={'page-sub-title'} aria-live={'polite'}>
							국가신분증(청소년증) 정보를 입력해 주세요
						</p>
					</>
				)
			}
			{
				data.result?.res > 0 ? (
					<DiscountTeenRegisterStep2
						data={data}
						fncCallbackEvent={fncCallbackEvent}
					/>
				) : (
					<DiscountTeenRegisterStep1
						data={data}
						fncCallbackEvent={fncCallbackEvent}
					/>
				)
			}
		</main>
	)
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F475, UI-CRM-F514
 */
MoMyDiscountTeenRegister.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function MoMyDiscountTeenRegister({data, fncCallbackEvent}) {
	return (
		<main id={'my'} className={'body-wrap-mobile-screen-height'} aria-labelledby={'page-name-mo'}>
			<h1 id={'page-name-mo'} className={'sr-only'}>
				국가신분증 등록
			</h1>
			<div className={'body-inner-wrap-mobile'}>
				{
					data.result?.res > 0 ? (
						<DiscountTeenRegisterStep2
							data={data}
							fncCallbackEvent={fncCallbackEvent}
						/>
					) : (
						<DiscountTeenRegisterStep1
							data={data}
							fncCallbackEvent={fncCallbackEvent}
						/>
					)
				}
			</div>
		</main>
	)
}


