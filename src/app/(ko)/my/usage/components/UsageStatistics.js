'use client'

import React, {useLayoutEffect, useMemo, useState} from 'react';
import PropTypes from 'prop-types';
import moment from "moment";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(ArcElement, Tooltip, Legend);
import {useMutation} from "@tanstack/react-query";

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {fncMaskComma} from '@modules/utils/NumberUitls';
import {useApi} from "@modules/services/useApi";
import {apiUsageStatistics} from "@/app/_actions/mypage.action";
import {useUserContext} from "@modules/context/UserContext";

// assets
import {ChevronLeft, ChevronRight, EmptyList} from '@assets/icons/Svgs';

// const
const chartColorByIndex = {
	0: '#00C779',
	1: '#FF7E33',
	2: '#33CFFF',
	3: '#FFC23D',
	4: '#FF5C5C',
	5: '#A289FA'
}


/**
 * @description: Rail+ 이용내역 통계 화면 입니다.
 * @screenID:    UI-CRM-F230, UI-CRM-F465-01
 * @screenPath:  홈 > 마이페이지 > Rail+ 이용내역 통계
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
UsageStatistics.propTypes = {
	activeCard: PropTypes.string,
};
export default function UsageStatistics({activeNo}) {

	const {isMobile} = useScreenSizeContext();
	const {jsonApiAction} = useApi();
	const {fncEncode} = useUserContext();

	// 파라미터
	const [params, setParams] = useState({
		dlngYm: moment().format('YYYYMM'),                                    // 거래연월
		bfrDlngYm: moment().subtract(1, 'M').format('YYYYMM'),    // 이전 거래연월
	})

	// 통계 데이터
	const [statsData, setStatsData] = useState([]);

	// 총 거래금액
	const [totalAmt, setTotalAmt] = useState(0);

	// 전월차이금액
	const [diffAmt, setDiffAmt] = useState(0);

	// --Api
	const {mutate: mutQueryUsageStatistics} = useMutation({
		mutationKey: ['mutQueryUsageStatistics'],
		mutationFn: (payload) => jsonApiAction(apiUsageStatistics, payload),
		onSuccess: (res) => {
			const formatted = [
				{ label: '버스',   value: res.busDlngAmt },
				{ label: '지하철', value: res.sbwyDlngAmt },
				{ label: '택시',   value: res.taxiDlngAmt },
				{ label: '기차',   value: res.trnDlngAmt },
				{ label: '유통',   value: res.rtlDlngAmt },
				{ label: '기타',   value: res.etcDlngAmt },
			]
			setStatsData(formatted);
			setTotalAmt(res.totalDlngAmt);
			setDiffAmt(res.bfmmDiffAmt);
		}
	})

	// 카드 번호 변경
	useLayoutEffect(() => {
		const fncInitStatisics = async() => {
			const encoded = await fncEncode(activeNo);
			if(!encoded) return;
			const initParams = {
				dlngYm: moment().format('YYYYMM'),
				bfrDlngYm: moment().subtract(1, 'M').format('YYYYMM'),
			}
			setParams(initParams)
			mutQueryUsageStatistics({
				...initParams,
				cardNoEncpt: encoded
			});
		}
		if(activeNo) fncInitStatisics();
	}, [activeNo]);

	useLayoutEffect(() => {
		const fncGetStatistics = async() => {
			const encoded = await fncEncode(activeNo);
			if(!encoded) return;
			mutQueryUsageStatistics({
				...params,
				cardNoEncpt: encoded,
			});
		}

		if(activeNo) fncGetStatistics();
	}, [params.dlngYm]);

	// 데이터 수 체크
	const isAllZero = useMemo(() =>
		statsData.length && statsData.every(v => Number(v.value) === 0)
	, [statsData])

	// 차트 데이터
	const chartData = useMemo(() => {
		return ({
			labels: statsData.map(i => i.label),
			datasets: [{
				data: isAllZero ? [1] : statsData.map(i => i.value),
				backgroundColor: isAllZero ? "#D4D4D8" : statsData.map((_, i) => chartColorByIndex[i]),
				borderWidth: 0,
				hoverOffset: 0,
			}],
		})
	}, [statsData, isAllZero])

	// 차트 옵션
	const chartOptions = useMemo(() => {
		return ({
			responsive: true,
			maintainAspectRatio: false,
			cutout: '40%',
			plugins: {
				legend: { display: false },
				tooltip: {
					backgroundColor: 'rgba(17,24,39,0.9)',
					borderWidth: 0,
					padding: 10,
					callbacks: {
						label: (ctx) => `${ctx.label}: ${fncMaskComma(ctx.parsed)}`,
					},
					enabled: !isAllZero
				},
			},
		})
	}, [isAllZero]);

	// 이전달
	const fncChangePreMonth = () => {
		setParams({
			dlngYm: moment(params.dlngYm).subtract(1, 'M').format('YYYYMM'),
			bfrDlngYm: moment(params.bfrDlngYm).subtract(1, 'M').format('YYYYMM')
		});
	}

	// 다음달
	const fncChangeNextMonth = () => {
		const thisMonth = moment().format('YYYYMM');
		if(params.dlngYm === thisMonth) return;

		setParams({
			dlngYm: moment(params.dlngYm).add(1, 'M').format('YYYYMM'),
			bfrDlngYm: moment(params.bfrDlngYm).add(1, 'M').format('YYYYMM')
		});
	}

	const fncHandlers = {
		changePreMonth: fncChangePreMonth,
		changeNextMonth: fncChangeNextMonth,
	}

	const fncCallbackEvent = (fncName, variable, payload = {}) => {
		const fnc = fncHandlers[fncName];
		if (typeof fnc === 'function') return fnc(variable, payload);
	}

	if (isMobile) return (
		<MoUsageStatistics
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...params,
				chartData,
				chartOptions,
				isAllZero,
				statsData,
				totalAmt,
				diffAmt
			}}
		/>
	);
	else return (
		<DtUsageStatistics
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...params,
				chartData,
				chartOptions,
				isAllZero,
				statsData,
				totalAmt,
				diffAmt
			}}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F230
 */
