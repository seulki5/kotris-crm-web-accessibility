'use client'

import React from 'react';

// modules
import {useThemeContext} from '@modules/context/ThemeContext';

// assets
import {Day, Night} from '@assets/icons/Svgs';


/**
 * @description: 공통 테마 변경 컴포넌트 입니다.
 * @screenID:    -
 * @screenPath:  -
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function ThemeChanger() {

	const { theme, applyTheme } = useThemeContext();
	const isDark = theme === 'dark';

	// 테마 적용
	const fncApplyTheme = () => {
		if(theme === 'light') applyTheme('dark')
		else applyTheme('light')
	}

	// 언어변경, 전체메뉴(intl only) 드롭다운 닫기
	const fncCallListenerCloseLanguageChanger = () => {
		const eventCloseLanguageChanger = new CustomEvent('eventCloseLanguageChanger');
		window.dispatchEvent(eventCloseLanguageChanger);

		const eventCloseIntlGnbMenu = new CustomEvent('eventCloseIntlGnbMenu');
		window.dispatchEvent(eventCloseIntlGnbMenu);
	}

	return (
		<button
			type={'button'}
			role={'switch'}
			aria-label={'홈페이지 라이트모드 또는 다크모드 변경 스위치'}
			aria-checked={isDark}
			className={`
                relative inline-flex items-center rounded-full transition-colors
                border-1 border-solid border-transparent
                w-[60px] h-[32px]
                cursor-pointer
            `}
			style={{backgroundColor: isDark ? '#212327' : '#FFAE00'}}
			onClick={fncApplyTheme}
			onFocus={() => fncCallListenerCloseLanguageChanger()}
			onMouseEnter={() => fncCallListenerCloseLanguageChanger()}
		>
            <span
                className={`
                    left-[2px] top-[6px]
                    transform rounded-full transition-transform
                    relative flex items-center justify-center
                    w-[28px] h-[28px] translate-y-[-6px]
                    bg-white
                    ${isDark ? 'translate-x-[28px]' : 'translate-x-0'}
                `}
                aria-hidden={true}
             />
            <div className={'w-full h-full absolute top-0 flex flex-row items-center justify-between px-7'} aria-hidden={true}>
                <Day
	                width={16} height={16}
	                color={isDark ? '#646568' : '#FFAE00'}
                />
                <Night
	                width={16} height={16}
	                color={isDark ? '#212327' : '#F4D684'}
                />
            </div>
		</button>
	)
}
