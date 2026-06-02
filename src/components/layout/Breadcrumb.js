'use client';

import React, {useEffect, useState} from 'react';
import {usePathname} from 'next/navigation';
import PropTypes from "prop-types";

// modules
import {RouteConfig} from '@modules/config/RouteConfig';

// assets
import {ChevronRight} from '@assets/icons/Svgs';


/**
 * @description: 공통 Breadcrumb 입니다.
 * @screenID:    -
 * @screenPath:  -
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
Breadcrumb.propTypes = {
	addPaths: PropTypes.array
};
export default function Breadcrumb({addPaths = []}) {
	
	const pathname = usePathname();
	const [breadcrumbData, setBreadcrumbData] = useState([]);
	
	useEffect(() => {
		if (pathname) getBreadcrumbsFromPath(pathname);
	}, [pathname, addPaths])
	
	// 경로 렌더링
	const getBreadcrumbsFromPath = (targetPath) => {
		const cleanedPath = targetPath;
		const getPathInfo = Object.values(RouteConfig).find(route => route.PATH === cleanedPath) || {};
		const crumbs = Object.keys(getPathInfo)?.length > 0 ? getPathInfo.TRAIL : [];
		
		// props 로 path 추가
		if(addPaths && addPaths?.length > 0) {
			crumbs.push(...addPaths);
		}
		
		setBreadcrumbData(crumbs)
	};
	
	return (
		<nav className={'w-full h-[24px] flex flex-row items-center justify-start mb-48'} aria-label={'현재 페이지 위치'}>
			{
				breadcrumbData?.map((path, index) => (
					<div key={path}
					     className={'flex flex-row items-center justify-start text-label-lg text-dynamic-text-neutral-secondary'}>
						{
							index > 0 && (
								<ChevronRight
									width={20} height={20}
									color={'text-dynamic-border-neutral-tertiary'}
								/>
							)
						}
						<p>{path}</p>
					</div>
				))
			}
		</nav>
	);
}
