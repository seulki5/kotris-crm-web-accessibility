'use client'

import React, {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import PropTypes from 'prop-types';

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {useThemeContext} from '@modules/context/ThemeContext';
import {LanguageOptions} from '@modules/consants/Options';
import {useLoadingContext} from '@modules/context/LoadingContext';
import {useUserContext} from "@modules/context/UserContext";

// components
import Dropdown from '@components/composite/Dropdown';

// assets
import {CheckBold, Global} from '@assets/icons/Svgs';


/**
 * @description: 공통 언어 변경 컴포넌트 입니다.
 * @screenID:    -
 * @screenPath:  -
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
LanguageChanger.propTypes = {
	currentLan: PropTypes.string,
	isTransparentHeader: PropTypes.bool,
};
export default function LanguageChanger({currentLan, isTransparentHeader}) {

	const router = useRouter();
	const dropdownRef = useRef(null);
	const toggleRef = useRef(null);
	const {isMobile} = useScreenSizeContext();
	const {theme} = useThemeContext();
	const {fncRouteStart} = useLoadingContext();
	const {isLogin, fncLogout} = useUserContext();

	// 적용 언어
	const [isLanguage, setIsLanguage] = useState(currentLan);

	// 언어변경 드롭다운
	const [isDropdown, setIsDropdown] = useState(false);

	useEffect(() => {
		// 바깥 클릭시 드롭다운 닫기
		function fncClickOutside(e) {
			if(dropdownRef.current && !dropdownRef.current.contains(e.target)) {
				setIsDropdown(false);
			}
		}
		document.addEventListener('mousedown', fncClickOutside, true)

		// GNB hover시 드롭다운 닫기
		const handleCloseDropdown = (e) => {
			setIsDropdown(false);
		}
		window.addEventListener('eventCloseLanguageChanger', handleCloseDropdown);

		return () => {
			document.removeEventListener('mousedown', fncClickOutside, true);
			window.removeEventListener('eventCloseLanguageChanger', handleCloseDropdown);
		}
	}, [])

	// 언어변경 드롭다운 보이기/숨기기
	const fncShowDropdown = () => {
		setIsDropdown(!isDropdown);

		// 언어변경 드롭다운이 열리면 LNB 목록 드롭다운 숨김
		if(!isDropdown) {
			const eventCloseGnbDropdown = new CustomEvent('eventCloseGnbDropdown');
			window.dispatchEvent(eventCloseGnbDropdown);

			const eventChangeHeaderBg = new CustomEvent('eventChangeHeaderBg', {detail: true});
			window.dispatchEvent(eventChangeHeaderBg);
		}
	}

	// 언어 적용
	const fncChangeLanguage = (e, id) => {
		e.stopPropagation();
		setIsLanguage(id);
		setIsDropdown(false);

		if (id === 'ko') {
			fncRouteStart('/');
			router.push('/');
		} else {
			if(isLogin) fncLogout(false);
			fncRouteStart(`/${id}`);
			router.push(`/${id}`);
		}
	}

	// 모바일 다국어페이지에서 전체메뉴 드롭다운 닫기
	const fncCallListeners = () => {
		const eventCloseIntlGnbMenu = new CustomEvent('eventCloseIntlGnbMenu');
		window.dispatchEvent(eventCloseIntlGnbMenu);
	}

	// 아이콘 색상
	const iconColorByState = () => {
		if(isDropdown) return 'text-dynamic-icon-brand-primary';
		else if(isTransparentHeader) return 'text-white';
		else if(theme === 'dark') return 'text-dynamic-icon-neutral-primary';
		else return 'text-dynamic-icon-neutral-primary';
	}

	return (
		<div
			className={`flex items-center ${!isMobile && 'relative'}`}
			onFocus={fncCallListeners}
			onMouseEnter={fncCallListeners}
		>
			<div className={'flex-col-center'} ref={toggleRef}>
				<button
					className={`
						rounded-6 p-5
						${iconColorByState()}
						hover:text-dynamic-icon-brand-primary
						hover:bg-dynamic-bg-neutral-secondary
						${isDropdown && 'text-dynamic-icon-brand-primary bg-dynamic-bg-neutral-secondary'}
					`}
					aria-label={'사이트 언어 변경 드롭다운'}
					onClick={fncShowDropdown}
		        >
					<Global width={24} height={24} />
				</button>
			</div>
			{
				isMobile ? (
					<Dropdown
						isOpen={isDropdown}
						top={60}
						position={'left-0'}
						customStyle={`
							rounded-none border-solid border-t-dynamic-border-neutral-primary overflow-x-hidden
							${isTransparentHeader ? 'border-0' : 'border-t'}
						`}
					>
						<div
							ref={dropdownRef}
							className={'w-screen'}
					        role={'none'}
					        onMouseLeave={() => setIsDropdown(false)}
						>
							{
								LanguageOptions.map((lan) => {
									const isApplied = isLanguage === lan.id;
									return (
										<button
											key={lan.id}
											aria-label={`${lan.ariaLabel} ${isApplied ? '적용됨' : ''}`}
											aria-current={isApplied ? 'true' : undefined}
											onClick={(e) => fncChangeLanguage(e, lan.id)}
											className={`
												w-full min-h-[43px] px-16 text-start flex-row-center justify-center gap-4
												${isApplied && 'text-dynamic-text-brand-primary'}
												hover:bg-dynamic-bg-neutral-secondary
											`}>
											<span>{lan.name}</span>
											{
												isApplied && (
													<CheckBold
														width={20} height={20}
														color={'text-dynamic-icon-brand-primary-bold'}
													/>
												)
											}
										</button>
									)
								})
							}
						</div>
					</Dropdown>
				) : (
					<Dropdown
						isOpen={isDropdown}
						top={40}
						position={'right-0'}
					>
						<div
							ref={dropdownRef}
							className={'min-w-[154px] px-8'}
					        role={'none'}
							onMouseLeave={() => setIsDropdown(false)}
						>
							{
								LanguageOptions.map((lan) => {
									const isApplied = isLanguage === lan.id;
									return (
										<button
											key={lan.id}
											aria-label={`언어: ${lan.name}`}
											aria-current={isApplied ? 'true' : undefined}
											onClick={(e) => fncChangeLanguage(e, lan.id)}
											className={
												`w-full min-h-[43px] px-8 text-start flex-row-center justify-between
												${isApplied && 'text-dynamic-text-brand-primary'}
												hover:bg-dynamic-bg-neutral-secondary
											`}>
											<span>{lan.name}</span>
											{
												isApplied && (
													<CheckBold
														width={20} height={20}
														color={'text-dynamic-icon-brand-primary-bold'}
													/>
												)
											}
										</button>
									)
								})
							}
						</div>
					</Dropdown>
				)
			}
		</div>
	);
}
