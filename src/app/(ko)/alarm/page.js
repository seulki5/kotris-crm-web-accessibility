'use client'

import React, {useLayoutEffect, useState} from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import {useMutation} from '@tanstack/react-query';
import {useRouter} from "next/navigation";

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {useMoHeaderContext} from '@modules/context/MoHeaderContext';
import {AlarmTypeOptions} from '@modules/consants/Options';
import {useScrollContext} from '@modules/context/ScrollContext';
import {useApi} from '@modules/services/useApi';
import {apiNotiList, apiUpdateNoti} from '@/app/_actions/user.action';
import {useWebContext} from '@modules/context/WebviewContext';
import {fncCalcTimesFromNow} from '@modules/utils/DateUtils';
import {useUserContext} from '@modules/context/UserContext';
import {RouteConfig} from "@modules/config/RouteConfig";
import {useLoadingContext} from "@modules/context/LoadingContext";

// components
import Breadcrumb from '@components/layout/Breadcrumb';
import Pagination from '@components/common/Pagination';
import Segment from '@components/common/Segment';

// assets
import {EmptyList} from '@assets/icons/Svgs';


/**
 * @description: 알림 목록 화면 입니다.
 * @screenID:    UI-CRM-F272, UI-CRM-F496
 * @screenPath:  홈 > 알림
 * @author       $Author
 * @since        $Date
 * @version      $Revision
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function AlarmList() {

	const router = useRouter();
	const {isMobile} = useScreenSizeContext();
	const {isAccApp, reloadKey, fncFocusLayout} = useWebContext();
	const {fncChangeMoHeader} = useMoHeaderContext();
	const {fncScrollToTop} = useScrollContext();
	const {jsonApiAction} = useApi();
	const {fncUpdateUnchecked} = useUserContext();
	const {isLogin} = useUserContext();
	const {fncRouteStart} = useLoadingContext();

	// 알림 목록(MO)
	const [infiniteList, setInfiniteList] = useState([]);

	// 파라미터
	const [params, setParams] = useState({
		page: 1,
		pageSize: 10,
		notiSeCd: '00',    // 알림구분(00전체, 01공지, 02이벤트, 03쿠폰, 04서비스)
	})

	// --Api
	// 알림 목록
	const {mutate: mutNotiList, data: notiList} = useMutation({
		mutationKey: ['mutNotiList'],
		mutationFn: (payload) => jsonApiAction(apiNotiList, payload),
		onSuccess: (res) => {
			console.log('3: ', res.list)
			if(res.page === 1) {
				setInfiniteList(res.list);
			} else if (res?.endPage >= res.page) {
				setInfiniteList((prev) => [...prev, ...res.list]);
			} else {
				setInfiniteList(res.list);
			}

			if(!isMobile) fncScrollToTop();
		}
	})

	// 알림 확인
	const {mutate: mutCheckNoti} = useMutation({
		mutationKey: ['mutCheckNoti'],
		mutationFn: (payload) => jsonApiAction(apiUpdateNoti, payload),
		onSuccess: (res) => {
			if(res > 0) {
				fncUpdateUnchecked();
			}
		}
	})

	useLayoutEffect(() => {
		if(isLogin) {
			mutCheckNoti({});
		}
	}, [])

	useLayoutEffect(() => {
		if(isLogin) {
			mutNotiList(params);
		}
	}, [params.page, params.notiSeCd, isLogin])

	useLayoutEffect(() => {
		if (isAccApp) fncFocusLayout();
		if(isMobile) {
			fncChangeMoHeader({
				type: 'back',
				title: '알림'
			})
		}
	}, [isMobile, isAccApp, reloadKey])

	// 페이지네이션
	const fncChangePage = (page) => {
		setParams({...params, page: page});
	}

	// 알림 구분 선택
	const fncChangeSegment = (id) => {
		setParams({
			...params,
			page: 1,
			notiSeCd: id
		});
	}

	// 알림 확인
	const fncCheck = (noti) => {
		// 알림구분코드(01공지사항02이벤트03쿠폰04서비스,10:어린이안심서비스,11:청소년연령초과학생할인,12:환불/분실,13:팝업)
		const redirectList = {
			'01': RouteConfig.NOTICE.PATH,
			'02': RouteConfig.EVENT.PATH,
			'03': RouteConfig.COUPON.PATH,
			'10': RouteConfig.CHILDPROOF.PATH,
			'11': RouteConfig.DISCOUNT_STUDENT.PATH,
			'12': RouteConfig.CLAIM.PATH
		}

		if(noti?.notiSeCd) {
			const targetUrl = redirectList[noti.notiSeCd] || null;
			if(targetUrl) {
				fncRouteStart(targetUrl);
				router.push(targetUrl);
			}
		}
	}

	const fncHandlers = {
		changePage: fncChangePage,
		changeSegment: fncChangeSegment,
		check: fncCheck
	}

	const fncCallbackEvent = (fncName, variable, payload = {}) => {
		const fnc = fncHandlers[fncName];
		if (typeof fnc === 'function') return fnc(variable, payload);
	}

	if (isMobile) return (
		<MoAlarmList
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...params,
				notiList,
				infiniteList
			}}
        />
	);
	else return (
		<DtAlarmList
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...params,
				notiList
			}}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F272
 */
