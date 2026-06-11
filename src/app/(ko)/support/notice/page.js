'use client'

import React, {useLayoutEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {useRouter} from 'next/navigation';
import InfiniteScroll from "react-infinite-scroll-component";
import {useMutation} from "@tanstack/react-query";

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {useMoHeaderContext} from '@modules/context/MoHeaderContext';
import {RouteConfig} from '@modules/config/RouteConfig';
import {useWebContext} from '@modules/context/WebviewContext';
import {useLoadingContext} from '@modules/context/LoadingContext';
import {useApi} from "@modules/services/useApi";
import {apiNoticeList} from "@/app/_actions/support.action";
import {toMomentFrom14} from "@modules/utils/DateUtils";
import {useScrollContext} from "@modules/context/ScrollContext";

// components
import Breadcrumb from '@components/layout/Breadcrumb';
import InputText from '@components/common/InputText';
import Pagination from '@components/common/Pagination';

// assets
import {EmptyDefault, Search} from '@assets/icons/Svgs';
import {BulletNotice, BulletNew} from '@assets/indicators/NoticeBullet';


/**
 * @description: 공지사항 목록 화면 입니다.
 * @screenID:    UI-CRM-F251, UI-CRM-F486
 * @screenPath:  홈 > 고객센터 > 공지사항
 * @author       $Author
 * @since        $Date
 * @version      $Revision
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function SupportNoticeList() {

	const router = useRouter();
	const searchRef = useRef(null);
	const {isMobile} = useScreenSizeContext();
	const {isAccApp, reloadKey, fncFocusLayout} = useWebContext();
	const {fncChangeMoHeader} = useMoHeaderContext();
	const {fncScrollToTop} = useScrollContext();
	const {jsonApiAction} = useApi();
	const {fncRouteStart} = useLoadingContext();

	// 목록(MO)
	const [infiniteList, setInfiniteList] = useState([]);

	// 목록(DT)
	const [noticeList, setNoticeList] = useState([]);

	// 파라미터
	const [params, setParams] = useState({
		page: 1,
		pageSize: 10,
		ofcatTtlCn: '',
	})

	// --Api
	// 공지 목록
	const {mutate: mutNoticeList} = useMutation({
		mutationKey: ['mutFaqCodeList'],
		mutationFn: (payload) => jsonApiAction(apiNoticeList, payload),
		onSuccess: (res) => {
			setNoticeList(res);

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

	useLayoutEffect(() => {
		if(params.page) mutNoticeList(params);
	}, [params.page])

	useLayoutEffect(() => {
		if (isAccApp) fncFocusLayout();
		if (isMobile) {
			fncChangeMoHeader({
				type: 'back',
				title: '공지사항'
			})
		}
	}, [isMobile, isAccApp, reloadKey])

	// 검색어 입력
	const fncChangeInput = (e) => {
		setParams({
			...params,
			[e.target.id]: e.target.value
		});
	}

	// 검색어 검색
	const fncSearch = () => {
		searchRef?.current?.blur();
		if(params.page > 1) {
			setParams({...params, page: 1});
		} else {
			mutNoticeList(params);
		}
	}

	// 페이지네이션
	const fncChangePage = (page) => {
		setParams({...params, page: page});
	}

	// 이동: 상세
	const fncGoDetail = (notice) => {
		if(notice?.ofcatId) {
			const targetUri = `${RouteConfig.NOTICE_DETAIL.PATH}?id=${notice.ofcatId}`;
			fncRouteStart(targetUri);
			router.push(targetUri);
		}
	}

	const fncHandlers = {
		changeInput: fncChangeInput,
		changePage: fncChangePage,
		search: fncSearch,
		goDetail: fncGoDetail
	}

	const fncCallbackEvent = (fncName, variable, payload = {}) => {
		const fnc = fncHandlers[fncName];
		if (typeof fnc === 'function') return fnc(variable, payload);
	}

	if (isMobile) return (
		<MoSupportNoticeList
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...params,
				noticeList,
				infiniteList
			}}
			ref={searchRef}
        />
	);
	else return (
		<DtSupportNoticeList
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...params,
				noticeList
			}}
			ref={searchRef}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F251
 */
DtSupportNoticeList.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func,
	ref: PropTypes.any
};
export function DtSupportNoticeList({data, fncCallbackEvent, ref}) {
	return (
		<main id={'support'} className={'body-wrap-880 notice-wrap'} aria-labelledby={'page-name-dt'}>
			<Breadcrumb addPaths={[]} />
			<h1 id={'page-name-dt'} className={'page-title'}>
				공지사항
			</h1>
			<div className={'page-bottom-space mt-48'} style={{paddingBottom: 0}}>
				<InputText
					ref={ref}
					size={'lg'}
					placeholder={'검색할 키워드를 입력하세요'}
					icon={<Search />}
					iconAriaLabel={'검색'}
					allows={['kor','alnum','space','dash']}
					id={'ofcatTtlCn'}
					value={data?.ofcatTtlCn}
					onChange={(e) => fncCallbackEvent('changeInput', e)}
					onClickIcon={() => fncCallbackEvent('search')}
					onKeyDown={(e) => {
						if(e.nativeEvent.isComposing) return;
						if (e.key === 'Enter') fncCallbackEvent('search');
					}}
				/>
				<p className={'total'}>
					총 <span className={'text-dynamic-text-brand-primary-bold'}>{data.noticeList?.total || 0}</span>건
				</p>
				{
					data.noticeList?.list?.length ? (
						<>
							<div className={'min-h-[calc(40dvh+144px)]'}>
								{
									data.noticeList.list.map((notice) => (
										<button
											key={notice.ofcatId}
											type={'button'}
											className={'notice-item'}
											aria-label={`${moment(toMomentFrom14(notice.frstRegDt)).format('YYYY년 MM월 DD일')}, ${notice.ofcatTtlCn} 링크`}
											onClick={() => fncCallbackEvent('goDetail', notice)}
											onKeyDown={(e) => {
												if(e.key === 'Enter') fncCallbackEvent('goDetail', notice);
											}}
										>
											<div className={'title'} aria-hidden={true}>
												{
													notice.ofcatSeCd === '01' && <BulletNotice />
												}
												{
													notice.ofcatSeCd === '03' && <BulletNew />
												}
												{notice.ofcatTtlCn}
											</div>
											<div className={'date'} aria-hidden={true}>
												{moment(toMomentFrom14(notice.frstRegDt)).format('YYYY-MM-DD')}
											</div>
										</button>
									))
								}
							</div>
							<div className={'flex-col-center mt-48'}>
								<Pagination
									pagingData={{
										dataTotal: data.noticeList?.total,
										blockData: data.noticeList?.recordCnt,
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
							<EmptyDefault/>
							<p>검색된 게시물이 없어요<br/>다시 검색해 주세요</p>
						</div>
					)
				}
			</div>
		</main>
	)
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F486
 */
MoSupportNoticeList.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func,
	ref: PropTypes.any
};
export function MoSupportNoticeList({data, fncCallbackEvent, ref}) {

	const {windowSize} = useScreenSizeContext();

	// 페이징
	const fncFetchMoreItems = () => {
		if(data.page + 1 <= data.noticeList?.endPage) {
			fncCallbackEvent('changePage', data.page + 1);
		}
	}

	// 검색
	const fncInfiniteSearch = () => {
		fncCallbackEvent('search');
	}

	return (
		<main id={'support'} className={'body-wrap-mobile-screen-height notice-wrap'} aria-labelledby={'page-name-mo'}>
			<h1 id={'page-name-mo'} className={'sr-only'}>공지사항</h1>
			<div className={'body-inner-wrap-mobile'} style={{justifyContent: 'flex-start'}}>
				<InputText
					ref={ref}
					size={'md'}
					placeholder={'검색할 키워드를 입력하세요'}
					icon={<Search />}
					iconAriaLabel={'검색'}
					allows={['kor','alnum','space','dash']}
					id={'ofcatTtlCn'}
					value={data?.ofcatTtlCn}
					onChange={(e) => fncCallbackEvent('changeInput', e)}
					onClickIcon={fncInfiniteSearch}
					onKeyDown={(e) => {
						if(e.nativeEvent.isComposing) return;
						if (e.key === 'Enter') fncInfiniteSearch();
					}}
				/>
				{
					data.infiniteList.length ? (
						<InfiniteScroll
							className={'scrollbar-none'}
							height={(windowSize.h ?? 800) - 180}
							dataLength={data.infiniteList.length}
							scrollThreshold={0.95}
							hasMore={data.noticeList?.endPage ? data.page < data.noticeList.endPage : true}
							next={fncFetchMoreItems}
						>
							{
								data.infiniteList.map((notice) => (
									<button
										key={notice.ofcatId}
										type={'button'}
										className={'notice-item'}
										aria-label={`${moment(toMomentFrom14(notice.frstRegDt)).format('YYYY년 MM월 DD일')}, ${notice.ofcatTtlCn} 링크`}
										onClick={() => fncCallbackEvent('goDetail', notice)}
										onKeyDown={(e) => {
											if(e.key === 'Enter') fncCallbackEvent('goDetail', notice);
										}}
									>
										<div className={'title'} aria-hidden={true}>
											{
												notice.ofcatSeCd === '01' && <BulletNotice />
											}
											{
												notice.ofcatSeCd === '03' && <BulletNew />
											}
											{notice.ofcatTtlCn}
										</div>
										<div className={'date'} aria-hidden={true}>
											{moment(toMomentFrom14(notice.frstRegDt)).format('YYYY-MM-DD')}
										</div>
									</button>
								))
							}
						</InfiniteScroll>
					) : (
						<div className={'empty-wrap'}>
							<EmptyDefault/>
							<p>검색된 게시물이 없어요<br/>다시 검색해 주세요</p>
						</div>
					)
				}
			</div>
		</main>
	)
}
