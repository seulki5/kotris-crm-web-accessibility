'use client'

import React, {useLayoutEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {usePathname, useRouter} from 'next/navigation';
import {useMutation} from '@tanstack/react-query';
import Cookies from "js-cookie";

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {useMoHeaderContext} from '@modules/context/MoHeaderContext';
import {RouteConfig} from '@modules/config/RouteConfig';
import {useLoadingContext} from '@modules/context/LoadingContext';
import {fncAllDefined, fncValiState, validate, VALIDATE_RULES} from '@modules/utils/ValidateUtils';
import {useScrollContext} from '@modules/context/ScrollContext';
import {useApi} from '@modules/services/useApi';
import {ageOptions, FindPWOptions} from '@modules/consants/Options';
import {apiFindUserPW} from '@/app/_actions/user.action';
import {usePopContext} from "@modules/context/PopContext";

// components
import Breadcrumb from '@components/layout/Breadcrumb';
import FindPwResult from '@/app/(ko)/find/pw/components/FindPwResult';
import InputText from '@components/common/InputText';
import IdentityVerification from '@components/composite/IdentityVerification';
import Button from '@components/common/Button';
import Radio from '@components/common/Radio';
import Segment from '@components/common/Segment';


/**
 * @description: 비밀번호 찾기 화면 입니다.
 * @screenID:    UI-CRM-F206, UI-CRM-F207, UI-CRM-F416, UI-CRM-F417
 * @screenPath:  홈 > 비밀번호 찾기
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
FindPwClient.propTypes = {
	clientVerifyId: PropTypes.string,
	identityParams: PropTypes.object
};
export default function FindPwClient({
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

	// 비밀번호 찾기 유형
	const [segmentType, setSegmentType] = useState(FindPWOptions[0].id);

	// 결과
	const [isResult, setIsResult] = useState({res: false, success: false});
	
	// 다음 단계 가능 여부
	const [blockNext, setBlockNext] = useState(true);
	
	// 파라미터
	const [valid, setValid] = useState({});
	const [params, setParams] = useState({
		webMbrId: '',                   // 아이디
		custNm: '',                     // 이름
		emlAddr: '',                    // 이메일
		rid: '',                        // 본인 인증
		notiType: FindPWOptions[0].id,  // 수신방법(02문자알림,03이메일)
		method: clientVerifyId,
		selectedMethod: ageOptions[0].id,
	})

	// --Api
	// 비밀번호 찾기
	const {mutate: mutFindPW} = useMutation({
		mutationKey: ['mutFindPW'],
		mutationFn: (payload) => jsonApiAction(apiFindUserPW, {...payload, __localHandle: true}),
		onSuccess: (res) => {
			setIsResult({res: true, success: res > 0});
		},
		onError: () => {
			setIsResult({res: true, success: false});
		}
	})

	useLayoutEffect(() => {
		if(isMobile) {
			fncChangeMoHeader({
				type: 'back',
				title: '비밀번호 찾기'
			})
		}
	}, [isMobile])
	
	useLayoutEffect(() => {
		let defined;
		if(segmentType === FindPWOptions[0].id) {
			// pass
			if(params.method?.toUpperCase() === ageOptions[0].id) {
				defined = fncAllDefined([
					params.webMbrId,
					params.custNm,
					params.rid
				]);
			}

			// ipin
			if(params.method?.toUpperCase() === ageOptions[1].id) {
				defined = fncAllDefined([
					params.webMbrId,
					params.custNm,
					params.custIpnNo
				]);
			}
		}
		if(segmentType === FindPWOptions[1].id) {
			defined = fncAllDefined([
				params.webMbrId,
				params.custNm,
				params.emlAddr,
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
						await Cookies.set('crm-verify', JSON.stringify({webMbrId: identityParams.webMbrId, custNm: identityParams.custNm}), { expires: expireMM });
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
						await Cookies.set('crm-verify', JSON.stringify({webMbrId: identityParams.webMbrId, custNm: identityParams.custNm}), { expires: expireMM });
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
	
	// 비밀번호 찾기 유형 변경
	const fncChangeSegment = (id) => {
		setSegmentType(id);
		setParams({
			webMbrId: '',
			custNm: '',
			emlAddr: '',
			rid: '',
			notiType: FindPWOptions[0].id,
		})
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
		})
	}
	
	// 수신방법 변경
	const fncChangeMethod = (id) => {
		setParams({
			...params,
            notiType: id
		});
	}

	// 업데이트
	const fncUpdateObj = (obj) => {
		setParams(prev => ({
			...prev,
			...obj
		}))
	}
	
	// 비밀번호 찾기
	const fndFindPW = () => {
		let rules
		
		// 본인인증 찾기
		if(segmentType === FindPWOptions[0].id) {
			rules = {
				webMbrId: [
					{type: VALIDATE_RULES.NUMERIC_AND_ALPHA},
				],
				custNm: [
					{type: VALIDATE_RULES.ALPHA},
					{type: VALIDATE_RULES.MIN_LENGTH, value: 2},
				],
				rid: [
					{type: VALIDATE_RULES.MIN_LENGTH, value: 7},
				]
			};
		}
		
		// 이메일 찾기
		if(segmentType === FindPWOptions[1].id) {
			rules = {
				webMbrId: [
					{type: VALIDATE_RULES.NUMERIC_AND_ALPHA},
				],
				custNm: [
					{type: VALIDATE_RULES.ALPHA},
					{type: VALIDATE_RULES.MIN_LENGTH, value: 2},
				],
				emlAddr: [
					{type: VALIDATE_RULES.EMAIL}
				]
			};
		}
		
		const res = validate(params, rules);
		if(Object.keys(res).length === 0) {
			mutFindPW(params);
		} else {

			if(res?.rid) {
				 return fncShowPop({
					 mainText: '본인인증 중 오류가 발생했습니다.',
					 primaryText: '확인',
					 onClickPrimary: () => fncClosePop()
				 })
			}

			setValid(res);
			fncScrollToTop();
		}
	}

	// 비밀번호찾기 초기화
	const fncGoFindPw = () => {
		setSegmentType(FindPWOptions[0].id);
		setIsResult({res: false, success: false})
		setBlockNext(true)
		setValid({});
		setParams({
			webMbrId: '',
			custNm: '',
			emlAddr: '',
			rid: '',
			notiType: FindPWOptions[0].id,
			method: clientVerifyId,
			selectedMethod: ageOptions[0].id,
		})
	}
	
	// 이동: 로그인
	const fncGoLogin = () => {
		const targetUri = RouteConfig.LOGIN.PATH;
		fncRouteStart(targetUri);
		router.push(targetUri);
	}

	const fncHandlers = {
		changeSegment: fncChangeSegment,
		changeInput: fncChangeInput,
		changeMethod: fncChangeMethod,
		updateObj: fncUpdateObj,
		findPW: fndFindPW,
		goFindPw: fncGoFindPw,
		goLogin: fncGoLogin,
	}

	const fncCallbackEvent = (fncName, variable, payload = {}) => {
		const fnc = fncHandlers[fncName];
		if (typeof fnc === 'function') return fnc(variable, payload);
	}

	if (isMobile) return (
		<MoFindPw
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...params,
				valid,
				isResult,
				segmentType,
				blockNext
			}}/>
	);
	else return (
		<DtFindPw
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...params,
				valid,
				isResult,
				segmentType,
				blockNext
			}}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F206, UI-CRM-F207
 */
DtFindPw.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function DtFindPw({data, fncCallbackEvent}) {
	return (
		<main id={'find'} className={'body-wrap-618'} aria-labelledby={'page-name-dt'}>
			<Breadcrumb addPaths={[]} />
			<div className={'page-bottom-space'}>
				{
					!data.isResult.res && (
						<>
							<h1 id={'page-name-dt'} className={'page-title'}>
								비밀번호 찾기
							</h1>
							<p className={'page-sub-title'}>
								회원가입 시 등록한 정보를 입력해 주세요
							</p>
						</>
					)
				}
				{
					data.isResult.res ? (
						<FindPwResult
							data={data.isResult}
							fncCallbackEvent={fncCallbackEvent}
						/>
					) : (
						<div className={'flex flex-col gap-36'}>
							<Segment
								size={'lg'}
								options={FindPWOptions}
								selectedValue={data.segmentType}
								fullSize={true}
								onChange={(id) => fncCallbackEvent('changeSegment', id)}
							/>
								<InputText
									size={'lg'}
									fitWidth={true}
									title={'아이디'}
									essential={true}
									placeholder={'아이디 입력'}
									status={fncValiState('webMbrId', data.valid)}
									message={fncValiState('webMbrId', data.valid) === 'warning' && '아이디를 확인해주세요.'}
									id={'webMbrId'}
									value={data.webMbrId}
									disabled={data.rid}
									onChange={(e) => fncCallbackEvent('changeInput', e)}
								/>
								<InputText
									size={'lg'}
									fitWidth={true}
									title={'이름'}
									essential={true}
									placeholder={'이름 입력'}
									status={fncValiState('custNm', data.valid)}
									message={fncValiState('custNm', data.valid) === 'warning' && '이름을 확인해주세요.'}
									id={'custNm'}
									value={data.custNm}
									disabled={data.rid}
									onChange={(e) => fncCallbackEvent('changeInput', e)}
								/>
							{
								// 휴대폰으로 찾기
								data.segmentType === FindPWOptions[0].id && (
									<IdentityVerification
										type={ageOptions[1].id}
										disabled={data.rid || data.custIpnNo}
										store={{
											webMbrId: data.webMbrId,
											custNm: data.custNm,
											prvcMkusAgreYn: true
										}}
										hiddenTerm={true}
										essentialValues={[
											{key: 'webMbrId', label: '아이디'},
											{key: 'custNm', label: '이름'}
										]}
										onUpdate={(obj) => fncCallbackEvent('updateObj', obj)}
									/>
								)
							}
							{
								// 이메일로 찾기
								data.segmentType === FindPWOptions[1].id && (
									<InputText
										size={'lg'}
										fitWidth={true}
										title={'이메일'}
										essential={true}
										allows={['emailLocal']}
										maxLength={100}
										placeholder={'이메일 주소 입력'}
										status={fncValiState('emlAddr', data.valid)}
										message={fncValiState('emlAddr', data.valid) === 'warning' && '이메일을 확인해주세요.'}
										id={'emlAddr'}
										value={data.emlAddr}
										onChange={(e) => fncCallbackEvent('changeInput', e)}
									/>
								)
							}
							<div className={'receive-wrap'}>
								<p className={'title'}>
									수신방법
								</p>
								<p className={'description'}>
									회원가입 시 등록된 정보로 임시 비밀번호가 전송됩니다.
								</p>
								<div className={'flex-row-center method-wrap'}>
									<Radio
										label={'휴대폰으로 받기'}
										value={FindPWOptions[0].id}
										isChecked={data.notiType === FindPWOptions[0].id}
										onChange={(id) => fncCallbackEvent('changeMethod', id)}
									/>
									<Radio
										label={'이메일로 받기'}
										value={FindPWOptions[1].id}
										isChecked={data.notiType === FindPWOptions[1].id}
										onChange={(id) => fncCallbackEvent('changeMethod', id)}
									/>
								</div>
							</div>
						</div>
					)
				}
			</div>
			{
				!data.isResult.res && (
					<div className={'flex justify-center'}>
						<Button
							theme={'primary'}
							size={'xl'}
							text={'비밀번호 찾기'}
							customStyle={'w-[240px]'}
							disabled={data.blockNext}
							onClick={() => fncCallbackEvent('findPW')}
						/>
					</div>
				)
			}
		</main>
	)
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F416, UI-CRM-F417
 */
MoFindPw.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function MoFindPw({data, fncCallbackEvent}) {
	return (
		<main id={'find'} className={'body-wrap-mobile-screen-height'} aria-labelledby={'page-name-mo'}>
			<h1 id={'page-name-mo'} className={'sr-only'}>비밀번호 찾기</h1>
			<div className={'body-inner-wrap-mobile -mt-10'}>
				{
					data.isResult.res ? (
						<FindPwResult
							data={data.isResult}
							fncCallbackEvent={fncCallbackEvent}
						/>
					) : (
						<>
							<Segment
								size={'sm'}
								options={FindPWOptions}
								selectedValue={data.segmentType}
								fullSize={true}
								onChange={(id) => fncCallbackEvent('changeSegment', id)}
							/>
							<div className={'flex-1 page-bottom-space'}>
								<p className={'page-title mb-28'}>
									{`회원가입 시 등록한\n정보를 입력해 주세요`}
								</p>
								<div className={'flex flex-col gap-40'}>
									<InputText
										size={'md'}
										fitWidth={true}
										title={'아이디'}
										essential={true}
										placeholder={'아이디 입력'}
										status={fncValiState('webMbrId', data.valid)}
										message={fncValiState('webMbrId', data.valid) === 'warning' && '아이디를 확인해주세요.'}
										id={'webMbrId'}
										value={data.webMbrId}
										disabled={data.rid}
										onChange={(e) => fncCallbackEvent('changeInput', e)}
									/>
									<InputText
										size={'md'}
										fitWidth={true}
										title={'이름'}
										essential={true}
										placeholder={'이름 입력'}
										status={fncValiState('custNm', data.valid)}
										message={fncValiState('custNm', data.valid) === 'warning' && '이름을 확인해주세요.'}
										id={'custNm'}
										value={data.custNm}
										disabled={data.rid}
										onChange={(e) => fncCallbackEvent('changeInput', e)}
									/>
									{
										// 휴대폰으로 찾기
										data.segmentType === FindPWOptions[0].id && (
											<IdentityVerification
												type={ageOptions[1].id}
												disabled={data.rid || data.custIpnNo}
												store={{
													webMbrId: data.webMbrId,
													custNm: data.custNm,
													prvcMkusAgreYn: true
												}}
												hiddenTerm={true}
												essentialValues={[
													{key: 'webMbrId', label: '아이디'},
													{key: 'custNm', label: '이름'}
												]}
												onUpdate={(obj) => fncCallbackEvent('updateObj', obj)}
											/>
										)
									}
									{
										// 이메일로 찾기
										data.segmentType === FindPWOptions[1].id && (
											<InputText
												size={'md'}
												fitWidth={true}
												title={'이메일'}
												essential={true}
												allows={['emailLocal']}
												maxLength={100}
												placeholder={'이메일 주소 입력'}
												status={fncValiState('emlAddr', data.valid)}
												message={fncValiState('emlAddr', data.valid) === 'warning' && '이메일을 확인해주세요.'}
												id={'emlAddr'}
												value={data.emlAddr}
												onChange={(e) => fncCallbackEvent('changeInput', e)}
											/>
										)
									}
									<div className={'receive-wrap'}>
										<p className={'title'}>
											수신방법
										</p>
										<p className={'description'}>
											회원가입 시 등록된 정보로 임시 비밀번호가 전송됩니다.
										</p>
										<div className={'flex-row-center method-wrap'}>
											<Radio
												label={'휴대폰으로 받기'}
												value={FindPWOptions[0].id}
												isChecked={data.notiType === FindPWOptions[0].id}
												onChange={(id) => fncCallbackEvent('changeMethod', id)}
											/>
											<Radio
												label={'이메일로 받기'}
												value={FindPWOptions[1].id}
												isChecked={data.notiType === FindPWOptions[1].id}
												onChange={(id) => fncCallbackEvent('changeMethod', id)}
											/>
										</div>
									</div>
								</div>
							</div>
							<Button
								theme={'primary'}
								size={'lg'}
								text={'비밀번호 찾기'}
								customStyle={'w-full'}
								disabled={data.blockNext}
								onClick={() => fncCallbackEvent('findPW')}
							/>
						</>
					)
				}
			</div>
		</main>
	)
}
