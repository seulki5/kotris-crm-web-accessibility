'use client'

import React, {useLayoutEffect, useState} from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";
import {useMutation} from "@tanstack/react-query";

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {apiDownloadUsageExcel, apiUsageList} from "@/app/_actions/mypage.action";
import {useApi} from "@modules/services/useApi";
import {useUserContext} from "@modules/context/UserContext";
import {to14FromMoment} from "@modules/utils/DateUtils";
import {useScrollContext} from "@modules/context/ScrollContext";
import {downloadFile} from "@modules/utils/FileUtils";
import {usePopContext} from "@modules/context/PopContext";

// components
import Pagination from '@components/common/Pagination';
import SearchFilter, {initSearchConditions} from "@components/composite/SearchFilter";
import UsageItem from "@/app/(ko)/my/usage/components/UsageItem";

// assets
import {EmptyList} from "@assets/icons/Svgs";


/**
 * @description: Rail+ 이용내역 기간별 조회 컴포넌트 입니다.
 * @screenID:    UI-CRM-F230, UI-CRM-F465-01
 * @screenPath:  홈 > 마이페이지 > Rail+ 이용내역 조회
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
UsagePeriod.propTypes = {
	activeCard: PropTypes.string,
};
export default function UsagePeriod({activeNo}) {

	const {isMobile} = useScreenSizeContext();
	const {jsonApiAction} = useApi();
	const {fncEncode} = useUserContext();
	const {fncScrollToTop} = useScrollContext();
	const {fncShowPop, fncClosePop} = usePopContext();

	// 검색 필터
	const [isFilter, setIsFilter] = useState(false);

	// 목록(MO)
	const [infiniteList, setInfiniteList] = useState([]);

	// 파라미터
	const [params, setParams] = useState({
		...initSearchConditions,
		page: 1,
		pageSize: 10,
		cardNoEncpt: activeNo
	})

	// --Api
	// 목록
	const {mutate: mutQueryUsageList, data: usageList} = useMutation({
		mutationKey: ['mutQueryUsageList'],
		mutationFn: (payload) => jsonApiAction(apiUsageList, {
			...payload,
			dlngBgngDt: to14FromMoment(payload.dlngBgngDt),
			dlngEndDt: to14FromMoment(payload.dlngEndDt),
		}),
		onSuccess: (res) => {
			setIsFilter(false);
			if(!isMobile) fncScrollToTop();

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
		mutationFn: (payload) => jsonApiAction(apiDownloadUsageExcel, {
			...payload,
			dlngBgngDt: to14FromMoment(payload.dlngBgngDt),
			dlngEndDt: to14FromMoment(payload.dlngEndDt),
		}),
		onSuccess: (res) => {
			const fileNm = `이용내역`;
			if(fileNm && res) {
				downloadFile(res, fileNm);
			}
		}
	})

	// 카드 번호 변경
	useLayoutEffect(() => {
		if(activeNo) fncInitFilter();
	}, [activeNo]);

	// 페이징
	useLayoutEffect(() => {
		const fncGetUsageList = async() => {
			const encoded = await fncEncode(activeNo);
			if(!encoded) return;
			mutQueryUsageList({
				...params,
				cardNoEncpt: encoded,
			});
		}

		if(activeNo) fncGetUsageList();
	}, [params.page]);

	// 페이지네이션
	const fncChangePage = (page) => {
		setParams({...params, page: page});
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
	const fncInitFilter = async () => {
		setParams({
			...initSearchConditions,
			page: 1,
			pageSize: 10,
			cardNoEncpt: activeNo
		});

		const encoded = await fncEncode(activeNo);
		if(!encoded) return;
		mutQueryUsageList({
			...initSearchConditions,
			page: 1,
			cardNoEncpt: encoded,
		});
	}

	// 검색
	const fncSearch = async () => {
		const encoded = await fncEncode(activeNo);
		if(!encoded) return;
		mutQueryUsageList({
			...params,
			cardNoEncpt: encoded,
			page: 1
		});
	}

	// 내역 다운로드
	const fncDownloadForm = async () => {
		if(usageList?.groupList?.length) {
			const encoded = await fncEncode(activeNo);
			if(!encoded) return;
			mutDownloadExcel({
				...params,
				cardNoEncpt: encoded
			});
		} else {
			fncShowPop({
				mainText: '다운로드할 이용내역이 없습니다.',
				primaryText: '확인',
				onClickPrimary: () => fncClosePop()
			})
		}
	}

	const fncHandlers = {
		toggleFilter: fncToggleFilter,
		changeFilterObj: fncChangeFilterObj,
		search: fncSearch,
		initFilter: fncInitFilter,
		changePage: fncChangePage,
		downloadForm: fncDownloadForm
	}

	const fncCallbackEvent = (fncName, variable, payload = {}) => {
		const fnc = fncHandlers[fncName];
		if (typeof fnc === 'function') return fnc(variable, payload);
	}

	if (isMobile) return (
		<MoUsagePeriod
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...params,
				isFilter,
				usageList,
				infiniteList,
				activeNo
			}}
		/>
	);
	else return (
		<DtUsagePeriod
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...params,
				isFilter,
				usageList,
				activeNo
			}}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F230
 */
