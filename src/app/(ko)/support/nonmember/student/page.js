'use client'

import React, {useEffect, useLayoutEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {useRouter} from 'next/navigation';
import {useMutation} from "@tanstack/react-query";

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {useMoHeaderContext} from '@modules/context/MoHeaderContext';
import {RouteConfig} from '@modules/config/RouteConfig';
import {useScrollContext} from '@modules/context/ScrollContext';
import {fncMaskCardNo} from '@modules/utils/StringUtils';
import {useLoadingContext} from '@modules/context/LoadingContext';
import {usePopContext} from "@modules/context/PopContext";
import {CODE} from "@modules/consants/Objects";
import {apiViewDiscount} from "@/app/_actions/mypage.action";
import {useApi} from "@modules/services/useApi";
import {fncValiState, validate, VALIDATE_RULES} from "@modules/utils/ValidateUtils";
import {useUserContext} from "@modules/context/UserContext";

// components
import Breadcrumb from '@components/layout/Breadcrumb';
import InputText from '@components/common/InputText';
import Button from '@components/common/Button';
import TemplateQueryDiscountStudent from "@components/composite/TemplateQueryDiscountStudent";


/**
 * @description: (비회원) 청소년 연령초과 학생 할인 조회 화면 입니다.
 * @screenID:    UI-CRM-F267
 * @screenPath:  홈 > 고객센터 > 비회원 할인등록 > 청소년 연령초과 학생 할인 조회
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function SupportNonMemberStudentInquiry() {

	const router = useRouter();
	const {isMobile} = useScreenSizeContext();
	const {fncChangeMoHeader} = useMoHeaderContext();
	const {fncScrollToTop} = useScrollContext();
	const {fncShowPop, fncClosePop} = usePopContext();
	const {jsonApiAction} = useApi();
	const {fncRouteStart} = useLoadingContext();
	const {fncEncode, isLogin} = useUserContext();

	const [blockNext, setBlockNext] = useState(true);

	// 파라미터
	const [valid, setValid] = useState({});
	const [params, setParams] = useState({
		cardNoEncpt: '',
		custBrdt: '',
		custNm: '',
	});

	// 상세
	const [dscntDetail, setDscntDetail] = useState(null);

	// --Api
	// 조회
	const {mutate: mutQueryNonDiscountStudent} = useMutation({
		mutationKey: ['mutQueryNonDiscountStudent'],
		mutationFn: (payload) => jsonApiAction(apiViewDiscount, {
			...payload,
			dscntAplySe: CODE.DC_STUDENT,
			memberYn: 'N',
			__localHandle: true
		}),
		onSuccess: (res) => {
			if(res?.length > 0){
				setDscntDetail(res[0]);
			} else {
				fncShowPop({
					mainText: `등록된 정보가 없습니다.\n다시 입력해주세요.`,
					primaryText: '확인',
					onClickPrimary: () => fncClosePop(),
				});
			}
			if(!isMobile) fncScrollToTop();
		},
		onError: (error) => {
			fncShowPop({
				mainText: error.message,
				primaryText: '확인',
				onClickPrimary: () => fncClosePop(),
			})
		}
	})

	useLayoutEffect(() => {
		if(isMobile) {
			fncChangeMoHeader({
				type: 'back',
				title: '청소년 연령초과 학생 할인 조회'
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

	useEffect(() => {
		if(params.cardNoEncpt && params.custNm && params.custBrdt) {
			setBlockNext(false);
		} else {
			setBlockNext(true);
		}
	}, [
		params.cardNoEncpt,
		params.custNm,
		params.custBrdt,
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
		setParams({
			...params,
			[e.target.id]: e.target.value
		})
	}

	// 카드 조회
	const fncSearch = async () => {
		const rules = {
			cardNoEncpt: [
				{type: VALIDATE_RULES.NUMERIC},
				{type: VALIDATE_RULES.CARD_NO},
			],
			custNm: [
				{type: VALIDATE_RULES.ALPHA},
			],
			custBrdt: [
				{type: VALIDATE_RULES.NUMERIC},
				{type: VALIDATE_RULES.MIN_LENGTH, value: 8},
				{type: VALIDATE_RULES.MAX_LENGTH, value: 8},
			]
		}

		const res = validate(params, rules);
		if(Object.keys(res).length === 0) {
			const encoded = await fncEncode(params.cardNoEncpt);
			if(!encoded) return;
			mutQueryNonDiscountStudent({
				cardNoEncpt: encoded,
				custNm: params.custNm,
				custBrdt: params.custBrdt
			})
		} else {
			setValid(res);
			fncScrollToTop();
		}
	}

	// 이동: 이전페이지
	const fncGoBack = () => {
		router.back();
	}

	// 이동: 등록/수정
	const fncGoRegister = () => {
		const targetUri = `${RouteConfig.NONMEMBER_STUDENT_REGISTER.PATH}?no=${dscntDetail.cardNoEncpt}&name=${params.custNm}&brdt=${params.custBrdt}`;
		fncRouteStart(targetUri);
		router.replace(targetUri);
	}

	const fncHandlers = {
		goBack: fncGoBack,
		goRegister: fncGoRegister,
		changeInput: fncChangeInput,
		search: fncSearch
	}

	const fncCallbackEvent = (fncName, variable, payload = {}) => {
		const fnc = fncHandlers[fncName];
		if (typeof fnc === 'function') return fnc(variable, payload);
	}

	if (isMobile) return (
		<MoSupportNonMemberStudentInquiry
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...params,
				valid,
				blockNext,
				result: dscntDetail
			}}
		/>
	);
	else return (
		<DtSupportNonMemberStudentInquiry
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...params,
				valid,
				blockNext,
				result: dscntDetail
			}}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F267
 */
DtSupportNonMemberStudentInquiry.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function DtSupportNonMemberStudentInquiry({data, fncCallbackEvent}) {
	return (
		<main id={'support'} className={'body-wrap-618 discount-wrap'} aria-labelledby={'page-name-dt'}>
			<Breadcrumb addPaths={[]} />
			{
				data.result && Object.keys(data.result).length > 0 ? (
					<TemplateQueryDiscountStudent
						fncCallbackEvent={fncCallbackEvent}
						data={data.result}
					/>
				) : (
					<>
						<h1 id={'page-name-dt'} className={'page-title'}>
							청소년 연령초과 학생 할인 조회
						</h1>
						<h2 className={'page-sub-title'} aria-live={'polite'}>
							조회하실 청소년 연령초과 학생 정보를 입력해 주세요
						</h2>
						<div className={'flex flex-col gap-36'}>
							<InputText
								size={'lg'}
								fitWidth={true}
								title={'카드번호'}
								essential={true}
								placeholder={'0000-0000-0000-0000'}
								status={fncValiState('cardNoEncpt', data.valid)}
								message={fncValiState('cardNoEncpt', data.valid) === 'warning' && '카드번호를 다시 입력해주세요.'}
								id={'cardNoEncpt'}
								maxLength={19}
								value={fncMaskCardNo(data.cardNoEncpt)}
								onChange={(e) => fncCallbackEvent('changeInput', e)}
							/>
							<InputText
								size={'lg'}
								fitWidth={true}
								title={'이름'}
								essential={true}
								placeholder={'이름 입력'}
								status={fncValiState('custNm', data.valid)}
								message={fncValiState('custNm', data.valid) === 'warning' && '이름을 다시 입력해주세요.'}
								id={'custNm'}
								value={data.custNm}
								onChange={(e) => fncCallbackEvent('changeInput', e)}
							/>
							<InputText
								size={'lg'}
								fitWidth={true}
								title={'생년월일'}
								essential={true}
								placeholder={'YYYYMMDD'}
								status={fncValiState('custBrdt', data.valid)}
								message={fncValiState('custBrdt', data.valid) === 'warning' && '생년월일을 다시 입력해주세요.'}
								maxLength={8}
								id={'custBrdt'}
								value={data.custBrdt}
								onChange={(e) => fncCallbackEvent('changeInput', e)}
							/>
						</div>
						<div className={'page-bottom-button-wrap'}>
							<Button
								theme={'secondary'}
								size={'xl'}
								text={'취소'}
								ariaLabel={'취소'}
								customStyle={'w-[240px]'}
								onClick={() => fncCallbackEvent('goBack')}
							/>
							<Button
								theme={'primary'}
								size={'xl'}
								text={'조회'}
								ariaLabel={'조회'}
								customStyle={'w-[240px]'}
								disabled={data.blockNext}
								onClick={() => fncCallbackEvent('search')}
							/>
						</div>
					</>
				)
			}
		</main>
	)
}

/**
 * @description: Mobile
 * @screenID:    -
 */
MoSupportNonMemberStudentInquiry.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function MoSupportNonMemberStudentInquiry({data, fncCallbackEvent}) {
	return (
		<main id={'support'} className={'body-wrap-mobile-screen-height discount-wrap'} aria-labelledby={'page-name-mo'}>
			{
				data.result && Object.keys(data.result).length > 0 ? (
					<TemplateQueryDiscountStudent
						fncCallbackEvent={fncCallbackEvent}
						data={data.result}
					/>
				) : (
					<>
						<h1 id={'page-name-mo'} className={'sr-only'}>
							청소년 연령초과 학생 할인 조회
						</h1>
						<div className={'flex flex-col gap-30'}>
							<h1 id={'page-name-mo'} className={'page-title'}>
								{`조회하실 청소년 연령초과 학생\n정보를 입력해 주세요`}
							</h1>
							<InputText
								size={'md'}
								fitWidth={true}
								title={'카드번호'}
								essential={true}
								placeholder={'0000-0000-0000-0000'}
								status={fncValiState('cardNoEncpt', data.valid)}
								message={fncValiState('cardNoEncpt', data.valid) === 'warning' && '카드번호를 다시 입력해주세요.'}
								id={'cardNoEncpt'}
								maxLength={19}
								value={fncMaskCardNo(data.cardNoEncpt)}
								onChange={(e) => fncCallbackEvent('changeInput', e)}
							/>
							<InputText
								size={'md'}
								fitWidth={true}
								title={'이름'}
								essential={true}
								placeholder={'이름 입력'}
								status={fncValiState('custNm', data.valid)}
								message={fncValiState('custNm', data.valid) === 'warning' && '이름을 다시 입력해주세요.'}
								id={'custNm'}
								value={data.custNm}
								onChange={(e) => fncCallbackEvent('changeInput', e)}
							/>
							<InputText
								size={'md'}
								fitWidth={true}
								title={'생년월일'}
								essential={true}
								placeholder={'YYYYMMDD'}
								status={fncValiState('custBrdt', data.valid)}
								message={fncValiState('custBrdt', data.valid) === 'warning' && '생년월일을 다시 입력해주세요.'}
								maxLength={8}
								id={'custBrdt'}
								value={data.custBrdt}
								onChange={(e) => fncCallbackEvent('changeInput', e)}
							/>
						</div>
						<div className={'page-bottom-button-wrap'}>
							<Button
								theme={'secondary'}
								size={'lg'}
								text={'취소'}
								ariaLabel={'국가신분증 등록/수정 취소'}
								customStyle={'w-full'}
								onClick={() => fncCallbackEvent('goBack')}
							/>
							<Button
								theme={'primary'}
								size={'lg'}
								text={'조회'}
								ariaLabel={'조회'}
								customStyle={'w-full'}
								disabled={data.blockNext}
								onClick={() => fncCallbackEvent('search')}
							/>
						</div>
					</>
				)
			}
		</main>
	)
}


