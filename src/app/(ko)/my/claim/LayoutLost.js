'use client'

import React, {useEffect, useLayoutEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {usePathname, useRouter} from 'next/navigation';
import {useMutation} from '@tanstack/react-query';

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {useMoHeaderContext} from '@modules/context/MoHeaderContext';
import {useScrollContext} from '@modules/context/ScrollContext';
import {RefundAndLostOptions} from '@modules/consants/Options';
import {RouteConfig} from '@modules/config/RouteConfig';
import {useLoadingContext} from '@modules/context/LoadingContext';
import {useWebContext} from '@modules/context/WebviewContext';
import {useApi} from '@modules/services/useApi';
import {validate, VALIDATE_RULES} from '@modules/utils/ValidateUtils';
import {apiApplyLost} from '@/app/_actions/mypage.action';
import {usePopContext} from '@modules/context/PopContext';
import {useUserContext} from '@modules/context/UserContext';

// components
import Breadcrumb from '@components/layout/Breadcrumb';
import Segment from '@components/common/Segment';
import CardLostStep1 from '@/app/(ko)/my/claim/components/CardLostStep1';
import CardLostStep2 from '@/app/(ko)/my/claim/components/CardLostStep2';


/**
 * @description: 분실 신청 화면 입니다.
 * @screenID:    UI-CRM-F237 ~ UI-CRM-F238, UI-CRM-F471 ~ UI-CRM-F472
 * @screenPath:  홈 > 마이페이지 > 분실신청
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function LayoutLost({onChangeTab}) {

	const router = useRouter();
	const pathname = usePathname();
	const {isMobile} = useScreenSizeContext();
	const {isAccApp, backRNPath, reloadKey, fncFocusLayout, fncPostRN} = useWebContext();
	const {fncChangeMoHeader} = useMoHeaderContext();
	const {fncScrollToTop} = useScrollContext();
	const {jsonApiAction} = useApi();
	const {fncShowPop, fncClosePop, fncErrorPop} = usePopContext();
	const {userInfo, fncEncode} = useUserContext();
	const {fncRouteStart} = useLoadingContext();

	const [valid, setValid] = useState({});
	const [params, setParams] = useState({
		rqstrNm: '',                        // 요청자명
        cardNoEncpt: '',                    // 카드
        micBankCd: '',                      // 은행 코드
        bacntOwnrNm: '',                    // 계좌소유주
        dpstActnoEncpt: '',                 // 계좌번호
        rqstrTelno: '',                     // 전화번호
        refundTerms: false,                 // 약관
	})

	const [applyRes, setApplyRes] = useState(null);

	// --Api
	// 분실신청
	const {mutate: mutApplyLost, data: resApplyLost} = useMutation({
		mutationKey: ['mutApplyLost'],
		mutationFn: (payload) => jsonApiAction(apiApplyLost, payload),
		onSuccess: (res) => setApplyRes(res),
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

	useLayoutEffect(() => {
		if (isAccApp) fncFocusLayout();
		if (isMobile) {
			fncChangeMoHeader({
				type: 'back',
				title: '대중교통안심카드 분실신청'
			})
		}
	}, [isMobile, isAccApp, reloadKey])

	useEffect(() => {
		if(userInfo?.custNm) {
			setParams(prev => ({
				...prev,
				rqstrNm: userInfo?.custNm,
			}))
		}
	}, [userInfo]);

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
		setParams({...params, [e.target.id]: e.target.value});
	}

	// segment 클릭
	const fncChangeSegment = (id) => {
		onChangeTab?.(id);
	}

	// 체크박스 선택
	const fncChangeCheckbox = (check) => {
		setParams({...params, refundTerms: check});
	}

	// 카드 선택
	const fncSelectCard = (option) => {
		if(Object.keys(valid).length) fncDelValid('cardNoEncpt');
		setParams({
			...params,
			cardNoEncpt: option.id,
			utztnDsctnSeCd: option.utztnDsctnSeCd
		});
	}

	// 은행 선택
	const fncSelectBank = (option) => {
		if(Object.keys(valid).length) fncDelValid('micBankCd');
		setParams({...params, micBankCd: option.id});
	}

	// 분실신청
	const fncRegister = async () => {
		if(!params.refundTerms) {
			fncShowPop({
				mainText: '분실/환불 신청을 위한 개인정보 수집 및 이용 동의 해주세요.',
				primaryText: '확인',
				onClickPrimary: () => fncClosePop()
			});
			return;
		}

		const rules = {
			rqstrNm: [
				{type: VALIDATE_RULES.ALPHA},
				{type: VALIDATE_RULES.MIN_LENGTH, value: 2},
				{type: VALIDATE_RULES.MAX_LENGTH, value: 10},
			],
			cardNoEncpt: [
				{type: VALIDATE_RULES.NUMERIC},
				{type: VALIDATE_RULES.MIN_LENGTH, value: 16},
				{type: VALIDATE_RULES.MAX_LENGTH, value: 16},
			],
			micBankCd: [
				{type: VALIDATE_RULES.NUMERIC},
				{type: VALIDATE_RULES.MIN_LENGTH, value: 2},
				{type: VALIDATE_RULES.MAX_LENGTH, value: 2},
			],
			bacntOwnrNm: [
				{type: VALIDATE_RULES.ALPHA},
				{type: VALIDATE_RULES.MIN_LENGTH, value: 2},
				{type: VALIDATE_RULES.MAX_LENGTH, value: 10},
			],
			dpstActnoEncpt: [
				{type: VALIDATE_RULES.NUMERIC},
			],
			rqstrTelno: [
				{type: VALIDATE_RULES.NUMERIC},
				{type: VALIDATE_RULES.MIN_LENGTH, value: 11},
				{type: VALIDATE_RULES.MAX_LENGTH, value: 11},
			]
		}

		const res = validate(params, rules);
		if(Object.keys(res).length === 0) {
			const encodedCardNo = await fncEncode(params.cardNoEncpt);
			const encodedAccount = await fncEncode(params.dpstActnoEncpt);
			if(!encodedCardNo || !encodedAccount) return;
			mutApplyLost({
				rqstrNm: params.rqstrNm,
				cardNoEncpt: encodedCardNo,
				micBankCd: params.micBankCd,
				bacntOwnrNm: params.bacntOwnrNm,
				dpstActnoEncpt: encodedAccount,
				rqstrTelno: params.rqstrTelno
			})
		} else {
			setValid(res);
			fncScrollToTop();
		}
	}

	// 이동: 이전
	const fncGoBack = () => {
		if(![
				RouteConfig.HOME.PATH,
				RouteConfig.INFO.PATH,
				RouteConfig.CARD.PATH,
				RouteConfig.COUPON.PATH,
			].includes(pathname) &&
			pathname === backRNPath &&
			isAccApp
		) {
			return fncPostRN({
				id: 'WEB_GO_BACK',
				payload: {},
			})
		} else {
			router.back();
		}
	}

	// 단계 초기화
	const fncInitStep = () => {
		setApplyRes(null);
		fncScrollToTop();
	}

	// 이동: 홈
	const fncGoHome = () => {
		const targetUri = RouteConfig.HOME.PATH;
		fncRouteStart(targetUri);
		router.replace(targetUri);
	}

	const fncHandlers = {
		register: fncRegister,
		changeInput: fncChangeInput,
		changeSegment: fncChangeSegment,
		changeCheckbox: fncChangeCheckbox,
		selectCard: fncSelectCard,
		selectBank: fncSelectBank,
		goBack: fncGoBack,
		goHome: fncGoHome,
		initStep: fncInitStep,
	}

	const fncCallbackEvent = (fncName, variable, payload = {}) => {
		const fnc = fncHandlers[fncName];
		if (typeof fnc === 'function') return fnc(variable, payload);
	}

	if (isMobile) return (
		<MoMyCardLost
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...params,
				valid,
				result: applyRes
			}}/>
	);
	else return (
		<DtMyCardLost
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...params,
				valid,
				result: applyRes
			}}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F237 ~ UI-CRM-F238
 */
DtMyCardLost.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function DtMyCardLost({data, fncCallbackEvent}) {
	return (
		<main id={'my'} className={'body-wrap-618'} aria-labelledby={'page-name-dt'}>
			{
				!data.result && (
					<>
						<Breadcrumb addPaths={[]} />
						<h1 id={'page-name-dt'} className={'page-title'}>
							대중교통안심카드 분실신청
						</h1>
						<div className={'my-48'}>
							<Segment
								size={'lg'}
								options={RefundAndLostOptions}
								selectedValue={RefundAndLostOptions[1].id}
								fullSize={true}
								onChange={(id) => fncCallbackEvent('changeSegment', id)}
							/>
						</div>
					</>
				)
			}
			{
				data.result > 0 ? (
					<CardLostStep2
						data={data}
						fncCallbackEvent={fncCallbackEvent}
					/>
				) : (
					<CardLostStep1
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
 * @screenID:    UI-CRM-F471 ~ UI-CRM-F472
 */
MoMyCardLost.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function MoMyCardLost({data, fncCallbackEvent}) {
	return (
		<main id={'my'} className={'body-wrap-mobile-screen-height'} aria-labelledby={'page-name-mo'}>
			<h1 id={'page-name-mo'} className={'sr-only'}>환불/분실신청</h1>
			<div className={'body-inner-wrap-mobile refund-wrap'}>
				{
					data.result > 0 ? (
						<CardLostStep2
							data={data}
							fncCallbackEvent={fncCallbackEvent}
						/>
					) : (
						<>
							<Segment
								size={'md'}
								options={RefundAndLostOptions}
								selectedValue={RefundAndLostOptions[1].id}
								fullSize={true}
								onChange={(id) => fncCallbackEvent('changeSegment', id)}
							/>
							<CardLostStep1
								data={data}
								fncCallbackEvent={fncCallbackEvent}
							/>
						</>
					)
				}
			</div>
		</main>
	)
}
