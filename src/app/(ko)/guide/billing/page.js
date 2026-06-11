'use client'

import React, {useLayoutEffect, useState} from 'react';
import PropTypes from 'prop-types';

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {useMoHeaderContext} from '@modules/context/MoHeaderContext';
import {useLoadingContext} from '@modules/context/LoadingContext';
import {useWebContext} from '@modules/context/WebviewContext';

// components
import Breadcrumb from '@components/layout/Breadcrumb';
import Segment from '@components/common/Segment';
import GuideMobileBillingTab01 from '@/app/(ko)/guide/billing/components/GuideTab01';
import GuideMobileBillingTab02 from '@/app/(ko)/guide/billing/components/GuideTab02';

// const
const segmentOptions = [
	{ id: '0', name: '선불형', body: <GuideMobileBillingTab01 /> },
	{ id: '1', name: '후불형', body: <GuideMobileBillingTab02 /> }
];


/**
 * @description: 모바일 Rail+ 선불형 / 후불형 카드 안내 화면 입니다.
 * @screenID:    UI-CRM-F219, UI-CRM-F428
 * @screenPath:  홈 > Rail+ 이용안내 > 모바일 Rail+ 선불형 / 후불형
 * @author       $Author
 * @since        $Date
 * @version      $Revision
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function GuideMobileBilling() {

	const {isMobile} = useScreenSizeContext();
	const {isAccApp, reloadKey, fncFocusLayout} = useWebContext();
	const {fncChangeMoHeader} = useMoHeaderContext();

	const [segmentType, setSegmentType] = useState(segmentOptions[0].id);

	useLayoutEffect(() => {
		if (isAccApp) fncFocusLayout();
		if (isMobile) {
			fncChangeMoHeader({
				type: 'back',
				title: '모바일 Rail+ 선불형 / 후불형 카드안내'
			})
		}
	}, [isMobile, isAccApp, reloadKey])

	// 탭 변경
	const fncChangeSegment = (id) => {
		setSegmentType(id);
	}

	const fncHandlers = {
		changeSegment: fncChangeSegment,
	}

	const fncCallbackEvent = (fncName, variable, payload = {}) => {
		const fnc = fncHandlers[fncName];
		if (typeof fnc === 'function') return fnc(variable, payload);
	}

	if (isMobile) return (
		<MoGuideMobileBilling
			fncCallbackEvent={fncCallbackEvent}
			data={{
				segmentType
			}}
		/>
	);
	else return (
		<DtGuideMobileBilling
			fncCallbackEvent={fncCallbackEvent}
			data={{
				segmentType
			}}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F219
 */
DtGuideMobileBilling.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};

export function DtGuideMobileBilling({data, fncCallbackEvent}) {
	return (
		<main id={'guide'} className={'body-wrap-880'} aria-labelledby={'page-name-dt'}>
			<Breadcrumb addPaths={[]}/>
			<h2 className={'catchphrase'}>
				필요에 따라 선택하는 유연한 결제 방식
			</h2>
			<h1 id={'page-name-dt'} className={'page-title'}>
				모바일 Rail+<br/>선불형 / 후불형 카드안내
			</h1>
			<p className={'page-description'}>
				Rail+ 앱에서는 선불형과 후불형 서비스를 제공하여, 사용자에게 맞는 편리한 서비스를 제공합니다
			</p>
			<Segment
				size={'lg'}
				options={segmentOptions}
				selectedValue={data.segmentType}
				fullSize={true}
				onChange={(id) => fncCallbackEvent('changeSegment', id)}
			/>
			<div className={'tab-inner-wrap'}>
				{segmentOptions.filter((el) => el.id === data.segmentType)?.[0]?.body}
			</div>
		</main>
	)
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F428
 */
MoGuideMobileBilling.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function MoGuideMobileBilling({data, fncCallbackEvent}) {
	return (
		<main id={'guide'} className={'body-wrap-mobile page-bottom-space'} aria-labelledby={'page-name-mo'}>
			<h2 className={'catchphrase'}>
				필요에 따라 선택하는 유연한 결제 방식
			</h2>
			<h1 id={'page-name-mo'} className={'page-title'}>
				모바일 Rail+ 선불형 / 후불형 카드안내
			</h1>
			<p className={'page-description'}>
				Rail+ 앱에서는 선불형과 후불형 서비스를 제공하여,<br/>사용자에게 맞는 편리한 서비스를 제공합니다
			</p>
			<Segment
				size={'md'}
				options={segmentOptions}
				selectedValue={data.segmentType}
				fullSize={true}
				onChange={(id) => fncCallbackEvent('changeSegment', id)}
			/>
			<div className={'tab-inner-wrap grid gap-16'}>
				{segmentOptions.filter((el) => el.id === data.segmentType)?.[0]?.body}
			</div>
		</main>
	)
}
