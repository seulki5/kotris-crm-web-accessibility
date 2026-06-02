'use client'

import React, {useLayoutEffect, useState} from 'react';
import PropTypes from 'prop-types';

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {useMoHeaderContext} from '@modules/context/MoHeaderContext';
import {useLoadingContext} from '@modules/context/LoadingContext';

// components
import Breadcrumb from '@components/layout/Breadcrumb';
import Segment from '@components/common/Segment';
import GuideUsableTab01 from '@/app/(ko)/guide/usable/components/GuideTab01';
import GuideUsableTab02 from '@/app/(ko)/guide/usable/components/GuideTab02';
import {useWebContext} from '@modules/context/WebviewContext';

// const
const segmentOptions = [
	{ id: '0', name: '사용처', body: <GuideUsableTab01 /> },
	{ id: '1', name: '충전처', body: <GuideUsableTab02 /> },
];


/**
 * @description: 사용처 안내 화면 입니다.
 * @screenID:    UI-CRM-F220, UI-CRM-F429
 * @screenPath:  홈 > Rail+ 이용안내 > 사용처 안내
 * @author       $Author
 * @since        $Date
 * @version      $Revision
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function GuideUsable() {

	const {isMobile} = useScreenSizeContext();
	const {isAccApp, reloadKey, fncFocusLayout} = useWebContext();
	const {fncChangeMoHeader} = useMoHeaderContext();

	const [segmentType, setSegmentType] = useState(segmentOptions[0].id);

	useLayoutEffect(() => {
		if (isAccApp) fncFocusLayout();
		if (isMobile) {
			fncChangeMoHeader({
				type: 'back',
				title: '사용처 안내'
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
		<MoGuideUsable
			fncCallbackEvent={fncCallbackEvent}
			data={{
				segmentType
			}}
		/>
	);
	else return (
		<DtGuideUsable
			fncCallbackEvent={fncCallbackEvent}
			data={{
				segmentType
			}}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F220
 */
DtGuideUsable.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};

export function DtGuideUsable({data, fncCallbackEvent}) {
	return (
		<main id={'guide'} className={'body-wrap-880'} aria-labelledby={'page-name-dt'}>
			<Breadcrumb addPaths={[]}/>
			<h1 id={'page-name-dt'} className={'page-title mb-48'}>
				사용처 안내
			</h1>
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
 * @screenID:    UI-CRM-F429
 */
MoGuideUsable.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function MoGuideUsable({data, fncCallbackEvent}) {
	return (
		<main id={'guide'} className={'w-full page-bottom-space'} aria-labelledby={'page-name-mo'}>
			<div className={'p-20'}>
				<h1 id={'page-name-mo'} className={'page-title'}>
					사용처 안내
				</h1>
			</div>
			<section className={'px-20 pt-36 pb-48'}>
				<Segment
					size={'md'}
					options={segmentOptions}
					selectedValue={data.segmentType}
					fullSize={true}
					onChange={(id) => fncCallbackEvent('changeSegment', id)}
				/>
				<div className={'tab-inner-wrap'}>
					{segmentOptions.filter((el) => el.id === data.segmentType)?.[0]?.body}
				</div>
			</section>
		</main>
	)
}
