'use client'

import React, {useLayoutEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {useRouter, useSearchParams} from 'next/navigation';
import {useMutation} from "@tanstack/react-query";
import moment from "moment";

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {useMoHeaderContext} from '@modules/context/MoHeaderContext';
import {RouteConfig} from '@modules/config/RouteConfig';
import {useScrollContext} from '@modules/context/ScrollContext';
import {useLoadingContext} from '@modules/context/LoadingContext';
import {usePopContext} from "@modules/context/PopContext";
import {useApi} from "@modules/services/useApi";
import {apiCreateDiscountMinor} from "@/app/_actions/mypage.action";
import {validate, VALIDATE_RULES} from "@modules/utils/ValidateUtils";
import {useUserContext} from "@modules/context/UserContext";
import {apiTerms} from "@/app/_actions/common.action";

// components
import Breadcrumb from '@components/layout/Breadcrumb';
import DiscountMinorsRegisterStep1 from '@/app/(ko)/support/nonmember/minors/register/components/DiscountMinorsRegisterStep1';
import DiscountMinorsRegisterStep2 from '@/app/(ko)/support/nonmember/minors/register/components/DiscountMinorsRegisterStep2';


/**
 * @description: (비회원) 어린이 및 청소년 할인 등록/수정 화면 입니다.
 * @screenID:    UI-CRM-F261, UI-CRM-F276
 * @screenPath:  홈 > 고객센터 > 비회원 할인등록 > 어린이 및 청소년 할인 등록/수정
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function SupportNonMemberMinorsRegister() {

	const router = useRouter();
	const {isMobile} = useScreenSizeContext();
	const {fncChangeMoHeader} = useMoHeaderContext();
	const {fncScrollToTop} = useScrollContext();
	const {fncShowPop, fncClosePop, fncErrorPop} = usePopContext();
	const {jsonApiAction} = useApi();
	const {fncRouteStart} = useLoadingContext();
	const {fncEncode, isLogin} = useUserContext();

	// 파라미터
	const [valid, setValid] = useState({});
	const [params, setParams] = useState({
		cardNoEncpt: '',
		custBrdt: '',
		agreDscnPii: false,
	});

	// 결과
	const [resCreate, setResCreate] = useState(null);

	// --Api
	// 등록
	const {mutate: mutCreateNonDiscountMinor} = useMutation({
		mutationKey: ['mutCreateNonDiscountMinor'],
		mutationFn: (payload) => jsonApiAction(apiCreateDiscountMinor, {
			...payload,
			memberYn: 'N',
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
				title: '어린이 및 청소년 할인 등록 / 수정'
			})
		}
	}, [isMobile])

	useLayoutEffect(() => {
		if(isLogin) {
			fncShowPop({
				mainText: '로그아웃 후 이용해주세요.',
				primaryText: '확인',
				onClickPrimary: () => {
					fncClosePop();
					fncGoBack();
				}
			})
		}
	}, [isLogin]);

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
				{type: VALIDATE_RULES.MIN_AGE, value: 6},
				{type: VALIDATE_RULES.MAX_AGE, value: 18}
			]
		}

		const res = validate(params, rules);
		if(Object.keys(res).length === 0) {
			const encoded = await fncEncode(params.cardNoEncpt);
			if(!encoded) return;
			if(!encoded) return;
			mutCreateNonDiscountMinor({
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
		<MoSupportNonMemberMinorsRegister
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
		<DtSupportNonMemberMinorsRegister
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
 * @screenID:    UI-CRM-F261, UI-CRM-F276
 */
DtSupportNonMemberMinorsRegister.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function DtSupportNonMemberMinorsRegister({data, fncCallbackEvent}) {
	return (
		<main id={'support'} className={'body-wrap-618 discount-wrap'} aria-labelledby={'page-name-dt'}>
			{
				!data.result && (
					<>
						<Breadcrumb addPaths={[]} />
						<h1 id={'page-name-dt'} className={'page-title'}>
							어린이 및 청소년 할인 등록 / 수정
						</h1>
						<p className={'page-sub-title'} aria-live={'polite'}>
							어린이 및 청소년 정보를 입력해 주세요
						</p>
					</>
				)
			}
			{
				data.result?.res > 0 ? (
					<DiscountMinorsRegisterStep2
						data={data}
						fncCallbackEvent={fncCallbackEvent}
					/>
				) : (
					<DiscountMinorsRegisterStep1
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
 * @screenID:    -
 */
MoSupportNonMemberMinorsRegister.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function MoSupportNonMemberMinorsRegister({data, fncCallbackEvent}) {
	return (
		<main id={'support'} className={'body-wrap-mobile-screen-height discount-wrap'} aria-labelledby={'page-name-mo'}>
			<h1 id={'page-name-mo'} className={'sr-only'}>어린이 및 청소년 할인 등록 / 수정</h1>
			<div className={'body-inner-wrap-mobile'}>
				{
					data.result?.res > 0 ? (
						<DiscountMinorsRegisterStep2
							data={data}
							fncCallbackEvent={fncCallbackEvent}
						/>
					) : (
						<DiscountMinorsRegisterStep1
							data={data}
							fncCallbackEvent={fncCallbackEvent}
						/>
					)
				}
			</div>
		</main>
	)
}


