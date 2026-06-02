'use client'

import React, {useLayoutEffect, useState} from 'react';
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
import {useApi} from "@modules/services/useApi";
import {apiDelDiscountTeen, apiViewDiscount} from "@/app/_actions/mypage.action";
import {fncValiState, validate, VALIDATE_RULES} from "@modules/utils/ValidateUtils";
import {CODE} from "@modules/consants/Objects";
import {useUserContext} from "@modules/context/UserContext";

// components
import Breadcrumb from '@components/layout/Breadcrumb';
import InputText from '@components/common/InputText';
import Button from '@components/common/Button';
import TemplateQueryDiscountTeen from "@components/composite/TemplateQueryDiscountTeen";


/**
 * @description: (비회원) 국가신분증 조회 화면 입니다.
 * @screenID:    UI-CRM-F258
 * @screenPath:  홈 > 고객센터 > 비회원 할인등록 > 국가신분증 조회
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function SupportNonMemberTeenInquiry() {

	const router = useRouter();
	const {isMobile} = useScreenSizeContext();
	const {fncChangeMoHeader} = useMoHeaderContext();
	const {fncScrollToTop} = useScrollContext();
	const {fncShowPop, fncClosePop} = usePopContext();
	const {jsonApiAction} = useApi();
	const {fncRouteStart} = useLoadingContext();
	const {fncEncode, isLogin} = useUserContext();

	// 조회 파라미터
	const [valid, setValid] = useState({});
	const [params, setParams] = useState({
		dscntAplySe: CODE.DC_TEEN,   // 할인신청구분코드 (01국가신분증)
		cardNoEncpt: '',             // 카드번호
		custBrdt: '',                // 생년월일
	});

	// 상세
	const [dscntDetail, setDscntDetail] = useState(null);

	// --Api
	// 조회
	const {mutate: mutQueryNonDiscountTeen} = useMutation({
		mutationKey: ['mutQueryNonDiscountTeen'],
		mutationFn: (payload) => jsonApiAction(apiViewDiscount, {
			...payload,
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

	// 해지
	const {mutate: mutDelNonDiscountTeen} = useMutation({
		mutationKey: ['mutDelNonDiscountTeen'],
		mutationFn: (payload) => jsonApiAction(apiDelDiscountTeen, {
			...payload,
			memberYn: 'N',
			__localHandle: true
		}),
		onSuccess: (res) => {
			if(res > 0) {
				fncShowPop({
					mainText: '해지가 완료되었습니다.',
					primaryText: '해지',
					onClickPrimary: () => {
						fncClosePop();
						fncGoBack();
					},
				})
			} else {
				fncShowPop({
					mainText: '해지중 오류가 발생했습니다.',
					primaryText: '확인',
					onClickPrimary: () => fncClosePop()
				})
			}
		},
		onError: () => {
			fncShowPop({
				mainText: '해지중 오류가 발생했습니다.',
				primaryText: '확인',
				onClickPrimary: () => fncClosePop()
			})
		}
	})

	useLayoutEffect(() => {
		if(isMobile) {
			fncChangeMoHeader({
				type: 'back',
				title: '국가신분증 조회'
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
				{type: VALIDATE_RULES.CARD_NO},
				{type: VALIDATE_RULES.MIN_LENGTH, value: 16},
				{type: VALIDATE_RULES.MAX_LENGTH, value: 16},
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
			mutQueryNonDiscountTeen({
				dscntAplySe: params.dscntAplySe,
				cardNoEncpt: encoded,
				custBrdt: params.custBrdt
			})
		} else {
			setValid(res);
			fncScrollToTop();
		}
	}

	// 팝업 열기/닫기
	const fncShowDelCheckPop = () => {
		fncShowPop({
			mainText: '국가신분증 등록을 해지하시겠습니까?',
			description: '해지 시 할인 혜택이 사라집니다.',
			tertiaryText: '취소',
			onClickTertiary: () => fncClosePop(),
			warningText: '해지',
			onClickWarning: () => {
				fncClosePop();
				fncDeleteCard();
			},
		})
	}

	// 카드 해지
	const fncDeleteCard = async () => {
		if(!dscntDetail.cardNoEncpt || !dscntDetail.custBrdt) return;
		const encoded = await fncEncode(dscntDetail.cardNoEncpt);
		if(!encoded) return;
		mutDelNonDiscountTeen({
			cardNoEncpt: encoded,
			custBrdt: dscntDetail.custBrdt
		})
	}

	// 이동: 등록/수정
	const fncGoRegister = () => {
		const targetUri = `${RouteConfig.NONMEMBER_TEENAGER_REGISTER.PATH}?no=${dscntDetail.cardNoEncpt}`;
		fncRouteStart(targetUri);
		router.push(targetUri);
	}

	// 이동: 이전
	const fncGoBack = () => {
		router.back();
	}

	const fncHandlers = {
		goBack: fncGoBack,
		goRegister: fncGoRegister,
		changeInput: fncChangeInput,
		showDelCheckPop: fncShowDelCheckPop,
		search: fncSearch
	}

	const fncCallbackEvent = (fncName, variable, payload = {}) => {
		const fnc = fncHandlers[fncName];
		if (typeof fnc === 'function') return fnc(variable, payload);
	}

	if (isMobile) return (
		<MoSupportNonMemberTeenInquiry
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...params,
				valid,
				result: dscntDetail
			}}
		/>
	);
	else return (
		<DtSupportNonMemberTeenInquiry
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...params,
				valid,
				result: dscntDetail,
			}}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F258
 */
