'use client';

import {useEffect, useState} from 'react';

export const PAGE_NAME_ID = {
	dt: 'page-name-dt',
	mo: 'page-name-mo',
};

export const SWIPER_A11Y = {
	enabled: true,
	prevSlideMessage: '이전 배너',
	nextSlideMessage: '다음 배너',
	paginationBulletMessage: '{{index}}번째 배너',
};

export const accordionA11yIds = (prefix, id) => ({
	triggerId: `${prefix}-trigger-${id}`,
	panelId: `${prefix}-panel-${id}`,
});

export const accordionHeaderA11yProps = (prefix, id, isActive) => {
	const {triggerId, panelId} = accordionA11yIds(prefix, id);
	return {
		type: 'button',
		id: triggerId,
		'aria-expanded': isActive,
		'aria-controls': panelId,
	};
};

export const accordionPanelA11yProps = (prefix, id, isActive) => {
	const {triggerId, panelId} = accordionA11yIds(prefix, id);
	return {
		id: panelId,
		role: 'region',
		'aria-labelledby': triggerId,
		'aria-hidden': !isActive,
	};
};

/**
 * @description prefers-reduced-motion 미디어 쿼리 구독
 */
export function usePrefersReducedMotion() {
	const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

	useEffect(() => {
		if (typeof window === 'undefined') return;
		const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		const update = () => setPrefersReducedMotion(mediaQuery.matches);
		update();
		mediaQuery.addEventListener('change', update);
		return () => mediaQuery.removeEventListener('change', update);
	}, []);

	return prefersReducedMotion;
}
