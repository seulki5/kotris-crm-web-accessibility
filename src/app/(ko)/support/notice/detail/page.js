'use client'

import React, {useLayoutEffect} from "react";
import PropTypes from "prop-types";
import moment from "moment";
import {useRouter, useSearchParams} from "next/navigation";
import {useMutation} from "@tanstack/react-query";

// modules
import {useScreenSizeContext} from "@modules/context/ScreenContext";
import {useMoHeaderContext} from "@modules/context/MoHeaderContext";
import {useApi} from "@modules/services/useApi";
import {useLoadingContext} from "@modules/context/LoadingContext";
import {apiNoticeDetail} from "@/app/_actions/support.action";
import {toMomentFrom14} from "@modules/utils/DateUtils";
import {useWebContext} from "@modules/context/WebviewContext";

// components
import Breadcrumb from "@components/layout/Breadcrumb";
import Button from "@components/common/Button";
import FileDownload from "@components/composite/FileDownload";

// assets
import {BulletNew, BulletNotice} from "@assets/indicators/NoticeBullet";


/**
 * @description: 공지사항 상세 화면 입니다.
 * @screenID:    UI-CRM-F252, UI-CRM-F487
 * @screenPath:  홈 > 고객센터 > 공지사항
 * @author       $Author
 * @since        $Date
 * @version      $Revision
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function SupportNoticeDetail() {

	const router = useRouter();
	const searchParams = useSearchParams();
	const id = searchParams.get('id');
	const {isMobile} = useScreenSizeContext();
	const {isAccApp, reloadKey, fncFocusLayout} = useWebContext();
	const {fncChangeMoHeader} = useMoHeaderContext();
	const {jsonApiAction} = useApi();
	const {fncSetLoading} = useLoadingContext();

	// --Api
	// 조회
	const {mutate: mutNoticeDetail, data: noticeDetail} = useMutation({
		mutationKey: ['mutNoticeDetail'],
		mutationFn: (id) => jsonApiAction(apiNoticeDetail, {ofcatId: id}),
		onSuccess: (data) => {
			fncSetLoading(false);
		}
	})

	useLayoutEffect(() => {
		if(id) mutNoticeDetail(id);
	}, [id]);

	useLayoutEffect(() => {
		if (isAccApp) fncFocusLayout();
		if(isMobile) {
			fncChangeMoHeader({
				type: 'back',
				title: '공지사항'
			})
		}
	}, [isMobile, isAccApp, reloadKey])

	// 이동: 이전
	const fncGoBack = () => {
		router.back();
	}

	const fncHandlers = {
		goBack: fncGoBack
	}

	const fncCallbackEvent = (fncName, variable, payload = {}) => {
		const fnc = fncHandlers[fncName];
		if (typeof fnc === 'function') return fnc(variable, payload);
	}

	if (isMobile) return (
		<MoSupportNoticeDetail
			data={{
				noticeDetail
			}}
        />
	);
	else return (
		<DtSupportNoticeDetail
			fncCallbackEvent={fncCallbackEvent}
			data={{
				noticeDetail
			}}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F252
 */
DtSupportNoticeDetail.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function DtSupportNoticeDetail({data, fncCallbackEvent}) {
	const detail = data.noticeDetail || {};
	return (
		<main id={'support'} className={'body-wrap-880 notice-wrap'} aria-labelledby={'page-name-dt'}>
			<Breadcrumb addPaths={[]} />
			<div className={'flex-col-center-40'}>
				<div className={'notice-header'}>
					<h1 id={'page-name-dt'} className={'title'}>
						{
							detail?.ofcatSeCd === '01' && <BulletNotice aria-hidden={true} />
						}
						{
							detail?.ofcatSeCd === '03' && <BulletNew aria-hidden={true} />
						}
						{detail?.ofcatTtlCn}
					</h1>
					<div className={'date'}>
						{detail?.frstRegDt && moment(toMomentFrom14(detail?.frstRegDt)).format('YYYY-MM-DD')}
					</div>
				</div>
				<div className={'divider'} />
				<div className={'content-wrap'}>
					<div
						className={'prose max-w-none dark:text-dynamic-text-neutral-primary'}
						dangerouslySetInnerHTML={{__html: detail?.ofcatBodyCn}}
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
 * @screenID:    UI-CRM-F487
 */
MoSupportNoticeDetail.propTypes = {
	data: PropTypes.object,
};
export function MoSupportNoticeDetail({data}) {
	const detail = data.noticeDetail || {};
	return (
		<main id={'support'} className={'body-wrap-mobile-screen-height notice-wrap'} aria-labelledby={'page-name-mo'}>
			<div className={'flex-col-center-40'}>
				<div className={'notice-header'}>
					<h1 id={'page-name-mo'} className={'title'}>
						{
							detail?.ofcatSeCd === '01' && <BulletNotice aria-hidden={true} />
						}
						{
							detail?.ofcatSeCd === '03' && <BulletNew aria-hidden={true} />
						}
						{detail?.ofcatTtlCn}
					</h1>
					<div className={'date'}>
						{moment(toMomentFrom14(detail?.frstRegDt)).format('YYYY-MM-DD')}
					</div>
				</div>
				<div className={'divider'} />
				<div className={'content-wrap'}>
					<div
						className={'prose max-w-none dark:text-dynamic-text-neutral-primary'}
						dangerouslySetInnerHTML={{__html: detail?.ofcatBodyCn}}
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
