'use client'

import React, {useLayoutEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {useRouter, usePathname} from 'next/navigation';
import {useMutation} from "@tanstack/react-query";
import Cookies from "js-cookie";

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {useMoHeaderContext} from '@modules/context/MoHeaderContext';
import {RouteConfig} from '@modules/config/RouteConfig';
import {useLoadingContext} from '@modules/context/LoadingContext';
import {useApi} from "@modules/services/useApi";
import {useScrollContext} from "@modules/context/ScrollContext";
import {apiFindUserID} from "@/app/_actions/user.action";
import {fncAllDefined, fncValiState, validate, VALIDATE_RULES} from "@modules/utils/ValidateUtils";
import {usePopContext} from "@modules/context/PopContext";
import {ageOptions} from "@modules/consants/Options";

// components
import Breadcrumb from '@components/layout/Breadcrumb';
import FindIdResult from '@/app/(ko)/find/id/components/FindIdResult';
import InputText from '@components/common/InputText';
import IdentityVerification from '@components/composite/IdentityVerification';
import Button from '@components/common/Button';


/**
 * @description: 아이디 찾기 화면 입니다.
 * @screenID:    UI-CRM-F205, UI-CRM-F414, UI-CRM-F415
 * @screenPath:  홈 > 아이디 찾기
 * @author
 * @since
 * @version
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
FindIdClient.propTypes = {
	clientVerifyId: PropTypes.string,
	identityParams: PropTypes.object
};
export default function FindIdClient({
	 clientVerifyId = ageOptions[1].id,
	 identityParams = {}
}) {

	const router = useRouter();
	const pathname = usePathname();
	const {isMobile} = useScreenSizeContext();
	const {fncChangeMoHeader} = useMoHeaderContext();
	const {fncScrollToTop} = useScrollContext();
	const {jsonApiAction} = useApi();
	const {fncRouteStart} = useLoadingContext();
	const {fncShowPop, fncClosePop} = usePopContext();
	const {fncSetLoading} = useLoadingContext();

	// 아이디 찾기 단계
	const [isResult, setIsResult] = useState({
		res: false,
		webMbrId: null,    // 웹회원 ID
		regYmd: null       // 가입일
	});

	// 다음 단계 이동 가능 여부
	const [blockNext, setBlockNext] = useState(true);
	
	// 파라미터
	const [valid, setValid] = useState({});
	const [params, setParams] = useState({
		custNm: '',              // 이름
		custIpnNo: '',           // 아이핀
		ipnDpcnJoinIdntyCn: '',  // 아이핀
		ipnLinkInfoCn: '',       // 아이핀
		ipnLinkVerVlCn: '',      // 아이핀
		rid: '',                 // PASS 본인 인증
		method: clientVerifyId,
		selectedMethod: ageOptions[0].id,
	})

	// --Api
	// 아이디 찾기
	const {mutate: mutFindID} = useMutation({
		mutationKey: ['mutFindID'],
		mutationFn: (payload) => jsonApiAction(apiFindUserID, {...payload, __localHandle: true}),
		onSuccess: (res) => {
			setIsResult({
				res: true,
				webMbrId: res?.webMbrId || null,
				regYmd: res?.regYmd || null
			});
		},
		onError: () => {
			setIsResult({
				res: true,
				webMbrId: null,
				regYmd: null
			});
		}
	})

	useLayoutEffect(() => {
		if(isMobile) {
			fncChangeMoHeader({
				type: 'back',
				title: '아이디 찾기'
			})
		}
	}, [isMobile])

	useLayoutEffect(() => {
		let defined;

		// pass
		if(params.method?.toUpperCase() === ageOptions[0].id) {
			defined = fncAllDefined([
				params.custNm,
				params.rid
			]);
		}

		// ipin
		if(params.method?.toUpperCase() === ageOptions[1].id) {
			defined = fncAllDefined([
				params.custNm,
				params.custIpnNo
			]);
		}

		setBlockNext (!defined);
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
						await Cookies.set('crm-verify', JSON.stringify({custNm: identityParams.custNm}), { expires: expireMM });
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
						ipnLinkInfoCn
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
						await Cookies.set('crm-verify', JSON.stringify({custNm: identityParams.custNm}), { expires: expireMM });
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

	// 입력
	const fncChangeInput = (e) => {
		setParams({
			...params,
			[e.target.id]: e.target.value
		})
	}

	// 업데이트
	const fncUpdateObj = (obj) => {
		setParams(prev => ({...prev, ...obj}))
	}

	// 아이디 찾기 실행
	const fndFindId = () => {
		const rules = {
			custNm: [
				{type: VALIDATE_RULES.ALPHA},
				{type: VALIDATE_RULES.MIN_LENGTH, value: 2},
			],
		}
		const res = validate(params, rules);
		if(Object.keys(res).length === 0) {
			mutFindID(params);
		} else {
			setValid(res);
			fncScrollToTop();
		}
	}

	// 이동: 비밀번호 찾기
	const fncGoFindPwd = () => {
		const targetUri = RouteConfig.FIND_PW.PATH;
		fncRouteStart(targetUri);
		router.push(targetUri);
	}

	// 이동: 로그인
	const fncGoLogin = () => {
		const targetUri = RouteConfig.LOGIN.PATH;
		fncRouteStart(targetUri);
		router.push(targetUri);
	}

	// 이동: 회원가입
	const fndGoJoin = () => {
		const targetUri = RouteConfig.JOIN.PATH;
		fncRouteStart(targetUri);
		router.push(targetUri);
	}

	const fncHandlers = {
		changeInput: fncChangeInput,
		updateObj: fncUpdateObj,
		findId: fndFindId,
		goFindPwd: fncGoFindPwd,
		goLogin: fncGoLogin,
		goJoin: fndGoJoin
	}

	const fncCallbackEvent = (fncName, variable, payload = {}) => {
		const fnc = fncHandlers[fncName];
		if (typeof fnc === 'function') return fnc(variable, payload);
	}

	if (isMobile) return (
		<MoFindId
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...params,
				isResult,
				valid,
				blockNext
			}}
		/>
	);
	else return (
		<DtFindId
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...params,
				isResult,
				valid,
				blockNext
			}}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F205
 */
DtFindId.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function DtFindId({data, fncCallbackEvent}) {
	return (
		<main id={'find'} className={'body-wrap-618'} aria-labelledby={'page-name-dt'}>
			<Breadcrumb addPaths={[]} />
			<div className={'page-bottom-space'}>
				{
					!data.isResult?.res && (
						<>
							<h1 id={'page-name-dt'} className={'page-title'}>
								아이디 찾기
							</h1>
							<p className={'page-sub-title'}>
								회원가입 시 등록한 정보를 입력해 주세요
							</p>
						</>
					)
				}
				{
					data.isResult?.res ? (
						<FindIdResult
							data={data.isResult}
							fncCallbackEvent={fncCallbackEvent}
						/>
					) : (
						<div className={'flex flex-col gap-36'}>
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
								disabled={data.rid || data.custIpnNo}
								onChange={(e) => fncCallbackEvent('changeInput', e)}
							/>
							<IdentityVerification
								type={ageOptions[1].id}
								disabled={data.rid || data.custIpnNo}
								store={{
									custNm: data.custNm,
									prvcMkusAgreYn: true
								}}
								hiddenTerm={true}
								essentialValues={[
									{key: 'custNm', label: '이름'}
								]}
								onUpdate={(obj) => fncCallbackEvent('updateObj', obj)}
							/>
						</div>
					)
				}
			</div>
			{
				!data.isResult?.res && (
					<div className={'flex justify-center'}>
						<Button
							theme={'primary'}
							size={'xl'}
							text={'아이디 찾기'}
							customStyle={'w-[240px]'}
							disabled={data.blockNext}
							onClick={() => fncCallbackEvent('findId')}
						/>
					</div>
				)
			}
		</main>
	)
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F414, UI-CRM-F415
 */
MoFindId.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function MoFindId({data, fncCallbackEvent}) {
	return (
		<main id={'find'} className={'body-wrap-mobile-screen-height'} aria-labelledby={'page-name-mo'}>
			<h1 id={'page-name-mo'} className={'sr-only'}>아이디 찾기</h1>
			<div className={'body-inner-wrap-mobile'}>
				{
					data.isResult?.res ? (
						<FindIdResult
							data={data.isResult}
							fncCallbackEvent={fncCallbackEvent}
						/>
					) : (
						<>
							<div className={'flex flex-col gap-40 page-bottom-space'}>
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
									disabled={data.rid || data.custIpnNo}
									onChange={(e) => fncCallbackEvent('changeInput', e)}
								/>
								<IdentityVerification
									type={ageOptions[1].id}
									disabled={data.rid || data.custIpnNo}
									store={{
										custNm: data.custNm,
										prvcMkusAgreYn: true
									}}
									hiddenTerm={true}
									essentialValues={[
										{key: 'custNm', label: '이름'}
									]}
									onUpdate={(obj) => fncCallbackEvent('updateObj', obj)}
								/>
							</div>
							<Button
								theme={'primary'}
								size={'lg'}
								text={'아이디 찾기'}
								customStyle={'w-full'}
								disabled={data.blockNext}
								onClick={() => fncCallbackEvent('findId')}
							/>
						</>
					)
				}
			</div>
		</main>
	)
}