DtSupportNonMemberTeenInquiry.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function DtSupportNonMemberTeenInquiry({data, fncCallbackEvent}) {
	return (
		<main id={'support'} className={'body-wrap-618'} aria-labelledby={'page-name-dt'}>
			<Breadcrumb addPaths={[]} />
			{
				data.result && Object.keys(data.result).length > 0 ? (
					<TemplateQueryDiscountTeen
						fncCallbackEvent={fncCallbackEvent}
						data={data.result}
					/>
				) : (
					<>
						<h1 id={'page-name-dt'} className={'page-title'}>
							국가신분증 조회
						</h1>
						<h2 className={'page-sub-title'} aria-live={'polite'}>
							조회하실 국가신분증(청소년증) 정보를 입력해 주세요
						</h2>
						<div className={'flex flex-col gap-36'}>
							<InputText
								size={'lg'}
								fitWidth={true}
								title={'카드번호'}
								essential={true}
								placeholder={'0000-0000-0000-0000'}
								allows={['num']}
								maxLength={19}
								status={fncValiState('cardNoEncpt', data.valid)}
								message={fncValiState('cardNoEncpt', data.valid) === 'warning' && '카드번호를 다시 입력해주세요.'}
								id={'cardNoEncpt'}
								value={fncMaskCardNo(data.cardNoEncpt)}
								onChange={(e) => fncCallbackEvent('changeInput', e)}
							/>
							<InputText
								size={'lg'}
								fitWidth={true}
								title={'생년월일'}
								essential={true}
								placeholder={'YYYYMMDD'}
								allows={['num']}
								maxLength={8}
								status={fncValiState('custBrdt', data.valid)}
								message={fncValiState('custBrdt', data.valid) === 'warning' && '할인대상이 아닙니다. 생년월일을 다시 입력해주세요.'}
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
								disabled={false}
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
MoSupportNonMemberTeenInquiry.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function MoSupportNonMemberTeenInquiry({data, fncCallbackEvent}) {
	return (
		<main id={'support'} className={'body-wrap-mobile-screen-height'} aria-labelledby={'page-name-mo'}>
			{
				data.result && Object.keys(data.result).length > 0 ? (
					<TemplateQueryDiscountTeen
						fncCallbackEvent={fncCallbackEvent}
						data={data.result}
					/>
				) : (
					<>
						<h1 id={'page-name-mo'} className={'sr-only'}>
							국가신분증 조회
						</h1>
						<div className={'flex flex-col gap-30'}>
							<h1 id={'page-name-mo'} className={'page-title'}>
								{`조회하실 국가신분증(청소년증)\n정보를 입력해 주세요`}
							</h1>
							<InputText
								size={'md'}
								fitWidth={true}
								title={'카드번호'}
								essential={true}
								placeholder={'0000-0000-0000-0000'}
								allows={['num']}
								maxLength={19}
								status={fncValiState('cardNoEncpt', data.valid)}
								message={fncValiState('cardNoEncpt', data.valid) === 'warning' && '카드번호를 다시 입력해주세요.'}
								id={'cardNoEncpt'}
								value={fncMaskCardNo(data.cardNoEncpt)}
								onChange={(e) => fncCallbackEvent('changeInput', e)}
							/>
							<InputText
								size={'md'}
								fitWidth={true}
								title={'생년월일'}
								essential={true}
								placeholder={'YYYYMMDD'}
								allows={['num']}
								maxLength={8}
								status={fncValiState('custBrdt', data.valid)}
								message={fncValiState('custBrdt', data.valid) === 'warning' && '할인대상이 아닙니다. 생년월일을 다시 입력해주세요.'}
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
								ariaLabel={'취소'}
								customStyle={'w-full'}
								onClick={() => fncCallbackEvent('goBack')}
							/>
							<Button
								theme={'primary'}
								size={'lg'}
								text={'조회'}
								ariaLabel={'조회'}
								customStyle={'w-full'}
								disabled={false}
								onClick={() => fncCallbackEvent('search')}
							/>
						</div>
					</>
				)
			}
		</main>
	)
}


