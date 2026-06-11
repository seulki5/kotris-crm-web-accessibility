'use client';

import React, {useEffect, useLayoutEffect, useState} from 'react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import PropTypes from 'prop-types';
import {FocusTrap} from "focus-trap-react";

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {useMoHeaderContext} from '@modules/context/MoHeaderContext';
import {useScrollContext} from "@modules/context/ScrollContext";
import {RouteConfig} from '@modules/config/RouteConfig';
import {routing} from "@/i18n/routing";
import {useWebContext} from "@modules/context/WebviewContext";
import {GnbMap} from "@modules/config/GnbConfig";
import {useUserContext} from '@modules/context/UserContext';
import {usePopContext} from '@modules/context/PopContext';
import {useLoadingContext} from "@modules/context/LoadingContext";

// components
import LanguageChanger from '@components/composite/LanguageChanger';
import ThemeChanger from '@components/composite/ThemeChanger';
import GnbDropdown from '@components/composite/GnbDropdown';

// assets
import {
	ArrowLeft,
	Bell,
	ChevronRight,
	Logo, LogOut,
	Menu,
	X
} from '@assets/icons/Svgs';

// const
const hideHeaderPath = ['/mpad', '/mlogin'];


/**
 * @description: 공통 헤더 입니다.
 * @screenID:    UI-CRM-F281
 * @screenPath:  -
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
Header.propTypes = {
	currentLocale: PropTypes.string,
	cookieViewport: PropTypes.any
};
export default function Header({currentLocale, cookieViewport}) {

	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const {isAccApp, backRNPath, fncPostRN} = useWebContext();
	const {isMobile} = useScreenSizeContext();
	const {scrollY} = useScrollContext();
	const {isLogin} = useUserContext();
	const {fncShowPop, fncClosePop} = usePopContext();
	const {fncRouteStart} = useLoadingContext();
	const shouldHide = hideHeaderPath.some(path => pathname.includes(path));

	// 다국어 페이지 진입 여부
	const [isIntl, setIsIntl] = useState(false);

	// 사이트맵
	const [isSitemap, setIsSitemap] = useState(false);

	// 활성화된 메뉴
	const [activeMenu, setActiveMenu] = useState({gnb: '', lnb: ''});

	// 강제 헤더 배경색 변경
	const [bgInteractive, setBgInteractive] = useState(false);

	// 투명헤더 여부
	let isTransparentHeader = pathname === '/' && scrollY < 28 && !bgInteractive;

	// 활성화 메뉴 표시
	useLayoutEffect(() => {
		const splitPaths = pathname.split('/');

		// 다국어 페이지인지 체크
		if(routing.locales.includes(splitPaths[1])){
			setIsIntl(true);
			return;
		} else {
			setIsIntl(false);
			setBgInteractive(false);
		}

		// 현재 Active 된 메뉴
		const gnbId = splitPaths[1] || '';
		if(gnbId) {
			setActiveMenu({
				gnb: gnbId,
				lnb: pathname
			})
		}

	}, [pathname, searchParams])

	useEffect(() => {
		// 언어설정 드롭다운 열릴시 헤더 배경색 변경
		const handleTransparent = (e) => {
			const detail = e?.detail;
			if(detail) {
				setBgInteractive(detail);
			} else {
				setBgInteractive(prev => !prev);
			}
		}
		window.addEventListener('eventChangeHeaderBg', handleTransparent);

		return () => {
			window.removeEventListener('eventChangeHeaderBg', handleTransparent);
		}
	}, [])

	useEffect(() => {
		if(!isLogin) setActiveMenu({gnb: '', lnb: ''});
	}, [isLogin]);

	// 헤더 배경 색상
	const fncCallListenerChangeHeaderBg = (boolean) => {
		const event = new CustomEvent('eventChangeHeaderBg', {detail: boolean});
		window.dispatchEvent(event);
	}

	// 언어변경 드롭다운 닫기
	const fncCallListenerCloseLanguageChanger = () => {
		const event = new CustomEvent('eventCloseLanguageChanger');
		window.dispatchEvent(event);
	}

	// 사이트맵 Show/Hidden
	const fncToggleSitemap = () => {
		setIsSitemap(!isSitemap);
		const event = new CustomEvent('eventChangeHeaderBg', {detail: !isSitemap});
		window.dispatchEvent(event);
	}

	// 화면 이동: LNB
	const fncGoPage = (lnb) => {
		if(pathname === lnb.uri) return;
		if(lnb.userRequired && !isLogin) {
			return fncShowPop({
				mainText: '로그인 후 이용해주세요.',
				primaryText: '확인',
				onClickPrimary: () => {
					fncClosePop();
					if(!isMobile) setIsSitemap(false);

					const targetUri = RouteConfig.LOGIN.PATH;
					fncRouteStart(targetUri);
					router.push(targetUri);
				}
			})
		}

		setIsSitemap(false);

		const targetUri = lnb.uri;
		fncRouteStart(targetUri);
		router.push(targetUri);
	}

	// 이동: 로그인
	const fncGoLogin = () => {
		setIsSitemap(false);

		const targetUri = RouteConfig.LOGIN.PATH;
		fncRouteStart(targetUri);
		router.push(targetUri);
	}

	// 이동: 회원가입
	const fncGoJoin = () => {
		setIsSitemap(false);

		const targetUri = RouteConfig.JOIN.PATH;
		fncRouteStart(targetUri);
		router.push(targetUri);
	}

	// 이동: 홈
	const fncGoHome = () => {
		setIsSitemap(false);
		setActiveMenu({gnb: '', lnb: ''});

		const targetUri = RouteConfig.HOME.PATH;
		fncRouteStart(targetUri);
		router.push(targetUri);
	}

	// 이동: 알림 내역
	const fncGoAlarm = () => {
		if(!isMobile) setIsSitemap(false);

		const targetUri = RouteConfig.ALARM.PATH;
		fncRouteStart(targetUri);
		router.push(targetUri);
	}

	// 이동: 내 정보
	const fncGoUserInfo = () => {
		const targetUri = RouteConfig.INFO.PATH;
		fncRouteStart(targetUri);
		router.push(targetUri);
	}

	// 이동: 뒤로
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
		} else if ([
			RouteConfig.REFUND.PATH,
			RouteConfig.LOST.PATH,
			RouteConfig.CLAIM.PATH,
			RouteConfig.CHILDPROOF.PATH,
			RouteConfig.CHILDPROOF_HISTORY.PATH
		].includes(pathname) && isAccApp) {
			return fncPostRN({
				id: 'WEB_GO_BACK',
				payload: {},
			})
		} else {
			if([
				RouteConfig.FIND_ID.PATH,
				RouteConfig.FIND_PW.PATH,
			].includes(pathname) &&
				isAccApp
			) {
				router.replace(RouteConfig.LOGIN.PATH);
			} else {
				router.back();
			}
		}
	}

	// 로그아웃
	const fncLogout = () => {
		fncGoHome();
	}

	const fncHandlers = {
		toggleSitemap: fncToggleSitemap,
		callListenerChangeHeaderBg: fncCallListenerChangeHeaderBg,
		callListenerCloseLanguageChanger: fncCallListenerCloseLanguageChanger,
		goPage: fncGoPage,
		goLogin: fncGoLogin,
		goJoin: fncGoJoin,
		goHome: fncGoHome,
		goAlarm: fncGoAlarm,
		goUserInfo: fncGoUserInfo,
		goBack: fncGoBack,
		logout: fncLogout
	}

	const fncCallbackEvent = (fncName, payload = {}) => {
		const fnc = fncHandlers[fncName];
		if (typeof fnc === 'function') return fnc(payload);
	}

	if(shouldHide) return null;
	return (
		<div>
			{/*다국어 페이지 O -> 다국어 Layout 안에 위치*/}
			{
				// 다국어 페이지 X + 모바일 헤더 O
				!isIntl && (isMobile || cookieViewport === 'mobile') && (
					<MoHeader
						fncCallbackEvent={fncCallbackEvent}
						data={{
							currentLocale,
							isSitemap,
							activeMenu,
							isTransparentHeader,
						}}
					/>
				)
			}
			{
				// 다국어 페이지 X + 모바일 헤더 X
				!isIntl && !isMobile && (
					<DtHeader
						fncCallbackEvent={fncCallbackEvent}
						data={{
							currentLocale,
							isSitemap,
							activeMenu,
							isTransparentHeader,
						}}
					/>
				)
			}
		</div>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F281
 */
