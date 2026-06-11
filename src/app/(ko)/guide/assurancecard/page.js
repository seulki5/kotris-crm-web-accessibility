'use client'

import React, {useLayoutEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {useRouter} from 'next/navigation';

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {useMoHeaderContext} from '@modules/context/MoHeaderContext';
import {RouteConfig} from '@modules/config/RouteConfig';
import {useLoadingContext} from '@modules/context/LoadingContext';
import {useWebContext} from '@modules/context/WebviewContext';
import {useUserContext} from '@modules/context/UserContext';
import {usePopContext} from '@modules/context/PopContext';

// components
import Breadcrumb from '@components/layout/Breadcrumb';
import Segment from '@components/common/Segment';
import GuideSafeTransitTab01 from '@/app/(ko)/guide/assurancecard/components/GuideTab01';
import GuideSafeTransitTab02 from '@/app/(ko)/guide/assurancecard/components/GuideTab02';
import GuideSafeTransitTab03 from '@/app/(ko)/guide/assurancecard/components/GuideTab03';
import Button from '@components/common/Button';

// assets
import {InfoCircle} from '@assets/icons/Svgs';
import {GuideDeduction, GuideRefund} from '@assets/icons/GuideSvgs';

// const
const segmentOptions = [
	{ id: '0', name: '등록 절차', body: <GuideSafeTransitTab01 /> },
	{ id: '1', name: '분실 신청', body: <GuideSafeTransitTab02 /> },
	{ id: '2', name: '환불', body: <GuideSafeTransitTab03 /> },
];


/**
 * @description: 대중교통안심카드 이용안내 화면 입니다.
 * @screenID:    UI-CRM-F215, UI-CRM-F425
 * @screenPath:  홈 > Rail+ 이용안내 > 대중교통안심카드
 * @author       $Author
 * @since        $Date
 * @version      $Revision
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function GuideTransitCard() {

	const router = useRouter();
	const {isMobile} = useScreenSizeContext();
	const {isAccApp, reloadKey, fncFocusLayout} = useWebContext();
	const {fncChangeMoHeader} = useMoHeaderContext();
	const {isLogin} = useUserContext();
	const {fncShowPop, fncClosePop} = usePopContext();
	const {fncRouteStart} = useLoadingContext();

	const [segmentType, setSegmentType] = useState(segmentOptions[0].id);

	useLayoutEffect(() => {
		if (isAccApp) fncFocusLayout();
		if (isMobile) {
			fncChangeMoHeader({
				type: 'back',
				title: '대중교통안심카드 이용안내'
			})
		}
	}, [isMobile, isAccApp, reloadKey])

	// 탭 변경
	const fncChangeSegment = (id) => {
		setSegmentType(id);
	}

	// 이동: 분실신청
	const fncGoLost = () => {
		// 로그인 유저만 가능
		if(isLogin) {
			const targetUri = RouteConfig.LOST.PATH;
			fncRouteStart(targetUri);
			router.push(targetUri);
		} else {
			fncShowPop({
				mainText: '로그인 후 이용해주세요.',
				primaryText: '확인',
				onClickPrimary: () => {
					fncClosePop();

					const targetUri = RouteConfig.LOGIN.PATH;
					fncRouteStart(targetUri);
					router.push(targetUri);
				}
			})
		}
	}

	const fncHandlers = {
		changeSegment: fncChangeSegment,
		goLost: fncGoLost
	}

	const fncCallbackEvent = (fncName, variable, payload = {}) => {
		const fnc = fncHandlers[fncName];
		if (typeof fnc === 'function') return fnc(variable, payload);
	}

	if (isMobile) return (
		<MoGuideTransitCard
			fncCallbackEvent={fncCallbackEvent}
			data={{
				segmentType
			}}
		/>
	);
	else return (
		<DtGuideTransitCard
			fncCallbackEvent={fncCallbackEvent}
			data={{
				segmentType
			}}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F215
 */
DtGuideTransitCard.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};

export function DtGuideTransitCard({data, fncCallbackEvent}) {
	return (
		<main id={'guide'} className={'body-wrap-880'} aria-labelledby={'page-name-dt'}>
			<Breadcrumb addPaths={[]}/>
			<h2 className={'catchphrase'}>
				쉽고 안전한 사용, 철저한 관리!
			</h2>
			<h1 id={'page-name-dt'} className={'page-title'}>
				대중교통안심카드 이용안내
			</h1>
			<section className={'type01'} aria-label={'기능 요약'}>
				<dl>
					<div>
						<dt className={'bg-[#EBF8FF]'}>
							<GuideRefund/>
						</dt>
						<dd>
							<h3 className={'title'}>안심 환불 제도</h3>
							<p>카드 등록하면,  분실/도난 시에도 안심하고 환불 가능</p>
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
			{
				data.segmentType === segmentOptions[1].id && (
					<div className={'page-bottom-button-wrap'}>
						<Button
							theme={'secondary'}
							size={'xl'}
							text={'분실신청 바로가기'}
							customStyle={'w-[240px]'}
							onClick={() => fncCallbackEvent('goLost')}
						/>
					</div>
				)
			}
		</main>
	)
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F425
 */
MoGuideTransitCard.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function MoGuideTransitCard({data, fncCallbackEvent}) {
	return (
		<main id={'guide'} className={'w-full page-bottom-space'} aria-labelledby={'page-name-mo'}>
			<div className={'p-20'}>
				<h2 className={'catchphrase'}>
					쉽고 안전한 사용, 철저한 관리!
				</h2>
				<h1 id={'page-name-mo'} className={'page-title'}>
					대중교통안심카드 이용안내
				</h1>
			</div>
			<section className={'type01'} aria-label={'기능 요약'}>
				<dl>
					<div>
						<dt className={'bg-[#EBF8FF]'}>
							<GuideRefund width={14} height={18} />
						</dt>
						<dd>
							<h3 className={'title'}>안심 환불 제도</h3>
							<p>카드 등록하면,  분실/도난 시에도 안심하고 환불 가능</p>
						</dd>
					</div>
					<div>
						<dt className={'bg-[#FDF8E3]'}>
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
				<h3 id={'comment'} className={'title'}>
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
			{
				data.segmentType === segmentOptions[1].id && (
					<div className={'page-bottom-button-wrap px-20'}>
						<Button
							theme={'secondary'}
							size={'lg'}
							text={'분실신청 바로가기'}
							customStyle={'w-full'}
							onClick={() => fncCallbackEvent('goLost')}
						/>
					</div>
				)
			}
		</main>
	)
}
