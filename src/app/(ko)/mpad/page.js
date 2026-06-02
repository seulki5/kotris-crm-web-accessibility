'use client';

import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import {useSearchParams} from "next/navigation";
import {useMutation} from "@tanstack/react-query";

// modules
import {useLoadingContext} from '@modules/context/LoadingContext';
import {usePopContext} from '@modules/context/PopContext';
import {useApi} from "@modules/services/useApi";
import {apiPinValid} from "@/app/_actions/common.action";
import {checkDataLength} from "@modules/utils/StringUtils";
import {fncGetBaseUrl} from "@modules/services/api.service";

// components
import Button from '@components/common/Button';

// assets
import {ChevronRight} from '@assets/icons/Svgs';
import '@/styles/components/nFilter/ownSample.css';
import '@/styles/components/nFilter/ownCustomKpdSample.css';


/**
 * @description: 가상키보드(Mobile Only) 컴포넌트 입니다.
 * @screenID:    -
 * @screenPath:  -
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function MobilePad() {

	const searchParams = useSearchParams();
	const boardName = searchParams.get('boardName'); // PIN, ZEROPAY
	const boardType = searchParams.get('boardType'); // CREATE, AUTH, RESET, CHANGE
	const boardStep = searchParams.get('boardStep');
	const preEnc = searchParams.get('preEnc');
	const boardMessage = searchParams.get('boardMessage');
	const boardTitle = searchParams.get('boardTitle');
	const bulletRefs = useRef([]);
	const bulletLength = useRef(0);
	const inputRef = useRef(null);
	const pinName = boardName === 'ZEROPAY' ? `제로페이 ` : '간편';

	const {fncSetLoading} = useLoadingContext();
	const {fncShowPop, fncClosePop} = usePopContext();
	const {jsonApiAction} = useApi();

	// API URL
	const [apiUrl, setApiUrl] = useState(null);

	// 모바일 OS
	const [isMobileOS, setIsMobileOS] = useState(false);

	// 메세지
	const [message, setMessage] = useState(null);

	//-- Api
	// 유효한 숫자 체크
	const {mutateAsync: mutPinValid} = useMutation({
		mutationKey: ['mutPinValid'],
		mutationFn: (payload) => jsonApiAction(apiPinValid, payload),
		onSuccess: (res) => {
			if(res?.resYn === 'Y') {
				fncPostRN({
					id: 'WEB_PAD_SAVE',
					payload: {
						boardName: boardName,
						boardType: boardType,
						boardStep: boardStep,
						encData: res?.webMbrPswdEncpt,
					}
				})
			} else {
				setMessage('3자리 이상 같은 번호나 연속된 번호는 사용할 수 없습니다. 다시 입력해주세요.')
			}
		}
	})

	// 동일값 체크
	const {mutateAsync: mutComparePin} = useMutation({
		mutationKey: ['mutComparePin'],
		mutationFn: (payload) => jsonApiAction(apiPinValid, payload),
		onSuccess: (res) => {
			if(res?.resYn === 'Y') {
				fncPostRN({
					id: 'WEB_PAD_SAVE',
					payload: {
						boardName: boardName,
						boardType: boardType,
						boardStep: boardStep,
						encData: res?.webMbrPswdEncpt,
					}
				})
			} else {
				setMessage(`${pinName}비밀번호가 일치하지 않습니다. 다시 입력해주세요.`)
			}
		}
	})

	useLayoutEffect(() => {
		async function initApiUrl() {
			const apiUrl = await fncGetBaseUrl();
			setApiUrl(apiUrl);
		}

		initApiUrl();
	}, []);

	useEffect(() => {
		const checkOS = /iPhone|iPad|Android/i.test(navigator.userAgent);
		setIsMobileOS(checkOS);
	}, []);

	useEffect(() => {
		boardMessage && setMessage(boardMessage);
	}, [boardMessage]);

	useEffect((url, config) => {
		if(!apiUrl) return;
		if(!isMobileOS) return;

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

			// 키패드 수동 오픈 (사용자 이벤트가 아닌 자바스크립트 코드로 키패드 호출시 사용)
			window.nshc.openKpd('m_num_typeB');
		});

		// 랜덤 숫자키패드 설정
		window.nshc.setRandomNumKpd();

		// 키패드 배경 사용중지 설정
		window.nshc.setBgNotUse();

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
		window.nshc.setCommon(document.getElementById('m_num_typeB'), 'mode=nBKpd');

		// ScreenReader에서 키패드 입력값이 읽혀짐 여부 설정
		window.nshc.setScreenReaderUse(true);

		// 키패드 초기화
		window.nshc.setInit();

		// 키패드 이벤트 callback
		window.nshc.ownCallback = async function (msg, inputID, focusCallback) {

			if(["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].includes(msg) && inputID === 'm_num_typeB') {
				bulletLength.current += 1;
				fncRenderBullets()
			}

			if(msg === 'delete' && inputID === 'm_num_typeB') {
				bulletLength.current = bulletLength.current - 1;
				fncRenderBullets()
			}

			if(['nfilter_clear', 'nfilter_renew', 'open'].includes(msg) && inputID === 'm_num_typeB') {
				bulletLength.current = 0;
				fncRenderBullets()
			}

			// 입력 완료시 props.onChange로 암호화 값 전달
			if (msg === 'enter' && inputID === 'm_num_typeB') {
				bulletLength.current += 1;
				fncRenderBullets()
				focusCallback(document.getElementById(''));
				let encData = window.nshc.encrypted();

				if(['CREATE', 'RESET', 'CHANGE'].includes(boardType)) {
					if(preEnc) {
						await mutComparePin({
							webMbrPswdEncpt: preEnc,
							compWebMbrPswdEncpt: encData,
						})
					} else {
						await mutPinValid({
							webMbrPswdEncpt: encData
						})
					}
				}

				if(boardType === 'AUTH') {
					fncPostRN({
						id: 'WEB_PAD_SAVE',
						payload: {
							boardName: boardName,
							boardType: boardType,
							boardStep: boardStep,
							encData: encData
						}
					})
				}
			}
		}
	}, [isMobileOS, apiUrl])

	// WEB -> APP
	const fncPostRN = useCallback((postMessage) => {
		if(checkDataLength(postMessage) && typeof window !== "undefined" && window.ReactNativeWebView) {
			window.ReactNativeWebView.postMessage(JSON.stringify(postMessage));
		}
	}, [])

	// 재설정
	const fncReset = () => {
		fncPostRN({
			id: 'WEB_PAD_RESET',
			payload: {
				boardName: boardName,
				boardType: boardType,
			}
		})
	};

	// 입력
	const fncRenderBullets = () => {
		bulletRefs.current?.forEach((el, i) => {
			if(!el) return;
			if(i < bulletLength.current) {
				el.classList.add('bg-dynamic-bg-brand-primary');
				el.classList.remove('bg-dynamic-bg-neutral-tertiary')
			} else {
				el.classList.add('bg-dynamic-bg-neutral-tertiary');
				el.classList.remove('bg-dynamic-bg-brand-primary');
			}
		})
	}

	// 스텝 초기화
	const fncInitBoardStep = () => {
		fncPostRN({
			id: 'WEB_PAD_INIT_STEP',
			payload: {
				boardName: boardName,
				boardType: boardType,
			}
		})
	}

	if (isMobileOS) {
		return (
			<main
				id={'keyboard'}
				className={'w-full h-full flex flex-1 flex-col'}
				aria-labelledby={'page-name-mo'}
			>
				<h1 id={'page-name-mo'} className={'sr-only'}>
					{boardTitle || `${pinName} 비밀번호 입력`}
				</h1>
				<div className={'w-full h-[60px] max-h-[60px] flex-col-center-center'} aria-hidden={true}>
					{boardTitle}
				</div>
				<div className={'w-full h-1/2 flex-col-center flex-1'}>
					<div className={clsx(
						'w-3/5 flex items-center justify-center mb-12 mt-[50px]',
						'text-heading-md text-dynamic-text-neutral-primary font-semibold text-center break-keep'
					)}>
						{
							['CREATE', 'RESET', 'CHANGE'].includes(boardType) && (
								<>
									{boardStep < 1 && `새 ${pinName}비밀번호 6자리를 설정해주세요`}
									{boardStep > 0 && `${pinName}비밀번호를\n한번 더 입력해주세요`}
								</>
							)
						}
						{
							boardType === 'AUTH' && `${pinName}비밀번호를 입력해주세요`
						}
					</div>
					<div className={clsx('relative w-full h-[170px] flex flex-col justify-start rounded-12')}>
						<div className={'mt-20 relative'}>
							<label
								htmlFor={'m_num_typeB'}
							    aria-label={'가상키패드 필드 입력하시려면 클릭 하세요'}
								className={'flex-row-center-center gap-12'}
								onClick={(e) => {
									e.preventDefault();
									if(inputRef.current) {
										inputRef.current.focus();
										inputRef.current.click();
									}
								}}
							>
								{
									[...Array(6)].map((_, i) => (
										<div
											key={`keypad_${i}`}
											ref={(el) => {
												if (el) bulletRefs.current[i] = el
											}}
											className={'border border-transparent'}
											style={{
												width: 26,
												minWidth: 26,
												height: 26,
												minHeight: 26,
												borderRadius: '100%',
												display: 'block',
												WebkitTransform: 'translateZ(0)',
												transform: 'translateZ(0)'
											}}
										>
											<span className={'opacity-0'}>.</span>
										</div>
									))
								}
							</label>
							<input
								ref={inputRef}
								type={'password'}
								aria-describedby={'가상키패드'}
								name={''}
								placeholder={''}
								id={'m_num_typeB'}
								maxLength={6}
								className={'absolute w-[1px] h-[1px] border-0 focus:outline-none'}
								style={{
									padding: 0,
									overflow: 'hidden',
									clip: 'rect(0,0,0,0)',
								}}
							/>
						</div>
						<div className={'pt-20 w-full h-full flex-col-center'}>
							<p className={'w-2/3 mt-10 text-body-xs text-dynamic-text-negative-primary font-medium text-center mb-20 break-all'}>
								{message}
							</p>
							<div className={'flex-col-center-center absolute bottom-[20px] w-full'}>
								{
									boardType === 'AUTH' && (
										<Button
											theme={'textOnly'}
											size={'sm'}
											text={`${pinName}비밀번호 재설정`}
											ariaLabel={`${pinName}비밀번호 재설정`}
											icon={<ChevronRight width={20} height={20}/>}
											iconPosition={'right'}
											customStyle={'w-fit'}
											onClick={fncReset}
										/>
									)
								}
								{
									['CREATE', 'RESET', 'CHANGE'].includes(boardType) && preEnc && (
										<Button
											theme={'textOnly'}
											size={'sm'}
											text={'처음부터'}
											ariaLabel={'처음부터'}
											icon={<ChevronRight width={20} height={20}/>}
											iconPosition={'right'}
											customStyle={'w-fit'}
											onClick={fncInitBoardStep}
										/>
									)
								}
							</div>
						</div>
					</div>
				</div>
				<div className={'flex flex-1'} />
			</main>
		);
	} else {
		return <div/>;
	}
}
