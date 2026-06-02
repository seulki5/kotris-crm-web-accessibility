import React, {useState, useRef, useLayoutEffect, useEffect} from 'react';
import PropTypes from "prop-types";


/**
 * @description: 드롭다운 컴포넌트 입니다.
 * @screenID:    -
 * @screenPath:  -
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
Dropdown.propTypes = {
	isOpen: PropTypes.bool,
	top: PropTypes.number,
	position: PropTypes.string,
	direction: PropTypes.string,
	customStyle: PropTypes.any,
	children: PropTypes.any,
};
export default function Dropdown({
     isOpen,
     top = 10,
     position = "left-0",
     direction = "down",
     customStyle = {},
     children
}) {
	
	const contentRef = useRef(null);
	
	const [height, setHeight] = useState(0);
	const [allowScroll, setAllowScroll] = useState(false);
	
	useLayoutEffect(() => {
		if (contentRef.current) {
			setHeight(isOpen ? contentRef.current.scrollHeight : 0);
		}
	}, [isOpen, children]);
	
	useEffect(() => {
		if (!isOpen) {
			setAllowScroll(false);
		}
	}, [isOpen]);
	
	const handleTransitionEnd = (e) => {
		if (e.propertyName === "max-height" && isOpen) {
			setAllowScroll(true);
		}
	};
	
	const overflowStyle = () => {
		if(allowScroll) return 'overflow-y-auto';
		else return 'overflow-hidden';
	}
	
	return (
		<div
			onTransitionEnd={handleTransitionEnd}
			className={`
		        absolute ${position} z-35
		        flex flex-col
		        transition-all duration-300 ease-out
		        bg-dynamic-bg-neutral-base
		        rounded-8
		        ${overflowStyle()}
		        ${direction === 'up' && isOpen ? '-translate-y-[50px]' : 'translateY(0)'}
		        ${customStyle}
	        `}
			style={{
				maxHeight: `${height}px`,
				boxShadow: `0 2px 10px 0px rgba(0, 0, 0, 0.1)`,
				top: direction === "up" ? null : `${top}px`,
				bottom: direction === "up" ? `${top}px` : null,
			}}
		>
			<div ref={contentRef} className={"w-full py-8 text-body-2xl text-dynamic-text-neutral-secondary font-semibold"}>
				{children}
			</div>
		</div>
	);
}
