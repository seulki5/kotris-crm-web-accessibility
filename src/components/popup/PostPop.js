'use client'

import React, {useEffect, useRef} from 'react';
import PropTypes from "prop-types";
import {FocusTrap} from "focus-trap-react";
import DaumPostcode from "react-daum-postcode";

// modules
import {useScreenSizeContext} from "@modules/context/ScreenContext";
import {useWebContext} from "@modules/context/WebviewContext";

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
	const isLeaving = useRef(false);

	// AOS Back Handler
	useEffect(() => {
		const fncHandleBackHandler = (e) => {
			if (isLeaving.current) return;
			onClose();
		}

		if(isMobile) {
			setTimeout(() => {
				window.history.pushState({ modal: 'open' }, '');
				window.addEventListener('popstate', fncHandleBackHandler);
			}, 50)
		}

		return () => {
			isLeaving.current = true;
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
				returnFocusOnDeactivate: true,
				initialFocus: '#popup-post-search',
				clickOutsideDeactivates: true,
				allowOutsideClick: true
			}}
		>
			<div
				id={"popup-post-search"}
				tabIndex={0}
				role={'dialog'}
				aria-modal={true}
				aria-label={'우편번호 주소 검색 팝업'}
				className={`popup-bg-opacity ${isMobile ? 'flex-col-center justify-between' : ''}`}
				style={{padding: 0}}
			>
				{
					isMobile ? (
						<div className={'w-full bg-dynamic-bg-neutral-base flex flex-1 flex-col justify-between'}>
							<div className={'flex-1 w-full relative'}>
								<DaumPostcode
									style={{
										width: '100%',
										height: '100%',
										padding: 20
									}}
									props={{title: '우편번호 검색 서비스창'}}
									onComplete={(post) => onComplete(post)}
								/>
							</div>
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
							<div className={'relative w-full h-[700px]'}>
								<DaumPostcode
									height={700}
									autoClose
									props={{title: '우편번호 검색 서비스창'}}
									onComplete={(post) => onComplete(post)}
									className={'bg-dynamic-bg-neutral-base p-20 rounded-12'}
								/>
							</div>
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
						</div>
					)
				}
			</div>
		</FocusTrap>
	)
}
