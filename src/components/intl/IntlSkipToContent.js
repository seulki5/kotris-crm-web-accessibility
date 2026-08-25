'use client';

import React, {useEffect} from 'react';
import {usePathname} from '@/i18n/navigation';
import {useTranslations} from "next-intl";


/**
 * @description: 본문 바로가기
 * @screenID:    -
 * @screenPath:  -
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function IntlSkipToContent() {
	
	const pathname = usePathname();
	const targetId = 'main-intl';
	const t = useTranslations();
	
	// 웹 접근성 지침(KWCAG 2.2 / WCAG 2.1)의 핵심 논리는 "사용자가 어떤 페이지에 진입하든, 첫 Tab 키를 누르면 헤더 메뉴를 건너뛰고 바로 본문으로 갈 수 있어야 한다"
	useEffect(() => {
		if(typeof window !== 'undefined') {
			// 1. 현재 포커스 해제
			if(document.activeElement instanceof HTMLElement) {
				document.activeElement.blur();
			}
			
			// 2. body로 포커스 이동하여 다음 Tab 입력 시 최상단으로 리셋
			document.body.setAttribute('tabindex', '-1');
			document.body.focus();
			
			// 3. 포커스 리셋 후 tabindex 제거
			document.body.removeAttribute('tabindex');
			
			// 4. 화면 상단으로
			window.scrollTo(0,0);
		}
	}, [pathname]);
	
	const fncHandleSkip = (e) => {
		e.preventDefault();
		
		const container = document.getElementById(targetId);
		if(!container) return;
		
		const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
		const firstFocusable = container.querySelector(focusableSelector);
		
		if(firstFocusable) {
			firstFocusable.focus();
		} else {
			container.setAttribute('tabindex', '-1');
			container.focus();
		}
	}

	return (
		<a
			href={`#${targetId}`}
			onClick={fncHandleSkip}
			onKeyDown={(e) => {
				if(e.key === 'Enter' || e.key === ' ') {
					fncHandleSkip(e);
				}
			}}
			className={'sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-0 focus:z-[9999] focus:w-full focus:min-h-[70px] focus:flex focus:flex-row focus:items-center focus:justify-center focus:bg-dynamic-bg-neutral-inverse focus:text-dynamic-text-neutral-inverse focus:text-heading-md'}
		>
			{t('HEADER.SKIP_CONTENT')}
		</a>
	);
}
