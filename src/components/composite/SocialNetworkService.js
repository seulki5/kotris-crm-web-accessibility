'use client';

import React, {useEffect, useLayoutEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import Cookies from "js-cookie";
import {useMutation} from "@tanstack/react-query";

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {CODE} from "@modules/consants/Objects";
import {apiLogin, apiUpdateSNS} from "@/app/_actions/user.action";
import {usePopContext} from "@modules/context/PopContext";
import {useWebContext} from "@modules/context/WebviewContext";
import {useApi} from "@modules/services/useApi";
import {useLoadingContext} from "@modules/context/LoadingContext";
import {useUserContext} from "@modules/context/UserContext";
import {RouteConfig} from "@modules/config/RouteConfig";
import {fncGetBaseUrl} from "@modules/services/api.service";

// components
import ToggleSwitch from "@components/common/ToggleSwitch";
import Tooltip from "@components/common/Tooltip";

// styles
import {SocialApple, SocialGoogle, SocialKakao, SocialNaver} from "@assets/icons/Svgs";

// const
export const REDIRECT_PATHNAME = {
	'LOGIN': '/login',
	'MYPAGE': '/my/info',
}


/**
 * @description: 공통 본인인증 컴포넌트 입니다.
 * @screenID:    -
 * @screenPath:  -
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
SocialNetworkService.propTypes = {
	pageName: PropTypes.string,
	snsLoginList: PropTypes.array,
	onRefresh: PropTypes.func
};
export default function SocialNetworkService({
	pageName = 'LOGIN',
	snsLoginList = [],
	onRefresh = () => {}
}) {

	const cookieViewport = Cookies.get('crm-viewport')?.value || null;

	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const {isMobile} = useScreenSizeContext();
	const {jsonApiAction} = useApi();
	const {fncShowPop, fncClosePop, fncErrorPop} = usePopContext();
	const {isLoading, fncRouteStart} = useLoadingContext();
	const {isAccApp, fncPostRN} = useWebContext();
	const {isLogin, fncLogin} = useUserContext();

	const [snsNm, setSnsNm] = useState(null);
	const [checkIOS, setCheckIOS] = useState(false);
	const [latestSns, setLatestSns] = useState(null);

	const [connected, setConnected] = useState({
		kakao: false,
		naver: false,
		google: false,
	})

	useLayoutEffect(() => {
		// IOS 체크
		const userAgent = navigator.userAgent || window.opera;
		setCheckIOS(/iPhone/i.test(userAgent));

		// 최근 로그인 체크
		const latestSNS = Cookies.get('crm-social');
		if(latestSNS) setLatestSns(latestSNS.toUpperCase());
	}, []);

	useEffect(() => {
		if(snsLoginList.length > 0) {
			const snsNaver = snsLoginList?.filter((sns) => sns.useYn === 'Y' && sns.snsLgnTypeCd === CODE.SOCIAL_NAVER)?.length > 0;
			const snsGoogle = snsLoginList?.filter((sns) => sns.useYn === 'Y' && sns.snsLgnTypeCd === CODE.SOCIAL_GOOGLE)?.length > 0;
			const snsKakao = snsLoginList?.filter((sns) => sns.useYn === 'Y' && sns.snsLgnTypeCd === CODE.SOCIAL_KAKAO)?.length > 0;

			setConnected({
				kakao: snsKakao,
				naver: snsNaver,
				google: snsGoogle,
			})
		}
	}, [snsLoginList, snsLoginList.length])

	// OAuth Redirect
	useEffect(() => {
		if(cookieViewport === 'mobile') return;

		const split = pathname.split('/');
		const code = searchParams.get('code');
		if(split.length >= 3) {
			// 로그인
			if(['login'].includes(split[1]) && code && !isLoading && isLogin === false) {
				var snsUpperCase = split[2].toUpperCase()
				setSnsNm(snsUpperCase);
				switch (snsUpperCase) {
					case CODE.SOCIAL_NAVER:
					case CODE.SOCIAL_KAKAO:
					case CODE.SOCIAL_GOOGLE:
						mutLogin({
							mobileYn: (cookieViewport === 'mobile' || isAccApp) ? 'Y' : 'N',
							loginType: snsUpperCase,
							snsCd: code
						});
						break;
					default: return;
				}
			}

			// 연동
			if(['my'].includes(split[1]) && ['info'].includes(split[2]) && code && !isLoading && isLogin !== false) {
				var snsUpperCase = split[3].toUpperCase()
				setSnsNm(snsUpperCase);
				switch (snsUpperCase) {
					case CODE.SOCIAL_NAVER:
					case CODE.SOCIAL_KAKAO:
					case CODE.SOCIAL_GOOGLE:
						mutConnectSNS({
							mobileYn: (cookieViewport === 'mobile' || isAccApp) ? 'Y' : 'N',
							snsYn: 'Y',
							loginType: snsUpperCase,
							snsCd: code
						});
						break;
					default: return;
				}
			}
		}
	}, [pathname, searchParams, isLoading, isLogin]);

	//-- Api
	// SNS 로그인
	const {mutate: mutLogin} = useMutation({
		mutationKey: ['mutLogin'],
		mutationFn: (payload) => jsonApiAction(apiLogin, {
			...payload,
			vrKeyPadYn: 'N',
			__localHandle: true
		}),
		onSuccess: (res) => {
			if(res?.jwt) {
				Cookies.set('crm-social', snsNm);

				if(res?.userInfo?.certYn !== 'Y') {
					if(isAccApp) {
						fncPostRN({
							id: 'WEB_CI',
							payload: {
								jwt: res?.jwt
							}
						});
					} else {
						fncLogin({
							jwt: res.jwt,
							pswdChgDt: res?.userInfo?.pswdChgDt,
							isAccApp: cookieViewport === 'mobile' || isAccApp
						});
					}

					return;
				}

				if(isAccApp) {
					fncPostRN({
						id: 'WEB_SYNC_USER',
						payload: {
							jwt: res?.jwt
						}
					});

					fncRouteStart(RouteConfig.APP_BLANK.PATH);
					router.replace(RouteConfig.APP_BLANK.PATH);
				}

				fncLogin({
					jwt: res.jwt,
					pswdChgDt: res?.userInfo?.pswdChgDt,
					isAccApp: cookieViewport === 'mobile' || isAccApp
				});

			} else {
				fncErrorPop();
			}
		},
		onError: (error) => {
			// 로그인 실패
			fncShowPop({
				mainText: 'SNS 로그인 연동 설정이 되어 있지 않거나, 회원가입이 되어있지 않습니다.',
				tertiaryText: '취소',
				onClickTertiary: () => {
					fncClosePop();
					fncRouteStart(RouteConfig.HOME.PATH);
					router.replace(RouteConfig.HOME.PATH);
				},
				primaryText: '회원가입하기',
				onClickPrimary: () => {fncClosePop(); fncGoJoin();},
			})
		}
	})

	// SNS 업데이트
	const {mutate: mutConnectSNS} = useMutation({
		mutationKey: ['mutConnectSNS'],
		mutationFn: (payload) => jsonApiAction(apiUpdateSNS, payload),
		onSuccess: (res) => {
			if(res > 0) {
				fncShowPop({
					mainText: 'SNS가 연동되었습니다.',
					primaryText: '확인',
					onClickPrimary: () => {
						fncClosePop();
						if(pageName === 'MYPAGE') fncGoMyInfo();
					}
				})
			} else {
				fncErrorPop();
			}
		}
	})
	const {mutate: mutDisconnectSNS} = useMutation({
		mutationKey: ['mutDisconnectSNS'],
		mutationFn: (payload) => jsonApiAction(apiUpdateSNS, payload),
		onSuccess: (res) => {
			if(res > 0) {
				fncShowPop({
					mainText: 'SNS 연동 해제되었습니다.',
					primaryText: '확인',
					onClickPrimary: () => {
						fncClosePop();
						if(pageName === 'MYPAGE') fncGoMyInfo();
					}
				})
			} else {
				fncErrorPop();
			}
		}
	})

	// OAuth Key
	const fncGetOAuthApiKey = (snsType) => {
		switch (snsType) {
			case CODE.SOCIAL_KAKAO:
				return process.env.NEXT_PUBLIC_KAKAO_API_KEY;
			case CODE.SOCIAL_NAVER:
				return process.env.NEXT_PUBLIC_NAVER_API_KEY;
			case CODE.SOCIAL_GOOGLE:
				return process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
			default: return;
		}
	}

	// OAuth Request URL
	const fncMakeOAuthReqUrl = (snsType, apiKey, encodedRedirectUri) => {
		switch (snsType) {
			case CODE.SOCIAL_KAKAO:
				return `${process.env.NEXT_PUBLIC_KAKAO_OAUTH_URI}?response_type=code&client_id=${apiKey}&redirect_uri=${encodedRedirectUri}`;
			case CODE.SOCIAL_NAVER:
				return `${process.env.NEXT_PUBLIC_NAVER_OAUTH_URI}?response_type=code&client_id=${apiKey}&redirect_uri=${encodedRedirectUri}`;
			case CODE.SOCIAL_GOOGLE:
				return `${process.env.NEXT_PUBLIC_GOOGLE_OAUTH_URI}?response_type=code&client_id=${apiKey}&redirect_uri=${encodedRedirectUri}&scope=email profile`;
			default: return;
		}
	}

	// OAuth Start
	const fncStartOAuth = async (props) => {

		const apiUrl = await fncGetBaseUrl();

		if(!props?.snsType || !apiUrl || !REDIRECT_PATHNAME[pageName]) return;

		const cookieViewport = Cookies.get('crm-viewport')?.value || null;
		const snsType = props.snsType.toUpperCase();

		if(cookieViewport === 'mobile' || isAccApp) {
			fncPostRN({
				id: 'WEB_SNS_LOGIN',
				payload: {
					snsType: snsType
				}
			})

			return;
		}

		const apiKey = fncGetOAuthApiKey(snsType);
		if(!apiKey) {
			fncShowPop({
				mainText: `${snsType} OAuth 실행이 불가합니다.`,
				primaryText: '확인',
				onClickPrimary: () => fncClosePop()
			})
			return;
		}

		const redirectUri = `${apiUrl}${REDIRECT_PATHNAME[pageName]}/${props.snsType.toLowerCase()}`; // Redirect URI
		const encodedRedirectUri = encodeURIComponent(redirectUri); // 인코딩된 URI
		const oAuthReqUrl =  fncMakeOAuthReqUrl(snsType, apiKey, encodedRedirectUri);

		window.location.href = oAuthReqUrl;
	}

	// 마이페이지 소셜 연동
	const fncToggleSocial = (snsType) => {
		const isExist = snsLoginList?.filter((sns) => sns.useYn === 'Y' && sns.snsLgnTypeCd === snsType.toUpperCase())?.length > 0;
		if(isExist) {
			fncShowPop({
				mainText: `${snsType.toUpperCase()} 계정 연동을 해제하시겠습니까?`,
				tertiaryText: '취소',
				onClickTertiary: () => fncClosePop(),
				primaryText: '확인',
				onClickPrimary: () => {
					fncClosePop();
					mutDisconnectSNS({
						snsYn: 'N',
						loginType: snsType.toUpperCase()
					});
				}
			})
		} else {
			fncStartOAuth({snsType: snsType});
		}
	}

	// 이동: 회원가입
	const fncGoJoin = () => {
		const targetUri = RouteConfig.JOIN.PATH;
		fncRouteStart(targetUri);
		router.replace(targetUri);
	}

	// 이동: 내 정보
	const fncGoMyInfo = () => {
		onRefresh() && onRefresh();
		const targetUri = RouteConfig.INFO.PATH;
		fncRouteStart(targetUri);
		router.replace(targetUri);
	}

	const fncHandlers = {
		toggleSocial: fncToggleSocial,
		startOAuth: fncStartOAuth,
	}

	const fncCallbackEvent = (fncName, variable, payload = {}) => {
		const fnc = fncHandlers[fncName];
		if (typeof fnc === 'function') return fnc(variable, payload);
	}

	if (isMobile) return (
		<MoSocialNetworkService
			fncCallbackEvent={fncCallbackEvent}
			data={{
				connected,
				pageName,
				checkIOS,
				latestSns
			}}
		/>
	);
	else return (
		<DtSocialNetworkService
			fncCallbackEvent={fncCallbackEvent}
			data={{
				connected,
				pageName,
				checkIOS,
				latestSns
			}}
		/>
	);
}


/**
 * @description: Desktop
 * @screenID:    UI-CRM-F201 ~ UI-CRM-F204
 */
DtSocialNetworkService.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function DtSocialNetworkService({data, fncCallbackEvent}) {

	const {isAccApp} = useWebContext();

	if(data.pageName === 'MYPAGE') {
		return (
			<fieldset role={'group'} className={'sns-wrap grid gap-16'}>
				<legend className={'sr-only'}>
					SNS 계정 연동 정보
				</legend>
				<div className={'group-header'}>
					<h2>SNS 계정 연동</h2>
					<div className={'divider'} />
				</div>
				<div className={'flex-row-center justify-between'}>
					<div className={'flex-row-center'} aria-hidden={true}>
						<SocialKakao width={44} height={44} />
						<p>카카오톡 계정 연결</p>
					</div>
					<ToggleSwitch
						size={'md'}
						id={CODE.SOCIAL_KAKAO}
						isChecked={data.connected?.kakao}
						aria-label={`카카오톡: ${data.connected?.naver ? '활성화 됨' : '활성화 안 됨'}`}
						onChange={() => fncCallbackEvent('toggleSocial', CODE.SOCIAL_KAKAO)}
					/>
				</div>
				<div className={'flex-row-center justify-between'}>
					<div className={'flex-row-center'} aria-hidden={true}>
						<SocialNaver width={44} height={44} />
						<p>네이버 계정 연결</p>
					</div>
					<ToggleSwitch
						size={'md'}
						id={CODE.SOCIAL_NAVER}
						isChecked={data.connected?.naver}
						aria-label={`네이버: ${data.connected?.naver ? '활성화 됨' : '활성화 안 됨'}`}
						onChange={() => fncCallbackEvent('toggleSocial', CODE.SOCIAL_NAVER)}
					/>
				</div>
				<div className={'flex-row-center justify-between'}>
					<div className={'flex-row-center'} aria-hidden={true}>
						<SocialGoogle width={44} height={44} />
						<p>구글 계정 연결</p>
					</div>
					<ToggleSwitch
						size={'md'}
						id={CODE.SOCIAL_GOOGLE}
						isChecked={data.connected?.google}
						aria-label={`구글: ${data.connected?.naver ? '활성화 됨' : '활성화 안 됨'}`}
						onChange={() => fncCallbackEvent('toggleSocial', CODE.SOCIAL_GOOGLE)}
					/>
				</div>
			</fieldset>
		)
	} else { // pageName === 'LOGIN'
		return (
			<div className={'social-wrap'}>
				<div className={'flex flex-row items-center'}>
					<div className={'divider'}/>
					<p>간편 로그인</p>
					<div className={'divider'}/>
				</div>
				<div className={'type-wrap'}>
					<div>
						<button
							aria-label={'카카오 계정 로그인'}
							onClick={() => fncCallbackEvent('startOAuth', {snsType: CODE.SOCIAL_KAKAO})}
							onKeyDown={(e) => {
								if(e.key === 'Enter') fncCallbackEvent('startOAuth', {snsType: CODE.SOCIAL_KAKAO})
							}}
						>
							<SocialKakao width={48} height={48} />
						</button>
						{
							data.latestSns === CODE.SOCIAL_KAKAO && <TooltipLatestLogin />
						}
					</div>
					<div>
						<button
							aria-label={'네이버 계정 로그인'}
							onClick={() => fncCallbackEvent('startOAuth', {snsType: 'NAVER'})}
							onKeyDown={(e) => {
								if(e.key === 'Enter') fncCallbackEvent('startOAuth', {snsType: CODE.SOCIAL_NAVER})
							}}
						>
							<SocialNaver width={48} height={48} />
						</button>
						{
							data.latestSns === CODE.SOCIAL_NAVER && <TooltipLatestLogin />
						}
					</div>
					<div>
						<button
							aria-label={'구글 계정 로그인'}
							onClick={() => fncCallbackEvent('startOAuth', {snsType: CODE.SOCIAL_GOOGLE})}
							onKeyDown={(e) => {
								if(e.key === 'Enter') fncCallbackEvent('startOAuth', {snsType: CODE.SOCIAL_GOOGLE})
							}}
						>
							<SocialGoogle width={48} height={48} />
						</button>
						{
							data.latestSns === CODE.SOCIAL_GOOGLE && <TooltipLatestLogin />
						}
					</div>
					{
						// 앱 접속시에만 가능
						isAccApp && data.checkIOS && (
							<div>
								<button
									aria-label={'애플 계정 로그인'}
									onClick={() => fncCallbackEvent('startOAuth', {snsType: CODE.SOCIAL_APPLE})}
									onKeyDown={(e) => {
										if(e.key === 'Enter') fncCallbackEvent('startOAuth', {snsType: CODE.SOCIAL_APPLE})
									}}
								>
									<SocialApple width={48} height={48} />
								</button>
								{
									data.latestSns === CODE.SOCIAL_APPLE && <TooltipLatestLogin />
								}
							</div>
						)
					}
				</div>
			</div>
		)
	}
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F408 ~ UI-CRM-F413
 */
MoSocialNetworkService.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};

export function MoSocialNetworkService({data, fncCallbackEvent}) {

	const {isAccApp} = useWebContext();

	if(data.pageName === 'MYPAGE') {
		return (
			<fieldset role={'group'} className={'sns-wrap grid gap-16'}>
				<legend className={'sr-only'}>
					SNS 계정 연동 정보
				</legend>
				<div className={'group-header'}>
					<h2>SNS 계정 연동</h2>
					<div className={'divider'} />
				</div>
				<div className={'flex-row-center justify-between'}>
					<div className={'flex-row-center'} aria-hidden={true}>
						<SocialKakao width={36} height={36} />
						<p>카카오톡 계정 연결</p>
					</div>
					<ToggleSwitch
						size={'sm'}
						id={CODE.SOCIAL_KAKAO}
						isChecked={data.connected?.kakao}
						aria-label={`카카오톡: ${data.connected?.naver ? '활성화 됨' : '활성화 안 됨'}`}
						onChange={() => fncCallbackEvent('toggleSocial', CODE.SOCIAL_KAKAO)}
					/>
				</div>
				<div className={'flex-row-center justify-between'}>
					<div className={'flex-row-center'} aria-hidden={true}>
						<SocialNaver width={36} height={36} />
						<p>네이버 계정 연결</p>
					</div>
					<ToggleSwitch
						size={'sm'}
						id={CODE.SOCIAL_NAVER}
						isChecked={data.connected?.naver}
						aria-label={`네이버: ${data.connected?.naver ? '활성화 됨' : '활성화 안 됨'}`}
						onChange={() => fncCallbackEvent('toggleSocial', CODE.SOCIAL_NAVER)}
					/>
				</div>
				<div className={'flex-row-center justify-between'}>
					<div className={'flex-row-center'} aria-hidden={true}>
						<SocialGoogle width={36} height={36} />
						<p>구글 계정 연결</p>
					</div>
					<ToggleSwitch
						size={'sm'}
						id={CODE.SOCIAL_GOOGLE}
						isChecked={data.connected?.google}
						aria-label={`구글: ${data.connected?.naver ? '활성화 됨' : '활성화 안 됨'}`}
						onChange={() => fncCallbackEvent('toggleSocial', CODE.SOCIAL_GOOGLE)}
					/>
				</div>
			</fieldset>
		)
	} else {
		return (
			<div className={'social-wrap'}>
				<div className={'h-[23px] flex flex-row items-center'}>
					<div className={'divider'}/>
					<p>간편 로그인</p>
					<div className={'divider'}/>
				</div>
				<div className={'type-wrap'}>
					<div>
						<button
							aria-label={'카카오 계정 로그인'}
							onClick={() => fncCallbackEvent('startOAuth', {snsType: CODE.SOCIAL_KAKAO})}
							onKeyDown={(e) => {
								if(e.key === 'Enter') fncCallbackEvent('startOAuth', {snsType: CODE.SOCIAL_KAKAO})
							}}
						>
							<SocialKakao width={48} height={48} />
						</button>
						{
							data.latestSns === CODE.SOCIAL_KAKAO && <TooltipLatestLogin />
						}
					</div>
					<div>
						<button
							aria-label={'네이버 계정 로그인'}
							onClick={() => fncCallbackEvent('startOAuth', {snsType: CODE.SOCIAL_NAVER})}
							onKeyDown={(e) => {
								if(e.key === 'Enter') fncCallbackEvent('startOAuth', {snsType: CODE.SOCIAL_NAVER})
							}}
						>
							<SocialNaver width={48} height={48} />
						</button>
						{
							data.latestSns === CODE.SOCIAL_NAVER && <TooltipLatestLogin />
						}
					</div>
					<div>
						<button
							aria-label={'구글 계정 로그인'}
							onClick={() => fncCallbackEvent('startOAuth', {snsType: CODE.SOCIAL_GOOGLE})}
							onKeyDown={(e) => {
								if(e.key === 'Enter') fncCallbackEvent('startOAuth', {snsType: CODE.SOCIAL_GOOGLE})
							}}
						>
							<SocialGoogle width={48} height={48} />
						</button>
						{
							data.latestSns === CODE.SOCIAL_GOOGLE && <TooltipLatestLogin />
						}
					</div>
					{
						// 모바일(IOS) 앱 접속시에만 가능
						isAccApp && data.checkIOS && (
							<div>
								<button
									aria-label={'애플 계정 로그인'}
									onClick={() => fncCallbackEvent('startOAuth', {snsType: CODE.SOCIAL_APPLE})}
									onKeyDown={(e) => {
										if(e.key === 'Enter') fncCallbackEvent('startOAuth', {snsType: CODE.SOCIAL_APPLE})
									}}
								>
									<SocialApple width={48} height={48} />
								</button>
								{
									data.latestSns === CODE.SOCIAL_APPLE && <TooltipLatestLogin />
								}h
							</div>
						)
					}
				</div>
			</div>
		)
	}
}


/**
 * @description: 최근 로그인 컴포넌트
 */
export const TooltipLatestLogin = () => {
	return (
		<div className={'tip-wrap'} aria-hidden={true}>
			<Tooltip
				size={'sm'}
				direction={'up'}
				position={'center'}
				text={'최근 로그인'}
			/>
		</div>
	)
}
