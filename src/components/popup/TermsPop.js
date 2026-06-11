'use client'

import React, {useCallback, useLayoutEffect} from 'react';
import PropTypes from "prop-types";
import dynamic from "next/dynamic";
import {FocusTrap} from "focus-trap-react";

// modules
import {useScreenSizeContext} from "@modules/context/ScreenContext";
import {useWebContext} from "@modules/context/WebviewContext";
import {checkDataLength, isJson} from "@modules/utils/StringUtils";

// components
import Button from "@components/common/Button";
import Loading from "@/app/loading";
const ToastViewer = dynamic(() => import('@components/common/Editor'), {
	ssr: false,
	loading: () => <Loading />
})

// assets
import {ArrowLeft, X} from "@assets/icons/Svgs";


/**
 * @description: 약관 확인 화면 입니다.
 * @screenID:    -
 * @screenPath:
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
TermsPop.propTypes = {
	data: PropTypes.object,
	id: PropTypes.string,
	buttonLabel: PropTypes.string,
	onClose: PropTypes.func,
	onDone: PropTypes.func
};
export default function TermsPop({
   data,
   id,
   buttonLabel = '확인',
   onClose,
   onDone
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
				initialFocus: '#popup-term-title-mo',
				returnFocusOnDeactivate: true,
			}}
		>
			{
				isMobile ? (
					<div className={'float pop-terms-wrap'}>
						<header className={'bg-dynamic-bg-neutral-base'}>
							<div className={'inner-header'}>
								<button
									aria-label={'약관 팝업 닫기'}
									onClick={() => onClose()}
								>
									<ArrowLeft color={'text-dynamic-icon-neutral-primary'}/>
								</button>
								<div className={'terms-title-wrap'}>
									<p className={'terms-title'}>
										약관
									</p>
								</div>
							</div>
						</header>
						<div className={'body-wrap-mobile-screen-height'}>
							<h3 className={'page-title mb-40'} id={'popup-term-title-mo'}>
								{data?.[id]?.trmsNm}
							</h3>
							<div className={'terms-contents-wrap'}>
								<ToastViewer
									className={'prose max-w-none dark:text-dynamic-text-neutral-primary'}
									initialValue={data?.[id]?.trmsDtlCn ?? ''}
								/>
							</div>
							<Button
								theme={'primary'}
								size={'lg'}
								text={buttonLabel}
								customStyle={'w-full'}
								onClick={() => onDone()}
							/>
						</div>
					</div>
				) : (
					<div className={'popup-bg-opacity'} style={{zIndex: 9999}}>
						<div className={'popup-float-wrap w-fit max-w-[50%] p-25 min-h-[55%] flex flex-col justify-between'}>
							<div>
								<p
									className={'text-heading-lg text-dynamic-text-neutral-primary font-semibold text-left mb-20'}
								    id={'popup-term-title-mo'}
								>
									{data?.[id]?.trmsNm}
								</p>
								<button
									aria-label={'약관 팝업 닫기'}
									onClick={() => onClose()}
									className={'absolute top-[20px] right-[20px]'}
								>
									<X width={30} height-={30} color={'text-dynamic-icon-neutral-primary'}/>
								</button>
								<div className={'mb-48'}>
									<ToastViewer
										className={'prose max-w-none dark:text-dynamic-text-neutral-primary'}
										initialValue={data?.[id]?.trmsDtlCn ?? ''}
									/>
								</div>
							</div>
							<Button
								theme={'primary'}
								size={'lg'}
								text={buttonLabel}
								customStyle={'w-full'}
								onClick={() => onDone()}
							/>
						</div>
					</div>
				)
			}
		</FocusTrap>
	)
}
