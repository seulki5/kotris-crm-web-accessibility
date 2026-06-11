'use client'

import React, {useEffect, useLayoutEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {useRouter, useSearchParams} from 'next/navigation';
import {useMutation} from '@tanstack/react-query';

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {useMoHeaderContext} from '@modules/context/MoHeaderContext';
import {RouteConfig} from '@modules/config/RouteConfig';
import {useApi} from '@modules/services/useApi';
import {useLoadingContext} from '@modules/context/LoadingContext';
import {usePopContext} from '@modules/context/PopContext';
import {apiCreateDiscountStudent, apiViewDiscount} from '@/app/_actions/mypage.action';
import {validate, VALIDATE_RULES} from '@modules/utils/ValidateUtils';
import {useScrollContext} from "@modules/context/ScrollContext";
import {useUserContext} from "@modules/context/UserContext";
import {CODE} from "@modules/consants/Objects";
import {apiUserMyDetail} from "@/app/_actions/user.action";
import {apiTerms} from "@/app/_actions/common.action";
import {useWebContext} from "@modules/context/WebviewContext";

// components
import Breadcrumb from '@components/layout/Breadcrumb';
import DiscountStudentRegisterStep1 from '@/app/(ko)/my/discount/student/register/components/DiscountStudentRegisterStep1';
import DiscountStudentRegisterStep2 from '@/app/(ko)/my/discount/student/register/components/DiscountStudentRegisterStep2';


/**
 * @description: (회원) 청소년 연령초과 학생 할인 등록/수정 화면 입니다.
 * @screenID:    UI-CRM-F244, UI-CRM-F274, UI-CRM-F477 ~ UI-CRM-F478
 * @screenPath:  홈 > 마이페이지 > 할인등록 > 청소년 연령초과 학생 할인 등록/수정
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function MyDiscountStudentRegister() {

	const router = useRouter();
	const searchParams = useSearchParams();
	const no = searchParams.get('no');
	const {isMobile} = useScreenSizeContext();
	const {fncChangeMoHeader} = useMoHeaderContext();
	const {fncScrollToTop} = useScrollContext();
	const {fncShowPop, fncClosePop, fncErrorPop} = usePopContext();
	const {jsonApiAction} = useApi();
	const {fncRouteStart} = useLoadingContext();
	const {fncEncode, isLogin} = useUserContext();
	const {isAccApp, fncCleanStoreRNPayload} = useWebContext();

	// 다음단계
	const [blockNext, setBlockNext] = useState(true);

	// 파라미터
	const [valid, setValid] = useState({});
	const [params, setParams] = useState({
		custNm: '',
		custBrdt: '',
		cardNoEncpt: '',
		hsclGrdtnPrnmntYmd: '',
		atchFileList: [],
		mblTelno: '',
		prvcClctUtztnAgreYn: false,
		yuthFareUseExtnsnAplyLeadYn: false,
	});

	// 결과
	const [resCreate, setResCreate] = useState(null);

	// --Api
	// 유저 조회
	const {mutate: mutUserInfo} = useMutation({
		mutationKey: ['mutUserInfo'],
		mutationFn: () => jsonApiAction(apiUserMyDetail, {}),
		onSuccess: (res) => {
			if(res) {
				setParams(prev => ({
					...prev,
					custNm: res.custNm,
					custBrdt: res.custBrdt,
					mblTelno: res.mblTelno
				}))
			}
		}
	})

	// 조회
	const {mutate: mutQueryDiscount} = useMutation({
		mutationKey: ['mutQueryDiscount'],
		mutationFn: () => jsonApiAction(apiViewDiscount, {dscntAplySe: CODE.DC_STUDENT, memberYn: 'Y'}),
		onSuccess: (res) => {
			if(res.length > 0) {
				setParams(prev => ({
					...prev,
					cardNoEncpt: res[0].cardNoEncpt,
					hsclGrdtnPrnmntYmd: res[0].hsclGrdtnPrnmntYmd,
					atchFileList: res[0].atchFileList,
					dmndNo: res[0].dmndNo
				}))
			} else {
				fncErrorPop();
			}
		}
	})

	// 등록
	const {mutate: mutCreateDiscountStudent} = useMutation({
		mutationKey: ['mutCreateDiscountStudent'],
		mutationFn: (payload) => jsonApiAction(apiCreateDiscountStudent, {
			...payload,
			memberYn: 'Y',
			__localHandle: true
		}),
		onSuccess: (res) => {
			if(res > 0) {
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
	
	// 조회(청소년 요금 사용기간 연장 신청)
	const {mutate: mutQueryExtendYouth, data: termExtendYouth} = useMutation({
		mutationKey: ['mutQueryExtendYouth'],
		mutationFn: (payload) => jsonApiAction(apiTerms, payload),
	})

	useLayoutEffect(() => {
		if(isMobile) {
			fncChangeMoHeader({
				type: 'back',
				title: '청소년 연령초과 학생 할인 등록 / 수정'
			})
		}

		return () => {
			if(isAccApp) fncCleanStoreRNPayload();
		}
	}, [isMobile, isAccApp])
	
	useLayoutEffect(() => {
		if(process.env.NEXT_PUBLIC_PII_DSCN_YOUTH && process.env.NEXT_PUBLIC_EXTEND_DSCN_YOUTH) {
			mutQueryDscnPii({trmsTypeCd: process.env.NEXT_PUBLIC_PII_DSCN_YOUTH});
			mutQueryExtendYouth({trmsTypeCd: process.env.NEXT_PUBLIC_EXTEND_DSCN_YOUTH})
		}
	}, []);

	useLayoutEffect(() => {
		isLogin && mutUserInfo();
	}, [isLogin]);

	// 수정
	useLayoutEffect(() => {
		if(no) mutQueryDiscount();
	}, [no]);

	useEffect(() => {
		if(
			params.cardNoEncpt &&
			params.hsclGrdtnPrnmntYmd &&
			params.mblTelno?.length > 10 &&
			params.atchFileList?.length > 0 &&
			params.prvcClctUtztnAgreYn &&
			params.yuthFareUseExtnsnAplyLeadYn
		) {
			setBlockNext(false);
		} else {
			setBlockNext(true);
		}
	}, [
		params.cardNoEncpt,
		params.hsclGrdtnPrnmntYmd,
		params.atchFileList,
		params.mblTelno,
		params.prvcClctUtztnAgreYn,
		params.yuthFareUseExtnsnAplyLeadYn
	]);

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
		setParams(prev => ({
			...prev,
			[e.target.id]: e.target.value
		}))
	}

	// 파일 업로드
	const fncUpdateUploaded = (files) => {
		setParams(prev => ({...prev, atchFileList: files}));
	}

	// 등록/수정
	const fncSave = async () => {
		if(blockNext) return;

		const rules = {
			cardNoEncpt: [
				{type: VALIDATE_RULES.CARD_NO},
			],
			mblTelno: [
				{type: VALIDATE_RULES.PHONE},
			],
			hsclGrdtnPrnmntYmd: [
				{type: VALIDATE_RULES.NUMERIC},
				{type: VALIDATE_RULES.MIN_LENGTH, value: 8},
				{type: VALIDATE_RULES.MAX_LENGTH, value: 8}
			],
			atchFileList: [
				{type: VALIDATE_RULES.FILE_MIN_LENGTH, value: 1},
				{type: VALIDATE_RULES.FILE_MAX_LENGTH, value: 2},
			]
		}

		const res = validate(params, rules);
		if(Object.keys(res).length === 0) {
			const encoded = await fncEncode(params.cardNoEncpt);
			if(!encoded) return;
			mutCreateDiscountStudent({
				cardNoEncpt: encoded,
				custBrdt: params.custBrdt,
				hsclGrdtnPrnmntYmd: params.hsclGrdtnPrnmntYmd,
				custNm: params.custNm,
				atchFileList: params.atchFileList,
				dmndNo: no ? params.dmndNo : '',
				mblTelno: params.mblTelno,
				prvcClctUtztnAgreYn: params.prvcClctUtztnAgreYn ? "Y" : "N",
				yuthFareUseExtnsnAplyLeadYn: params.prvcClctUtztnAgreYn? "Y" : "N",
			})
		} else {
			setValid(res);
			if(res['atchFileList']){
				fncShowPop({
					mainText: '첨부된 파일이 없습니다.',
					primaryText: '확인',
					onClickPrimary: () => fncClosePop(),
				});
			}
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
		updateUploaded: fncUpdateUploaded,
		save: fncSave,
		updateObj: fncUpdateObj,
	}

	const fncCallbackEvent = (fncName, variable, payload = {}) => {
		const fnc = fncHandlers[fncName];
		if (typeof fnc === 'function') return fnc(variable, payload);
	}

	if (isMobile) return (
		<MoMyDiscountStudentRegister
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...params,
				valid,
				blockNext,
				result: resCreate,
				termDscnPii,
				termExtendYouth
			}}
		/>
	);
	else return (
		<DtMyDiscountStudentRegister
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...params,
				valid,
				blockNext,
				result: resCreate,
				termDscnPii,
				termExtendYouth
			}}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F244, UI-CRM-F274
 */
DtMyDiscountStudentRegister.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function DtMyDiscountStudentRegister({data, fncCallbackEvent}) {
	return (
		<main id={'my'} className={'body-wrap-618 discount-wrap'} aria-labelledby={'page-name-dt'}>
			{
				!data.result && (
					<>
						<Breadcrumb addPaths={[]} />
						<h1 id={'page-name-dt'} className={'page-title'}>
							청소년 연령초과 학생 할인<br/>등록 / 수정
						</h1>
						<p className={'page-sub-title'} aria-live={'polite'}>
							청소년 연령초과 학생 할인 정보를 입력해 주세요
						</p>
					</>
				)
			}
			{
				data.result > 0 ? (
					<DiscountStudentRegisterStep2
						fncCallbackEvent={fncCallbackEvent}
					/>
				) : (
					<DiscountStudentRegisterStep1
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
 * @screenID:    UI-CRM-F477 ~ UI-CRM-F478
 */
MoMyDiscountStudentRegister.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function MoMyDiscountStudentRegister({data, fncCallbackEvent}) {
	return (
		<main id={'my'} className={'body-wrap-mobile-screen-height discount-wrap'} aria-labelledby={'page-name-mo'}>
			<h1 id={'page-name-mo'} className={'sr-only'}>청소년 연령초과 학생 할인 등록 / 수정</h1>
			<div className={'body-inner-wrap-mobile'}>
				{
					data.result > 0 ? (
						<DiscountStudentRegisterStep2
							fncCallbackEvent={fncCallbackEvent}
						/>
					) : (
						<DiscountStudentRegisterStep1
							data={data}
							fncCallbackEvent={fncCallbackEvent}
						/>
					)
				}
			</div>
		</main>
	)
}


