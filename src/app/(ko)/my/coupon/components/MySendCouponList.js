'use client'

import React, {useLayoutEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {useMutation} from '@tanstack/react-query';
import InfiniteScroll from 'react-infinite-scroll-component';

// modules
import {CouponPageOptions} from '@modules/consants/Options';
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {useLoadingContext} from '@modules/context/LoadingContext';
import {useScrollContext} from '@modules/context/ScrollContext';
import {useApi} from '@modules/services/useApi';
import {apiCouponList} from '@/app/_actions/mypage.action';
import {useUserContext} from "@modules/context/UserContext";

// components
import Ticket from '@/app/(ko)/my/coupon/components/Ticket';
import Pagination from '@components/common/Pagination';

// assets
import {EmptyCoupon} from '@assets/icons/Svgs';


/**
 * @description: 쿠폰함(보낸 쿠폰) 목록 입니다.
 * @screenID:    UI-CRM-F237, UI-CRM-F483
 * @screenPath:  홈 > 마이페이지 > 쿠폰함
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function MySendCouponList() {

	const {isMobile} = useScreenSizeContext();
	const {fncScrollToTop} = useScrollContext();
	const {jsonApiAction} = useApi();
	const {isLogin} = useUserContext();

	// 쿠폰 목록(MO)
	const [infiniteList, setInfiniteList] = useState([]);

	// 파라미터
	const [params, setParams] = useState({
		tsrpSeCd: CouponPageOptions[1].id,   // 송수신구분코드(S보낸쿠폰, R받은쿠폰)
		pageSize: 10,
		page: 1
	})

	// --Api
	// 목록
	const {mutate: mutQuerySendCouponList, data: couponList} = useMutation({
		mutationKey: ['mutQuerySendCouponList'],
		mutationFn: (payload) => jsonApiAction(apiCouponList, payload),
		onSuccess: (res) => {
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
		isLogin && mutQuerySendCouponList(params);
	}, [params.page, isLogin]);

	// 페이지네이션
	const fncChangePage = (page) => {
		setParams({...params, page: page});
	}

	const fncHandlers = {
		changePage: fncChangePage,
	}

	const fncCallbackEvent = (fncName, variable, payload = {}) => {
		const fnc = fncHandlers[fncName];
		if (typeof fnc === 'function') return fnc(variable, payload);
	}

	if (isMobile) return (
		<MoMySendCouponList
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...params,
				couponList,
				infiniteList
			}}
		/>
	);
	else return (
		<DtMySendCouponList
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...params,
				couponList,
			}}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F237
 */
DtMySendCouponList.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function DtMySendCouponList({data, fncCallbackEvent}) {
	return (
		<>
			{
				data.couponList?.list?.length > 0 ? (
					<>
						<div className={'min-h-[calc(40dvh+144px)]'}>
							<div className={'coupon-list-wrap'}>
								{
									data.couponList.list.map((coupon) => (
										<Ticket
											key={coupon.coupSn}
											type={CouponPageOptions[1].id}
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
						<p>보낸 쿠폰이 없어요.</p>
						<p>쿠폰을 보내면 이곳에서 확인할 수 있어요.</p>
					</div>
				)
			}
		</>
	)
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F483
 */
MoMySendCouponList.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function MoMySendCouponList({data, fncCallbackEvent}) {

	const {windowSize} = useScreenSizeContext();

	// 페이징
	const fncFetchMoreItems = () => {
		if(data.page + 1 <= data.couponList?.endPage) {
			fncCallbackEvent('changePage', data.page + 1);
		}
	}

	return (
		<div className={'w-full flex flex-col flex-1'}>
			<div className={'coupon-list-wrap'}>
				{
					data.infiniteList?.length > 0 ? (
						<InfiniteScroll
							className={'scrollbar-none'}
							height={(windowSize.h ?? 800) - 270 - 53}
							dataLength={data.infiniteList.length}
							scrollThreshold={0.9}
							hasMore={true}
							next={fncFetchMoreItems}
						>
							{
								data.infiniteList?.map((coupon) => (
									<Ticket
										key={coupon.coupSn}
										type={CouponPageOptions[1].id}
										data={coupon}
									/>
								))
							}
						</InfiniteScroll>
					) : (
						<div className={'empty-wrap gap-12'}>
							<EmptyCoupon/>
							<p>보낸 쿠폰이 없어요.</p>
							<p>쿠폰을 보내면 이곳에서 확인할 수 있어요.</p>
						</div>
					)
				}
			</div>
		</div>
	)
}
