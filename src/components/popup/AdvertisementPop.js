'use client';

import React, {useState, useLayoutEffect} from 'react';
import PropTypes from 'prop-types';
import {useMutation} from '@tanstack/react-query';
import Image from 'next/image';
import Cookies from 'js-cookie';
import moment from 'moment';

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {useApi} from '@modules/services/useApi';
import {apiPopList} from '@/app/_actions/home.action';
import {useWebContext} from "@modules/context/WebviewContext";

// components
import Button from '@components/common/Button';

// assets
import {X} from '@assets/icons/Svgs';


/**
 * @description: 광고 팝업 컴포넌트 입니다.
 * @screenID:    -
 * @screenPath:  -
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function AdvertisementPop() {

	const {isMobile} = useScreenSizeContext();
	const {jsonApiAction} = useApi();
	const {isAccApp, fncPostRN} = useWebContext();

	const [popList, setPopList] = useState([]);    // 팝업 목록

	// --Api
	// 메인 팝업 목록
	const {mutate: mutPopList} = useMutation({
		mutationKey: ['mutPopList'],
		mutationFn: (payload) => jsonApiAction(apiPopList, payload),
		onSuccess: (res) => {
			const popCookie = Cookies.get('crm-pop');
			if(popCookie) {
				// 오늘 하루 block 처리된 팝업이 있을 경우
				const parse = JSON.parse(popCookie);
				const filtered = res.filter((el) => !parse.includes(el.popupId)) || [];
				setPopList(filtered);
			} else {
				// 오늘 하루 block 처리된 팝업이 없을 경우
				setPopList(res);
			}
		}
	})

	useLayoutEffect(() => {
		 mutPopList({prepDefpSeCd : "10"});
	}, []);

	// 오늘 하루 닫기
	const fncCloseToday = (pop) => {
		const popCookie = Cookies.get('crm-pop');
		const parse = popCookie ? JSON.parse(popCookie) : [];
		const expiresDate = moment().endOf('day').utc().toDate();
		let blockList = [];

		if(popCookie) {
			blockList = [...parse, pop.popupId];
		} else {
			blockList.push(pop.popupId);
		}

		Cookies.set('crm-pop', JSON.stringify(blockList), { expires: expiresDate });
		setPopList(prev => prev.filter(item => item.popupId !== pop.popupId));
	}

	// 닫기
	const fncCloseTemp = (pop) => {
		setPopList(prev => prev.filter(item => item.popupId !== pop.popupId));
	}

	// 링크
	const fncLinkUrl = (item) => {
		if(!item.popupWndwUrlAddr) return;

		let targetUrl = item.popupWndwUrlAddr;
		// const isWWW = item.popupWndwUrlAddr.includes('www.');
		// if(!isWWW) targetUrl = `www.${item.popupWndwUrlAddr}`;

		const isHttps = targetUrl.includes('https://');
		if(!isHttps) targetUrl = `https://${targetUrl}`;

		if(isAccApp) {
			fncPostRN({
				id: 'WEB_OPEN_URL',
				uri: targetUrl
			})
		} else {
			window.open(targetUrl, '_blank')
		}
	}

	const fncHandlers = {
		closeToday: fncCloseToday,
		closeTemp: fncCloseTemp,
		linkUrl: fncLinkUrl
	}

	const fncCallbackEvent = (fncName, variable, payload = {}) => {
		const fnc = fncHandlers[fncName];
		if (typeof fnc === 'function') return fnc(variable, payload);
	}

	if (isMobile) return (
		<MoAdvertisementPop
			fncCallbackEvent={fncCallbackEvent}
			data={{
				popList
			}}
		/>
	);
	else return (
		<DtAdvertisementPop
			fncCallbackEvent={fncCallbackEvent}
			data={{
				popList
			}}
		/>
	)
}

/**
 * @description: Desktop
 * @screenID:    -
 */