DtHeader.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function DtHeader({data, fncCallbackEvent}) {

	const {fncLogout} = useUserContext();
	const {isLogin, userInfo, uncheckedNoti} = useUserContext();

	// GNB 활성화 ID
	const [hoveredId, setHoveredId] = useState(null);

	// 헤더 상태에 따른 색
	const stateTransparent = data.isTransparentHeader && !hoveredId;
	const colorSetIcon = stateTransparent ? 'text-white' : 'text-dynamic-icon-neutral-primary';
	const colorSetText = stateTransparent ? 'text-white' : 'text-dynamic-text-neutral-primary';

	useEffect(() => {
		// 언어변경 드롭다운이 열리면 LNB 목록 숨김
		const handleGnbDropdown = (e) => {
			setHoveredId(null);
		}
		window.addEventListener('eventCloseGnbDropdown', handleGnbDropdown);

		return () => {
			window.removeEventListener('eventCloseGnbDropdown', handleGnbDropdown);
		}
	}, [])

	// GNB 호버
	const fncHoverGnbId = (id) => {
		setHoveredId(id);

		// LNB 목록 드롭다운이 열리면 언어변경 드롭다운 숨김
		const event = new CustomEvent('eventCloseLanguageChanger');
		window.dispatchEvent(event);
	}

	// 상태에 따른 텍스트 색상
	const colorGnbTextByState = (isOpen) => {
		if(isOpen) return 'text-dynamic-text-brand-primary';
		else if(stateTransparent) return 'text-white';
		else return 'text-dynamic-text-neutral-primary';
	}

	return (
		<>
			<header
				className={stateTransparent ? 'bg-transparent' : 'bg-dynamic-bg-neutral-base'}
		        onMouseEnter={() => fncCallbackEvent('callListenerChangeHeaderBg', true)}
		        onMouseLeave={() => fncCallbackEvent('callListenerChangeHeaderBg', false)}
			>
				<div className={`inner-header ${stateTransparent ? 'border-0' : 'border-b'}`}>
					<div className={'logo-wrap'}>
						<button
							aria-label={'레일플러스 로고'}
							onClick={() => fncCallbackEvent('goHome')}
					        onFocus={() => fncCallbackEvent('callListenerCloseLanguageChanger')}
					        onMouseEnter={() => fncCallbackEvent('callListenerCloseLanguageChanger')}
						>
							<Logo color={colorSetIcon}/>
						</button>
					</div>
					<nav className={'gnb-wrap'}>
						{
							GnbMap.map((gnb) => {
								const isOpen = hoveredId === gnb.id;
								return (
									<div
										key={gnb.id}
										className={'h-full'}
										role={'none'}
										onMouseLeave={() => setHoveredId(null)}
										onBlur={(e) => {
											if(!e.currentTarget.contains(e.relatedTarget)) {
												setHoveredId(null)
											}
										}}
										onFocus={() => fncHoverGnbId(gnb.id)}
									>
										<button
											className={`
												h-full px-5 py-6
												border-b-2 border-solid border-transparent
												${(isOpen || (data.activeMenu.gnb === gnb.id)) && 'border-b-dynamic-border-brand-primary'}
											`}
											aria-label={`메뉴 대분류: ${gnb.name}`}
											aria-haspopup={true}
											aria-expanded={isOpen}
											aria-current={data.activeMenu.gnb === gnb.id ? 'page' : undefined}
											onMouseEnter={() => fncHoverGnbId(gnb.id)}
											onFocus={() => fncHoverGnbId(gnb.id)}
											onKeyDown={(e) => {
												if(e.key === 'Enter' || e.key === ' ') {
													e.preventDefault();
													fncHoverGnbId(gnb.id);
												}
											}}
										>
											<p className={`text-body-2xl font-semibold ${colorGnbTextByState(isOpen)}`} aria-hidden={true}>
												{gnb.name}
											</p>
										</button>
										<GnbDropdown
											isOpen={isOpen}
											lnb={gnb.lnb}
											activeLnb={data.activeMenu?.lnb}
											onClick={fncCallbackEvent}
										/>
									</div>
								)
							})
						}
					</nav>
					<div className={'end-wrap'}>
						{
							isLogin ? (
								<>
									<button
										className={`flex-row-center w-fit text-body-xl font-medium ${colorSetText} hover:text-dynamic-text-brand-primary hover:underline`}
										aria-hidden={true}
										onClick={() => fncCallbackEvent('goUserInfo')}
										onKeyDown={(e) => {
											if(e.key === 'Enter' || e.key === ' ') fncCallbackEvent('goUserInfo')
										}}
										onFocus={() => fncCallbackEvent('callListenerCloseLanguageChanger')}
										onMouseEnter={() => fncCallbackEvent('callListenerCloseLanguageChanger')}
									>
										<p className={'w-[60px] truncate'}>{`${userInfo?.custNm || '-'} 님`}</p>
										<ChevronRight
											width={20} height={20}
											color={'icon-dynamic-icon-brand-primary'}
										/>
									</button>
									<button
										className={`rounded-6 p-5 ${colorSetIcon} hover:text-dynamic-icon-brand-primary hover:bg-dynamic-bg-neutral-secondary`}
										aria-label={'로그아웃'}
										onClick={() => fncLogout()}
										onKeyDown={(e) => {
											if(e.key === 'Enter' || e.key === ' ') fncLogout()
										}}
										onFocus={() => fncCallbackEvent('callListenerCloseLanguageChanger')}
										onMouseEnter={() => fncCallbackEvent('callListenerCloseLanguageChanger')}
									>
										<LogOut/>
									</button>
									<div className={'relative flex items-center justify-center'}>
										<button
											className={`rounded-6 p-5 ${colorSetIcon} hover:text-dynamic-icon-brand-primary hover:bg-dynamic-bg-neutral-secondary`}
											aria-label={`${uncheckedNoti?.resYn === 'Y' ? '새로운 알림이 있음' : ''} 알림 링크`}
											onClick={() => fncCallbackEvent('goAlarm')}
											onKeyDown={(e) => {
												if(e.key === 'Enter' || e.key === ' ') fncCallbackEvent('goAlarm')
											}}
											onFocus={() => fncCallbackEvent('callListenerCloseLanguageChanger')}
											onMouseEnter={() => fncCallbackEvent('callListenerCloseLanguageChanger')}
										>
											<Bell />
										</button>
										{
											uncheckedNoti?.resYn === 'Y' && <div className={'new-alarm'} aria-hidden={true} />
										}
									</div>
								</>
							) : (
								<div className={'flex-row-center gap-5'}>
									<button
										className={`w-fit text-body-xl font-medium ${colorSetText} hover:text-dynamic-text-brand-primary hover:underline`}
										aria-label={'로그인 링크'}
										onClick={() => fncCallbackEvent('goLogin')}
										onKeyDown={(e) => {
											if(e.key === 'Enter' || e.key === ' ') fncCallbackEvent('goLogin')
										}}
										onFocus={() => fncCallbackEvent('callListenerCloseLanguageChanger')}
										onMouseEnter={() => fncCallbackEvent('callListenerCloseLanguageChanger')}
									>
										{`로그인`}
									</button>
									<span className={colorSetText} aria-hidden={true}>/</span>
									<button
										className={`w-fit text-body-xl font-medium ${colorSetText} mr-10 hover:text-dynamic-text-brand-primary hover:underline`}
										aria-label={'회원가입 링크'}
										onClick={() => fncCallbackEvent('goJoin')}
										onKeyDown={(e) => {
											if(e.key === 'Enter' || e.key === ' ') fncCallbackEvent('goJoin')
										}}
										onFocus={() => fncCallbackEvent('callListenerCloseLanguageChanger')}
										onMouseEnter={() => fncCallbackEvent('callListenerCloseLanguageChanger')}
									>
										{`회원가입`}
									</button>
								</div>
							)
						}
						<LanguageChanger
							currentLan={data.currentLocale}
							isTransparentHeader={data.isTransparentHeader}
						/>
						<button
							className={`rounded-6 p-5 ${colorSetIcon} hover:text-dynamic-icon-brand-primary hover:bg-dynamic-bg-neutral-secondary`}
					        aria-label={'전체 메뉴 드롭다운'}
					        onClick={() => fncCallbackEvent('toggleSitemap')}
							onKeyDown={(e) => {
								if(e.key === 'Enter' || e.key === ' ') fncCallbackEvent('toggleSitemap')
							}}
					        onFocus={() => fncCallbackEvent('callListenerCloseLanguageChanger')}
					        onMouseEnter={() => fncCallbackEvent('callListenerCloseLanguageChanger')}
						>
							<Menu />
						</button>
						<ThemeChanger />
					</div>
				</div>
			</header>
			{
				// 사이트 맵
				data.isSitemap && (
					<FocusTrap
						active={true}
						focusTrapOptions={{
							escapeDeactivates: true,
							clickOutsideDeactivates: true,
							initialFocus: '#sitemap-title',
							returnFocusOnDeactivate: true,
						}}
					>
						<div
							className={'dt-sitemap-wrap'}
							role={'dialog'}
							aria-labelledby={'sitemap-title'}
						>
							<div className={'sitemap-inner-wrap'}>
								<div className={'sitemap-title-wrap'}>
									<p
										className={'text-dynamic-icon-brand-primary'}
										id={'sitemap-title'}
										aria-label={'전체메뉴'}
										tabIndex={0}
									>
										<span className={'text-heading-sm font-semibold mr-16'} aria-hidden={true}>
											전체메뉴
										</span>
										<span className={'font-prosto'} aria-hidden={true}>
											SITEMAP
										</span>
									</p>
									<button
										id={'close'} aria-label={'전체 메뉴 닫기'}
										onClick={() => fncCallbackEvent('toggleSitemap')}
										onKeyDown={(e) => {
											if(e.key === 'Enter' || e.key === ' ') fncCallbackEvent('toggleSitemap')
										}}
									>
										<X
											width={32} height={32}
											color={'text-dynamic-icon-neutral-primary'}
										/>
									</button>
								</div>
								<div>
									{
										GnbMap.map((gnb) => (
											<div key={gnb.id} className={'sitemap-group-wrap'}>
												<p className={'sitemap-gnb-wrap'} aria-label={`메뉴 대분류: ${gnb.name}`}>
													{gnb.name}
												</p>
												<div className={'sitemap-lnb-wrap grid-cols-2 wide:grid-cols-4'}>
													{
														gnb.lnb?.map((lnb) => (
															<button
																key={lnb.id}
														        aria-label={`메뉴 소분류: ${lnb.name}`}
														        onClick={() => fncCallbackEvent('goPage', lnb)}
															>
																{lnb.name}
															</button>
														))
													}
												</div>
											</div>
										))
									}
									{
										isLogin && (
											<div className={'sitemap-group-wrap'}>
												<div className={'sitemap-gnb-wrap'} aria-label={`메뉴 대분류: 알림내역`}>
													알림내역
												</div>
												<div className={'sitemap-lnb-wrap grid-cols-2 wide:grid-cols-4'}>
													<button onClick={() => fncCallbackEvent('goPage', {uri: RouteConfig.ALARM.PATH, userRequired: true})}
													        aria-label={`메뉴 소분류: 알림`}>
														알림
													</button>
												</div>
											</div>
										)
									}
								</div>
							</div>
						</div>
					</FocusTrap>
				)
			}
		</>
	);
}

