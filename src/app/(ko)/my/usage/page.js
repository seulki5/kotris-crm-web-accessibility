'use client'

import React, {useLayoutEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {useMutation} from "@tanstack/react-query";
import {useSearchParams} from "next/navigation";

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {useMoHeaderContext} from '@modules/context/MoHeaderContext';
import {UsagePageOptions} from '@modules/consants/Options';
import {useLoadingContext} from "@modules/context/LoadingContext";
import {apiCardList} from "@/app/_actions/mypage.action";
import {FindCardProductName} from "@modules/consants/Objects";
import {useApi} from "@modules/services/useApi";
import {useUserContext} from "@modules/context/UserContext";

// components
import Breadcrumb from '@components/layout/Breadcrumb';
import Segment from '@components/common/Segment';
import TabControl from '@components/common/TabControl';
import UsagePeriod from "@/app/(ko)/my/usage/components/UsagePeriod";
import UsageMonthlyUse from "@/app/(ko)/my/usage/components/UsageMonthlyUse";
import UsageMonthlyCharge from "@/app/(ko)/my/usage/components/UsageMonthlyCharge";


/**
 * @description: Rail+ 이용내역 조회 화면 입니다.
 * @screenID:    UI-CRM-F230, UI-CRM-F465-01
 * @screenPath:  홈 > 마이페이지 > Rail+ 이용내역 조회
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function MyUsageHistory() {

	const searchParams = useSearchParams();
	const cardNo = searchParams.get('no');
	const {isMobile} = useScreenSizeContext();
	const {fncChangeMoHeader} = useMoHeaderContext();
	const {jsonApiAction} = useApi();
	const {isLogin} = useUserContext();

	// 사용자 보유 카드 목록
	const [cardList, setCardList] = useState([]);

	// 선택된 카드 정보
	const [isActiveCard, setIsActiveCard] = useState(null);

	// 선택된 탭(기간별/통계)
	const [isActiveTab, setIsActiveTab] = useState(UsagePageOptions[0].id);

	// --Api
	// 목록
	const {mutate: mutQueryCardList} = useMutation({
		mutationKey: ['mutQueryCardList'],
		mutationFn: () => jsonApiAction(apiCardList, {}),
		onSuccess: (res) => {
			if(res?.length) {
				const formMap = res.map((card) => ({
					...card,
					id: card.cardNoEncpt,
					name: FindCardProductName[card.mypgCardSeCd],
					nick: card.cardNcknmNm
				}))
				setCardList(formMap);

				if(cardNo) {
					let find = formMap.filter((el) => el.cardNoEncpt === cardNo)?.[0] || {};
					if(find)  setIsActiveCard(find.id);
					else setIsActiveCard(formMap[0].id);
				} else {
					setIsActiveCard(formMap[0].id);
				}
			}
		}
	})

	useLayoutEffect(() => {
		isLogin && mutQueryCardList();
	}, [isLogin])

	useLayoutEffect(() => {
		if (isMobile) {
			fncChangeMoHeader({
				type: 'back',
				title: 'Rail+ 이용내역'
			})
		}
	}, [isMobile])

	// 탭 변경(카드)
	const fncChangeActiveCard = (id) => {
		const cardInfo = cardList.filter((el) => el.cardNoEncpt === id)[0] || {};
		setIsActiveCard(cardInfo?.cardNoEncpt ?? null);
	}

	// 탭 변경(유형)
	const fncChangeSegment = (id) => {
		setIsActiveTab(id);
	}

	// 콘텐츠 영역 렌더링
	const fncRenderContents = () => {
		const renderContents = {
			[UsagePageOptions[0].id]: <UsagePeriod activeNo={isActiveCard} />,
			[UsagePageOptions[1].id]: <UsageMonthlyUse activeNo={isActiveCard} />,
			[UsagePageOptions[2].id]: <UsageMonthlyCharge activeNo={isActiveCard} />,
		}

		return renderContents[isActiveTab];
	}

	const fncHandlers = {
		changeSegment: fncChangeSegment,
		changeActiveCard: fncChangeActiveCard,
		renderContents: fncRenderContents,
	}

	const fncCallbackEvent = (fncName, variable, payload = {}) => {
		const fnc = fncHandlers[fncName];
		if (typeof fnc === 'function') return fnc(variable, payload);
	}

	if (isMobile) return (
		<MoUsageHistory
			fncCallbackEvent={fncCallbackEvent}
			data={{
				cardList,
				isActiveCard,
				isActiveTab,
			}}
		/>
	);
	else return (
		<DtUsageHistory
			fncCallbackEvent={fncCallbackEvent}
			data={{
				cardList,
				isActiveCard,
				isActiveTab,
			}}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F230
 */
DtUsageHistory.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function DtUsageHistory({data, fncCallbackEvent}) {
	return (
		<main id={'my'} className={'body-wrap-618 usage-wrap'} aria-labelledby={'page-name-dt'}>
			<Breadcrumb addPaths={[]}/>
			<h1 id={'page-name-dt'} className={'page-title mb-48'}>
				Rail+ 이용내역
			</h1>
			<TabControl
				ariaLabel={'내 카드 목록'}
				options={data.cardList}
				isSelected={data.isActiveCard}
				cntKey={'utztnCnt'}
				onChange={(id) => fncCallbackEvent('changeActiveCard', id)}
			/>
			<div className={'mt-10'}>
				<Segment
					size={'lg'}
					options={UsagePageOptions}
					selectedValue={data.isActiveTab}
					fullSize={true}
					onChange={(id) => fncCallbackEvent('changeSegment', id)}
				/>
				{fncCallbackEvent('renderContents')}
			</div>
		</main>
	)
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F465-01
 */
MoUsageHistory.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function MoUsageHistory({data, fncCallbackEvent}) {
	return (
		<main id={'my'} className={'body-wrap-mobile-screen-height usage-wrap'} aria-labelledby={'page-name-mo'}>
			<h1 id={'page-name-mo'} className={'sr-only'}>Rail+ 이용내역 조회</h1>
			<div className={'body-inner-wrap-mobile'}>
				<div className={'flex-col-center flex-1 gap-32'}>
					<TabControl
						options={data.cardList}
						isSelected={data.isActiveCard}
						cntKey={'utztnCnt'}
						onChange={(id) => fncCallbackEvent('changeActiveCard', id)}
					/>
					<Segment
						size={'md'}
						options={UsagePageOptions}
						selectedValue={data.isActiveTab}
						fullSize={true}
						onChange={(id) => fncCallbackEvent('changeSegment', id)}
					/>
					{fncCallbackEvent('renderContents')}
				</div>
			</div>
		</main>
	)
}
