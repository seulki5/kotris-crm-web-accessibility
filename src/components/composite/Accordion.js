'use client';

import React, {useState, useRef, useLayoutEffect} from 'react';
import PropTypes from "prop-types";


/**
 * @description: 아코디언 컴포넌트 입니다.
 * @screenID:    -
 * @screenPath:  -
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
Accordion.propTypes = {
	active: PropTypes.bool,
	headerComponent: PropTypes.func,
	bodyComponent: PropTypes.func,
	panelId: PropTypes.string,
};
export default function Accordion({
    active = false,
    headerComponent,
    bodyComponent,
	panelId,
}) {
	
	const contentRef = useRef(null);
	const [contentHeight, setContentHeight] = useState(0);
	
	useLayoutEffect(() => {
		if (contentRef.current) {
			requestAnimationFrame(() => {
				setContentHeight(active ? contentRef.current.scrollHeight : 0);
			});
		}
	}, [active]);
	
	return (
		<div>
			<div className={'flex items-center justify-start bg-transparent'}>
				{headerComponent()}
			</div>
			<div
				ref={contentRef}
				id={panelId}
				className={'transition-all duration-300 overflow-hidden'}
				style={{maxHeight: `${contentHeight}px`}}
				aria-hidden={!active}
			>
				{bodyComponent()}
			</div>
		</div>
	)
}