DtAlarmList.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function DtAlarmList({data, fncCallbackEvent}) {
	return (
		<main id={'alarm'} className={'body-wrap-618'} aria-labelledby={'page-name-dt'}>
			<Breadcrumb addPaths={[]} />
			<h1 id={'page-name-dt'} className={'page-title'}>
				알림
			</h1>
			<div className={'mt-48'}>
				<Segment
					size={'lg'}
					options={AlarmTypeOptions}
					selectedValue={data.notiSeCd}
					fullSize={true}
					onChange={(id) => fncCallbackEvent('changeSegment', id)}
				/>
				<div className={'mt-36'}>
					{
						data.notiList?.list?.length > 0 ? (
							<>
								<div className={'min-h-[calc(40dvh+144px)]'}>
									{
										data.notiList.list.map((noti) => (
											<button
												key={noti.notiDmndSn}
												type={'button'}
												className={'alarm-item'}
												aria-label={`${noti.notiTtl} 상세 보기`}
												onClick={() => fncCallbackEvent('check', noti)}
												onKeyDown={(e) => {
													if (e.key === 'Enter') fncCallbackEvent('check', noti);
												}}
											>
												<div className={'title'} style={{textAlign: 'left'}}>
													{`[${noti.notiTypeNm}]`}&nbsp;
													{noti?.notiTtl || '-'}
													{noti?.notiChkYn === 'N' && <div className={'badge'}>N</div>}
												</div>
												<div className={'date'}>
													{fncCalcTimesFromNow(noti.frstRegDt)}
												</div>
											</button>
										))
									}
								</div>
								<div className={'flex-col-center mt-48'}>
									<Pagination
										pagingData={{
											dataTotal: data.notiList?.total,
											blockData: data.notiList?.recordCnt,
											blockGroup: 10,
											activePage: data.page,
											activeLastBtn: true,
										}}
										onPaging={(page) => fncCallbackEvent('changePage', page)}
									/>
								</div>
							</>
						) : (
							<div className={'empty-wrap'}>
								<EmptyList/>
								<p>알림이 없어요.</p>
								<p>새로운 알림이 도착하면 이곳에서 확인할 수 있어요.</p>
							</div>
						)
					}
				</div>
			</div>
		</main>
	)
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F496
 */
MoAlarmList.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function MoAlarmList({data, fncCallbackEvent}) {

	const {windowSize} = useScreenSizeContext();

	// 페이징
	const fncFetchMoreItems = () => {
		if(data.page + 1 <= data.notiList?.endPage) {
			fncCallbackEvent('changePage', data.page + 1);
		}
	}

	return (
		<main id={'alarm'} className={'body-wrap-mobile-screen-height'} aria-labelledby={'page-name-mo'}>
			<h1 id={'page-name-mo'} className={'sr-only'}>알림</h1>
			<div className={'body-inner-wrap-mobile gap-20'} style={{justifyContent: 'flex-start'}}>
				<Segment
					size={'sm'}
					options={AlarmTypeOptions}
					selectedValue={data.notiSeCd}
					fullSize={true}
					onChange={(id) => fncCallbackEvent('changeSegment', id)}
				/>
				{
					data.infiniteList.length ? (
						<InfiniteScroll
							className={'scrollbar-none'}
							height={(windowSize.h ?? 800) - 180}
							dataLength={data.infiniteList.length}
							scrollThreshold={0.9}
							hasMore={data.notiList?.endPage ? data.page < data.notiList.endPage : true}
							next={fncFetchMoreItems}
						>
							{
								data.infiniteList.map((noti) => (
									<button
										key={noti.notiDmndSn}
										type={'button'}
										className={'alarm-item'}
										aria-label={`${noti.notiTtl} 상세 보기`}
										onClick={() => fncCallbackEvent('check', noti)}
										onKeyDown={(e) => {
											if(e.key === 'Enter') fncCallbackEvent('check', noti);
										}}
									>
										<div className={'title'} style={{textAlign: 'left'}}>
											{`[${noti.notiTypeNm}]`}&nbsp;
											{noti?.notiTtl || '-'}
											{noti?.notiChkYn === 'N' && <div className={'badge'}>N</div>}
										</div>
										<div className={'date'}>
											{fncCalcTimesFromNow(noti.frstRegDt)}
										</div>
									</button>
								))
							}
						</InfiniteScroll>
					) : (
						<div className={'empty-wrap'}>
							<EmptyList/>
							<p>알림이 없어요.</p>
							<p>새로운 알림이 도착하면 이곳에서 확인할 수 있어요.</p>
						</div>
					)
				}
			</div>
		</main>
	)
}
