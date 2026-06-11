import React, {useState, useRef, useLayoutEffect} from 'react';
import PropTypes from "prop-types";


/**
 * @description: LNB 컴포넌트 입니다.
 * @screenID:    -
 * @screenPath:  -
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
GnbDropdown.propTypes = {
	isOpen: PropTypes.bool,
	lnb: PropTypes.array,
	activeLnb: PropTypes.string,
	onClick: PropTypes.func,
};
export default function GnbDropdown({
     isOpen,
     lnb= [],
     activeLnb = '',
     onClick = () => {},
}) {

	const contentRef = useRef(null);

	// lnb 높이
	const [height, setHeight] = useState(0);

	useLayoutEffect(() => {
		if (contentRef.current) {
			setHeight(isOpen ? contentRef.current.scrollHeight : 0);
		}
	}, [isOpen]);

	const handleLnbClick = (item) => {
		onClick('goPage', item);
		setHeight(0);
	}

	return (
		<ul
			className={`
		        w-full absolute top-[90px] left-0 z-30
		        transition-all duration-300 ease-out
		        flex items-center justify-center
		        bg-dynamic-bg-neutral-base
		        overflow-hidden
	        `}
			aria-label={'메뉴 소분류'}
			style={{
				maxHeight: `${height}px`,
				boxShadow: `0 3px 8px -1px rgba(0, 0, 0, 0.15)`,
			}}
		>
			<li ref={contentRef} className={"max-w-[950px] py-56 grid grid-cols-4 gap-y-20 gap-x-56"}>
				{
					lnb.map((item) => {
						const isActive = activeLnb === item.url;
						return (
							<button
								key={item.id}
								aria-label={`${item.name} 링크`}
								tabIndex={0}
								onClick={() => handleLnbClick(item)}
								className={`
								    text-body-2xl font-medium text-start
								    ${isActive ? 'text-dynamic-text-brand-primary' : 'text-dynamic-text-neutral-primary'}
								    hover:text-dynamic-text-brand-primary
						        `}
							>
								{item.name}
							</button>
						)
					})
				}
			</li>
		</ul>
	);
}
