import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';

// modules
import {fncMaskComma} from '@modules/utils/NumberUitls';
import {CouponPageOptions} from '@modules/consants/Options';
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {usePopContext} from '@modules/context/PopContext';
import {toMomentFrom14} from "@modules/utils/DateUtils";

// assets
import {
	CouponExpired,
	CouponGift,
	CouponGifted,
	CouponSale,
	CouponUsed,
} from '@assets/icons/Svgs';


/**
 * @description: 쿠폰 컴포넌트 입니다.
 * @screenID:    -
 * @screenPath:  -
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
Ticket.propTypes = {
	type: PropTypes.string,
	data: PropTypes.object,
};
export default function Ticket({type = CouponPageOptions[0].id, data}) {

	const {isMobile} = useScreenSizeContext();
	const {fncShowPop, fncClosePop} = usePopContext();

	let disabled = false;
	let used = data.giftUseSeCd === '01';
	if(type === CouponPageOptions[0].id) {
		if(used || moment().diff(moment(data.aplcnEndYmd), 'days') >= 0) disabled = true;
	}

	const renderDate = () => {
		if(type === CouponPageOptions[1].id) {
			// 보낸 쿠폰
			return (
				<dl className={'mt-2 text-body-sm'}>
					<div className={'flex-row-center gap-4'}>
						<dt className={'text-dynamic-text-neutral-primary font-normal'}>
							받은사람
						</dt>
						<dd className={'text-dynamic-text-neutral-secondary font-semibold'}>
							{data.custNm}
						</dd>
					</div>
					<div className={'flex-row-center gap-4'}>
						<dt className={'text-dynamic-text-neutral-primary font-normal'}>
							보낸날짜
						</dt>
						<dd className={'text-dynamic-text-neutral-secondary font-semibold'}>
							{moment(toMomentFrom14(data.frstRegDt)).format('YYYY-MM-DD')}
						</dd>
					</div>
				</dl>
			)
		} else {
			// 받은 쿠폰
			return (
				<dl className={'mt-2 text-body-sm'}>
					<div className={'flex-row-center gap-4'}>
						{
							data.evntCoupCd === '1111111111' ? (
								<>
									<dt className={'text-dynamic-text-neutral-primary font-normal'}>
										보낸사람
									</dt>
									<dd className={'text-dynamic-text-neutral-secondary font-semibold'}>
										{data.custNm}
									</dd>
								</>
							) : (
								<p className={'text-dynamic-text-neutral-secondary font-semibold text-ellipsis break-all line-clamp-1'}>
									{[1, '1'].includes(data?.mlgSeCd) ? `[마일리지] ${data?.coupTtl}` : data?.coupTtl}
								</p>
							)
						}
					</div>
					<div className={'flex-row-center gap-4'}>
						<dt className={'text-dynamic-text-neutral-primary font-normal'}>
							받은일자
						</dt>
						<dd className={'text-dynamic-text-neutral-secondary font-semibold'}>
							{moment(toMomentFrom14(data.frstRegDt)).format('YYYY-MM-DD')}
						</dd>
					</div>
					<div className={'flex-row-center gap-4'}>
						<dt className={'text-dynamic-text-neutral-primary font-normal'}>
							유효기간
						</dt>
						<dd className={'text-dynamic-text-neutral-secondary font-semibold'}>
							{moment(toMomentFrom14(data.aplcnEndYmd)).format('YYYY-MM-DD')}
						</dd>
					</div>
				</dl>
			)
		}
	}

	const renderState = () => {
		if (type === CouponPageOptions[1].id) {
			if (isMobile) return <CouponGifted width={68} height={68}/>;
			else return <CouponGifted width={64} height={64}/>;
		} else if (used) {
			if (isMobile) return <CouponUsed width={68} height={68}/>;
			else return <CouponUsed width={64} height={64}/>;
		} else if (moment().diff(moment(data.aplcnEndYmd), 'days') >= 0) {
			if(isMobile) return <CouponExpired width={68} height={68} />;
			else return <CouponExpired width={64} height={64} />;
		} else {
			return  (
				<button
					type={'button'}
					aria-label={`${data.coupAmt}원 쿠폰 사용하기`}
					onClick={fncClickTicket}
					onKeyDown={(e) => {
						if(e.key === 'Enter' || e.key === '') fncClickTicket();
					}}
					className={'h-full w-full'}
				>
					<p className={'text-body-lg text-dynamic-text-brand-primary font-semibold'}>
						사용가능
					</p>
					<p className={'text-button-xs text-dynamic-text-neutral-secondary font-semibold underline mt-4'}>
						쿠폰 사용하기
					</p>
				</button>
			)
		}
	}

	const fncClickTicket = () => {
		if(type === CouponPageOptions[1].id) return;
		fncShowPop({
			mainText: '쿠폰 충전은 모바일 앱에서 가능합니다.',
			primaryText: '확인',
			onClickPrimary: () => fncClosePop(),
		});
	}

	return (
		<div className={clsx(
			'flex-row-center justify-between overflow-hidden col-span-1',
			'min-h-[120px] h-auto max-h-[200px] rounded-12',
			'border border-solid',
			disabled ? 'border-transparent' : 'border-dynamic-border-neutral-primary',
			disabled ? 'bg-dynamic-bg-neutral-secondary' : 'bg-dynamic-bg-neutral-base',
		)}>
			<div className={'flex-row-center pl-16 pr-8 gap-12 mo:pl-20 mo:pr-12'}>
				<div className={clsx(
					'w-[44px] h-[44px] flex items-center justify-center rounded-full mo:w-[48px] mo:h-[48px]',
					disabled ? 'bg-dynamic-bg-neutral-disabled' : 'bg-dynamic-bg-neutral-secondary'
				)}>
					{
						type === CouponPageOptions[1].id ? (
							<CouponGift color={disabled ? '#A6A9AB' : '#FFC23D'} />
						) : (
							<CouponSale color={disabled ? '#A6A9AB' : '#FFC23D'} />
						)
					}
				</div>
				<div>
					<p className={'text-body-3xl mo:text-heading-md text-dynamic-text-neutral-primary font-semibold'}>
						{fncMaskComma(data.coupAmt)}
						<span className={'text-body-xl font-medium'}>원</span>
					</p>
					{renderDate()}
				</div>
			</div>
			<div className={'px-10 h-[75%] min-w-[85px] flex items-center justify-center border-l border-dashed border-l-dynamic-border-neutral-primary'}>
				{renderState()}
			</div>
		</div>
	)
}
