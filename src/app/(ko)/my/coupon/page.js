'use client'

import React, {useLayoutEffect, useState} from 'react';
import PropTypes from 'prop-types';

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {useMoHeaderContext} from '@modules/context/MoHeaderContext';
import {CouponPageOptions} from '@modules/consants/Options';
import {useLoadingContext} from '@modules/context/LoadingContext';
import {useWebContext} from '@modules/context/WebviewContext';
import {useUserContext} from "@modules/context/UserContext";

// components
import Breadcrumb from '@components/layout/Breadcrumb';
import Segment from '@components/common/Segment';
import MyReceivedCouponList from '@/app/(ko)/my/coupon/components/MyReceivedCouponList';
import MySendCouponList from '@/app/(ko)/my/coupon/components/MySendCouponList';


/**
 * @description: 쿠폰함 화면 입니다.
 * @screenID:    UI-CRM-F237, UI-CRM-F482 ~ UI-CRM-F483
 * @screenPath:  홈 > 마이페이지 > 쿠폰함
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function MyCoupon() {

	const {isMobile} = useScreenSizeContext();
	const {isAccApp, reloadKey, fncFocusLayout} = useWebContext();
	const {fncChangeMoHeader} = useMoHeaderContext();
	const {isLogin} = useUserContext();

	// 쿠폰 구분
	const [couponType, setCouponType] = useState(CouponPageOptions[0].id);

	useLayoutEffect(() => {
		if (isAccApp) fncFocusLayout();
		if (isMobile) {
			fncChangeMoHeader({
				type: 'back',
				title: '쿠폰함'
			})
		}
	}, [isMobile, isAccApp, reloadKey])

	// 쿠폰 구분
	const fncChangeSegment = (id) => {
		setCouponType(id);
	}

	// 쿠폰 목록 레이아웃
	const fncRenderList = () => {
		switch (couponType) {
			case CouponPageOptions[0].id:
				return (
					<MyReceivedCouponList />
				)
			case CouponPageOptions[1].id:
				return (
					<MySendCouponList />
				)
			default: return;
		}
	}

	const fncHandlers = {
		changeSegment: fncChangeSegment,
		renderList: fncRenderList,
	}

	const fncCallbackEvent = (fncName, variable, payload = {}) => {
		const fnc = fncHandlers[fncName];
		if (typeof fnc === 'function') return fnc(variable, payload);
	}

	if (isMobile) return (
		<MoMyCoupon
			fncCallbackEvent={fncCallbackEvent}
			data={{
				couponType
			}}
		/>
	);
	else return (
		<DtMyCoupon
			fncCallbackEvent={fncCallbackEvent}
			data={{
				couponType
			}}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F237
 */
DtMyCoupon.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function DtMyCoupon({data, fncCallbackEvent}) {
	return (
		<main id={'my'} className={'body-wrap-618 coupon-wrap'} aria-labelledby={'page-name-dt'}>
			<Breadcrumb addPaths={[]}/>
			<h1 id={'page-name-dt'} className={'page-title mb-48'}>
				쿠폰함
			</h1>
			<Segment
				size={'lg'}
				options={CouponPageOptions}
				selectedValue={data.couponType}
				fullSize={true}
				onChange={(id) => fncCallbackEvent('changeSegment', id)}
			/>
			<div className={'mt-48'}>
				{fncCallbackEvent('renderList')}
			</div>
		</main>
	)
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F482 ~ UI-CRM-F483
 */
MoMyCoupon.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function MoMyCoupon({data, fncCallbackEvent}) {
	return (
		<main id={'my'} className={'body-wrap-mobile-screen-height coupon-wrap'} aria-labelledby={'page-name-mo'}>
			<h1 id={'page-name-mo'} className={'sr-only'}>쿠폰함</h1>
			<div className={'flex-1 flex-col-center gap-32'}>
				<Segment
					size={'md'}
					options={CouponPageOptions}
					selectedValue={data.couponType}
					fullSize={true}
					onChange={(id) => fncCallbackEvent('changeSegment', id)}
				/>
				<div className={'w-full flex flex-1'}>
					{fncCallbackEvent('renderList')}
				</div>
			</div>
		</main>
	)
}
