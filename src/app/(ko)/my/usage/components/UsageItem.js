'use client'

import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import clsx from 'clsx';

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {fncMaskComma} from '@modules/utils/NumberUitls';
import {toMomentFrom14} from '@modules/utils/DateUtils';

// components
import {
	GdtBus,
	GdtDistribution,
	GdtEtc,
	GdtExchange,
	GdtMetro,
	GdtRail,
	GdtRecharge,
	GdtTaxi
} from '@assets/icons/HistorySvgs';


/**
 * @description: 이용내역 아이템 컴포넌트 입니다.
 * @screenID:    -
 * @screenPath:  홈 > 마이페이지 > Rail+ 이용내역 조회
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
UsageItem.propTypes = {
	item: PropTypes.object,
	index: PropTypes.number
};
export default function UsageItem({item, index}) {

	const {isMobile} = useScreenSizeContext();

	// 거래구분
	const fncCalcTrade = (sub) => {
		return ['B', 'E', 'L', 'U'].includes(sub.rideSeCd);
	}

	// 아이콘
	const fncFormIcon = (sub) => {
		if(!item || !sub) return null;

		// 충전
		if(sub.totTypeCd.charAt(0) == '2') {
			return <GdtRecharge />;
		}

		// 환불
		if(sub.totTypeCd.charAt(0) == '4') {
			return <GdtExchange/>;
		}

		switch (sub.totTypeCd) {
			case '14':
			case '1A':
				// 유통
				return <GdtDistribution />;
			case '16':
			case '19':
				// 버스
				return <GdtBus />;
			case '11':
			case '1D':
				// 지하철
				return <GdtMetro />;
			case '15':
				// 기차
				return <GdtRail />;
			case '12':
				// 택시
				return <GdtTaxi />;
			default:
				// 기타
				return <GdtEtc />;
		}
	}

	// 라벨
	const fncFormLabel = (sub) => {
		if(!item || !sub) return '-';

		// 충전
		if(sub.totTypeCd.charAt(0) == '2') {
			return '충전';
		}

		// 환불
		if(sub.totTypeCd.charAt(0) == '4') {
			return '환불';
		}

		switch (sub.totTypeCd) {
			case '14':
			case '1A':
				return '유통';
			case '16':
			case '19':
			case '11':
			case '1D':
			case '15':
			case '12':
				// 대중교통
				// rideSeCd
				// A	대중교통하차거래
				// B	미확인충전
				// C	카드충전반환
				// D	카드충전취소
				// E	카드충전거래
				// I	카드잔액현장환불
				// J	카드잔액본사환불
				// K	카드잔액ATM환불
				// L	카드충전ATM
				// P	카드지불거래
				// R	대중교통승차거래
				// S	온라인지불거래
				// U	KCP충전거래
				// V	온라인충전반환
				// X	유료도로지불거래
				if(['A', 'R'].includes(sub.rideSeCd)) {
					return `${sub.rideSeCdNm.replace('대중교통', '').replace('거래', '')} - ${sub.dlngBrnchNm}`;
				} else {
					return `${sub.rideSeCdNm} - ${sub.dlngBrnchNm}`;
				}
			default:
				return '기타';
		}
	}


	const fncHandlers = {
		formLabel: fncFormLabel,
		formIcon: fncFormIcon,
		calcTrade: fncCalcTrade
	}

	const fncCallbackEvent = (fncName, variable, payload = {}) => {
		const fnc = fncHandlers[fncName];
		if (typeof fnc === 'function') return fnc(variable, payload);
	}

	if (isMobile) return (
		<MoUsageItem
			fncCallbackEvent={fncCallbackEvent}
			item={item}
			index={index}
		/>
	);
	else return (
		<DtUsageItem
			fncCallbackEvent={fncCallbackEvent}
			item={item}
			index={index}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F230
 */
DtUsageItem.propTypes = {
	item: PropTypes.object,
	index: PropTypes.number,
	fncCallbackEvent: PropTypes.func
};
export function DtUsageItem({item, index, fncCallbackEvent}) {
	return (
		<div>
			{index > 0 && <div className={'divider'}/>}
			<div>
				<p className={'date'}>
					{moment(toMomentFrom14(item?.key)).format('M월 D일')}
				</p>
				{
					item?.list?.map((sub) => (
						<div
							className={clsx('flex-row-center justify-between py-8')}
							key={`${sub.dlngYmd}${sub.dlngTm}`}
						>
							<div className={'flex-row-start gap-16'}>
								<div className={'symbol-wrap'}>
									{fncCallbackEvent('formIcon', sub) || ""}
								</div>
								<div>
									<p className={'label'}>
										{fncCallbackEvent('formLabel', sub) || "-"}
									</p>
									<p className={'time'}>
										{moment(sub.dlngTm, 'HHmmss').format('HH:mm:ss')}
									</p>
								</div>
							</div>
							<div>
								<p className={clsx(
									'amount',
									fncCallbackEvent('calcTrade', sub) ? 'text-dynamic-text-other-red-subtle' : 'text-dynamic-text-other-blue-subtle'
								)}>
									{fncCallbackEvent('calcTrade', sub) ? '+' : Number(sub.dlngAmt) === 0 ? '' : '-'}
									{`${fncMaskComma(sub.dlngAmt)}원`}
								</p>
								<p className={'balance'}>
									{`잔액 ${fncMaskComma(sub.dlngAftrCardBlnc)}원`}
								</p>
							</div>
						</div>
					))
				}
			</div>
		</div>
	)
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F465-01
 */
MoUsageItem.propTypes = {
	item: PropTypes.object,
	index: PropTypes.number,
	fncCallbackEvent: PropTypes.func
};
export function MoUsageItem({item, index, fncCallbackEvent}) {
	return (
		<div>
			{index > 0 && <div className={'divider'}/>}
			<div>
				<p className={'date'}>
					{moment(toMomentFrom14(item?.key)).format('M월 D일')}
				</p>
				{
					item.list.map((sub, index) => (
						<div
							className={clsx('flex-row-center justify-between', index > 0 ? 'py-16' : 'pt-16')}
							key={`${sub.dlngYmd}${sub.dlngTm}`}
						>
							<div className={'flex-row-start gap-16'}>
								<div className={'symbol-wrap'}>
									{fncCallbackEvent('formIcon', sub) || ""}
								</div>
								<div>
									<p className={'label'}>
										{fncCallbackEvent('formLabel', sub) || "-"}
									</p>
									<p className={'time'}>
										{moment(sub.dlngTm, 'HHmmss').format('HH:mm:ss')}
									</p>
								</div>
							</div>
							<div>
								<p className={clsx(
									'amount',
									fncCallbackEvent('calcTrade', sub) ? 'text-dynamic-text-other-red-subtle' : 'text-dynamic-text-other-blue-subtle'
								)}>
									{fncCallbackEvent('calcTrade', sub) ? '+' : Number(sub.dlngAmt) === 0 ? '' : '-'}
									{`${fncMaskComma(sub.dlngAmt)}원`}
								</p>
								<p className={'balance'}>
									{`잔액 ${fncMaskComma(sub.dlngAftrCardBlnc)}원`}
								</p>
							</div>
						</div>
					))
				}
			</div>
		</div>
	)
}
