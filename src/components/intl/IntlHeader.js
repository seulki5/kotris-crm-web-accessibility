'use client';

import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {useLocale, useTranslations} from "next-intl";
import {usePathname, useRouter} from '@/i18n/navigation';
import clsx from "clsx";

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {RouteIntlConfig} from '@modules/config/RouteConfig';
import {useThemeContext} from '@modules/context/ThemeContext';
import {useLoadingContext} from "@modules/context/LoadingContext";

// components
import LanguageChanger from '@components/composite/LanguageChanger';
import ThemeChanger from '@components/composite/ThemeChanger';
import Dropdown from "@components/composite/Dropdown";

// assets
import {CheckBold, Logo, Menu} from '@assets/icons/Svgs';
import {FontBody2xlClasses} from "@/styles/intlFontSizeClasses";


/**
 * @description: 공통 헤더(다국어) 입니다.
 * @screenID:    UI-CRM-F281
 * @screenPath:  -
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function IntlHeader() {
	
	const router = useRouter();
	const pathname = usePathname();
	const currentLocale = useLocale();
	const {isMobile} = useScreenSizeContext();
	const {fncRouteStart} = useLoadingContext();


	// 최종 메뉴 목록
	const gnbMap = [
		{
			id: 'discount',
			name: 'GNB.REGISTRATION_DISCOUNT',
			url: RouteIntlConfig.DISCOUNT.PATH
		},
		{
			id: 'howtouse',
			name: 'GNB.HOW_TO_USE',
			url: RouteIntlConfig.HOWTOUSE.PATH
		},
	];
	
	// 활성화된 메뉴
	const [activeMenu, setActiveMenu] = useState({gnb: ''});
	
	// 활성화 메뉴 표시
	useEffect(() => {
		const splitPaths = pathname.split('/');
		const gnbId = splitPaths[1] || '';
		if(gnbId){
			setActiveMenu(gnbId);
		}
	}, [pathname])
	
	// 언어변경 드롭다운 닫기
	const fncCallListenerCloseLanguageChanger = () => {
		const event = new CustomEvent('eventCloseLanguageChanger');
		window.dispatchEvent(event);
	}
	
	// 화면 이동: LNB
	const fncGoPage = (gnb) => {
		const targetUri = gnb.url;
		fncRouteStart(targetUri, {locale: currentLocale});
		router.push(targetUri);
	}
	
	// 이동: 홈
	const fncGoHome = () => {
		const targetUri = RouteIntlConfig.HOWTOUSE.PATH;
		fncRouteStart(targetUri, {locale: currentLocale});
		router.push(targetUri);
	}
	
	// 이동: 뒤로
	const fncGoBack = () => {
		router.back();
	}
	
	const fncHandlers = {
		callListenerCloseLanguageChanger: fncCallListenerCloseLanguageChanger,
		goPage: fncGoPage,
		goHome: fncGoHome,
		goBack: fncGoBack,
	}
	
	const fncCallbackEvent = (fncName, payload = {}) => {
		const fnc = fncHandlers[fncName];
		if (typeof fnc === 'function') return fnc(payload);
	}
	
	if (isMobile) return (
		<MoIntlHeader
			fncCallbackEvent={fncCallbackEvent}
			data={{
				currentLocale,
				gnbMap,
				activeMenu,
			}}
		/>
	)
	else return (
		<DtIntlHeader
			fncCallbackEvent={fncCallbackEvent}
			data={{
				currentLocale,
				gnbMap,
				activeMenu,
			}}
		/>
	)
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F281
 */
DtIntlHeader.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function DtIntlHeader({data, fncCallbackEvent}) {
	
	const t = useTranslations();
	const locale = useLocale();
	
	// GNB 활성화 ID
	const [hoveredId, setHoveredId] = useState(null);
	
	// GNB 호버
	const fncHoverGnbId = (id) => {
		setHoveredId(id);
		
		// GNB 호버하면 언어변경 드롭다운 숨김
		const event = new CustomEvent('eventCloseLanguageChanger');
		window.dispatchEvent(event);
	}
	
	// 상태에 따른 텍스트 색상
	const colorGnbTextByState = (isOpen) => {
		if(isOpen) return 'text-dynamic-text-brand-primary';
		else return 'text-dynamic-text-neutral-primary';
	}
	
	return (
		<header
			className={'bg-dynamic-bg-neutral-base'}
			role={'none'}
			onMouseLeave={() => setHoveredId(null)}
		>
			<div className={`inner-header relative border-b`}>
				<div className={'logo-wrap'}>
					<button
						aria-label={t('HEADER.COMPANY_LOGO')}
						onClick={() => fncCallbackEvent('goHome')}
						onFocus={() => fncCallbackEvent('callListenerCloseLanguageChanger')}
						onMouseEnter={() => fncCallbackEvent('callListenerCloseLanguageChanger')}
					>
						<Logo color={'text-dynamic-icon-neutral-primary'}/>
					</button>
				</div>
				<div className={'gnb-wrap'} aria-label={t('HEADER.SITE_MENUS')}>
					{
						data?.gnbMap.map((gnb) => {
							const isOpen = hoveredId === gnb.id || data.activeMenu === gnb.id;
							return (
								<button
									key={gnb.id}
									className={`
										h-full px-5 py-6
										border-b-2 border-solid border-transparent
										${(isOpen || data.activeMenu.gnb === gnb.id) && 'border-b-dynamic-border-brand-primary'}
									`}
									aria-label={gnb.name}
									aria-haspopup={true}
									aria-expanded={isOpen}
									aria-current={data.activeMenu.gnb === gnb.id ? 'page' : undefined}
									onMouseEnter={() => fncHoverGnbId(gnb.id)}
									onFocus={() => fncHoverGnbId(gnb.id)}
									onClick={() => fncCallbackEvent('goPage', gnb)}
									onKeyDown={(e) => {
										if(e.key === 'Enter' || e.key === ' ') {
											e.preventDefault();
											fncCallbackEvent('goPage', gnb);
										}
									}}
								>
									<p className={clsx('font-semibold', colorGnbTextByState(isOpen), FontBody2xlClasses[locale])}>
										{t(gnb.name)}
									</p>
								</button>
							)
						})
					}
				</div>
				<div className='end-wrap'>
					<LanguageChanger
						currentLan={data.currentLocale}
						isTransparentHeader={false}
					/>
					<ThemeChanger />
				</div>
			</div>
		</header>
	);
}

