'use client'

import React, {useLayoutEffect} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {useRouter, useSearchParams} from 'next/navigation';
import {useMutation} from '@tanstack/react-query';

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {useMoHeaderContext} from '@modules/context/MoHeaderContext';
import {useApi} from '@modules/services/useApi';
import {useLoadingContext} from '@modules/context/LoadingContext';
import {useWebContext} from "@modules/context/WebviewContext";
import {apiEventDetail} from "@/app/_actions/support.action";
import {toMomentFrom14} from "@modules/utils/DateUtils";

// components
import Breadcrumb from '@components/layout/Breadcrumb';
import Button from '@components/common/Button';
import FileDownload from '@components/composite/FileDownload';


/**
 * @description: 이벤트 상세 화면 입니다.
 * @screenID:    UI-CRM-F254, UI-CRM-F489
 * @screenPath:  홈 > 고객센터 > 이벤트
 * @author       $Author
 * @since        $Date
 * @version      $Revision
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function SupportEventDetail() {

	const router = useRouter();
	const searchParams = useSearchParams();
	const id = searchParams.get('id');
	const {isMobile} = useScreenSizeContext();
	const {isAccApp, reloadKey, fncFocusLayout} = useWebContext();
	const {fncChangeMoHeader} = useMoHeaderContext();
	const {jsonApiAction} = useApi();
	const {fncSetLoading} = useLoadingContext();

	// --Api
	const {mutate: mutEventDetail, data: eventDetail} = useMutation({
		mutationKey: ['mutEventDetail'],
		mutationFn: (id) => jsonApiAction(apiEventDetail, {evntId: id}),
		onSuccess: (data) => {
			fncSetLoading(false);
		}
	})

	useLayoutEffect(() => {
		if(id) mutEventDetail(id);
	}, [id]);

	useLayoutEffect(() => {
		if (isAccApp) fncFocusLayout();
		if (isMobile) {
			fncChangeMoHeader({
				type: 'back',
				title: '이벤트'
			})
		}
	}, [isMobile, isAccApp, reloadKey])

	// 이동: 이전
	const fncGoBack = () => {
		router.back();
	}

	const fncHandlers = {
		goBack: fncGoBack,
	}

	const fncCallbackEvent = (fncName, variable, payload = {}) => {
		const fnc = fncHandlers[fncName];
		if (typeof fnc === 'function') return fnc(variable, payload);
	}

	if (isMobile) return (
		<MoSupportEventDetail
			data={{
				eventDetail
			}}
        />
	);
	else return (
		<DtSupportEventDetail
			fncCallbackEvent={fncCallbackEvent}
			data={{
				eventDetail
			}}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F254
 */
DtSupportEventDetail.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function DtSupportEventDetail({data, fncCallbackEvent}) {
	const detail = data.eventDetail || {};
	return (
		<main id={'support'} className={'body-wrap-880 event-wrap'} aria-labelledby={'page-name-dt'}>
			<Breadcrumb addPaths={[]} />
			<div className={'flex-col-center-40'}>
				<div className={'event-header'}>
					<h1 id={'page-name-dt'} className={'title'}>
						{detail?.evntNm}
					</h1>
					<div className={'date'}>
						<span className={'sr-only'}>
							{`게시일자: ${detail?.frstRegDt && moment(toMomentFrom14(detail?.frstRegDt)).format('YYYY년 MM월 DD일')}`}
						</span>
						<span aria-hidden={true}>
							{moment(toMomentFrom14(detail?.frstRegDt)).format('YYYY-MM-DD')}
						</span>
					</div>
				</div>
				<div className={'divider'} />
				<div className={'content-wrap'}>
					<div
						className={'prose max-w-none dark:text-dynamic-text-neutral-primary'}
						dangerouslySetInnerHTML={{__html: detail?.evntCn}}
					/>
					{
						detail?.atchFileList?.length > 0 && (
							<div className={'attachment-wrap'}>
								{
									detail.atchFileList.map((attach) => (
										<FileDownload
											key={attach.atchFileId}
											type={'attached'}
											name={attach.atchFileNm}
											fileId={attach.atchFileId}
											fileName={attach.atchFileNm}
										/>
									))
								}
							</div>
						)
					}
				</div>
			</div>
			<div className={'page-bottom-button-wrap'}>
				<Button
					theme={'primary'}
					size={'xl'}
					text={'목록'}
					ariaLabel={'목록으로 돌아가기'}
					customStyle={'w-[240px]'}
					disabled={false}
					onClick={() => fncCallbackEvent('goBack')}
				/>
			</div>
		</main>
	)
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F489
 */
MoSupportEventDetail.propTypes = {
	data: PropTypes.object,
};
export function MoSupportEventDetail({data}) {
	const detail = data.eventDetail || {};
	return (
		<main id={'support'} className={'body-wrap-mobile-screen-height event-wrap'} aria-labelledby={'page-name-mo'}>
			<div className={'flex-col-center-40'}>
				<div className={'event-header'}>
					<h1 id={'page-name-mo'} className={'title'}>
						{detail?.evntNm}
					</h1>
					<div className={'date'}>
						<span className={'sr-only'}>
							{`게시일자: ${detail?.frstRegDt && moment(toMomentFrom14(detail?.frstRegDt)).format('YYYY년 MM월 DD일')}`}
						</span>
						<span aria-hidden={true}>
							{moment(toMomentFrom14(detail?.frstRegDt)).format('YYYY-MM-DD')}
						</span>
					</div>
				</div>
				<div className={'divider'} />
				<div className={'content-wrap'}>
					<div
						className={'prose max-w-none dark:text-dynamic-text-neutral-primary'}
						dangerouslySetInnerHTML={{__html: detail?.evntCn}}
					/>
					{
						detail?.atchFileList?.length > 0 && (
							<div className={'attachment-wrap'}>
								{
									detail.atchFileList.map((attach) => (
										<FileDownload
											key={attach.atchFileId}
											type={'attached'}
											name={attach.atchFileNm}
											fileId={attach.atchFileId}
											fileName={attach.atchFileNm}
										/>
									))
								}
							</div>
						)
					}
				</div>
			</div>
		</main>
	)
}
