"use client"

import React, {useState, useContext, useEffect, useMemo} from "react";
import Cookies from "js-cookie";
import PropTypes from "prop-types";

const ThemeContext = React.createContext();

/**
 * @description: 테마 Context 입니다.
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
ThemeProvider.propTypes = {
	children: PropTypes.any,
	initialTheme: PropTypes.string,
}
export function ThemeProvider({ children, initialTheme }) {
	
	const [theme, setTheme] = useState(initialTheme);
	
	useEffect(() => {
		let userTheme = 	document.documentElement.getAttribute("data-theme");
		if(userTheme !== null) {
			setTheme(userTheme);
			document.documentElement.setAttribute("data-theme", userTheme);
		} else {
			document.documentElement.setAttribute("data-theme", initialTheme);
		}
	}, [])

	// 최종 테마 적용
	const applyTheme = (themeId) => {
		document.documentElement.setAttribute("data-theme", themeId);
		Cookies.set('crm-theme', themeId, { expires: 365 });
		setTheme(themeId);
	};
	
	// provider props
	const obj = useMemo(() => (
		{ theme, applyTheme }
	), [theme]);
	
	return (
		<ThemeContext.Provider value={obj}>
			{children}
		</ThemeContext.Provider>
	);
}

export const useThemeContext = () => useContext(ThemeContext);