/**
 * @description: Mobile
 * @screenID:    -
 */
MoIntlHeader.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function MoIntlHeader({data, fncCallbackEvent}) {
	
	const t = useTranslations();
	const dropdownRef = useRef(null);
	const {theme} = useThemeContext();
	
	// 전체메뉴 드롭다운
	const [isDropdown, setIsDropdown] = useState(false);
	
	useEffect(() => {
		// GNB hover시 드롭다운 닫기
		const handleCloseDropdown = (e) => {
			setIsDropdown(false);
		}
		window.addEventListener('eventCloseIntlGnbMenu', handleCloseDropdown);
		
		return () => {
			window.removeEventListener('eventCloseIntlGnbMenu', handleCloseDropdown);
		}
	}, [])
	
	// 전체 메뉴 드롭다운 보이기/숨기기
	const fncShowDropdown = () => {
		setIsDropdown(!isDropdown);
	}
	
	// 언어변경, 전체 메뉴 드롭다운 닫기
	const fncCallListeners = () => {
		fncCallbackEvent('callListenerCloseLanguageChanger');
		setIsDropdown(false);
	}
	
	// 아이콘 색상
	const iconColorByState = () => {
		if(isDropdown) return 'text-dynamic-icon-brand-primary';
		else if(theme === 'dark') return 'text-dynamic-icon-neutral-primary';
		else return 'text-dynamic-icon-neutral-primary';
	}
	
	return (
		<header className={'bg-dynamic-bg-neutral-base'}>
			<div className={'inner-header'}>
				<button
					id={'logo'}
					aria-label={t('HEADER.COMPANY_LOGO')}
					onClick={() => fncCallbackEvent('goHome')}
					onKeyDown={(e) => {
						if(e.key === 'Enter' || e.key === ' '){
							fncCallbackEvent('goHome');
						}
					}}
					onFocus={fncCallListeners}
					onMouseEnter={fncCallListeners}
				>
					<Logo color={'text-dynamic-icon-neutral-primary'}/>
				</button>
				<div className={'flex-row-center gap-10'}>
					<LanguageChanger
						currentLan={data.currentLocale}
						isTransparentHeader={false}
					/>
					<button
						className={clsx(
							'rounded-6 p-5',
							'hover:text-dynamic-icon-brand-primary hover:bg-dynamic-bg-neutral-secondary',
							iconColorByState(),
							isDropdown && 'text-dynamic-icon-brand-primary bg-dynamic-bg-neutral-secondary'
						)}
						aria-label={t('HEADER.OPEN_MENU')}
						onClick={fncShowDropdown}
						onFocus={() => fncCallbackEvent('callListenerCloseLanguageChanger')}
						onMouseEnter={() => fncCallbackEvent('callListenerCloseLanguageChanger')}
					>
						<Menu />
					</button>
					<Dropdown
						isOpen={isDropdown}
						top={60}
						position={'left-0'}
						customStyle={'rounded-none border-solid border-t-dynamic-border-neutral-primary overflow-x-hidden border-t'}
					>
						<div
							ref={dropdownRef}
							className={'w-screen'}
							role={'none'}
							onMouseLeave={() => setIsDropdown(false)}
						>
							{
								data.gnbMap.map((gnb, index) => {
									const isOpen = data.activeMenu === gnb.id;
									return (
										<div key={gnb.id}>
											{index === 0 && <div className={'h-[36px]'} />}
											<button
												aria-label={gnb.name}
												aria-haspopup={true}
												aria-expanded={isOpen}
												aria-current={data.activeMenu.gnb === gnb.id ? 'page' : undefined}
												onClick={() => {
													setIsDropdown(false);
													fncCallbackEvent('goPage', gnb);
												}}
												onKeyDown={(e) => {
													if(e.key === 'Enter' || e.key === ' ') {
														e.preventDefault();
														setIsDropdown(false);
														fncCallbackEvent('goPage', gnb);
													}
												}}
												className={`
													w-full min-h-[43px] px-16 text-start flex-row-center justify-center gap-4
													${isOpen && 'text-dynamic-text-brand-primary'}
													hover:bg-dynamic-bg-neutral-secondary
												`}>
												<span>{t(gnb.name)}</span>
												{
													isOpen && (
														<CheckBold
															width={20} height={20}
															color={'text-dynamic-icon-brand-primary-bold'}
														/>
													)
												}
											</button>
											{index === data.gnbMap.length - 1 && <div className={'h-[36px]'} />}
										</div>
									)
								})
							}
						</div>
					</Dropdown>
					<ThemeChanger />
				</div>
			</div>
		</header>
	)
}
