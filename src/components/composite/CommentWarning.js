import React from 'react';
import PropTypes from "prop-types";

// modules
import {useScreenSizeContext} from "@modules/context/ScreenContext";

// assets
import {AlertCircleFill} from "@assets/icons/Svgs";


/**
 * @description: 경고 주석 컴포넌트 입니다.
 * @screenID:    -
 * @screenPath:  -
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
CommentWarning.propTypes = {
	title: PropTypes.string,
	list: PropTypes.array,
};
export default function CommentWarning({title, list}) {
	
	const {isMobile} = useScreenSizeContext();
	
	return (
		<div className={'w-full flex flex-col gap-12 mo:gap-8'}>
			<div className={'flex-row-center gap-6'}>
				<AlertCircleFill
					width={isMobile ? 16 : 24}
					height={isMobile ? 16 : 24}
					color={'text-dynamic-icon-negative-primary'}
				/>
				<p className={`
					text-body-2xl text-dynamic-text-neutral-primary font-medium
					mo:text-body-md
					mo:font-semibold
				`}>
					{title}
				</p>
			</div>
			<div className={'flex flex-col ml-4 gap-6 mo:gap-8'}>
				{
					list.map((li) => {
						return (
							<div className={'flex flex-row'} key={li.id}>
								<p className={`text-body-xl font-medium ${li.textColor} mo:text-body-sm mo:font-normal`}>
									{`\u00B7`}
								</p>
								<p className={`text-body-xl font-medium ml-3 ${li.textColor} mo:text-body-sm mo:font-normal`}>
									{li.message}
								</p>
							</div>
						);
					})
				}
			</div>
		</div>
	);
}
