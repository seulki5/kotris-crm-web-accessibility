'use client'

import React, {useLayoutEffect} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {fncMaskComma} from '@modules/utils/NumberUitls';
import {CODE, FindCardProductName} from '@modules/consants/Objects';
import {fncMaskCardNo} from '@modules/utils/StringUtils';
import {useWebContext} from "@modules/context/WebviewContext";

// components
import TemplateResult from '@components/composite/TemplateResult';


/**
 * @description: 환불신청 결과 화면 입니다.
 * @screenID:    UI-CRM-F233, UI-CRM-F235, UI-CRM-F469
 * @screenPath:  홈 > 마이페이지 > 환불신청
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
CardRefundStep3.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export default function CardRefundStep3({data, fncCallbackEvent}) {
	
	const {isMobile} = useScreenSizeContext();
	if (isMobile) return (
		<MoCardRefundStep3
			fncCallbackEvent={fncCallbackEvent}
			data={data}
		/>
	);
	else return (
		<DtCardRefundStep3
			fncCallbackEvent={fncCallbackEvent}
			data={data}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F233, UI-CRM-F235
 */
DtCardRefundStep3.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};

export function DtCardRefundStep3({data, fncCallbackEvent}) {
	return (
		<TemplateResult
			screen={'desktop'}
			title={'환불신청이 완료되었습니다!'}
			subTitle={'환불신청 결과조회에서 승인여부를 확인하세요.'}
			animationSrc={require('@assets/animations/refund_complete.json')}
			buttonText={'확인'}
			buttonAriaLabel={'환불신청 첫 페이지로 이동'}
			onDone={() => fncCallbackEvent('initStep')}
		>
			<div className={'result-table-wrap'} aria-label={`환불 결과 정보`}>
				{
					// 실물카드
					[CODE.CARD_SEG_PLA_DEFAULT, CODE.CARD_SEG_PLA_SAFE].includes(data.selectedCard?.mypgCardSeCd) && (
						<dl>
							<div>
								<dt>{data.selectedCard?.mypgCardSeCd ? FindCardProductName[data.selectedCard.mypgCardSeCd] : '-'}</dt>
								<dd>{fncMaskCardNo(data.selectedCard?.cardNoEncpt)}</dd>
							</div>
							<div>
								<dt>환불신청 일자</dt>
								<dd>{moment().format('YYYY-MM-DD')}</dd>
							</div>
						</dl>
					)
				}
				{
					// 앱 카드
					[CODE.CARD_SEG_MO_PRE, CODE.CARD_SEG_MO_POST].includes(data.selectedCard?.mypgCardSeCd) && (
						<dl>
							<div>
								<dt>{data.selectedCard?.mypgCardSeCd ? FindCardProductName[data.selectedCard.mypgCardSeCd] : '-'}</dt>
								<dd>{fncMaskCardNo(data.selectedCard?.cardNoEncpt)}</dd>
							</div>
							<div>
								<dt>환불신청 일자</dt>
								<dd>{moment().format('YYYY-MM-DD')}</dd>
							</div>
							<div className={'sub-table'}>
								<div>
									<dt>환불신청 금액</dt>
									<dd className={'color-info'} aria-label={'strong'}>
										{`${fncMaskComma(data.selectedCard?.blncSum)}원`}
									</dd>
								</div>
								<div>
									<dt>현금환불 가능금액</dt>
									<dd>{`${fncMaskComma(data.selectedCard?.cashRfndPsbltyAmt)}원`}</dd>
								</div>
								<div>
									<dt>마일리지 복구금액</dt>
									<dd>{`${fncMaskComma(data.selectedCard?.mlgRstrAmt)}원`}</dd>
								</div>
								<div>
									<dt>환불 수수료</dt>
									<dd className={'color-secondary'}>
										{`${fncMaskComma(data.selectedCard?.rfndFee)}원`}
									</dd>
								</div>
								<div>
									<dt className={'text-body-3xl'}>총 환불금액</dt>
									<dd className={'color-alert'} aria-label={'strong'}>
										{`${fncMaskComma(Number(data.selectedCard?.blncSum) - Number(data.selectedCard?.rfndFee)) || 0}원`}
									</dd>
								</div>
							</div>
						</dl>
					)
				}
			</div>
		</TemplateResult>
	)
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F469
 */
MoCardRefundStep3.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};