DtUsageStatistics.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function DtUsageStatistics({data, fncCallbackEvent}) {
	const thisMonth = moment().format('YYYYMM');
	const blockNextMonth = thisMonth === data.dlngYm;

	return (
		<>
			<div className={'month-wrap'}>
				<button
					type={'button'}
					aria-label={'이전 월'}
					onClick={() => fncCallbackEvent('changePreMonth')}
					onKeyDown={(e) => {
						if(e.key === 'Enter') fncCallbackEvent('changePreMonth')
					}}
				>
					<ChevronLeft
						width={20} height={20}
						color={'text-dynamic-icon-neutral-secondary'}
					/>
				</button>
				<p>{moment(data.dlngYm).format('YYYY년 M월')}</p>
				<button
					type={'button'}
					aria-label={'다음 월'}
					onClick={() => fncCallbackEvent('changeNextMonth')}
					onKeyDown={(e) => {
						if(e.key === 'Enter') fncCallbackEvent('changeNextMonth')
					}}
					disabled={blockNextMonth}
					className={blockNextMonth ? 'bg-dynamic-bg-neutral-disabled' : ''}
				>
					<ChevronRight
						width={20} height={20}
						color={blockNextMonth ? 'text-dynamic-icon-neutral-disabled' : 'text-dynamic-icon-neutral-secondary'}
					/>
				</button>
			</div>
			{
				data.statsData?.length ? (
					<>
						<div className={'brief-wrap'}>
							<p>{`${fncMaskComma(data.totalAmt)}원`}</p>
							{
								data.diffAmt < 0 ? (
									<p>지난달 보다 <span className={'decrease'}>
										{fncMaskComma(data.diffAmt)}원 덜</span> 썼어요
									</p>
								) : (
									<p>지난달 보다 <span className={'increase'}>
										{fncMaskComma(data.diffAmt)}원 더</span> 썼어요
									</p>
								)
							}
						</div>
						<div className={'statistics-wrap'}>
							<div className={'chart-wrap'}>
								<Doughnut
									data={data.chartData}
									options={data.chartOptions}
									key={data.isAllZero ? 'empty' : 'normal'}
								/>
							</div>
							<ul className="legend-wrap">
								{
									data.statsData?.map((item, index) => (
										<li key={item.label}>
											<p className={'color'} style={{ backgroundColor: chartColorByIndex[index] }} />
											<p className={'label'}>
												{item.label}
											</p>
											<p className={'value'}>
												{fncMaskComma(item.value) || 0}원
											</p>
										</li>
									))
								}
							</ul>
						</div>
					</>
				) : (
					<div className={'empty-wrap'}>
						<EmptyList />
						<p>이용내역이 없습니다.</p>
					</div>
				)
			}
		</>
	)
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F465-01
 */
MoUsageStatistics.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function MoUsageStatistics({data, fncCallbackEvent}) {
	const thisMonth = moment().format('YYYYMM');
	const blockNextMonth = thisMonth === data.dlngYm;

	return (
		<div className={'w-full'}>
			<div className={'month-wrap'}>
				<button
					type={'button'}
					aria-label={'이전 월'}
					onClick={() => fncCallbackEvent('changePreMonth')}
					onKeyDown={(e) => {
						if(e.key === 'Enter') fncCallbackEvent('changePreMonth')
					}}
				>
					<ChevronLeft
						width={20} height={20}
						color={'text-dynamic-icon-neutral-secondary'}
					/>
				</button>
				<p>{moment(data.dlngYm).format('YYYY년 M월')}</p>
				<button
					type={'button'}
					aria-label={'다음 월'}
					onClick={() => fncCallbackEvent('changeNextMonth')}
					onKeyDown={(e) => {
						if(e.key === 'Enter') fncCallbackEvent('changeNextMonth')
					}}
					disabled={blockNextMonth}
					className={blockNextMonth ? 'bg-dynamic-bg-neutral-disabled' : ''}
				>
					<ChevronRight
						width={20} height={20}
						color={blockNextMonth ? 'text-dynamic-icon-neutral-disabled' : 'text-dynamic-icon-neutral-secondary'}
					/>
				</button>
			</div>
			{
				data.statsData?.length ? (
					<>
						<div className={'brief-wrap'}>
							<p>{`${fncMaskComma(data.totalAmt)}원`}</p>
							{
								data.diffAmt < 0 ? (
									<p>지난달 보다 <span className={'decrease'}>
										{fncMaskComma(data.diffAmt)}원 덜</span> 썼어요
									</p>
								) : (
									<p>지난달 보다 <span className={'increase'}>
										{fncMaskComma(data.diffAmt)}원 더</span> 썼어요
									</p>
								)
							}
						</div>
						<div className={'statistics-wrap'}>
							<div className={'chart-wrap'}>
								<Doughnut
									data={data.chartData}
									options={data.chartOptions}
									key={data.isAllZero ? 'empty' : 'normal'}
								/>
							</div>
							<ul className="legend-wrap">
								{
									data.statsData?.map((item, index) => (
										<li key={item.label}>
											<p className={'color'} style={{ backgroundColor: chartColorByIndex[index] }} />
											<p className={'label'}>
												{item.label}
											</p>
											<p className={'value'}>
												{fncMaskComma(item.value) || 0}원
											</p>
										</li>
									))
								}
							</ul>
						</div>
					</>
				) : (
					<div className={'empty-wrap'}>
						<EmptyList />
						<p>이용내역이 없습니다.</p>
					</div>
				)
			}
		</div>
	)
}
