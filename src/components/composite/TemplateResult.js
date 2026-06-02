'use client'

import React, {useEffect} from "react";
import PropTypes from "prop-types";
import Lottie from "lottie-react";

// modules
import {useMoHeaderContext} from "@modules/context/MoHeaderContext";

// components
import Button from "@components/common/Button";


/**
 * @description: 결과 화면 레이아웃 컴포넌트 입니다.
 * @screenID:    -
 * @screenPath:  -
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
TemplateResult.propTypes = {
	screen: PropTypes.string,
	title: PropTypes.string,
	subTitle: PropTypes.string,
	buttonText: PropTypes.string,
	buttonAriaLabel: PropTypes.string,
	comment: PropTypes.string,
	children: PropTypes.any,
	animationSrc: PropTypes.any,
	onDone: PropTypes.func
};
export default function TemplateResult({
	screen = 'desktop', //desktop, mobile
	title = '',
	subTitle = '',
	buttonText = '',
    buttonAriaLabel = '',
	onDone = () => {},
	animationSrc,
	children
}) {
	
	const {fncChangeMoHeader} = useMoHeaderContext();
	
	// Mobile Only: 모바일 헤더
	useEffect(() => {
		if (screen === 'mobile') {
			fncChangeMoHeader({
				type: 'none',
				title: ''
			})
		}
	}, [screen])
	
	return (
		<>
			{
				screen === 'desktop' && (
					<div className={'flex-col-center gap-16 mt-72'}>
						<Lottie
							animationData={animationSrc}
							loop={true}
							style={{width: 200, height: 200}}
							aria-hidden={true}
						/>
						<div className={'w-full flex-col-center gap-12'} aria-label={'결과 메세지'}>
							<h1 className={'result-success-title'}
							   aria-level={1} aria-describedby={'result-subtitle-dt'}>
								{title}
							</h1>
							<h2 id={'result-subtitle-dt'} className={'result-success-subtitle'}>
								{subTitle}
							</h2>
							{children}
						</div>
						{
							buttonText && onDone && (
								<div className={'page-bottom-button-wrap'}>
									<Button
										theme={'primary'}
										size={'xl'}
										text={buttonText}
										ariaLabel={buttonAriaLabel}
										customStyle={'w-[240px]'}
										onClick={onDone}
									/>
								</div>
							)
						}
					</div>
				)
			}
			{
				screen === 'mobile' && (
					<div className={'body-inner-wrap-mobile'}>
						<div className={'flex-col-center-center flex-1 gap-28 page-bottom-space'}>
							<Lottie
								animationData={animationSrc}
								loop={true}
								style={{width: '50%', height: '50%', maxWidth: 200, maxHeight: 200}}
								aria-hidden={true}
							/>
							<div className={'flex-col-center gap-16'} aria-label={'결과 메세지'}>
								<h1 className={'result-success-title'}
								    aria-level={1} aria-describedby={'result-subtitle-mo'}>
									{title}
								</h1>
								<h2 id={'result-subtitle-mo'} className={'result-success-subtitle'}>
									{subTitle}
								</h2>
							</div>
							{children}
						</div>
						{
							buttonText && onDone && (
								<Button
									theme={'primary'}
									size={'lg'}
									text={buttonText}
									ariaLabel={buttonAriaLabel}
									customStyle={'w-full'}
									onClick={onDone}
								/>
							)
						}
					</div>
				)
			}
		</>
	)
}
