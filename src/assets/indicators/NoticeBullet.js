import React from "react";
import clsx from "clsx";
import {useScreenSizeContext} from "@modules/context/ScreenContext";

export const BulletNew = () => {
	const {isMobile} = useScreenSizeContext();
	let width = isMobile ? 47 : 54;
	let height = isMobile ? 24 : 29;
	
	return (
		<div className={clsx(
			'rounded-4 bg-dynamic-bg-other-red-subtle flex items-center justify-center mr-16',
			'text-body-md mo:text-body-xs text-dynamic-text-other-red-subtle font-semibold text-center'
		)}
		     style={{width: width, height: height}}>
			새소식
		</div>
	);
};

export const BulletNotice = () => {
	const {isMobile} = useScreenSizeContext();
	let width = isMobile ? 37 : 54;
	let height = isMobile ? 24 : 29;
	
	return (
		<div className={clsx(
			'rounded-4 bg-dynamic-bg-other-green-subtle flex items-center justify-center mr-16',
			'text-body-md mo:text-body-xs text-dynamic-text-other-green font-semibold text-center'
		)}
		     style={{width: width, height: height}}>
			공지
		</div>
	);
};
