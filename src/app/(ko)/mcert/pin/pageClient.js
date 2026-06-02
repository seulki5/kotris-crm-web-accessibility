'use client'

import React, {useLayoutEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {useMutation} from '@tanstack/react-query';
import Cookies from "js-cookie";
import {usePathname, useRouter, useSearchParams} from "next/navigation";

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {useMoHeaderContext} from '@modules/context/MoHeaderContext';
import {useApi} from '@modules/services/useApi';
import {usePopContext} from '@modules/context/PopContext';
import {apiMobileCert, apiUpdateCert} from '@/app/_actions/user.action';
import {useWebContext} from '@modules/context/WebviewContext';
import {fncAllDefined} from '@modules/utils/ValidateUtils';
import {useLoadingContext} from "@modules/context/LoadingContext";
import {ageOptions} from "@modules/consants/Options";
import {RouteConfig} from "@modules/config/RouteConfig";

// components
import {DtNotFound} from "@/app/not-found";
import RadioArray from "@components/composite/RaidoArray";
import IdentityVerification from "@components/composite/IdentityVerification";
import Button from "@components/common/Button";


/**
 * @description: 앱 본인인증 화면 입니다.
 * @screenID:    -
 * @screenPath:  -
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by S  Traffic co.,Ltd. All right reserved.
 */
MobilePinCertClient.propTypes = {
	clientStep: PropTypes.number,
	clientVerifyId: PropTypes.string,
	identityParams: PropTypes.object
};
export default function MobilePinCertClient({
	clientVerifyId = ageOptions[1].id,
	identityParams = {}
}) {
	
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const webMbrId = searchParams.get('webMbrId');
	const {isMobile} = useScreenSizeContext();
	const {isAccApp, reloadKey, fncFocusLayout, fncPostRN} = useWebContext();
	const {fncChangeMoHeader} = useMoHeaderContext();
	const {jsonApiAction} = useApi();
	const {fncShowPop, fncClosePop, fncErrorPop} = usePopContext();
	const {fncSetLoading} = useLoadingContext();
	const {fncRouteStart} = useLoadingContext();

	// 다음 단계 가능 여부
	const [blockNext, setBlockNext] = useState(true);

	// 파라미터
	const [params, setParams] = useState({
		prvcMkusAgreYn: false,      // 개인정보 수집 및 이용에 관한 동의(아이핀)
		rid: '',
		method: clientVerifyId,
		selectedMethod: ageOptions[0].id,
		webMbrId: webMbrId,
	})

	// 본인인증
	const {mutate: mutCheckMobileCert} = useMutation({
		mutationKey: ['mutCheckMobileCert'],
		mutationFn: (payload) => jsonApiAction(apiMobileCert, {
			...payload,
			__localHandle: true,
			prvcMkusAgreYn: payload.prvcMkusAgreYn ? 'Y' : 'N'
		}),
		onSuccess: (res) => {
			if(res?.resYn === 'Y') {
				const targetUri = `${RouteConfig.APP_PAD.PATH}?boardName=PIN&boardType=RESET&boardStep=0`;
				fncRouteStart(targetUri);
				router.replace(targetUri);
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
				title: '본인인증'
			})
		}
	}, [isMobile, isAccApp, reloadKey])

	// 다음 단계 허용 체크
	useLayoutEffect(() => {
		let defined = false;

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
		}

		setBlockNext(!defined);

	}, [params]);

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

	// 약관 동의 업데이트
	const fncUpdateObj = (obj) => {
		setParams(prev => ({...prev, ...obj}))
	}

	// 회원가입
	const fncDoCert = async () => {
		const {status, ...rest} = params;
		mutCheckMobileCert({
			...rest,
			prvcMkusAgreYn: params.prvcMkusAgreYn ? 'Y' : 'N',
		});
	}

	const fncHandlers = {
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
				webMbrId,
				blockNext,
			}}/>
	);
	else return (
		<DtNotFound />
	);
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

	// 나이 구분
	const [ageType, setAgeType] = useState(ageOptions[0].id);

	// 초기화
	useLayoutEffect(() => {
		fncCallbackEvent('updateObj', {prvcMkusAgreYn: false})
		data?.selectedMethod && setAgeType(data?.selectedMethod);
	}, [data?.selectedMethod]);

	// 본인인증 진행방식 변경
	const fncChangeAgeType = (type) => {
		setAgeType(type);
	}

	return (
		<main id={'join'} className={'body-wrap-mobile-screen-height'} aria-labelledby={'page-name-mo'} style={{minHeight: '100%', flexGrow: 1}}>
			<h1 id={'page-name-mo'} className={'sr-only'}>본인인증</h1>
			<p className={'page-title'} aria-hidden={true}>
				<span>{`본인 인증을 진행해 주세요`}</span>
			</p>
			<div className={'body-inner-wrap-mobile'}>
				<div className={'flex flex-col mt-40 page-bottom-space'}
					 style={{gap: ageType === ageOptions[1].id ? 10 : 40}}>
					<RadioArray
						options={ageOptions}
						value={ageType}
						disabled={data.rid || data.custIpnNo}
						onChange={fncChangeAgeType}
					/>
					<IdentityVerification
						value={ageType}
						disabled={data.rid || data.custIpnNo}
						store={{
							webMbrId: data.webMbrId
						}}
						onUpdate={(obj) => fncCallbackEvent('updateObj', obj)}
					/>
				</div>
				<div className={'page-bottom-button-wrap'}>
					<Button
						theme={'primary'}
						size={'lg'}
						text={'다음'}
						customStyle={'w-full'}
						disabled={data.blockNext}
						onClick={() => fncCallbackEvent('doCert')}
					/>
				</div>
			</div>
		</main>
	)
}
