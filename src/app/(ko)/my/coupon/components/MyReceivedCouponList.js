'use client'

import React, {useLayoutEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {useMutation} from '@tanstack/react-query';
import InfiniteScroll from 'react-infinite-scroll-component';

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {CouponPageOptions} from '@modules/consants/Options';
import {useScrollContext} from '@modules/context/ScrollContext';
import {useLoadingContext} from '@modules/context/LoadingContext';
import {useApi} from '@modules/services/useApi';
import {apiCouponList} from '@/app/_actions/mypage.action';
import {useUserContext} from "@modules/context/UserContext";

// components
import CouponFilter, {initCouponConditions} from '@components/composite/CouponFilter';
import Ticket from '@/app/(ko)/my/coupon/components/Ticket';
import Pagination from '@components/common/Pagination';

// assets
import {EmptyCoupon} from '@assets/icons/Svgs';


/**
 * @description: 쿠폰함(받은 쿠폰) 목록 입니다.
 * @screenID:    UI-CRM-F237, UI-CRM-F482
 * @screenPath:  홈 > 마이페이지 > 쿠폰함
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function MyReceivedCouponList() {

	const {isMobile} = useScreenSizeContext();
	const {fncScrollToTop} = useScrollContext();
	const {jsonApiAction} = useApi();
	const {isLogin} = useUserContext();

	// 쿠폰 목록(MO)
	const [infiniteList, setInfiniteList] = useState([]);

	// 검색 필터
	const [isFilter, setIsFilter] = useState(false);

	// 파라미터
	const [params, setParams] = useState({
		...initCouponConditions,
		tsrpSeCd: CouponPageOptions[0].id,   // 송수신구분코드(S보낸쿠폰, R받은쿠폰)
		pageSize: 10,
		page: 1
	})

	// --Api
	// 목록
	const {mutate: mutQueryRecvCouponList, data: couponList} = useMutation({
		mutationKey: ['mutQueryRecvCouponList'],
		mutationFn: (payload) => jsonApiAction(apiCouponList, payload),
		onSuccess: (res) => {
			setIsFilter(false);
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
		isLogin && mutQueryRecvCouponList(params);
	}, [params.page, isLogin]);

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
			...initCouponConditions,
			page: 1,
		});

		mutQueryRecvCouponList({
			...params,
			...initCouponConditions,
			page: 1,
		});
	}

	// 검색
	const fncSearch = () => {
		mutQueryRecvCouponList({...params, page: 1});
	}

	// 페이지네이션
	const fncChangePage = (page) => {
		setParams({...params, page: page});
	}

	const fncHandlers = {
		toggleFilter: fncToggleFilter,
		changeFilterObj: fncChangeFilterObj,
		changePage: fncChangePage,
		search: fncSearch,
		initFilter: fncInitFilter,
	}

	const fncCallbackEvent = (fncName, variable, payload = {}) => {
		const fnc = fncHandlers[fncName];
		if (typeof fnc === 'function') return fnc(variable, payload);
	}

	if (isMobile) return (
		<MoMyReceivedCouponList
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...params,
				isFilter,
				couponList,
				infiniteList
			}}
		/>
	);
	else return (
		<DtMyReceivedCouponList
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...params,
				isFilter,
				couponList,
			}}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F237
 */
DtMyReceivedCouponList.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function DtMyReceivedCouponList({data, fncCallbackEvent}) {
	return (
		<>
			<CouponFilter
				data={data}
				isOpen={data.isFilter}
				onUpdate={(obj) => fncCallbackEvent('changeFilterObj', obj)}
				onSearch={() => fncCallbackEvent('search')}
				onInit={() => fncCallbackEvent('initFilter')}
				onToggle={() => fncCallbackEvent('toggleFilter')}
			/>
			{
				data.couponList?.list?.length > 0 ? (
					<>
						<div className={'min-h-[calc(40dvh+144px)]'}>
							<div className={'coupon-list-wrap'}>
								{
									data.couponList.list.map((coupon) => (
										<Ticket
											key={coupon.coupSn}
											type={CouponPageOptions[0].id}
											data={coupon}
										/>
									))
								}
							</div>
						</div>
						<div className={'flex-col-center'}>
							<Pagination
								pagingData={{
									dataTotal: data.couponList?.total,
									blockData: data.couponList?.recordCnt,
									blockGroup: 10,
									activePage: data.page,
									activeLastBtn: true,
								}}
								onPaging={(page) => fncCallbackEvent('changePage', page)}
							/>
						</div>
					</>
				) : (
					<div className={'empty-wrap gap-12'}>
						<EmptyCoupon/>
						<p>받은 쿠폰이 없어요.</p>
						<p>쿠폰을 받으면 이곳에서 확인할 수 있어요.</p>
					</div>
				)
			}
		</>
	)
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F482
 */
MoMyReceivedCouponList.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function MoMyReceivedCouponList({data, fncCallbackEvent}) {

	const {windowSize} = useScreenSizeContext();

	// 페이징
	const fncFetchMoreItems = () => {
		if(data.page + 1 <= data.couponList?.endPage) {
			fncCallbackEvent('changePage', data.page + 1);
		}
	}

	return (
		<div className={'w-full flex flex-col'}>
			<CouponFilter
				data={data}
				isOpen={data.isFilter}
				onUpdate={(obj) => fncCallbackEvent('changeFilterObj', obj)}
				onSearch={() => fncCallbackEvent('search')}
				onInit={() => fncCallbackEvent('initFilter')}
				onToggle={() => fncCallbackEvent('toggleFilter')}
			/>
			<div className={'coupon-list-wrap'}>
				{
					data.infiniteList?.length > 0 ? (
						<InfiniteScroll
							className={'scrollbar-none gap-16 flex flex-1 flex-col'}
							height={(windowSize.h ?? 800) - 220}
							dataLength={data.infiniteList.length}
							scrollThreshold={0.9}
							hasMore={true}
							next={fncFetchMoreItems}
						>
							{
								data.infiniteList?.map((coupon) => (
									<Ticket
										key={coupon.coupSn}
										type={CouponPageOptions[0].id}
										data={coupon}
									/>
								))
							}
						</InfiniteScroll>
					) : (
						<div className={'empty-wrap gap-12'}>
							<EmptyCoupon/>
							<p>받은 쿠폰이 없어요.</p>
							<p>쿠폰을 받으면 이곳에서 확인할 수 있어요.</p>
						</div>
					)
				}
			</div>
		</div>
	)
}
