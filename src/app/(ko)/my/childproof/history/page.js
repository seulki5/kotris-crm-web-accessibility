'use client'

import React, {useLayoutEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {useRouter} from 'next/navigation';
import InfiniteScroll from 'react-infinite-scroll-component';
import {useMutation} from '@tanstack/react-query';
import moment from "moment";

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {useMoHeaderContext} from '@modules/context/MoHeaderContext';
import {ChildproofPageOptions} from '@modules/consants/Options';
import {useLoadingContext} from '@modules/context/LoadingContext';
import {useWebContext} from '@modules/context/WebviewContext';
import {apiChildHistoryList, apiChildRegList, apiDownloadChildHistoryExcel} from '@/app/_actions/mypage.action';
import {useApi} from '@modules/services/useApi';
import {CODE} from "@modules/consants/Objects";
import {downloadFile} from "@modules/utils/FileUtils";
import {usePopContext} from "@modules/context/PopContext";
import {useUserContext} from "@modules/context/UserContext";

// components
import Breadcrumb from '@components/layout/Breadcrumb';
import Segment from '@components/common/Segment';
import TabControl from '@components/common/TabControl';
import Pagination from '@components/common/Pagination';
import SearchFilter, {initSearchConditions} from '@components/composite/SearchFilter';
import UsageItem from '@/app/(ko)/my/usage/components/UsageItem';

// assets
import {EmptyList} from "@assets/icons/Svgs";


/**
 * @description: 어린이 안심서비스 내 자녀 이용내역 화면 입니다.
 * @screenID:    UI-CRM-F250, UI-CRM-F481
 * @screenPath:  홈 > 마이페이지 > 어린이 안심서비스
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function MyChildproofHistory() {

	const router = useRouter();
	const {isMobile} = useScreenSizeContext();
	const {isAccApp, reloadKey, fncFocusLayout} = useWebContext();
	const {fncChangeMoHeader} = useMoHeaderContext();
	const {jsonApiAction} = useApi();
	const {fncShowPop, fncClosePop} = usePopContext();
	const {isLogin} = useUserContext();
	const {fncRouteStart} = useLoadingContext();

	// 자녀 목록
	const [childList, setChildList] = useState([]);

	// 자녀 목록(MO)
	const [infiniteList, setInfiniteList] = useState([]);

	// 검색 조건
	const [isFilter, setIsFilter] = useState(false);
	const [params, setParams] = useState({
		...initSearchConditions,
		cdrnWebMbrId: '',    // 자녀 아이디
	});

	// --Api
	// 자녀 목록
	const {mutate: mutQueryChildList} = useMutation({
		mutationKey: ['mutQueryChildList'],
		mutationFn: () => jsonApiAction(apiChildRegList, {page: 1, recordCnt: 99999}),
		onSuccess: (res) => {
			if(res?.length > 0) {
				let childes = res.filter(el => el.stlmSttsCd === CODE.CHILDPROOF_APPROVED)?.map((item) => {
					item['id'] = item.cdrnWebMbrId;
					item['name'] = item.cdrnNm;
					return item;
				}) || [];
				setChildList(childes);

				let firstChild = childes?.[0] || {};
				setParams(prev => {
					return {...prev, cdrnWebMbrId: firstChild?.cdrnWebMbrId || ''}
				});
			}
		}
	})

	// 이용내역 목록
	const {mutate: mutQueryChildHistoryList, data: historyList} = useMutation({
		mutationKey: ['mutQueryChildHistoryList'],
		mutationFn: (payload) => jsonApiAction(apiChildHistoryList, {
			...payload,
			dlngBgngDt: moment(payload.dlngBgngDt).format('YYYYMMDD'),
			dlngEndDt: moment(payload.dlngEndDt).format('YYYYMMDD'),
		}),
		onSuccess: (res) => {
			setIsFilter(false);

			const list = res?.groupList ?? [];
			const curPage = res?.page;

			if(res.page === 1) return setInfiniteList(list);
			if (res?.endPage >= curPage) {
				return setInfiniteList((prev) => [...prev, ...list]);
			}
		}
	})

	// 목록 다운로드
	const {mutate: mutDownloadExcel} = useMutation({
		mutationKey: ['mutDownloadExcel'],
		mutationFn: (payload) => jsonApiAction(apiDownloadChildHistoryExcel, {
			...payload,
			dlngBgngDt: moment(payload.dlngBgngDt).format('YYYYMMDD'),
			dlngEndDt: moment(payload.dlngEndDt).format('YYYYMMDD'),
		}),
		onSuccess: (res) => {
			const kidNm = childList.filter(el => el.cdrnWebMbrId === params.cdrnWebMbrId)?.[0]?.name || '';
			const fileNm = `이용내역(${kidNm})`;
			if(kidNm && res) {
				downloadFile(res, fileNm);
			}
		}
	})

    useLayoutEffect(() => {
		isLogin && mutQueryChildList();
    }, [isLogin])

	useLayoutEffect(() => {
		if (isAccApp) fncFocusLayout();
		if (isMobile) {
			fncChangeMoHeader({
				type: 'back',
				title: '어린이 안심서비스'
			})
		}
	}, [isMobile, isAccApp, reloadKey])

    useLayoutEffect(() => {
        if(params.cdrnWebMbrId) {
            mutQueryChildHistoryList(params);
        }
    }, [params.page, params.cdrnWebMbrId]);

    // 페이지네이션
    const fncChangePage = (page) => {
        setParams({...params, page: page});
    }

	// 탭 변경
	const fncChangeActiveChild = (id) => {
		setParams({
			...params,
			...initSearchConditions,
			cdrnWebMbrId: id
		});
		setInfiniteList([]);
	}

	// 검색 필터 보이기/숨기기
	const fncToggleFilter = () => {
		setIsFilter(!isFilter);
	}

	// 검색 조건
	const fncChangeFilterObj = (obj) => {
        setParams({...params, ...obj});
	}

	// 검색 조건 초기화
	const fncInitFilter = () => {
		setParams({
			...params,
			...initSearchConditions,
			page: 1,
		});

		mutQueryChildHistoryList({
			...params,
			...initSearchConditions,
			page: 1,
		});
	}

	// 검색
	const fncSearch = () => {
		if(params.cdrnWebMbrId) {
			setParams({
				...params,
				page: 1,
			});

			mutQueryChildHistoryList({
				...params,
				page: 1,
			});
		}
	}

	// 내역 다운로드
	const fncDownloadExcel = () => {
		if(historyList?.groupList?.length > 0) {
			mutDownloadExcel(params);
		} else {
			fncShowPop({
				mainText: '다운로드할 이용내역이 없습니다.',
				primaryText: '확인',
				onClickPrimary: () => fncClosePop()
			})
		}
	}

	// 이동: 등록현황/이용내역
	const fncChangeSegment = (id) => {
		fncRouteStart(id)
		router.push(id);
	}

	const fncHandlers = {
		changeSegment: fncChangeSegment,
		changeActiveChild: fncChangeActiveChild,
		toggleFilter: fncToggleFilter,
		changeFilterObj: fncChangeFilterObj,
		search: fncSearch,
		initFilter: fncInitFilter,
		changePage: fncChangePage,
		downloadExcel: fncDownloadExcel
	}

	const fncCallbackEvent = (fncName, variable, payload = {}) => {
		const fnc = fncHandlers[fncName];
		if (typeof fnc === 'function') return fnc(variable, payload);
	}

	if (isMobile) return (
		<MoMyChildproofHistory
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...params,
				isFilter,
				childList,
				infiniteList,
				historyList
			}}
		/>
	);
	else return (
		<DtMyChildproofHistory
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...params,
				isFilter,
				childList,
				historyList
			}}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F250
 */
DtMyChildproofHistory.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function DtMyChildproofHistory({data, fncCallbackEvent}) {
	return (
		<main id={'my'} className={'body-wrap-618 childproof-wrap'} aria-labelledby={'page-name-dt'}>
			<Breadcrumb addPaths={[]}/>
			<h1 id={'page-name-dt'} className={'page-title mb-48'}>
				어린이 안심서비스
			</h1>
			<Segment
				size={'lg'}
				options={ChildproofPageOptions}
				selectedValue={ChildproofPageOptions[1].id}
				fullSize={true}
				onChange={(id) => fncCallbackEvent('changeSegment', id)}
			/>
			{
				data.childList?.length > 0 ? (
					<div className={'mt-48'}>
						<TabControl
							disableCnt={true}
							options={data.childList}
							isSelected={data.cdrnWebMbrId}
							onChange={(id) => fncCallbackEvent('changeActiveChild', id)}
						/>
						<SearchFilter
							data={data}
							isOpen={data.isFilter}
							triggerId={data.cdrnWebMbrId}
							onUpdate={(obj) => fncCallbackEvent('changeFilterObj', obj)}
							onSearch={() => fncCallbackEvent('search')}
							onInit={() => fncCallbackEvent('initFilter')}
							onToggle={() => fncCallbackEvent('toggleFilter')}
							onDownload={() => fncCallbackEvent('downloadExcel')}
						/>
						{
							data.historyList?.groupList?.length > 0 ? (
								<>
									<div className={'history-wrap min-h-[calc(40dvh+144px)]'}>
										{
											data.historyList.groupList.map((item, index) => (
												<UsageItem
													key={`${item.dlngYmd}_${item.dlngTm}_${index}`}
													item={item}
													index={index}
												/>
											))
										}
									</div>
									<div className={'flex-col-center'}>
										<Pagination
											pagingData={{
												dataTotal: data.historyList?.total,
												blockData: data.historyList?.recordCnt,
												blockGroup: 10,
												activePage: data.page,
												activeLastBtn: true,
											}}
											onPaging={(page) => fncCallbackEvent('changePage', page)}
										/>
									</div>
								</>
							) : (
								<div className={'empty-wrap'} style={{minHeight: '40dvh'}}>
									<EmptyList/>
									<p>내 자녀 이용내역이 없어요</p>
									<p>Rail+ 카드를 사용하면 이용내역이 표시돼요.</p>
								</div>
							)
						}
					</div>
				) : (
					<div className={'empty-wrap gap-12'} style={{minHeight: '50dvh'}}>
						<EmptyList/>
						<p>등록된 자녀가 없어요.</p>
						<p>자녀 등록은 내 자녀 등록현황에서 신청해 주세요.</p>
					</div>
				)
			}
		</main>
	)
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F481
 */
MoMyChildproofHistory.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};

export function MoMyChildproofHistory({data, fncCallbackEvent}) {

	const {windowSize} = useScreenSizeContext();

	// 페이징
	const fncFetchMoreItems = () => {
		if(data.page + 1 <= data.historyList?.endPage) {
			fncCallbackEvent('changePage', data.page + 1);
		}
	}

	return (
		<main id={'my'} className={'body-wrap-mobile-screen-height childproof-wrap'} aria-labelledby={'page-name-mo'}>
			<h1 id={'page-name-mo'} className={'sr-only'}>어린이 안심서비스 내 자녀 등록현황</h1>
			<div className={'flex-col-center flex-1 gap-32'}>
				<Segment
					size={'md'}
					options={ChildproofPageOptions}
					selectedValue={ChildproofPageOptions[1].id}
					fullSize={true}
					onChange={(id) => fncCallbackEvent('changeSegment', id)}
				/>
				{
					data.childList?.length > 0 ? (
						<div className={'w-full'}>
							<TabControl
								disableCnt={true}
								options={data.childList}
								isSelected={data.cdrnWebMbrId}
								onChange={(id) => fncCallbackEvent('changeActiveChild', id)}
							/>
							<SearchFilter
								data={data}
								isOpen={data.isFilter}
								triggerId={data.cdrnWebMbrId}
								onUpdate={(obj) => fncCallbackEvent('changeFilterObj', obj)}
								onSearch={() => fncCallbackEvent('search')}
								onInit={() => fncCallbackEvent('initFilter')}
								onToggle={() => fncCallbackEvent('toggleFilter')}
								onDownload={() => fncCallbackEvent('downloadExcel')}
							/>
							{
								data.infiniteList?.length > 0 ? (
									<div className={'history-wrap'}>
										<InfiniteScroll
											className={'scrollbar-none'}
											height={(windowSize.h ?? 800) - 270 - 20}
											dataLength={data.infiniteList.length}
											scrollThreshold={0.9}
											hasMore={true}
											next={fncFetchMoreItems}
										>
											{
												data.infiniteList.map((item, index) => (
													<UsageItem
														key={`${item.dlngYmd}_${item.dlngTm}_${index}`}
														item={item}
														index={index}
													/>
												))
											}
										</InfiniteScroll>
									</div>
								) : (
									<div className={'empty-wrap'}>
										<EmptyList/>
										<p>내 자녀 이용내역이 없어요</p>
										<p>Rail+ 카드를 사용하면 이용내역이 표시돼요.</p>
									</div>
								)
							}
						</div>
					) : (
						<div className={'empty-wrap'} style={{marginTop: 0}}>
							<EmptyList/>
							<p>등록된 자녀가 없어요.</p>
							<p>자녀 등록은 내 자녀 등록현황에서 신청해 주세요.</p>
						</div>
					)
				}
			</div>
		</main>
	)
}