export function MoCardRefundStep3({data, fncCallbackEvent}) {

	const {isAccApp, fncPostRN} = useWebContext();

	useLayoutEffect(() => {
		// 앱카드 환불시 잔액 조회 브릿지 호출
		if(isAccApp && [CODE.CARD_SEG_MO_PRE, CODE.CARD_SEG_MO_POST].includes(data.selectedCard?.mypgCardSeCd)) {
			fncPostRN({
				id: 'WEB_REFRESH_MO_CARD',
				payload: {}
			});
		}
	}, [isAccApp]);

	return (
		<TemplateResult
			screen={'mobile'}
			title={'환불신청이 완료되었습니다!'}
			subTitle={'환불신청 결과조회에서 승인여부를 확인하세요.'}
			animationSrc={require('@assets/animations/refund_complete.json')}
			buttonText={'확인'}
			buttonAriaLabel={'환불신청 첫 페이지로 이동'}
			onDone={() => fncCallbackEvent('initStep')}
		>
			<div className={'result-table-wrap'} aria-label={`환불 결과 정보`}>
				{
					// 실물카드
					[CODE.CARD_SEG_PLA_DEFAULT, CODE.CARD_SEG_PLA_SAFE].includes(data.selectedCard?.mypgCardSeCd) && (
						<dl>
							<div>
								<dt>{data.selectedCard?.mypgCardSeCd ? FindCardProductName[data.selectedCard.mypgCardSeCd] : '-'}</dt>
								<dd>{fncMaskCardNo(data.selectedCard?.cardNoEncpt)}</dd>
							</div>
							<div>
								<dt>환불신청 일자</dt>
								<dd>{moment().format('YYYY-MM-DD')}</dd>
							</div>
						</dl>
					)
				}
				{
					// 앱 카드
					[CODE.CARD_SEG_MO_PRE, CODE.CARD_SEG_MO_POST].includes(data.selectedCard?.mypgCardSeCd) && (
						<dl>
							<div>
								<dt>{data.selectedCard?.mypgCardSeCd ? FindCardProductName[data.selectedCard.mypgCardSeCd] : '-'}</dt>
								<dd>{fncMaskCardNo(data.selectedCard?.cardNoEncpt)}</dd>
							</div>
							<div>
								<dt>환불신청 일자</dt>
								<dd>{moment().format('YYYY-MM-DD')}</dd>
							</div>
							<div className={'sub-table'}>
								<div>
									<dt>환불신청 금액</dt>
									<dd className={'color-info'} aria-label={'strong'}>
										{`${fncMaskComma(data.selectedCard?.blncSum)}원`}
									</dd>
								</div>
								<div>
									<dt>현금환불 가능금액</dt>
									<dd>{`${fncMaskComma(data.selectedCard?.cashRfndPsbltyAmt)}원`}</dd>
								</div>
								<div>
									<dt>마일리지 복구금액</dt>
									<dd>{`${fncMaskComma(data.selectedCard?.mlgRstrAmt)}원`}</dd>
								</div>
								<div>
									<dt>환불 수수료</dt>
									<dd className={'color-secondary'}>
										{`${fncMaskComma(data.selectedCard?.rfndFee)}원`}
									</dd>
								</div>
								<div>
									<dt>총 환불금액</dt>
									<dd className={'color-alert'} aria-label={'strong'}>
										{`${fncMaskComma(Number(data.selectedCard?.blncSum) - Number(data.selectedCard?.rfndFee)) || 0}원`}
									</dd>
								</div>
							</div>
						</dl>
					)
				}
			</div>
		</TemplateResult>
	)
}
