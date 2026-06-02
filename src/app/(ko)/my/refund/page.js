'use client'

import React, {useEffect, useLayoutEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {usePathname, useRouter} from 'next/navigation';
import {useMutation} from '@tanstack/react-query';
import {pdf} from '@react-pdf/renderer';

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {useMoHeaderContext} from '@modules/context/MoHeaderContext';
import {useScrollContext} from '@modules/context/ScrollContext';
import {RefundAndLostOptions} from '@modules/consants/Options';
import {RouteConfig} from '@modules/config/RouteConfig';
import {CODE} from '@modules/consants/Objects';
import {useLoadingContext} from '@modules/context/LoadingContext';
import {useWebContext} from '@modules/context/WebviewContext';
import {validate, VALIDATE_RULES} from '@modules/utils/ValidateUtils';
import {apiApplyRefund} from '@/app/_actions/mypage.action';
import {useApi} from '@modules/services/useApi';
import {usePopContext} from '@modules/context/PopContext';
import {useUserContext} from '@modules/context/UserContext';

// components
import Breadcrumb from '@components/layout/Breadcrumb';
import Segment from '@components/common/Segment';
import CardRefundStep1 from '@/app/(ko)/my/refund/components/CardRefundStep1';
import CardRefundStep2 from '@/app/(ko)/my/refund/components/CardRefundStep2';
import CardRefundStep3 from '@/app/(ko)/my/refund/components/CardRefundStep3';
import PDFEnvelope from '@components/composite/PDFEnvelope';
import PDFRefundForm from '@components/composite/PDFRefundForm';


/**
 * @description: 환불 신청 화면 입니다.
 * @screenID:    UI-CRM-F232 ~ UI-CRM-F235, UI-CRM-F467, UI-CRM-F469
 * @screenPath:  홈 > 마이페이지 > 환불신청
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function MyCardRefund() {

	const router = useRouter();
	const pathname = usePathname();
	const {isMobile} = useScreenSizeContext();
	const {isAccApp, reloadKey, backRNPath, fncFocusLayout, fncPostRN} = useWebContext()
	const {fncChangeMoHeader} = useMoHeaderContext();
	const {fncScrollToTop} = useScrollContext();
	const {jsonApiAction} = useApi();
	const {fncShowPop, fncClosePop, fncErrorPop} = usePopContext();
	const {userInfo, fncEncode} = useUserContext();
	const {fncRouteStart} = useLoadingContext();

	// 등록 순서
	const [step, setStep] = useState(0);

	// 선택된 카드 정보
	const [selectedCard, setSelectedCard] = useState({    
		cardNoEncpt: '',           // 카드번호
		cardNcknmNm: '',           // 카드 애칭
		blncSum: 0,                // 보유 금액
		cashSum: 0,                // 현금 환불 가능 금액
		mlgSum: 0,                 // 마일리지 복구 금액
		rfndFee: 0,                // 환불 수수료
		acmRfndAmt: 0,             // 연간 누적 환불 금액
		mypgCardSeCd: '',          // 환불카드 구분 코드(01모바일선불,02모바일후불,03일반,04대중교통안심)
	});
	
	// 파라미터
	const [valid, setValid] = useState({});
	const [params, setParams] = useState({
		// 모바일: 이름, 카드번호, 은행, 예금주, 계좌번호
		rqstrNm: '',    // 요청자명
		cardNoEncpt: '',                    // 카드번호암호화
		micBankCd: '',                      // 은행코드
		micBankNm: '',                      // 은행명
		bacntOwnrNm: '',                    // 계좌소유자명
		dpstActnoEncpt: '',                 // 입금계좌번호암호화

		// 실물 : 이름, 카드번호, 은행, 에금주, 계좌번호, 휴대폰번호, 주소, 환불 코드, 환불 약관
		rqstrTelno: '',                     // 요청자전화번호
		zoneCd: '',                         // 우편번호
		address1: '',                       // 주소
		address2: '',                       // 상세주소
		rfndDmndCd: '',                     // 환불요청코드(01:카드인식불가, 02:충전안됨, 03:외형 훼손/파손, 04:기타, 05: 안심카드)
		rfndDmndCn: '',                     // 기타 반환 사유(직접입력)
		refundTerms: false,                 // 약관
	})

	// --Api
	// 환불
	const {mutate: mutApplyRefund} = useMutation({
		mutationKey: ['mutApplyRefund'],
		mutationFn: (payload) => jsonApiAction(apiApplyRefund, {
			...payload,
			mobileYn: isAccApp ? 'Y' : 'N'
		}),
		onSuccess: (res) => {
			if(res > 0) {
				setStep(2);
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

	useLayoutEffect(() => {
		if (isAccApp) fncFocusLayout();
		if (isMobile) {
			fncChangeMoHeader({
				type: 'back',
				title: '환불신청'
			})
		}
	}, [isMobile, isAccApp, reloadKey])

	useEffect(() => {
		if(userInfo?.custNm) {
			setParams(prev => ({
				...prev,
				rqstrNm: userInfo?.custNm
			}))
		}
	}, [userInfo]);

	// 다음단계로 변경
	const fncNextStep = () => {
		let rules;

		if(!params.cardNoEncpt) {
			return fncShowPop({
				mainText: '환불할 카드를 선택해주세요.',
				primaryText: '확인',
				onClickPrimary: () => fncClosePop()
			})
		}

		switch (selectedCard?.mypgCardSeCd) {
			case CODE.CARD_SEG_MO_PRE:
			case  CODE.CARD_SEG_MO_POST:
				// 모바일카드
				rules = {
					rqstrNm: [
						{type: VALIDATE_RULES.ALPHA},
						{type: VALIDATE_RULES.MIN_LENGTH, value: 2},
						{type: VALIDATE_RULES.MAX_LENGTH, value: 10},
					],
					micBankCd: [
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
					]
				}
				break;
			case CODE.CARD_SEG_PLA_DEFAULT:
			case CODE.CARD_SEG_PLA_SAFE:
				// 실물카드
				rules = {
					rqstrNm: [
						{type: VALIDATE_RULES.ALPHA},
						{type: VALIDATE_RULES.MIN_LENGTH, value: 2},
						{type: VALIDATE_RULES.MAX_LENGTH, value: 10},
					],
					micBankCd: [
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
					],
					rfndDmndCd: [
						{type: VALIDATE_RULES.NUMERIC},
						{type: VALIDATE_RULES.MIN_LENGTH, value: 2},
						{type: VALIDATE_RULES.MAX_LENGTH, value: 2},
					],
					zoneCd: [
						{type: VALIDATE_RULES.NUMERIC},
						{type: VALIDATE_RULES.MIN_LENGTH, value: 5},
						{type: VALIDATE_RULES.MAX_LENGTH, value: 6},
					],
					address1: [
						{type: VALIDATE_RULES.BLANK},
					],
				}

				// 환불 사유가 '기타'인경우 상세 사유 입력 체크 추가
				if (params.rfndDmndCd === CODE.REFUND_CLAIM_ETC) {
					rules = {
						...rules,
						rfndDmndCn: [
							{type: VALIDATE_RULES.BLANK},
							{type: VALIDATE_RULES.MIN_LENGTH, value: 1},
							{type: VALIDATE_RULES.MAX_LENGTH, value: 200},
						]
					}
				}

				// 약관 동의
				if (!params.refundTerms) {
					fncShowPop({
						mainText: '반환을 위한 개인정보 수집 및 이용에 동의해주세요.',
						primaryText: '확인',
						onClickPrimary: () => fncClosePop()
					})
					return;
				}

				// 반환 사유 선택
				if (!params.rfndDmndCd || params.rfndDmndCd.length < 2) {
					fncShowPop({
						mainText: '반환사유를 선택해주세요.',
						primaryText: '확인',
						onClickPrimary: () => fncClosePop()
					})
					return;
				}
				break;
			default: return;
		}

		if(rules) {
			const res = validate(params, rules);
			if(Object.keys(res).length === 0) {
				if([CODE.CARD_SEG_MO_PRE, CODE.CARD_SEG_MO_POST].includes(selectedCard?.mypgCardSeCd)) {
					fncCallbackEvent('doRefund')
					setStep(step + 2);
				} else {
					setStep(step + 1);
				}
			} else {
				setValid(res);
			}

			fncScrollToTop();
		}
	}

	// 단계 초기화
	const fncInitStep = () => {
		setStep(0);
		fncScrollToTop();
	}

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
		});
	}

	// segment 클릭
	const fncChangeSegment = (id) => {
		const findSegInfo = RefundAndLostOptions.filter((el) => el.id === id)[0];
		const targetUri = findSegInfo?.url;
		fncRouteStart(targetUri);
		router.push(targetUri);
	}

	// 체크박스 선택
	const fncChangeCheckbox = (key, value) => {
		if(Object.keys(valid).length) fncDelValid(key);
		if(key === 'rfndDmndCd' && value !== CODE.REFUND_CLAIM_ETC) {
			setParams({
				...params,
				[key]: value,
				rfndDmndCn: ''
			});
		} else {
			setParams({...params, [key]: value});
		}
	}

	// 카드 선택
	const fncSelectCard = (option) => {
		if(Object.keys(valid).length) fncDelValid('cardNoEncpt');
		setSelectedCard(option);
		setParams({
			...params,
			cardNoEncpt: option.id,
		});
	}

	// 은행 선택
	const fncSelectBank = (option) => {
		if(Object.keys(valid).length) fncDelValid('micBankCd');
		setParams({
			...params,
			micBankCd: option.id,
			micBankNm: option.name
		});
	}

	// 주소 입력
	const fncChangeAddress = (post) => {
		if(Object.keys(valid).length) fncDelValid('zoneCd');
		setParams({
			...params,
			zoneCd: post.zonecode,
			address1: post.buildingName ? `${post.address} (${post.buildingName})` : post.address,
		})
	}

	// 환불신청
	const fncDoRefund = async () => {
		const encodedCardNo = await fncEncode(params.cardNoEncpt);
		const encodedAccount = await fncEncode(params.dpstActnoEncpt);
		if(!encodedCardNo || !encodedAccount) return;
		if([CODE.CARD_SEG_MO_PRE, CODE.CARD_SEG_MO_POST].includes(selectedCard?.mypgCardSeCd)) {
			// 앱카드
			mutApplyRefund({
				rqstrNm: params.rqstrNm,
				cardNoEncpt: encodedCardNo,
				micBankCd: params.micBankCd,
				micBankNm: params.micBankNm,
				bacntOwnrNm: params.bacntOwnrNm,
				dpstActnoEncpt: encodedAccount
			});
		} else {
			// 실물카드
			mutApplyRefund({
				rqstrNm: params.rqstrNm,
				cardNoEncpt: encodedCardNo,
				micBankCd: params.micBankCd,
				micBankNm: params.micBankNm,
				bacntOwnrNm: params.bacntOwnrNm,
				dpstActnoEncpt: encodedAccount,
				rqstrTelno: params.rqstrTelno,
				zoneCd: params.zoneCd,
				address1: params.address1,
				address2: params.address2,
				rfndDmndCd: params.rfndDmndCd,
				rfndDmndCn: params.rfndDmndCn,
			});
		}
	}

	// 신청서/봉투 다운로드
	const fncDownloadForm = async (type) => {
		let doc;
		let fileName;
		switch (type) {
			case 'envelope':
				doc = <PDFEnvelope form={params} />;
                fileName = '우편환불봉투';
				break;
			case 'apply':
                doc = <PDFRefundForm form={params} />;
                fileName = '환불신청서';
				break;
			default: return;
		}

		try {
			if (!doc || !fileName) return;

			const blob = await pdf(doc).toBlob();
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `${fileName}.pdf`;
			document.body.appendChild(a);
			a.click();
			a.remove();
			URL.revokeObjectURL(url);

		} finally {
		}
	}

	// 이동: 이전 페이지
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

	// 이동: 홈
	const fncGoHome = () => {
		const targetUri = RouteConfig.HOME.PATH;
		fncRouteStart(targetUri);
		router.replace(targetUri);
	}

	const fncHandlers = {
		nextStep: fncNextStep,
		initStep: fncInitStep,
		changeInput: fncChangeInput,
		changeSegment: fncChangeSegment,
		changeCheckbox: fncChangeCheckbox,
		changeAddress: fncChangeAddress,
		selectCard: fncSelectCard,
		selectBank: fncSelectBank,
		doRefund: fncDoRefund,
		downloadForm: fncDownloadForm,
		goBack: fncGoBack,
		goHome: fncGoHome
	}

	const fncCallbackEvent = (fncName, variable, payload = {}) => {
		const fnc = fncHandlers[fncName];
		if (typeof fnc === 'function') return fnc(variable, payload);
	}

	if (isMobile) return (
		<MoMyCardRefund
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...params,
				step,
				valid,
				selectedCard,
			}}/>
	);
	else return (
		<DtMyCardRefund
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...params,
				step,
				valid,
				selectedCard,
			}}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F232 ~ UI-CRM-F235
 */
DtMyCardRefund.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function DtMyCardRefund({data, fncCallbackEvent}) {
	const stepComponentMap = {
		0: (
			<CardRefundStep1
				data={data}
				fncCallbackEvent={fncCallbackEvent}
			/>
		),
		1: (
			<CardRefundStep2
				data={data}
				fncCallbackEvent={fncCallbackEvent}
			/>
		),
		2: (
			<CardRefundStep3
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
							환불신청
						</h1>
						<div className={'my-48'}>
							<Segment
								size={'lg'}
								options={RefundAndLostOptions}
								selectedValue={RefundAndLostOptions[0].id}
								fullSize={true}
								onChange={(id) => fncCallbackEvent('changeSegment', id)}
							/>
						</div>
					</>
				)
			}
			{stepComponentMap[data.step]}
		</main>
	)
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F467, UI-CRM-F469
 */
MoMyCardRefund.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function MoMyCardRefund({data, fncCallbackEvent}) {
	const stepComponentMap = {
		0: (
			<CardRefundStep1
				data={data}
				fncCallbackEvent={fncCallbackEvent}
			/>
		),
		1: (
			<CardRefundStep2
				data={data}
				fncCallbackEvent={fncCallbackEvent}
			/>
		),
		2: (
			<CardRefundStep3
				data={data}
				fncCallbackEvent={fncCallbackEvent}
			/>
		)
	}

	return (
		<main id={'my'} className={'body-wrap-mobile-screen-height'} aria-labelledby={'page-name-mo'}>
			<h1 id={'page-name-mo'} className={'sr-only'}>환불/분실신청</h1>
			<div className={'body-inner-wrap-mobile refund-wrap'}>
				{
					data.step < 2 && (
						<Segment
							size={'md'}
							options={RefundAndLostOptions}
							selectedValue={RefundAndLostOptions[0].id}
							fullSize={true}
							onChange={(id) => fncCallbackEvent('changeSegment', id)}
						/>
					)
				}
				{stepComponentMap[data.step]}
			</div>
		</main>
	)
}
