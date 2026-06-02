'use client'

import React, {useEffect, useLayoutEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {useRouter} from 'next/navigation';
import {useMutation} from '@tanstack/react-query';
import Cookies from "js-cookie";

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {useMoHeaderContext} from '@modules/context/MoHeaderContext';
import {useScrollContext} from '@modules/context/ScrollContext';
import {IssueCardOptions} from '@modules/consants/Options';
import {RouteConfig} from '@modules/config/RouteConfig';
import {useLoadingContext} from '@modules/context/LoadingContext';
import {apiCardList, apiCreateDefaultCard, apiCreateSafeCard} from '@/app/_actions/mypage.action';
import {useApi} from '@modules/services/useApi';
import {CODE} from '@modules/consants/Objects';
import {useUserContext} from "@modules/context/UserContext";
import {usePopContext} from "@modules/context/PopContext";
import {apiTerms} from "@/app/_actions/common.action";

// components
import Breadcrumb from '@components/layout/Breadcrumb';
import CardRegisterStep1 from '@/app/(ko)/my/card/register/components/CardRegisterStep1';
import CardRegisterStep2 from '@/app/(ko)/my/card/register/components/CardRegisterStep2';
import CardRegisterStep3 from '@/app/(ko)/my/card/register/components/CardRegisterStep3';


/**
 * @description: 카드 등록 화면 입니다.
 * @screenID:    UI-CRM-F226,UI-CRM-F227, UI-CRM-F229, UI-CRM-F454, UI-CRM-F455, UI-CRM-F457
 * @screenPath:  홈 > 마이페이지 > 내 카드 > 카드 등록
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
MyCardRegisterClient.propTypes = {
	identityParams: PropTypes.object
};
export default function MyCardRegisterClient({ identityParams = {} }) {

	const router = useRouter();
	const {isMobile} = useScreenSizeContext();
	const {fncChangeMoHeader} = useMoHeaderContext();
	const {fncScrollToTop} = useScrollContext();
	const {jsonApiAction} = useApi();
	const {fncRouteStart} = useLoadingContext();
	const {fncEncode} = useUserContext();
	const {fncShowPop, fncClosePop, fncErrorPop} = usePopContext();

	// 등록 순서
	const [step, setStep] = useState(0);

	// 소득공제 등록 팝업
	const [popTaxDeduction, setPopTaxDeduction] = useState(false);
	const [moRealnameRes, setMoRealnameRes] = useState(null);

	// 파라미터
	const [params, setParams] = useState({
		utztnDsctnSeCd: '',     // 이용구분 코드
		utztnDsctnSeNm: '',     // 이용구분명
		cardNoEncpt: '',        // 카드번호
		cardNcknmNm: '',        // 별칭
		earnDdcYn: 'N',         // 소득공제
		ssnFront: '',           // 주민등록번호(앞)
		ssnLast: '',            // 주민등록번호(뒤)
		agreCardRegPii: false,  // 카드등록 약관 동의
		passCardCheck: false,   // 카드 검증 여부
	})

	// --Api
	// 등록(일반)
	const {mutate: mutCreateDefaultCard} = useMutation({
		mutationKey: ['mutCreateDefaultCard'],
		mutationFn: (payload) => jsonApiAction(apiCreateDefaultCard, {...payload, __localHandle: true}),
		onSuccess: async (res) => {
			if(res > 0) {
				const encoded = await fncEncode(params.cardNoEncpt);
				if(!encoded) return;
				mutQueryCard({cardNoEncpt: encoded});
			} else {
				fncErrorPop();
			}
		},
		onError: (error) => {
			if(error.message) {
				fncShowPop({
					mainText: error.message,
					primaryText: '확인',
					onClickPrimary: () => fncClosePop(),
				});
			} else {
				fncErrorPop()
			}
		}
	})

	// 등록(대중교통안심)
	const {mutate: mutCreateSafeCard} = useMutation({
		mutationKey: ['mutCreateSafeCard'],
		mutationFn: (payload) => jsonApiAction(apiCreateSafeCard, {...payload, __localHandle: true}),
		onSuccess: async (res) => {
			if(res > 0) {
				const encoded = await fncEncode(params.cardNoEncpt);
				if(!encoded) return;
				mutQueryCard({cardNoEncpt: encoded});
			} else {
				fncErrorPop();
			}
		},
		onError: (error) => {
			if(error.message) {
				fncShowPop({
					mainText: error.message,
					primaryText: '확인',
					onClickPrimary: () => fncClosePop(),
				});
			} else {
				fncErrorPop()
			}
		}
	})

	// 조회
	const {mutate: mutQueryCard} = useMutation({
		mutationKey: ['mutQueryCard'],
		mutationFn: (payload) => jsonApiAction(apiCardList, payload),
		onSuccess: (res) => {
			if(res) {
				const find = res.filter(el => el.cardNoEncpt === params.cardNoEncpt)?.[0] || {};
				setParams(prev => ({
					...prev,
					issuCardPssrTypeCd: find.issuCardPssrTypeCd
				}))

				fncNextStep();
			}
		},
	})

	// 조회(개인정보 수집 및 이용)
	const {mutate: mutQueryCardRegPii, data: termCardRegPii} = useMutation({
		mutationKey: ['mutQueryCardRegPii'],
		mutationFn: (payload) => jsonApiAction(apiTerms, payload),
	})

	useLayoutEffect(() => {
		if(isMobile) {
			fncChangeMoHeader({
				type: 'back',
				title: '카드등록'
			})
		}
	}, [isMobile])

	useLayoutEffect(() => {
		if(process.env.NEXT_PUBLIC_PII_PLA_CARD) {
			mutQueryCardRegPii({trmsTypeCd: process.env.NEXT_PUBLIC_PII_PLA_CARD});
		}
	}, []);

	// 반응형 실명인증
	useLayoutEffect(() => {
		const cookie = Cookies.get('crm-verify');

		if(
			isMobile &&
			(identityParams?.type === 'realname') &&
			identityParams?.result &&
			cookie
		) {
			setStep(1);

			const storedCookie = cookie ? JSON.parse(cookie) : {};
			if([1, "1"].includes(identityParams.result)) {
				setPopTaxDeduction(true);
				setMoRealnameRes({
					type: identityParams.type,
					result: identityParams.result,
					redirectType: identityParams.redirectType,
					popParams: storedCookie?.popParams || {}
				});
				setParams(prev => ({
					...prev,
					utztnDsctnSeCd: storedCookie.utztnDsctnSeCd,
					utztnDsctnSeNm: storedCookie.utztnDsctnSeNm,
					cardNoEncpt: storedCookie.cardNoEncpt,
					cardNcknmNm: storedCookie.cardNcknmNm,
					agreCardRegPii: storedCookie.agreCardRegPii,
					passCardCheck: storedCookie.passCardCheck,
				}))

			} else {
				Cookies.remove('crm-verify');
				fncShowPop({
					mainText: '실명인증에 실패했습니다.',
					primaryText: '확인',
					onClickPrimary: () => fncClosePop()
				})
			}
		}
	}, [isMobile, identityParams]);
	
	// 등록할 카드 변경
	const fncChangeCardType = (type) => {
		const findCardName = IssueCardOptions.filter((el) => el.id === type)[0]?.name;
		setParams(prev => ({
			...prev,
			utztnDsctnSeCd: type,
			utztnDsctnSeNm: findCardName
		}))
	}

	// 다음단계로 변경
	const fncNextStep = () => {
		setStep(step + 1);
		fncScrollToTop();
	}

	// 입력
	const fncChangeInput = (e) => {
		setParams(prev => ({
			...prev,
			[e.target.id]: e.target.value
		}))
	}

	// 카드 등록
	const fncAdd = async () => {
		const encoded = await fncEncode(params.cardNoEncpt);
		if(!encoded) return;
		if(params.utztnDsctnSeCd === CODE.CARD_SEG_PLA_DEFAULT) {
			mutCreateDefaultCard({...params, cardNoEncpt: encoded});
		}
		if(params.utztnDsctnSeCd === CODE.CARD_SEG_PLA_SAFE) {
			mutCreateSafeCard({...params, cardNoEncpt: encoded});
		}
	}

	// 소득공제 팝업 핸들러
	const fncShowDeduction = () => {
		if(params.earnDdcYn === 'N') {
			setPopTaxDeduction(true);
		} else {
			setPopTaxDeduction(false);
			setParams(prev => ({
				...prev,
				earnDdcYn: 'N',
				ssnFront: '',
				ssnLast: '',
			}))
		}
	}

	// 소득공제 팝업 닫기
	const fncCloseDeduction = () => {
		setPopTaxDeduction(false);
	}

	// 소득공제/약관 등록
	const fncUpdateObj = (obj) => {
		setPopTaxDeduction(false);
		setParams(prev => ({
			...prev,
			...obj
		}))
	}

	// 이동: 홈
	const fncGoHome = () => {
		const targetUri = RouteConfig.HOME.PATH;
		fncRouteStart(targetUri);
		router.replace(targetUri);
	}

	// 이동: 뒤로가기
	const fncGoBack = () => {
		router.back();
	}

	const fncHandlers = {
		changeCardType: fncChangeCardType,
		next: fncNextStep,
		changeInput: fncChangeInput,
		showDeduction: fncShowDeduction,
		closeDeduction: fncCloseDeduction,
		updateObj: fncUpdateObj,
		add: fncAdd,
		goHome: fncGoHome,
		goBack: fncGoBack,
	}

	const fncCallbackEvent = (fncName, variable, payload = {}) => {
		const fnc = fncHandlers[fncName];
		if (typeof fnc === 'function') return fnc(variable, payload);
	}

	if (isMobile) return (
		<MoMyCardRegister
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...params,
				step,
				popTaxDeduction,
				termCardRegPii,
				moRealnameRes
			}}/>
	);
	else return (
		<DtMyCardRegister
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...params,
				step,
				popTaxDeduction,
				termCardRegPii
			}}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F226,UI-CRM-F227, UI-CRM-F229
 */
DtMyCardRegister.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function DtMyCardRegister({data, fncCallbackEvent}) {
	const stepComponentMap = {
		1: (
			<CardRegisterStep2
				data={data}
				fncCallbackEvent={fncCallbackEvent}
			/>
		),
		2: (
			<CardRegisterStep3
				data={data}
				fncCallbackEvent={fncCallbackEvent}
			/>
		)
	}

	return (
		<main id={'my'} className={'body-wrap-618'} aria-labelledby={'page-name-dt'}>
			{
				data.step < 2 && (
					<>
						<Breadcrumb addPaths={[]} />
						<h1 id={'page-name-dt'} className={'page-title'}>
							카드등록
						</h1>
						<p className={'page-sub-title'} aria-live={'polite'}>
							{
								data.step === 0 && (
									'등록할 카드의 종류를 선택해 주세요'
								)
							}
							{
								data.step === 1 && (
									`${data.utztnDsctnSeNm}의 정보를 입력해 주세요`
								)
							}
						</p>
					</>
				)
			}
			{
				stepComponentMap[data.step] || (
					<CardRegisterStep1
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
 * @screenID:    UI-CRM-F454, UI-CRM-F455, UI-CRM-F457
 */
MoMyCardRegister.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function MoMyCardRegister({data, fncCallbackEvent}) {
	const stepComponentMap = {
		1: (
			<CardRegisterStep2
				data={data}
				fncCallbackEvent={fncCallbackEvent}
			/>
		),
		2: (
			<CardRegisterStep3
				data={data}
				fncCallbackEvent={fncCallbackEvent}
			/>
		)
	}

	return (
		<main id={'my'} className={'body-wrap-mobile-screen-height'} aria-labelledby={'page-name-mo'}>
			<h1 id={'page-name-mo'} className={'sr-only'}>카드등록</h1>
			{
				stepComponentMap[data.step] || (
					<CardRegisterStep1
						data={data}
						fncCallbackEvent={fncCallbackEvent}
					/>
				)
			}
		</main>
	)
}
