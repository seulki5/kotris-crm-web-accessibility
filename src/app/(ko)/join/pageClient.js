'use client'

import React, {useEffect, useLayoutEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {useMutation} from '@tanstack/react-query';
import Cookies from "js-cookie";
import {usePathname, useRouter} from "next/navigation";

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {useMoHeaderContext} from '@modules/context/MoHeaderContext';
import {useApi} from '@modules/services/useApi';
import {usePopContext} from '@modules/context/PopContext';
import {apiDuplicateUser, apiJoinUser} from '@/app/_actions/user.action';
import {useWebContext} from '@modules/context/WebviewContext';
import {fncAllDefined, validate, VALIDATE_RULES} from '@modules/utils/ValidateUtils';
import {useScrollContext} from '@modules/context/ScrollContext';
import {useLoadingContext} from "@modules/context/LoadingContext";
import {useUserContext} from "@modules/context/UserContext";
import {ageOptions} from "@modules/consants/Options";

// components
import Breadcrumb from '@components/layout/Breadcrumb';
import JoinStep1 from '@/app/(ko)/join/components/JoinStep1';
import JoinStep2 from '@/app/(ko)/join/components/JoinStep2';
import JoinStep3 from '@/app/(ko)/join/components/JoinStep3';
import JoinStep4 from '@/app/(ko)/join/components/JoinStep4';

// const
const subTitlesByStep = {
	0: `레일플러스 서비스\n이용약관에 동의해주세요`,
	1: '회원가입을 위한\n본인 인증을 진행해 주세요',
	2: '정보를 입력해 주세요'
}


/**
 * @description: 회원가입 화면 입니다.
 * @screenID:    UI-CRM-F201 ~ UI-CRM-F204, UI-CRM-F408 ~ UI-CRM-F413
 * @screenPath:  홈 > 회원가입
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by S  Traffic co.,Ltd. All right reserved.
 */
JoinClient.propTypes = {
	clientStep: PropTypes.number,
	clientVerifyId: PropTypes.string,
	identityParams: PropTypes.object
};
export default function JoinClient({
	clientStep = 0,
	clientVerifyId = ageOptions[1].id,
	identityParams = {}
}) {

	const router = useRouter();
	const pathname = usePathname();
	const {isMobile} = useScreenSizeContext();
	const {isAccApp, reloadKey, fncFocusLayout} = useWebContext();
	const {fncChangeMoHeader} = useMoHeaderContext();
	const {jsonApiAction} = useApi();
	const {fncScrollToTop} = useScrollContext();
	const {fncShowPop, fncClosePop, fncErrorPop} = usePopContext();
	const {fncSetLoading} = useLoadingContext();
	const {fncEncode} = useUserContext();

	// 스텝
	const [joinStep, setJoinStep] = useState(clientStep);

	// 다음 단계 가능 여부
	const [blockNext, setBlockNext] = useState(true);

	// 아이디 중복 체크 여부
	const [dupleId, setDupleId] = useState(false);

	// 파라미터
	const [valid, setValid] = useState({});
	const [params, setParams] = useState({
		terms01: false,             // 이용약관
		terms02: false,             // 개인정보 수집 및 이용에 관한 동의(필수)
		mktgMkusAgreYn: false,      // 마케팅 활용 동의 여부
		terms04: false,             // 광고성 정보 수신 동의
		terms05: false,             // 서비스 및 마케팅 정보 수신 동의(app)
		srvcNotiRcptnAgreYn: false, // 서비스 알림 수신 동의(app)
		prvcMkusAgreYn: false,      // 개인정보 수집 및 이용에 관한 동의(아이핀)
		smsSndngYn: false,          // SMS 발송여부
		emlSndngYn: false,          // 이메일 발송여부
		pushSndngYn: false,         // 푸시 발송여부
		webMbrId: '',               // 아이디
		webMbrPswdEncpt: '',        // 비밀번호
		reWebMbrPswdEncpt: '',      // 비밀번호 확인
		emlAddr: '',                // 이메일
		mvmnComCoSeCd: '',          // 이동통신사 구분 코드
		mblTelno: '',               // 휴대폰번호
		custNm: '',                 // 고객명
		custBrdt: '',               // 생년월일
		rid: '',                    // PASS 본인 인증
		method: clientVerifyId,
		selectedMethod: ageOptions[0].id,
	})

	//-- Api
	// 아이디 중복 체크
	const {mutate: mutCheckDuplicate} = useMutation({
		mutationKey: ['checkDuplicate'],
		mutationFn: (payload) => jsonApiAction(apiDuplicateUser, payload),
		onSuccess: (res) => {
			if(res?.result === 'Y') {
				fncShowPop({
					mainText: `${params.webMbrId}\n사용가능한 아이디 입니다.`,
					primaryText: '확인',
					onClickPrimary: () => fncClosePop()
				});
				setDupleId(true);
			} else {
				setDupleId(false);
				fncShowPop({
					mainText: `중복된 아이디 입니다.\n다른 아이디를 입력해주세요.`,
					primaryText: '확인',
					onClickPrimary: () => fncClosePop()
				})
			}
		}
	})

	// 회원가입
	const {mutate: mutJoin} = useMutation({
		mutationKey: ['mutJoin'],
		mutationFn: (payload) => jsonApiAction(apiJoinUser, {
			...payload,
			__localHandle: true
		}),
		onSuccess: (res) => {
			if(res?.custId) fncNextStep();
			else fncShowPop({
				mainText: '오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
				primaryText: '확인',
				onClickPrimary: () => fncClosePop(),
			});
		},
		onError: (error) => {
			console.log('error : ', error)
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
				title: '회원가입'
			})
		}
	}, [isMobile, isAccApp, reloadKey])

	useEffect(() => {
		window.history.pushState(null, '', window.location.href);
		const handlePopState = () => {
			switch (joinStep) {
				case 1:
					setJoinStep(0);
                    setParams(prev => ({
                        ...prev,
                        terms01: false,
                        terms02: false,
                        mktgMkusAgreYn: false,
                        terms04: false,
                        terms05: false,
                        srvcNotiRcptnAgreYn: false,
                        prvcMkusAgreYn: false,
                        smsSndngYn: false,
                        emlSndngYn: false,
                        pushSndngYn: false,
                        webMbrId: '',
                        webMbrPswdEncpt: '',
                        reWebMbrPswdEncpt: '',
                        emlAddr: '',
                        mvmnComCoSeCd: '',
                        mblTelno: '',
                        custNm: '',
                        custBrdt: '',
                        rid: '',
                        method: ageOptions[1].id,
                        selectedMethod: ageOptions[0].id
                    }))
					window.history.pushState(null, '' , window.location.href)
					break;
				case 2:
					setJoinStep(1);
					setParams(prev => ({
						...prev,
						webMbrId: '',
						webMbrPswdEncpt: '',
                        reWebMbrPswdEncpt: '',
                        mvmnComCoSeCd: '',
                        mblTelno: '',
                        emlAddr: '',
                        custNm: '',
                        custBrdt: '',
                        rid: '',
                        method: ageOptions[1].id,
                        selectedMethod: ageOptions[0].id
					}))
					window.history.pushState(null, '' , window.location.href)
					break;
				case 3:
					window.history.pushState(null, '' , window.location.href)
					break;
				case 0:
				default: return;
			}
		}

		 window.addEventListener('popstate', handlePopState)

		return () => {
			window.removeEventListener('popstate', handlePopState)
		}

	}, [joinStep]);

	// 다음 단계 허용 체크
	useLayoutEffect(() => {
		let defined = true;

		if(joinStep === 2) {
			defined = fncAllDefined([
				params.webMbrId,
				params.webMbrPswdEncpt,
				params.reWebMbrPswdEncpt,
				params.emlAddr,
				params.mvmnComCoSeCd,
				params.mblTelno,
			]);

			if(!dupleId) defined = false;
		} else if(joinStep === 1) {
			// 본인인증
			if(params.method === ageOptions[0].id) {
				defined = fncAllDefined([
					params.rid,
				]);
			} else if(params.method === ageOptions[1].id) {
				defined = fncAllDefined([
					params.custIpnNo,
					params.ipnDpcnJoinIdntyCn,
					params.ipnLinkVerVlCn,
					params.ipnLinkInfoCn,
				]);
			} else {
				defined = false;
			}
		} else if(joinStep === 0) {
			// 필수 약관 동의
			defined = fncAllDefined([
				params.terms01,
				params.terms02
			]);
		}

		setBlockNext(!defined);

	}, [params, dupleId, joinStep]);

	// 본인 인증
	useLayoutEffect(() => {
		if(!isMobile) return;

		fncSetLoading(true)

		const cookie = Cookies.get('crm-verify');
		const stored = cookie ? JSON.parse(cookie) : {};
		const method = stored?.method || '';
		const expireMM = new Date(Date.now() + 10 * 60 * 1000);

		if(Object.keys(stored).length < 1 || !method) {
			fncSetLoading(false);
			return Cookies.remove('crm-verify');
		} else {
			setParams(prev => ({
				...prev,
				...stored,
				terms01: true,
				terms02: true,
			}));
		}

		const status = identityParams?.status;

		if([ageOptions[0].id.toUpperCase(), ageOptions[0].id.toLowerCase()].includes(identityParams.type)) {
			const rid = identityParams?.rid;
			if(status === 'success' && rid) {
				setTimeout(() => {
					setParams(prev => ({
						...prev,
						rid,
					}))
					fncSetLoading(false);
					Cookies.remove('crm-verify');
				}, 1000)

			} else if(status === 'fail') {
				fncSetLoading(false);
				fncShowPop({
					mainText: identityParams?.message || '본인인증에 실패했습니다.',
					primaryText: '확인',
					onClickPrimary: async () => {
						fncClosePop();
						const {method, selectedMethod, ...rest} = stored;
						await Cookies.set('crm-verify', JSON.stringify({...rest}), { expires: expireMM });
						router.replace(pathname);
					}
				})
			} else {
				fncSetLoading(false);
				Cookies.remove('crm-verify');
			}
		}

		if([ageOptions[1].id.toUpperCase(), ageOptions[1].id.toLowerCase()].includes(identityParams.type)) {
			const custIpnNo = identityParams?.custIpnNo;
			const ipnDpcnJoinIdntyCn = identityParams?.ipnDpcnJoinIdntyCn;
			const ipnLinkVerVlCn = identityParams?.ipnLinkVerVlCn;
			const ipnLinkInfoCn = identityParams?.ipnLinkInfoCn;

			if(
				status === 'success' &&
				custIpnNo &&
				ipnDpcnJoinIdntyCn &&
				ipnLinkVerVlCn &&
				ipnLinkInfoCn
			) {
				setTimeout(() => {
					setParams(prev => ({
						...prev,
						custIpnNo,
						ipnDpcnJoinIdntyCn,
						ipnLinkVerVlCn,
						ipnLinkInfoCn,
						prvcMkusAgreYn: 'Y'
					}))
					fncSetLoading(false);
					Cookies.remove('crm-verify');
				}, 1000)

			} else if(status === 'fail') {
				fncSetLoading(false);
				fncShowPop({
					mainText: identityParams?.message || '본인인증에 실패했습니다.',
					primaryText: '확인',
					onClickPrimary: async () => {
						fncClosePop();
						const {method, selectedMethod, ...rest} = stored;
						await Cookies.set('crm-verify', JSON.stringify({...rest}), { expires: expireMM });
						router.replace(pathname);
					}
				})
			} else {
				fncSetLoading(false);
				Cookies.remove('crm-verify');
			}
		}

		return () => cookie && Cookies.remove('crm-verify');

	}, [identityParams]);

	// 다음 단계로 이동
	const fncNextStep = () => {
		// 모바일: 마지막 단계일 경우엔 헤더 없음
		if(isMobile && (joinStep + 1 > 3)) {
			fncChangeMoHeader({
				type: 'none',
				title: ''
			})
		}

		setJoinStep(joinStep + 1);
		fncScrollToTop();
	}

	// 약관 동의 업데이트
	const fncUpdateObj = (obj) => {
		setParams(prev => ({...prev, ...obj}))
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
		if(Object.keys(valid).length > 0) fncDelValid(e.target.id);
		setParams({
			...params,
			[e.target.id]: e.target.value
		});

		if(e.target.id === 'webMbrId') setDupleId(false);
	}

	// ID 중복체크
	const fncCheckDupleId = () => {
		if(!params.webMbrId) return;
		const rules = {
			webMbrId: [
				{type: VALIDATE_RULES.NUMERIC_AND_ALPHA},
				{type: VALIDATE_RULES.MIN_LENGTH, value: 6},
				{type: VALIDATE_RULES.MAX_LENGTH, value: 12},
			]
		}

		let res = validate(params, rules);
		if(Object.keys(res).length === 0) {
			mutCheckDuplicate({webMbrId: params.webMbrId});
		} else {
			setValid(res);
			fncScrollToTop();
		}
	}

	// 회원가입
	const fncDoJoin = async () => {
		if(!dupleId) {
			return fncShowPop({
				mainText: '아이디 중복 확인을 해주세요.',
				primaryText: '확인',
				onClickPrimary: () => fncClosePop()
			})
		}

		const rules = {
			webMbrId: [
				{type: VALIDATE_RULES.NUMERIC_AND_ALPHA},
			],
			webMbrPswdEncpt: [
				{type: VALIDATE_RULES.PASSWORD},
				{type: VALIDATE_RULES.MIN_LENGTH, value: 9},
				{type: VALIDATE_RULES.MAX_LENGTH, value: 20},
			],
			mvmnComCoSeCd: [
				{type: VALIDATE_RULES.MIN_LENGTH, value: 2},
				{type: VALIDATE_RULES.MAX_LENGTH, value: 2},
			],
			mblTelno: [
				{type: VALIDATE_RULES.PHONE},
				{type: VALIDATE_RULES.MIN_LENGTH, value: 11},
				{type: VALIDATE_RULES.MAX_LENGTH, value: 11},
			],
			emlAddr: [
				{type: VALIDATE_RULES.EMAIL},
			]
		}

		let res = validate(params, rules);

		// 비밀번호 확인
		if(params.webMbrPswdEncpt !== params.reWebMbrPswdEncpt) {
			res['reWebMbrPswdEncpt'] = '비밀번호가 일치하지 않습니다.'
		}

		// 통신사 코드 확인
		if(res['mvmnComCoSeCd']) {
			return fncShowPop({
				mainText: '통신사를 선택해주세요.',
				primaryText: '확인',
				onClickPrimary: () => fncClosePop()
			})
		}

		if(Object.keys(res).length === 0) {
			const {
				terms01,
				terms02,
				terms04,
				terms05,
				status,
				webMbrPswdEncpt,
				reWebMbrPswdEncpt,
				...rest
			} = params;
			const encodedPwd = await fncEncode(params.webMbrPswdEncpt);
			if(!encodedPwd) return;
			mutJoin({
				...rest,
				webMbrPswdEncpt: encodedPwd,
				mktgMkusAgreYn: params.mktgMkusAgreYn === true ? 'Y' : 'N',
				srvcNotiRcptnAgreYn: params.srvcNotiRcptnAgreYn === true ? 'Y' : 'N',
				prvcMkusAgreYn: params.prvcMkusAgreYn === true ? 'Y' : 'N',
				smsSndngYn: params.smsSndngYn === true ? 'Y' : 'N',
				emlSndngYn: params.emlSndngYn === true ? 'Y' : 'N',
				pushSndngYn: params.pushSndngYn === true ? 'Y' : 'N',
			});
		} else {
			setValid(res);
			fncScrollToTop();
		}
	}

	const fncHandlers = {
		nextStep: fncNextStep,
		updateObj: fncUpdateObj,
		changeInput: fncChangeInput,
		checkDupleId: fncCheckDupleId,
		doJoin: fncDoJoin,
	}

	const fncCallbackEvent = (fncName, payload = {}) => {
		const fnc = fncHandlers[fncName];
		if (typeof fnc === 'function') return fnc(payload);
	}

	if (isMobile) return (
		<MoJoin
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...params,
				joinStep,
				valid,
				blockNext,
				dupleId
			}}/>
	);
	else return (
		<DtJoin
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...params,
				joinStep,
				valid,
				blockNext,
				dupleId
			}}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F201 ~ UI-CRM-F204
 */
