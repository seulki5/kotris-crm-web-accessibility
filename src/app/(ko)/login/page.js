'use client';

import React, {useLayoutEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import PropTypes from 'prop-types';
import {useMutation} from '@tanstack/react-query';
import Cookies from "js-cookie";

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {useMoHeaderContext} from '@modules/context/MoHeaderContext';
import {RouteConfig} from '@modules/config/RouteConfig';
import {useLoadingContext} from '@modules/context/LoadingContext';
import {useApi} from '@modules/services/useApi';
import {usePopContext} from '@modules/context/PopContext';
import {apiLogin} from '@/app/_actions/user.action';
import {useWebContext} from '@modules/context/WebviewContext';
import {fncValiState, validate, VALIDATE_RULES} from '@modules/utils/ValidateUtils';
import {useScrollContext} from '@modules/context/ScrollContext';
import {useUserContext} from "@modules/context/UserContext";

// components
import InputText from '@components/common/InputText';
import Button from '@components/common/Button';
import NFilterKeyboard from '@components/composite/NFilterKeyboard';
import SocialNetworkService from "@components/composite/SocialNetworkService";
import Checkbox from "@components/common/Checkbox";

// assets
import {Logo} from '@assets/icons/Svgs';
import InputWithButton from "@components/composite/InputWithButton";


/**
 * @description: 로그인 화면 입니다.
 * @screenID:    UI-CRM-F280, UI-CRM-F406
 * @screenPath:  홈 > 로그인
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function Login() {

	const router = useRouter();
	const {isAccApp, reloadKey, fncPostRN} = useWebContext();
	const {isMobile} = useScreenSizeContext();
	const {fncChangeMoHeader} = useMoHeaderContext();
	const {fncScrollToTop} = useScrollContext();
	const {jsonApiAction} = useApi();
	const {fncErrorPop} = usePopContext();
	const {isLogin, fncLogin, fncEncode} = useUserContext();
	const {fncRouteStart} = useLoadingContext();
	const cookieViewport = Cookies.get('crm-viewport')?.value || null;
	const nfilterRef = useRef(null);
	const inputPwRef = useRef(null);
	const inputIdRef = useRef(null);

	// 가상키패드
	const [isNFilter, setIsNFilter] = useState(false);

	// 로그인 파라미터
	const [valid, setValid] = useState({});
	const [params, setParams] = useState({
		webMbrId: '',           // 아이디
		webMbrPswdEncpt: '',    // 비밀번호
	})

	//-- Api
	// ID 로그인
	const {mutate: mutLogin} = useMutation({
		mutationKey: ['mutLogin'],
		mutationFn: (payload) => jsonApiAction(apiLogin, {
			...payload,
			loginType: 'RAILPLUS',
			vrKeyPadYn: isNFilter ? 'Y' : 'N',
			mobileYn: isAccApp ? 'Y' : 'N',
			__localHandle: true
		}),
		onSuccess: (res) => {
			if(res?.jwt) {
				fncDoneLogin(res);
			} else {
				fncErrorPop();
			}
		},
		onError: (error) => {
			// 로그인 실패
			if(error.message.includes('등록된 아이디가 아닙니다.')) {
				setValid({
					webMbrId: '등록된 아이디가 아닙니다.',
				})
			} else if(error.message.includes('관리자')) {
				setValid({
					webMbrId: '관리자 정지 회원입니다.',
				})
			} else if(error.message.includes('비밀번호가 일치하지 않습니다.')) {
				setValid({
					webMbrPswdEncpt: '비밀번호가 일치하지 않습니다. 다시 입력해주세요.',
				})
			} else {
				setValid({
					webMbrId: '등록된 아이디가 아닙니다.',
					webMbrPswdEncpt: '비밀번호가 일치하지 않습니다. 다시 입력해주세요.',
				})
			}
		}
	})

	useLayoutEffect(() => {
		if (isMobile) {
			fncChangeMoHeader({
				type: 'none',
				title: null
			})
		}
	}, [isMobile, isAccApp, reloadKey, isLogin])

	// 아이디/비밀번호 input 입력
	const fncChangeInput = (e) => {
		setParams({
			...params,
			[e.target.id]: e.target.value
		});
	}

	// 가상키패드
	const fncToggleNFilter = () => {
		setIsNFilter(!isNFilter);
	}

	// 가상키패드 입력
	const fncChangeVirtualInput = (enc) => {
		setParams(prev => ({
			...prev,
			webMbrPswdEncpt: enc
		}))
	}

	// 로그인: ID
	const fncLoginById = async () => {
		const rules = {
			webMbrId: [
				{type: VALIDATE_RULES.MIN_LENGTH, value: 1},
			],
			webMbrPswdEncpt: [
				{type: VALIDATE_RULES.MIN_LENGTH, value: 4},
			],
		}

		const res = validate(params, rules);
		if(Object.keys(res).length === 0) {
			if(isNFilter) {
				mutLogin({
					...params,
					mobileYn: (isAccApp || cookieViewport === 'mobile') ? 'Y' : 'N'
				})
			} else {
				const encodedPwd = await fncEncode(params.webMbrPswdEncpt)
				if(!encodedPwd) return;
				if(encodedPwd) {
					mutLogin({
						...params,
						webMbrPswdEncpt: encodedPwd,
						mobileYn: (isAccApp || cookieViewport === 'mobile') ? 'Y' : 'N'
					})
				}
			}
		} else {
			setValid(res);
			fncScrollToTop();
		}
	}

	// 로그인 완료
	const fncDoneLogin = (loginRes) => {
		if(loginRes?.jwt) {
			if(loginRes?.userInfo?.certYn !== 'Y') {
				if(isAccApp) {
					fncPostRN({
						id: 'WEB_CI',
						payload: {
							jwt: loginRes?.jwt
						}
					});
				} else {
					fncLogin({
						jwt: loginRes.jwt,
						pswdChgDt: loginRes?.userInfo?.pswdChgDt,
						isAccApp: isAccApp,
						certYn: loginRes?.userInfo?.certYn
					});
				}

				return;
			}

			if(isAccApp) {
				fncPostRN({
					id: 'WEB_SYNC_USER',
					payload: {
						jwt: loginRes?.jwt
					}
				});

				fncRouteStart(RouteConfig.APP_BLANK.PATH);
				router.replace(RouteConfig.APP_BLANK.PATH);
			}

			fncLogin({
				jwt: loginRes.jwt,
				pswdChgDt: loginRes?.userInfo?.pswdChgDt,
				isAccApp: isAccApp,
				certYn: loginRes?.userInfo?.certYn
			});

		} else {
			fncErrorPop()
		}
	}

	// 이동: 아이디 찾기
	const fncGoFindId = () => {
		const targetUri = RouteConfig.FIND_ID.PATH;
		fncRouteStart(targetUri);
		router.push(targetUri);
	}

	// 비밀번호 찾기
	const fcnGoFindPw = () => {
		const targetUri = RouteConfig.FIND_PW.PATH;
		fncRouteStart(targetUri);
		router.push(targetUri);
	}

	// 이동: 회원가입
	const fncGoJoin = () => {
		const targetUri = RouteConfig.JOIN.PATH;
		fncRouteStart(targetUri);
		router.push(targetUri);
	}

	const fncHandlers = {
		changeInput: fncChangeInput,
		changeVirtualInput: fncChangeVirtualInput,
		goFindId: fncGoFindId,
		goFindPw: fcnGoFindPw,
		goJoin: fncGoJoin,
		loginById: fncLoginById,
		toggleNFilter: fncToggleNFilter
	}

	const fncCallbackEvent = (fncName, payload = {}) => {
		const fnc = fncHandlers[fncName];
		if (typeof fnc === 'function') return fnc(payload);
	}

	if (isMobile) return (
		<MoLogin
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...params,
				isNFilter,
				valid,
			}}
			nfilterRef={nfilterRef}
			inputPwRef={inputPwRef}
			inputIdRef={inputIdRef}
		/>
	)
	else return (
		<DtLogin
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...params,
				isNFilter,
				valid,
			}}
			nfilterRef={nfilterRef}
			inputPwRef={inputPwRef}
			inputIdRef={inputIdRef}
		/>
	)
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F280
 */
DtLogin.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func,
	nfilterRef: PropTypes.any,
	inputPwRef: PropTypes.any,
	inputIdRef: PropTypes.any
};
export function DtLogin({data, fncCallbackEvent, nfilterRef, inputPwRef, inputIdRef}) {
	return (
		<main id={'login'} className={'body-wrap-618 items-center'} aria-labelledby={'page-name-dt'}>
			<h1 id={'page-name-dt'} className={'sr-only'}>로그인</h1>
			<div className={'w-[404px] gap-56 mt-68'}>
				<div className={'login-wrap'}>
					<Logo
						width={124} height={38}
						color={'text-dynamic-icon-neutral-primary'}
						aria-hidden={true}
					/>
					<div className={'input-wrap'}>
						<InputText
							ref={inputIdRef}
							size={'lg'}
							fitWidth={true}
							title={'아이디'}
							placeholder={'아이디를 입력하세요'}
							allows={['lowAlnum']}
							maxLength={30}
							status={fncValiState('webMbrId', data.valid)}
							message={fncValiState('webMbrId', data.valid) === 'warning' && (data.valid?.webMbrId || '등록된 아이디가 아닙니다.')}
							id={'webMbrId'}
							value={data.webMbrId}
							onChange={(e) => fncCallbackEvent('changeInput', e)}
							// onKeyDown={(e) => {
							// 	if(e.key === 'Tab') {
							// 		e.preventDefault();
							// 		if(inputPwRef.current) inputPwRef.current.focus();
							// 		if(data.isNFilter && nfilterRef.current) nfilterRef.current.click();
							// 	}
							// }}
						/>
						{
							data.isNFilter ? (
								<NFilterKeyboard
									ref={nfilterRef}
									size={'lg'}
									title={'비밀번호'}
									placeholder={'비밀번호를 입력하세요'}
									keypad={'password'}
									status={fncValiState('webMbrPswdEncpt', data.valid)}
									message={fncValiState('webMbrPswdEncpt', data.valid) === 'warning' && '비밀번호가 일치하지 않습니다. 다시 입력해주세요.'}
									minLength={9}
									maxLength={20}
									id={'webMbrPswdEncpt'}
									value={data.webMbrPswdEncpt}
									onChange={(enc) => fncCallbackEvent('changeVirtualInput', enc)}
								/>
							) : (
								<InputText
									ref={inputPwRef}
									size={'lg'}
									fitWidth={true}
									title={'비밀번호'}
									placeholder={'비밀번호를 입력하세요'}
									inputType={'password'}
									keypad={'password'}
									allows={['alnum', 'pwChar']}
									status={fncValiState('webMbrPswdEncpt', data.valid)}
									message={fncValiState('webMbrPswdEncpt', data.valid) === 'warning' && '비밀번호가 일치하지 않습니다. 다시 입력해주세요.'}
									minLength={9}
									maxLength={20}
									id={'webMbrPswdEncpt'}
									value={data.webMbrPswdEncpt}
									onChange={(e) => fncCallbackEvent('changeInput', e)}
									onKeyDown={(e) => {
										if((e.key === 'Enter' || e.key === ' ') && data.webMbrId) {
											fncCallbackEvent('loginById')
										}
									}}
								/>
							)
						}
					</div>
					<Button
						theme={'primary'}
						size={'lg'}
						text={'로그인'}
						ariaLabel={'로그인'}
						customStyle={'w-full'}
						disabled={!(data.webMbrId && data.webMbrPswdEncpt)}
						onClick={() => fncCallbackEvent('loginById')}
					/>
					<div className={'sub-login-wrap'}>
						<button
							type={'button'}
							className={'button-sub-login'}
							aria-label={'아이디 찾기로 이동'}
							onClick={() => fncCallbackEvent('goFindId')}
							onKeyDown={(e) => {
								if(e.key === 'Enter' || e.key === ' ') {
									e.preventDefault();
									fncCallbackEvent('goFindId');
								}
							}}
						>
							아이디 찾기
						</button>
						<div className={'login-divider'} />
						<button
							className={'button-sub-login'}
							aria-label={'비밀번호 찾기로 이동'}
							onClick={() => fncCallbackEvent('goFindPw')}
							onKeyDown={(e) => {
								if(e.key === 'Enter') fncCallbackEvent('goFindPw')
							}}
						>
							비밀번호 찾기
						</button>
						<div className={'login-divider'} />
						<button
							className={'button-sub-login'}
							aria-label={'회원가입으로 이동'}
							onClick={() => fncCallbackEvent('goJoin')}
							onKeyDown={(e) => {
								if(e.key === 'Enter') fncCallbackEvent('goJoin')
							}}
						>
							회원가입
						</button>
						<div className={'login-divider'} />
						<Checkbox
							type={'square'}
							label={'가상키패드 미사용'}
							isChecked={!data.isNFilter}
							onChange={() => fncCallbackEvent('toggleNFilter')}
						/>
					</div>
				</div>
				<SocialNetworkService pageName={'LOGIN'} />
			</div>
		</main>
	)
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F406
 */
MoLogin.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func,
	nfilterRef: PropTypes.any,
	inputPwRef: PropTypes.any,
	inputIdRef: PropTypes.any
};
export function MoLogin({data, fncCallbackEvent, nfilterRef, inputPwRef, inputIdRef}) {

	const {isAccApp} = useWebContext();
	const [checkIOS, setCheckIOS] = useState(false);

	useLayoutEffect(() => {
		const userAgent = navigator.userAgent || window.opera;
		setCheckIOS(/iPhone|iPad/i.test(userAgent));
	}, []);

	return (
		<main id={'login'} className={'body-wrap-mobile items-center justify-center'} aria-labelledby={'page-name-mo'}>
			<h1 id={'page-name-mo'} className={'sr-only'}>로그인</h1>
			<div className={'login-wrap'}>
				<Logo
					width={171} height={51}
					color={'text-dynamic-icon-neutral-primary'}
					aria-hidden={true}
				/>
				<div className={'input-wrap'}>
					<InputText
						ref={inputIdRef}
						size={'md'}
						fitWidth={true}
						title={'아이디'}
						placeholder={'아이디를 입력하세요'}
						allows={['lowAlnum']}
						maxLength={30}
						status={fncValiState('webMbrId', data.valid)}
						message={fncValiState('webMbrId', data.valid) === 'warning' && '등록된 아이디가 아닙니다.'}
						id={'webMbrId'}
						value={data.webMbrId}
						onChange={(e) => fncCallbackEvent('changeInput', e)}
						// onKeyDown={(e) => {
						// 	if(e.key === 'Tab') {
						// 		e.preventDefault();
						// 		if(data.isNFilter && nfilterRef.current) nfilterRef.current.click();
						// 	}
						// }}
					/>
					{
						data.isNFilter ? (
							<NFilterKeyboard
								ref={nfilterRef}
								size={'md'}
								title={'비밀번호'}
								placeholder={'비밀번호를 입력하세요'}
								keypad={'password'}
								status={fncValiState('webMbrPswdEncpt', data.valid)}
								message={fncValiState('webMbrPswdEncpt', data.valid) === 'warning' && '비밀번호가 일치하지 않습니다. 다시 입력해주세요.'}
								minLength={9}
								maxLength={20}
								id={'webMbrPswdEncpt'}
								value={data.webMbrPswdEncpt}
								onChange={(enc) => fncCallbackEvent('changeVirtualInput', enc)}
							/>
						) : (
							<InputText
								ref={inputPwRef}
								size={'md'}
								fitWidth={true}
								title={'비밀번호'}
								placeholder={'비밀번호를 입력하세요'}
								inputType={'password'}
								keypad={'password'}
								allows={['alnum', 'pwChar']}
								status={fncValiState('webMbrPswdEncpt', data.valid)}
								message={fncValiState('webMbrPswdEncpt', data.valid) === 'warning' && '비밀번호가 일치하지 않습니다. 다시 입력해주세요.'}
								minLength={9}
								maxLength={20}
								id={'webMbrPswdEncpt'}
								value={data.webMbrPswdEncpt}
								onChange={(e) => fncCallbackEvent('changeInput', e)}
								onKeyDown={(e) => {
									if((e.key === 'Enter' || e.key === ' ') && data.webMbrId) {
										fncCallbackEvent('loginById')
									}
								}}
							/>
						)
					}
				</div>
				<Button
					theme={'primary'}
					size={'lg'}
					text={'로그인'}
					ariaLabel={'로그인'}
					customStyle={'w-full'}
					disabled={!(data.webMbrId && data.webMbrPswdEncpt)}
					onClick={() => fncCallbackEvent('loginById')}
				/>
				<div className={'sub-login-wrap'}>
					<button
						type={'button'}
						className={'button-sub-login'}
						aria-label={'아이디 찾기로 이동'}
						onClick={() => fncCallbackEvent('goFindId')}
						onKeyDown={(e) => {
							if(e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								fncCallbackEvent('goFindId');
							}
						}}
					>
						아이디 찾기
					</button>
					<div className={'login-divider'} aria-hidden={true} />
					<button
						type={'button'}
						className={'button-sub-login'}
						aria-label={'비밀번호 찾기로 이동'}
						onClick={() => fncCallbackEvent('goFindPw')}
						onKeyDown={(e) => {
							if(e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								fncCallbackEvent('goFindPw');
							}
						}}
					>
						비밀번호 찾기
					</button>
					<div className={'login-divider'} aria-hidden={true} />
					<button
						type={'button'}
						className={'button-sub-login'}
						aria-label={'회원가입으로 이동'}
						onClick={() => fncCallbackEvent('goJoin')}
						onKeyDown={(e) => {
							if(e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								fncCallbackEvent('goJoin');
							}
						}}
					>
						회원가입
					</button>
				</div>
				<Checkbox
					type={'square'}
					label={'가상키패드 미사용'}
					isChecked={!data.isNFilter}
					onChange={() => fncCallbackEvent('toggleNFilter')}
				/>
				<SocialNetworkService pageName={'LOGIN'} />
			</div>
		</main>
	)
}
