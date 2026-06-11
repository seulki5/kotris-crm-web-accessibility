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
import GuideBasicTab01 from '@/app/(ko)/guide/basiccard/components/GuideTab01';
import GuideBasicTab02 from '@/app/(ko)/guide/basiccard/components/GuideTab02';

// assets
import {InfoCircle} from '@assets/icons/Svgs';
import {GuideCharge, GuideDeduction, GuideSpot} from '@assets/icons/GuideSvgs';
import {useWebContext} from '@modules/context/WebviewContext';
import AboutBasicCard from "@/app/(ko)/about/basiccard/page";

// const
const segmentOptions = [
	{ id: '0', name: '사용처', body: <GuideBasicTab01 /> },
	{ id: '1', name: '충전처', body: <GuideBasicTab02 /> }
];


/**
 * @description: 일반 Rail+ 카드 이용안내 화면 입니다.
 * @screenID:    UI-CRM-F216, UI-CRM-F426
 * @screenPath:  홈 > Rail+ 이용안내 > 일반 Rail+ 카드
 * @author       $Author
 * @since        $Date
 * @version      $Revision
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function GuideBasicCard() {

	const {isMobile} = useScreenSizeContext();
	const {isAccApp, reloadKey, fncFocusLayout} = useWebContext();
	const {fncChangeMoHeader} = useMoHeaderContext();

	const [segmentType, setSegmentType] = useState(segmentOptions[0].id);


	useLayoutEffect(() => {
		if (isAccApp) fncFocusLayout();
		if (isMobile) {
			fncChangeMoHeader({
				type: 'back',
				title: '일반 Rail+ 카드 이용안내'
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
		<MoGuideBasicCard
			fncCallbackEvent={fncCallbackEvent}
			data={{
				segmentType
			}}
		/>
	);
	else return (
		<DtGuideBasicCard
			fncCallbackEvent={fncCallbackEvent}
			data={{
				segmentType
			}}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F216
 */
DtGuideBasicCard.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};

export function DtGuideBasicCard({data, fncCallbackEvent}) {
	return (
		<main id={'guide'} className={'body-wrap-880'} aria-labelledby={'page-name-dt'}>
			<Breadcrumb addPaths={[]}/>
			<h2 className={'catchphrase'}>
				전국 교통과 유통을 하나의 카드로 손쉽게!
			</h2>
			<h1 id={'page-name-dt'} className={'page-title'}>
				일반 Rail+ 카드 이용안내
			</h1>
			<section className={'type01'} aria-label={'기능 요약'}>
				<dl>
					<div>
						<dt className={'bg-[#EBF8FF]'}>
							<GuideSpot/>
						</dt>
						<dd>
							<h3 className={'title'}>다양한 사용처</h3>
							<p>전국의 지하철, 버스, 택시, 기차, 고속도로 요금소, 편의점 등에서 사용 가능</p>
						</dd>
					</div>
					<div>
						<dt className={'bg-[#FAF0FF]'}>
							<GuideCharge/>
						</dt>
						<dd>
							<h3 className={'title'}>편리한 충전</h3>
							<p>기차역 매표소, 지하철 내 무인기기, 편의점, ATM, 모바일 앱 등에서 충전 가능</p>
						</dd>
					</div>
					<div>
						<dt className={'bg-[#FDF8E3]'}>
							<GuideDeduction/>
						</dt>
						<dd>
							<h3 className={'title'}>소득공제 혜택</h3>
							<p>카드 등록 시 사용 금액에 대한 소득공제 혜택 제공</p>
						</dd>
					</div>
				</dl>
			</section>
			<section className={'type02'} aria-labelledby={'comment'}>
				<h3 id={'comment'} className={'title'}>
					<InfoCircle
						width={20} height={20}
						color={'text-dynamic-icon-info-primary'}
					/>
					카드 등록(소득공제) 및 할인 안내
				</h3>
				<ul>
					<li>카드 사용자 본인(어린이/청소년 포함) 레일플러스 홈페이지 또는 앱 회원가입 후 반드시 카드 등록해야 합니다.</li>
					<li>등록 시점부터 소득공제 적용 등록 이전 사용 금액은 제외됩니다.</li>
					<li>14세 미만(어린이/청소년)의 경우 사용 시작일로부터 10일 이내 카드 등록 시 할인 혜택 적용됩니다.</li>
				</ul>
			</section>
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
 * @screenID:    UI-CRM-F426
 */
MoGuideBasicCard.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function MoGuideBasicCard({data, fncCallbackEvent}) {
	return (
		<main id={'guide'} className={'w-full page-bottom-space'} aria-labelledby={'page-name-mo'}>
			<div className={'p-20'}>
				<h2 className={'catchphrase'}>
					전국 교통과 유통을 하나의 카드로 손쉽게!
				</h2>
				<h1 id={'page-name-mo'} className={'page-title'}>
					일반 Rail+ 카드 이용안내
				</h1>
			</div>
			<section className={'type01'} aria-label={'기능 요약'}>
				<dl>
					<div>
						<dt>
							<GuideSpot width={14} height={18} />
						</dt>
						<dd>
							<h3 className={'title'}>다양한 사용처</h3>
							<p>전국의 지하철, 버스, 택시, 기차, 고속도로 요금소, 편의점 등에서 사용 가능</p>
						</dd>
					</div>
					<div>
						<dt>
							<GuideCharge width={13} height={17} />
						</dt>
						<dd>
							<h3 className={'title'}>편리한 충전</h3>
							<p>기차역 매표소, 지하철 내 무인기기, 편의점, ATM, 모바일 앱 등에서 충전 가능</p>
						</dd>
					</div>
					<div>
						<dt>
							<GuideDeduction width={18} height={18} />
						</dt>
						<dd>
							<h3 className={'title'}>소득공제 혜택</h3>
							<p>카드 등록 시 사용 금액에 대한 소득공제 혜택 제공</p>
						</dd>
					</div>
				</dl>
			</section>
			<section className={'type02'} aria-labelledby={'comment'}>
				<h3 id={'comment'}>
					<InfoCircle
						width={12} height={12}
						color={'text-dynamic-icon-info-primary'}
					/>
					카드 등록(소득공제) 및 할인 안내
				</h3>
				<ul>
					<li>카드 사용자 본인(어린이/청소년 포함) 레일플러스 홈페이지 또는 앱 회원가입 후 반드시 카드 등록해야 합니다.</li>
					<li>등록 시점부터 소득공제 적용 등록 이전 사용 금액은 제외됩니다.</li>
					<li>14세 미만(어린이/청소년)의 경우 사용 시작일로부터 10일 이내 카드 등록 시 할인 혜택 적용됩니다.</li>
				</ul>
			</section>
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