DtJoin.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function DtJoin({data, fncCallbackEvent}) {

	const stepComponentMap = {
		1: (
			<JoinStep2
				data={data}
				fncCallbackEvent={fncCallbackEvent}
			/>
		),
		2: (
			<JoinStep3
				data={data}
				fncCallbackEvent={fncCallbackEvent}
			/>
		),
		3: (
			<JoinStep4 data={data} />
		)
	}

	return (
		<main id={'join'} className={'body-wrap-618'} aria-labelledby={'page-name-dt'}>
			<Breadcrumb addPaths={[]} />
			<div>
				{
					data.joinStep < 3 && (
						<>
							<h1 id={'page-name-dt'} className={'page-title'}>
								회원가입
							</h1>
							<h2 className={'page-sub-title'}>
								<span className={'highlight'}>{`Step${data.joinStep + 1 || 0}.`}</span>
								<span>{subTitlesByStep[data.joinStep] || '-'}</span>
							</h2>
						</>
					)
				}
				{
					stepComponentMap[data.joinStep] || (
						<JoinStep1
							data={data}
							fncCallbackEvent={fncCallbackEvent}
						/>
					)
				}
			</div>
		</main>
	)
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F408 ~ UI-CRM-F413
 */
MoJoin.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function MoJoin({data, fncCallbackEvent}) {

	const stepComponentMap = {
		1: (
			<JoinStep2
				data={data}
				fncCallbackEvent={fncCallbackEvent}
			/>
		),
		2: (
			<JoinStep3
				data={data}
				fncCallbackEvent={fncCallbackEvent}
			/>
		),
		3: (
			<JoinStep4 data={data} />
		)
	}

	return (
		<main id={'join'} className={'body-wrap-mobile-screen-height'}>
			<h2 className={'page-title'}>
				<span>{subTitlesByStep[data.joinStep]}</span>
			</h2>
			<div className={'body-inner-wrap-mobile'}>
				{
					stepComponentMap[data.joinStep] || (
						<JoinStep1
							data={data}
							fncCallbackEvent={fncCallbackEvent}
						/>
					)
				}
			</div>
		</main>
	)
}
