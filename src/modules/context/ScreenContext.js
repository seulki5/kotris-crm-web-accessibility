"use client"

import React, {useState, useContext, useEffect, useMemo} from "react";
import Cookies from "js-cookie";
import PropTypes from "prop-types";

const ScreenSizeContext = React.createContext({ isMobile: false, windowSize: 0 });

ScreenSizeProvider.propTypes = {
	children: PropTypes.any,
	initialIsMobile: PropTypes.bool,
}

/**
 * @description: Window Size 체크하는 Context 입니다.
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export function ScreenSizeProvider({ children, initialIsMobile = false }) {
	
	const [windowSize, setWindowSize] = useState({w: 0, h: 0});
	const [isMobile, setIsMobile] = useState(initialIsMobile);

	// window size 체크 후 isMobile 업데이트
	useEffect(() => {
		const update = () => {
			const checkOS = /iPhone|iPad|Android/i.test(navigator.userAgent);
			const w = window.innerWidth;
			const h = window.innerHeight;
			setWindowSize({w, h});
			setIsMobile(w <= 880 || checkOS);

			Cookies.set('crm-viewport', w <= 880 ? 'mobile' : 'desktop', { expires: 24 });
		}
		update()
		window.addEventListener('resize', update)
		
		return () => window.removeEventListener('resize', update)
	}, [])
	
	// provider props
	const obj = useMemo(() => (
		{ isMobile, windowSize }
	), [isMobile, windowSize]);
	
	return (
		<ScreenSizeContext.Provider value={obj}>
			{children}
		</ScreenSizeContext.Provider>
	)
}

export const useScreenSizeContext = () => useContext(ScreenSizeContext);
