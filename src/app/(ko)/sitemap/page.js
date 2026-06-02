'use client'

import React, {useLayoutEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {usePathname, useRouter} from 'next/navigation';
import clsx from "clsx";

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {useMoHeaderContext} from '@modules/context/MoHeaderContext';
import {RouteConfig} from '@modules/config/RouteConfig';
import {useThemeContext} from '@modules/context/ThemeContext';
import {GnbMap} from '@modules/config/GnbConfig';
import {useLoadingContext} from '@modules/context/LoadingContext';
import {useUserContext} from '@modules/context/UserContext';
import {usePopContext} from "@modules/context/PopContext";

// components
import {DtNotFound} from '@/app/not-found';

// assets
import {ChevronRight, LogOut, Smile} from '@assets/icons/Svgs';


/**
 * @description: 사이트맵 화면 입니다. (반응형 Mobile Only)
 * @screenID:    UI-CRM-F281
 * @screenPath:  홈 > 사이트맵
 * @author       $Author
 * @since        $Date
 * @version      $Revision
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function Sitemap() {

	const router = useRouter();
	const pathname = usePathname();
	const {isMobile} = useScreenSizeContext();
	const {fncChangeMoHeader} = useMoHeaderContext();
	const {isLogin, fncLogout} = useUserContext();
	const {fncShowPop, fncClosePop} = usePopContext();
    const {fncRouteStart} = useLoadingContext();

	useLayoutEffect(() => {
		if(isMobile) {
			fncChangeMoHeader({
				type: 'sitemap',
				title: '전체메뉴'
			})
		}
	}, [isMobile])

	// 화면 이동: LNB
	const fncGoPage = (lnb) => {
		if(pathname === lnb.uri) return;
		if(lnb.userRequired && !isLogin) {
			return fncShowPop({
				mainText: '로그인 후 이용해주세요.',
				primaryText: '확인',
				onClickPrimary: () => {
					fncClosePop();

					const targetUri = RouteConfig.LOGIN.PATH;
					fncRouteStart(targetUri);
					router.push(targetUri);
				}
			})
		}

		const targetUri = lnb.uri;
		fncRouteStart(targetUri);
		router.push(targetUri);
	}

	// 이동: 로그인
	const fncGoLogin = () => {
		const targetUri = RouteConfig.LOGIN.PATH;
		fncRouteStart(targetUri);
		router.push(targetUri);
	}

	// 이동: 뒤로
	const fncGoBack = () => {
		router.back();
	}

	// 로그아웃
	const fncHandleLogout = () => {
		fncLogout();
	}

	const fncHandlers = {
		goPage: fncGoPage,
		goLogin: fncGoLogin,
		goBack: fncGoBack,
		logout: fncHandleLogout,
	}

	const fncCallbackEvent = (fncName, payload = {}) => {
		const fnc = fncHandlers[fncName];
		if (typeof fnc === 'function') return fnc(payload);
	}

	if (isMobile) return (
		<MoSitemap
			fncCallbackEvent={fncCallbackEvent}
		/>
	);
	else return (
		<DtNotFound
			fncCallbackEvent={fncCallbackEvent}
		/>
	);
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F488
 */
MoSitemap.propTypes = {
	fncCallbackEvent: PropTypes.func
};
export function MoSitemap({fncCallbackEvent}) {

	const {theme} = useThemeContext();
	const {isLogin, userInfo} = useUserContext();
	const {historyPath} = useLoadingContext();

	// 선택된 GNB 값
	const [selectedGnb, setSelectedGnb] = useState(GnbMap[0].id);

	// hovered GNB
	const [hoverId, setHoverId] = useState(null);

    // 이전 페이지 클릭 정보
	useLayoutEffect(() => {
		if(historyPath) {
			const split = historyPath.split('/');
			const isExist = GnbMap.filter(el => el.id === split[1]);
			isExist.length > 0 && setSelectedGnb(split[1])
		}
	}, [historyPath]);

	// GNB 선택
	const fncSelectGnb = (gnb) => {
		setSelectedGnb(gnb.id);
	};


	return (
		<main
			id={'mo-sitemap'}
			className={'w-full h-full min-h-[calc(100dvh-51px)] flex flex-1 flex-col'}
			aria-labelledby={'page-name-mo'}
		>
			<h1 id={'page-name-mo'} className={'sr-only'}>모바일 전체 메뉴</h1>
			<div className={'my-wrap'}>
				{
					isLogin ? (
						<>
							<div className={'flex-col-start'}>
								<div className={'flex-row-start gap-2'}>
									<p className={'text-body-md text-neutral-10 font-medium'}>
										안녕하세요
									</p>
									<Smile/>
								</div>
								<p className={'text-heading-md text-neutral-10 font-semibold'}>
									{`${userInfo?.custNm || '-'} 님`}
								</p>
							</div>
							<button
								aria-label={'로그아웃'}
								className={'hover:text-[#00A867]'}
								onClick={() => fncCallbackEvent('logout')}
								onKeyDown={(e) => {
									if(e.key === 'Enter' || e.key === ' ') fncCallbackEvent('logout')
								}}
							>
								<LogOut/>
							</button>
						</>
					) : (
						<button className={'flex flex-row items-center gap-2'}
								onClick={() => fncCallbackEvent('goLogin')}>
							<p className={'text-heading-md text-neutral-10 font-semibold'}>
								로그인 해주세요
							</p>
							<ChevronRight/>
						</button>
					)
				}
			</div>
			<div className={'gnb-wrap'}>
				{
					GnbMap.map((gnb) => {
						const isOpen = gnb.id === selectedGnb;
						const isHover = gnb.id === hoverId;
						let icon = gnb.icon.nonActive;
						if (isOpen || isHover) {
							if (theme === 'dark') icon = gnb.icon.activeDark;
							else icon = gnb.icon.activeLight;
						}

						return (
							<nav className={'flex flex-row w-full '} key={gnb.id} role={'navigation'}>
								{/* Depth 1 */}
								<div className={'depth-1'} aria-label={'1차 메뉴(대분류)'}>
									<button
										className={`gnb-item ${isOpen && 'bg-dynamic-bg-neutral-primary'} group/gnb`}
										aria-label={`메뉴 대분류: ${gnb.name}`}
										aria-current={isOpen ? 'true' : undefined}
										onClick={() => fncSelectGnb(gnb)}
										onKeyDown={(e) => {
											if(e.key === 'Enter' || e.key === ' ') fncSelectGnb(gnb);
										}}
										onMouseEnter={() => setHoverId(gnb.id)}
										onMouseLeave={() => setHoverId(null)}
										onFocus={() => setHoverId(gnb.id)}
										onBlur={() => setHoverId(null)}
									>
										{icon}
										<p className={clsx(
											'text-body-lg font-semibold group-hover/gnb:text-dynamic-text-neutral-primary',
											isOpen ? 'text-dynamic-text-neutral-primary' : 'text-dynamic-text-neutral-secondary'
										)}>
											{gnb.name}
										</p>
									</button>
								</div>
								{
									// Depth 2
									isOpen && (
										<div className={'depth-2'} aria-label={'2차 메뉴(소분류)'}>
											{
												gnb.lnb.map((lnb) => (
													<button
														key={lnb.id}
														className={'lnb-item'}
														aria-label={`메뉴 소분류: ${lnb.name}`}
														onClick={() => fncCallbackEvent('goPage', lnb)}
														onKeyDown={(e) => {
															if(e.key === 'Enter' || e.key === ' ') fncCallbackEvent('goPage', lnb);
														}}
													>
														<p className={'lnb-name'}>
															{lnb.name}
														</p>
														<ChevronRight
															width={20} height={20}
															color={'text-dynamic-icon-neutral-primary'}
														/>
													</button>
												))
											}
										</div>
									)
								}
							</nav>
						)
					})
				}
			</div>
		</main>
	)
}