DtUsagePeriod.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function DtUsagePeriod({data, fncCallbackEvent}) {
	return (
		<div className={'mt-48'}>
			<SearchFilter
				data={data}
				isOpen={data.isFilter}
				triggerId={data.cardNoEncpt}
				onUpdate={(obj) => fncCallbackEvent('changeFilterObj', obj)}
				onSearch={() => fncCallbackEvent('search')}
				onInit={() => fncCallbackEvent('initFilter')}
				onToggle={() => fncCallbackEvent('toggleFilter')}
				onDownload={() => fncCallbackEvent('downloadForm')}
			/>
			{
				data.usageList?.groupList?.length > 0 ? (
					<>
						<div className={'history-wrap'}>
							{
								data.usageList.groupList.map((item, index) => (
									<UsageItem key={item.key} item={item} index={index} />
								))
							}
						</div>
						<div className={'flex-col-center'}>
							<Pagination
								pagingData={{
									dataTotal: data.usageList?.total,
									blockData: data.usageList?.recordCnt,
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
						<EmptyList />
						<p>이용내역이 없어요</p>
						<p>Rail+ 카드를 사용하면 이용내역이 표시돼요.</p>
					</div>
				)
			}
		</div>
	)
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F465-01
 */
MoUsagePeriod.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function MoUsagePeriod({data, fncCallbackEvent}) {

	const {windowSize} = useScreenSizeContext();

	// 페이징
	const fncFetchMoreItems = () => {
		if(data.page + 1 <= data.usageList?.endPage) {
			fncCallbackEvent('changePage', data.page + 1);
		}
	}

	return (
		<div className={'w-full flex flex-col flex-1'}>
			<SearchFilter
				data={data}
				isOpen={data.isFilter}
				triggerId={data.cardNoEncpt}
				onUpdate={(obj) => fncCallbackEvent('changeFilterObj', obj)}
				onSearch={() => fncCallbackEvent('search')}
				onInit={() => fncCallbackEvent('initFilter')}
				onToggle={() => fncCallbackEvent('toggleFilter')}
				onDownload={() => fncCallbackEvent('downloadForm')}
			/>
			{
				data.infiniteList?.length > 0 ? (
					<>
						<div className={'history-wrap'}>
							<InfiniteScroll
								className={'scrollbar-none'}
								height={(windowSize.h ?? 800) - 270 - 53}
								dataLength={data.infiniteList.length}
								scrollThreshold={0.9}
								hasMore={true}
								next={fncFetchMoreItems}
							>
								{
									data.infiniteList?.map((item, index) => (
										<UsageItem key={item.key} item={item} index={index} />
									))
								}
							</InfiniteScroll>
						</div>
					</>
				) : (
					<div className={'empty-wrap'}>
						<EmptyList />
						<p>이용내역이 없어요</p>
						<p>Rail+ 카드를 사용하면 이용내역이 표시돼요.</p>
					</div>
				)
			}
		</div>
	)
}
