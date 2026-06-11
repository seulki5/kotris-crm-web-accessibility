'use client'

import React, {useCallback, useLayoutEffect} from 'react';
import PropTypes from "prop-types";
import {FocusTrap} from "focus-trap-react";
import DaumPostcode from "react-daum-postcode";

// modules
import {useScreenSizeContext} from "@modules/context/ScreenContext";
import {useWebContext} from "@modules/context/WebviewContext";
import {checkDataLength, isJson} from "@modules/utils/StringUtils";

// components
import Button from "@components/common/Button";

// assets
import {X} from "@assets/icons/Svgs";


/**
 * @description: 주소 찾기 팝업 입니다.
 * @screenID:    -
 * @screenPath:
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
PostPop.propTypes = {
	data: PropTypes.object,
	id: PropTypes.string,
	buttonLabel: PropTypes.string,
	onClose: PropTypes.func,
	onDone: PropTypes.func
};
export default function PostPop({
   onClose,
   onComplete
}) {

	const {isMobile} = useScreenSizeContext();
	const {isAccApp} = useWebContext();

	// AOS Back Handler
	useLayoutEffect(() => {
		const fncHandleBackHandler = (e) => {
			onClose();
		}

		if(isMobile) {
			window.history.pushState({ modal: 'open' }, '');
			window.addEventListener('popstate', fncHandleBackHandler);
		}

		return () => {
			if(isMobile) {
				window.removeEventListener('popstate', fncHandleBackHandler);
				if(window.history.state?.modal === 'open') {
					window.history.back();
				}
			}

			window.scrollTo(window.scrollX, window.scrollY);
		}

	}, [isAccApp, isMobile]);

	return (
		<FocusTrap
			active={true}
			focusTrapOptions={{
				escapeDeactivates: true,
				clickOutsideDeactivates: true,
				initialFocus: '#popup-post-mo',
				fallbackFocus: "#popup-close-btn",
				returnFocusOnDeactivate: true,
			}}
		>
			<div
				id={"popup-close-btn"}
				tabIndex={-1}
				className={`popup-bg-opacity ${isMobile ? 'flex-col-center justify-between' : ''}`}
				style={{padding: 0}}
			>
				{
					isMobile ? (
						<div className={'w-full bg-dynamic-bg-neutral-base flex flex-1 flex-col justify-between'}>
							<DaumPostcode
								style={{
									width: '100%',
									height: '100%',
									padding: 20
								}}
								onComplete={(post) => onComplete(post)}
							/>
							<div className={'w-full flex flex-col items-end py-4 px-15'}>
								<Button
									theme={'textOnly'}
									size={'md'}
									text={'닫기'}
									ariaLabel={'닫기'}
									customStyle={'w-fit text-button-lg text-dynamic-text-neutral-secondary font-semibold'}
									icon={<X/>}
									iconPosition={'right'}
									onClick={() => onClose()}
								/>
							</div>
						</div>
					) : (
						<div className={`relative`}>
							<Button
								theme={'iconOnly'}
								size={'xxl'}
								text={''}
								ariaLabel={'주소 검색 팝업 닫기'}
								customStyle={'absolute top-[-20px] right-[-35px] bg-dynamic-bg-neutral-base'}
								icon={<X/>}
								iconPosition={'right'}
								onClick={() => onClose()}
							/>
							<DaumPostcode
								height={700}
								autoClose
								onComplete={(post) => onComplete(post)}
								className={'bg-dynamic-bg-neutral-base p-20 rounded-12'}
							/>
						</div>
					)
				}
			</div>
		</FocusTrap>
	)
}
