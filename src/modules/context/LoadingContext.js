"use client"

import React, {useState, useContext, useMemo, useEffect} from "react";
import PropTypes from "prop-types";
import {useIsFetching, useIsMutating} from "@tanstack/react-query";
import {usePathname} from "next/navigation";

// components
import Loading from "@/app/loading";


/**
 * @description: 로딩 Context 입니다.
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
const LoadingContext = React.createContext();
LoadingProvider.propTypes = {
	children: PropTypes.any,
}
export function LoadingProvider({ children }) {

	const isFetching = useIsFetching();
	const isMutating = useIsMutating();
	const pathname = usePathname();

	const [isLoading, setIsLoading] = useState(false);
	const [targetPath, setTargetPath] = useState(null);
	const [historyPath, setHistoryPath] = useState(null);

	// 실제 경로 변경시 네비게이션 종료
	useEffect(() => {
		if(!targetPath) return;
		if(pathname === targetPath) {
			setIsLoading(false);
			setTargetPath(null)
		}
	}, [pathname, targetPath]);

	const fncRouteStart = (url, options = {}) => {
		const splitQuery = url.split('?')[0];
		const target = options?.locale ? `/${options.locale}${url}` : splitQuery;
		setTargetPath(target);
		setHistoryPath(target);
		setIsLoading(true);
	}

	const fncSetLoading = (bool) => {
		setIsLoading(bool);
	}
	
	// provider props
	const obj = useMemo(() => (
		{isLoading,fncSetLoading, fncRouteStart, historyPath}
	), [isLoading, fncSetLoading, fncRouteStart]);

	return (
		<LoadingContext.Provider value={obj}>
			{children}
			{(isLoading || isFetching + isMutating > 0)&& <Loading />}
		</LoadingContext.Provider>
	);
}

export const useLoadingContext = () => useContext(LoadingContext);
