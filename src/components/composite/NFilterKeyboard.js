'use client';

import React, {forwardRef, useEffect, useLayoutEffect, useState} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';


// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {useLoadingContext} from '@modules/context/LoadingContext';
import {usePopContext} from '@modules/context/PopContext';


// components
import FieldTitle from '@components/composite/FieldTitle';

// assets
import '@/styles/components/nFilter/ownSample.css';
import '@/styles/components/nFilter/ownCustomKpdSample.css';
import {AlertCircleFill, AlertTriangleFill, CheckCircleFill} from '@assets/icons/Svgs';
import {fncGetBaseUrl} from "@modules/services/api.service";


const NFilterKeyboard = forwardRef(({
	size = 'md',
	title = '',
	essential = false,
	placeholder = '',
	status = 'default',
	message = null,
	keypad = 'password', //password or number
	id = '',
	minLength = 4,
	maxLength = 10,
	onChange = () => {},
}, ref)  => {

	const {isMobile} = useScreenSizeContext();
	const {fncShowPop, fncClosePop} = usePopContext();
	const {fncSetLoading} = useLoadingContext();

	let keyboardId = '';
	if (isMobile && keypad === 'password') keyboardId = 'm_qwer_pw';
	else if (!isMobile && keypad === 'number') keyboardId = 'pc_num_typeB';
	else if (isMobile && keypad === 'number') keyboardId = 'm_num_typeB';
	else keyboardId = 'pc_qwer_pw';

	// API URL
	const [apiUrl, setApiUrl] = useState(null);

	useLayoutEffect(() => {
		async function initApiUrl() {
			const apiUrl = await fncGetBaseUrl();
			setApiUrl(apiUrl);
		}

		initApiUrl();
	}, []);

	useEffect((url, config) => {
		if(!apiUrl) return;

		// 키패드 초기화 완료될 때까지 보일 로딩
		fncSetLoading(true);

		window.nshc.contextPath = apiUrl;
		window.nshc.CSSPath = `${apiUrl}/nfilter/css`;
		window.nshc.imgPath = `${apiUrl}/nfilter/image`;

		/* 암호화 알고리즘 설정 (RSA, ECDH) */
		window.nshc.algName = 'ECDH';
		window.nshc.uuSessionUse = true;
		window.nshc.NSCryptoUse = true;

		// 키패드 초기화 시작
		window.nshc.setOnInitStart();

		// 키패드 로딩 완료 후 이벤트 callback
		window.nshc.setFinishedCallback(function () {
			// 로딩 끄기
			fncSetLoading(false);
		});

		// 랜덤 숫자키패드 설정
		window.nshc.setRandomNumKpd();

		// 키패드 하단 픽스 (모바일 모드에만 사용)
		window.nshc.setKpdBottomFix();

		// 에러 메시지 리턴값(최소값)
		window.nshc.setErrMsgCallBackType('customizing', function (errMsg) {
			window.nshc.closeKpd('close');
			fncShowPop({
				mainText: `최소 ${minLength}자리 이상 입력해주세요.`,
				primaryText: '확인',
				onClickPrimary: () => fncClosePop()
			})
		});

		// 키패드 클릭시 시각적 안전성을 위한 마스킹 처리 여부 설정
		window.nshc.setVisualSafetyKpd();

		// Open Web nFilter 키패드 필드 설정
		if (keyboardId === 'pc_qwer_pw') {
			window.nshc.setCommon(document.getElementById('pc_qwer_pw'), 'mode=pcCKpd');
		}

		if (keyboardId === 'pc_num_typeB') {
			window.nshc.setCommon(document.getElementById('pc_num_typeB'), 'mode=nBKpd');
		}

		if (keyboardId === 'm_qwer_pw') {
			window.nshc.setCommon(document.getElementById('m_qwer_pw'), 'mode=mCKpd');
		}

		if (keyboardId === 'm_num_typeB') {
			window.nshc.setCommon(document.getElementById('m_num_typeB'), 'mode=nBKpd');
		}

		// 키패드 초기화
		window.nshc.setInit();

		// 키패드 이벤트 callback
		window.nshc.ownCallback = function (msg, inputID, focusCallback) {
			// console.log(inputID + ' :: ' + msg);

			// 키패드가 닫힌 후(close, enter 이벤트 발생후) Focus 처리
			// if (msg === 'enter' && inputID === 'm_qwer') {
			// 	// 1. focusCallback 함수 미호출시 키패드를 호출한 input 엘리먼트로 Focus 이동
			// 	// 2. focusCallback 함수 파라미터로 notFocus 문자열 전달시 Focus 이벤트를 주지 않음. -> focusCallback('notFocus');
			// 	// 3. focusCallback 함수 파라미터로 특정 객체 전달시 해당 객체 Focus
			// 	focusCallback(document.getElementById('m_qwer_pw'));
			// }

			// 입력 완료시 props.onChange로 암호화 값 전달
			if (msg === 'enter') {
				let encData = window.nshc.encrypted();
				onChange(encData);
			}
		}
	}, [keyboardId, apiUrl])

	const stylesBySize = {
		sm: {
			wrapper: 'h-[40px]',
			textSize: 'text-[16px] placeholder:text-body-sm ',
			padding: 'pl-12 pr-34'
		},
		md: {
			wrapper: 'h-[48px]',
			textSize: 'text-[16px] placeholder:text-body-md',
			padding: 'pl-16 pr-41'
		},
		lg: {
			wrapper: 'h-[56px]',
			textSize: 'text-[16px] placeholder:text-body-xl',
			padding: 'pl-20 pr-50'
		},
	};

	const stylesByStatus = {
		default: {
			input: `
                border-dynamic-border-neutral-primary
                text-dynamic-text-neutral-primary
                bg-dynamic-bg-neutral-primary
                hover:border-dynamic-border-neutral-tertiary
                focus:border-dynamic-border-brand-primary-subtle
                focus:text-dynamic-text-neutral-primary
                focus:bg-dynamic-bg-neutral-primary
            `,
			icon: null,
			underMessage: 'text-dynamic-text-neutral-secondary',
		},
		warning: {
			input: 'border-dynamic-border-negative-primary text-dynamic-text-neutral-primary bg-dynamic-bg-neutral-primary',
			icon: <AlertCircleFill width={16} height={16} color='text-dynamic-icon-negative-primary'/>,
			underMessage: 'text-dynamic-text-negative-primary-bold',
		},
		success: {
			input: 'border-dynamic-border-positive-primary-bold text-dynamic-text-neutral-primary bg-dynamic-bg-neutral-primary',
			icon: <CheckCircleFill width={16} height={16} color='text-dynamic-icon-positive-primary-bold'/>,
			underMessage: 'text-dynamic-text-positive-primary-bold',
		},
		caution: {
			input: 'border-dynamic-border-caution-primary-bold text-dynamic-text-neutral-primary bg-dynamic-bg-neutral-primary',
			icon: <AlertTriangleFill width={16} height={16} color='text-dynamic-icon-caution-primary-bold'/>,
			underMessage: 'text-dynamic-text-caution-primary-bold',
		}
	};

	return (
		<div id={'nFilter'} className={`w-full flex gap-8 flex-col`}>
			{title && (
				<FieldTitle title={title} essential={essential}/>
			)}
			<div className={'flex flex-col'}>
				<div className={clsx('relative flex items-center rounded-12', stylesBySize[size].wrapper)}>
					<label htmlFor={keyboardId} ref={ref} aria-label={'가상키패드 필드 입력하시려면 클릭 하세요'}></label>
					<input
						type={keypad === 'number' ? 'text' : 'password'}
						aria-describedby={message ? `${id}-detail` : undefined}
						className={clsx(
							'ownInput',
							stylesBySize[size].textSize,
							stylesBySize[size].padding,
							stylesByStatus[status].input,
							'h-full border rounded-12 text-ellipsis whitespace-nowrap transition-colors duration-300 focus:outline-none'
						)}
						name={''}
						placeholder={placeholder || ''}
						id={keyboardId}
						minLength={minLength}
						maxLength={maxLength}
					/>
				</div>
				{message && (
					<div
						id={message ? `${id}-detail` : undefined}
						className={'flex items-center gap-2 mt-4 px-5'}
					>
						{stylesByStatus[status].icon}
						<p className={`text-label-2xs ${stylesByStatus[status].underMessage}`}>{message}</p>
					</div>
				)}
			</div>
		</div>
	);
})

NFilterKeyboard.propTypes = {
	size: PropTypes.string,
	title: PropTypes.string,
	essential: PropTypes.bool,
	placeholder: PropTypes.string,
	status: PropTypes.string,
	message: PropTypes.string,
	keypad: PropTypes.string,
	id: PropTypes.string,
	minLength: PropTypes.number,
	maxLength: PropTypes.number,
	onChange: PropTypes.func
};
NFilterKeyboard.displayName = "NFilterKeyboard"
export default NFilterKeyboard;