/**
 * @description: Mobile
 * @screenID:    -
 */
MoHeader.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function MoHeader({data, fncCallbackEvent}) {

	const router = useRouter();
	const {isAccApp} = useWebContext();
	const {headerType, headerTitle} = useMoHeaderContext();
	const {uncheckedNoti} = useUserContext();
	const {isLogin} = useUserContext();
	const {fncRouteStart} = useLoadingContext();

	// 헤더 상태에 따른 색
	const stateTransparent = data.isTransparentHeader;
	const colorSetIcon = data.isTransparentHeader ? 'text-white' : 'text-dynamic-icon-neutral-primary';

	// 사이트맵 보기: 모바일은 페이지 이동
	const fncToggleSitemap = () => {
		const targetUri = RouteConfig.SITEMAP.PATH;
		fncRouteStart(targetUri);
		router.push(targetUri);
	}

	// 이동: 뒤로가기
	const fncGoBack = () => {
		router.back();
	}

	return (
		<header
			className={stateTransparent ? 'bg-transparent' : 'bg-dynamic-bg-neutral-base'}
			role={'none'}
			onMouseEnter={() => fncCallbackEvent('callListenerChangeHeaderBg', true)}
			onMouseLeave={() => fncCallbackEvent('callListenerChangeHeaderBg', false)}
		>
			<div className={'inner-header'} style={{height: 60}}>
				{
					['main'].includes(headerType) && (
						// case: 로고 + 메뉴 아이콘
						<>
							<button
								id={'logo'}
						        aria-label={'회사 로고, 홈으로 이동'}
						        onClick={() => fncCallbackEvent('goHome')}
								onKeyDown={(e) => {
									if(e.key === 'Enter' || e.key === ' ') {
										e.preventDefault();
										fncCallbackEvent('goHome');
									}
								}}
						        onFocus={() => fncCallbackEvent('callListenerCloseLanguageChanger')}
						        onMouseEnter={() => fncCallbackEvent('callListenerCloseLanguageChanger')}
							>
								<Logo color={colorSetIcon}/>
							</button>
							<div className={'flex-row-center gap-10'}>
								<LanguageChanger
									currentLan={data.currentLocale}
									isTransparentHeader={stateTransparent}
								/>
								<button
									className={`rounded-6 p-5 ${colorSetIcon} hover:text-dynamic-icon-brand-primary hover:bg-dynamic-bg-neutral-secondary`}
							        aria-label={'전체 메뉴 열기'}
							        onClick={fncToggleSitemap}
							        onFocus={() => fncCallbackEvent('callListenerCloseLanguageChanger')}
							        onMouseEnter={() => fncCallbackEvent('callListenerCloseLanguageChanger')}
								>
									<Menu />
								</button>
								<ThemeChanger />
							</div>
						</>
					)
				}
				{
					['sitemap'].includes(headerType) && (
						// case: 로고 + 메뉴 아이콘
						<>
							<button
								id={'logo'}
								aria-label={'회사 로고, 홈으로 이동'}
								onClick={() => fncCallbackEvent('goHome')}
								onKeyDown={(e) => {
									if(e.key === 'Enter' || e.key === ' ') {
										e.preventDefault();
										fncCallbackEvent('goHome');
									}
								}}
							>
								<Logo color={colorSetIcon}/>
							</button>
							<div className={'flex-row-center gap-10'}>
								{
									isLogin && (
										<div className={'relative flex items-center justify-center'}>
											<button
												aria-label={'알림 이동'}
												className={`rounded-6 p-5 ${colorSetIcon} hover:text-dynamic-icon-brand-primary hover:bg-dynamic-bg-neutral-secondary`}
												onClick={() => fncCallbackEvent('goAlarm')}
												onFocus={() => fncCallbackEvent('callListenerCloseLanguageChanger')}
												onMouseEnter={() => fncCallbackEvent('callListenerCloseLanguageChanger')}
											>
												<Bell />
											</button>
											{
												uncheckedNoti?.resYn === 'Y' && <div className={'new-alarm'}/>
											}
										</div>
									)
								}
								<LanguageChanger
									currentLan={data.currentLocale}
									isTransparentHeader={stateTransparent}
								/>
								<button
									className={`rounded-6 p-5 ${colorSetIcon} hover:text-dynamic-icon-brand-primary hover:bg-dynamic-bg-neutral-secondary`}
									aria-label={'전체 메뉴 열기'}
									onClick={fncGoBack}
								>
									<X/>
								</button>
							</div>
						</>
					)
				}
				{
					['back'].includes(headerType) && (
						// case: 뒤로가기 아이콘 + 페이지명
						<>
							<button
								aria-label={'이전 페이지로 이동'}
								onClick={() => fncCallbackEvent('goBack')}
								onKeyDown={(e) => {
									if(e.key === 'Enter' || e.key === ' ') {
										e.preventDefault();
										fncCallbackEvent('goBack');
									}
								}}
							>
								<ArrowLeft color={colorSetIcon}/>
							</button>
							<div className={'w-full flex flex-row items-center justify-center'}>
								{
									isAccApp ? (
										<p className={'text-body-2xl text-dynamic-text-neutral-primary font-semibold'}>
											{headerTitle}
										</p>
									) : (
										<h1 className={'text-body-2xl text-dynamic-text-neutral-primary font-semibold'}>
											{headerTitle}
										</h1>
									)
								}
							</div>
						</>
					)
				}
				{
					['close'].includes(headerType) && (
						// case: 페이지명 + 닫기 아이콘
						<>
							<div className={'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'}>
								{
									isAccApp ? (
										<p className={'text-body-2xl text-dynamic-text-neutral-primary font-semibold'}>
											{headerTitle}
										</p>
									) : (
										<h1 className={'text-body-2xl text-dynamic-text-neutral-primary font-semibold'}>
											{headerTitle}
										</h1>
									)
								}
							</div>
							<button
								aria-label={'닫기'}
								onClick={() => fncCallbackEvent('close')}
								onKeyDown={(e) => {
									if(e.key === 'Enter' || e.key === ' ') {
										e.preventDefault();
										fncCallbackEvent('close');
									}
								}}
							>
								<X color={'text-dynamic-icon-neutral-primary'}/>
							</button>
						</>
					)
				}
			</div>
		</header>
	)
}