DtAdvertisementPop.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function DtAdvertisementPop({data, fncCallbackEvent}) {
	return (
		<div
			className={'popup-bg-opacity gap-x-20 gap-y-10 flex-wrap'}
			style={{
				paddingTop: 0,
				paddingBottom: 0,
				visibility: data?.popList?.length ? 'visible' : 'hidden'
			}}
		>
			{
				data?.popList?.map((pop) => {
					return (
						<div className={'rounded-12 bg-dynamic-bg-neutral-base overflow-hidden'} key={pop.popupId}>
							<div
								className={'relative w-[400px] min-w-[400px] h-[400px] min-h-[400px] overflow-hidden'}
								style={{background: '#F4F5F6'}}
								onClick={() => fncCallbackEvent('linkUrl', pop)}
							>
								{
									pop?.popupTypeCd === 'Y' && pop?.atchFileList[0]?.atchFileId && (
										<Image
											src={`/api/crm/racs/file/download/${pop.atchFileList[0].atchFileId}`}
											alt={`${pop.popupNm} 이미지`}
											style={{ objectFit: 'cover', objectPosition: 'center' }}
											fill
											unoptimized
										/>
									)
								}
								{
									pop?.popupTypeCd === 'N' && (
										<div className={'w-full h-full px-22 py-32 overflow-y-auto prose max-w-none dark:text-dynamic-text-neutral-primary whitespace-pre-wrap'}>
											{pop.popupCn ?? ''}
										</div>
									)
								}
							</div>
							<div className={'flex-row-center justify-between py-4 px-5'}>
								<Button
									theme={'textOnly'}
									size={'md'}
									text={'오늘 하루 보지않기'}
									ariaLabel={'오늘 하루 보지않기'}
									customStyle={'w-fit text-button-lg text-dynamic-text-neutral-secondary font-semibold'}
									onClick={() => fncCallbackEvent('closeToday', pop)}
								/>
								<Button
									theme={'textOnly'}
									size={'md'}
									text={'닫기'}
									ariaLabel={'닫기'}
									customStyle={'w-fit text-button-lg text-dynamic-text-neutral-secondary font-semibold'}
									icon={<X/>}
									iconPosition={'right'}
									onClick={() => fncCallbackEvent('closeTemp', pop)}
								/>
							</div>
						</div>
					)
				})
			}
		</div>
	);
}

/**
 * @description: Mobile
 * @screenID:    -
 */
MoAdvertisementPop.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function MoAdvertisementPop({data, fncCallbackEvent}) {
	return (
		<div
			className={'popup-bg-opacity gap-x-20 gap-y-10 flex-wrap'}
			style={{
				paddingTop: 0,
				paddingBottom: 0,
				visibility: data?.popList?.length ? 'visible' : 'hidden'
			}}
		>
			{
				data?.popList?.map((pop, index) => {
					return (
						<div className={'flex-col-center-center w-full h-full absolute top-0 left-0'} style={{zIndex: 50 + index}} key={pop.popupId}>
							<div className={'rounded-12 bg-dynamic-bg-neutral-base overflow-hidden'}>
								<div
									className={'relative w-[90vw] min-w-[90vw] h-[90vw] min-h-[90vw] overflow-hidden'}
									style={{background: '#F4F5F6'}}
									onClick={() => fncCallbackEvent('linkUrl', pop)}
								>
									{
										pop?.popupTypeCd === 'Y' && pop?.atchFileList[0]?.atchFileId && (
											<Image
												src={`/api/crm/racs/file/download/${pop.atchFileList[0].atchFileId}`}
												alt={`${pop.popupNm} 이미지`}
												style={{ objectFit: 'cover', objectPosition: 'center' }}
												fill
												unoptimized
											/>
										)
									}
									{
										pop?.popupTypeCd === 'N' && (
											<div className={'w-full h-full px-22 py-32 overflow-y-auto prose max-w-none dark:text-dynamic-text-neutral-primary whitespace-pre-wrap'}>
												{pop.popupCn ?? ''}
											</div>
										)
									}
								</div>
								<div className={'flex-row-center justify-between py-4'}>
									<Button
										theme={'textOnly'}
										size={'xs'}
										text={'오늘 하루 보지않기'}
										ariaLabel={'오늘 하루 보지않기'}
										customStyle={'w-fit text-button-lg text-dynamic-text-neutral-secondary font-semibold'}
										onClick={() => fncCallbackEvent('closeToday', pop)}
									/>
									<Button
										theme={'textOnly'}
										size={'xs'}
										text={'닫기'}
										ariaLabel={'닫기'}
										customStyle={'w-fit text-button-lg text-dynamic-text-neutral-secondary font-semibold'}
										icon={<X/>}
										iconPosition={'right'}
										onClick={() => fncCallbackEvent('closeTemp', pop)}
									/>
								</div>
							</div>
						</div>
					)}
				)
			}
		</div>
	);
}
