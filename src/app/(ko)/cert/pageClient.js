'use client'

import React, {useLayoutEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {useMutation} from '@tanstack/react-query';
import Cookies from "js-cookie";
import {usePathname, useRouter} from "next/navigation";

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {useMoHeaderContext} from '@modules/context/MoHeaderContext';
import {useApi} from '@modules/services/useApi';
import {usePopContext} from '@modules/context/PopContext';
import {apiUpdateCert} from '@/app/_actions/user.action';
import {useWebContext} from '@modules/context/WebviewContext';
import {fncAllDefined} from '@modules/utils/ValidateUtils';
import {useScrollContext} from '@modules/context/ScrollContext';
import {useLoadingContext} from "@modules/context/LoadingContext";
import {ageOptions} from "@modules/consants/Options";
import {RouteConfig} from "@modules/config/RouteConfig";

// components
import Breadcrumb from '@components/layout/Breadcrumb';
import CertStep2 from "@/app/(ko)/cert/components/CertStep2";
import CertStep1 from "@/app/(ko)/cert/components/CertStep1";

// const
const subTitlesByStep = {
	0: `레일플러스 서비스\n이용약관에 동의해주세요`,
	1: `레일플러스 이용을 위한\n본인 인증을 진행해 주세요`,
}


/**
 * @description: 본인인증 화면 입니다.
 * @screenID:    -
 * @screenPath:  홈 > 본인인증
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by S  Traffic co.,Ltd. All right reserved.
 */
CertClient.propTypes = {
	clientStep: PropTypes.number,
	clientVerifyId: PropTypes.string,
	identityParams: PropTypes.object
};
export default function CertClient({
	clientStep = 0,
	clientVerifyId = ageOptions[1].id,
	identityParams = {}
}) {
	
	const router = useRouter();
	const pathname = usePathname();
	const {isMobile} = useScreenSizeContext();
	const {isAccApp, reloadKey, fncFocusLayout, fncPostRN} = useWebContext();
	const {fncChangeMoHeader} = useMoHeaderContext();
	const {jsonApiAction} = useApi();
	const {fncScrollToTop} = useScrollContext();
	const {fncShowPop, fncClosePop, fncErrorPop} = usePopContext();
	const {fncSetLoading} = useLoadingContext();
	const {fncRouteStart} = useLoadingContext();

	// 스텝
	const [step, setStep] = useState(clientStep);

	// 다음 단계 가능 여부
	const [blockNext, setBlockNext] = useState(true);

	// 파라미터
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
		rid: '',
		method: clientVerifyId,
		selectedMethod: ageOptions[0].id,
	})

	// 본인인증
	const {mutate: mutCert} = useMutation({
		mutationKey: ['mutCert'],
		mutationFn: (payload) => jsonApiAction(apiUpdateCert, {
			...payload,
			__localHandle: true,
			mktgMkusAgreYn: payload.mktgMkusAgreYn ? 'Y' : 'N',
			smsSndngYn: payload.smsSndngYn ? 'Y' : 'N',
			emlSndngYn: payload.emlSndngYn ? 'Y' : 'N',
			pushSndngYn: payload.pushSndngYn ? 'Y' : 'N',
			srvcNotiRcptnAgreYn: payload.srvcNotiRcptnAgreYn ? 'Y' : 'N',
			prvcMkusAgreYn: payload.prvcMkusAgreYn ? 'Y' : 'N'
		}),
		onSuccess: (res) => {
			if(res?.res > 0) {
				if(isAccApp) {
					fncPostRN({
						id: 'WEB_SYNC_USER',
						payload: {
							jwt: res?.jwt,
							custId: res?.userInfo?.custId,
							custNm: res?.userInfo?.custNm,
							custBrdt: res?.userInfo?.custBrdt
						}
					});

					fncRouteStart(RouteConfig.APP_BLANK.PATH);
					router.replace(RouteConfig.APP_BLANK.PATH);

				} else {
					fncShowPop({
						mainText: `본인 인증이 완료되었습니다.\n레일플러스를 시작하세요!`,
						primaryText: '확인',
						onClickPrimary: () => {
							fncClosePop();

							const targetUri = RouteConfig.HOME.PATH;
							fncRouteStart(targetUri);
							router.replace(targetUri);
						}
					})
				}
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

	useLayoutEffect(() => {
		if (isAccApp) fncFocusLayout();
		if (isMobile) {
			fncChangeMoHeader({
				type: 'none',
				title: '서비스 이용동의'
			})
		}
	}, [isMobile, isAccApp, reloadKey])

	// 다음 단계 허용 체크
	useLayoutEffect(() => {
		let defined = true;

		 if(step === 1) {
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
		} else if(step === 0) {
			// 필수 약관 동의
			defined = fncAllDefined([
				params.terms01,
				params.terms02
			]);
		}

		setBlockNext(!defined);

	}, [params, step]);

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
		setStep(step + 1);
		fncScrollToTop();
	}

	// 약관 동의 업데이트
	const fncUpdateObj = (obj) => {
		setParams(prev => ({...prev, ...obj}))
	}

	// 회원가입
	const fncDoCert = async () => {
		const {
			terms01,
			terms02,
			terms04,
			terms05,
			status,
			...rest
		} = params;
		mutCert({
			...rest,
			mktgMkusAgreYn: params.mktgMkusAgreYn ? 'Y' : 'N',
			srvcNotiRcptnAgreYn: params.srvcNotiRcptnAgreYn ? 'Y' : 'N',
			prvcMkusAgreYn: params.prvcMkusAgreYn ? 'Y' : 'N',
			smsSndngYn: params.smsSndngYn ? 'Y' : 'N',
			emlSndngYn: params.emlSndngYn ? 'Y' : 'N',
			pushSndngYn: params.pushSndngYn ? 'Y' : 'N',
		});
	}

	const fncHandlers = {
		nextStep: fncNextStep,
		updateObj: fncUpdateObj,
		doCert: fncDoCert,
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
				step,
				blockNext,
			}}/>
	);
	else return (
		<DtJoin
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...params,
				step,
				blockNext,
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
			<CertStep2
				data={data}
				fncCallbackEvent={fncCallbackEvent}
			/>
		)
	}

	return (
		<main id={'join'} className={'body-wrap-618'} aria-labelledby={'page-name-dt'}>
			<Breadcrumb addPaths={[]} />
			<div>
				<h1 id={'page-name-dt'} className={'page-title'}>
					서비스 이용동의
				</h1>
				<p className={'page-sub-title'}>
					<span className={'highlight'}>{`Step${data.step + 1 || 0}.`}</span>
					<span>{subTitlesByStep[data.step] || '-'}</span>
				</p>
				{
					stepComponentMap[data.step] || (
						<CertStep1
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
			<CertStep2
				data={data}
				fncCallbackEvent={fncCallbackEvent}
			/>
		)
	}

	return (
		<main id={'join'} className={'body-wrap-mobile-screen-height'} aria-labelledby={'page-name-mo'}>
			<h1 id={'page-name-mo'} className={'sr-only'}>본인인증</h1>
			<p className={'page-title'} aria-hidden={true}>
				<span>{subTitlesByStep[data.step]}</span>
			</p>
			<div className={'body-inner-wrap-mobile'}>
				{
					stepComponentMap[data.step] || (
						<CertStep1
							data={data}
							fncCallbackEvent={fncCallbackEvent}
						/>
					)
				}
			</div>
		</main>
	)
}
