'use client'

import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {fncMaskCardNo} from '@modules/utils/StringUtils';

// components
import TemplateResult from '@components/composite/TemplateResult';


/**
 * @description: 분실신청 결과 화면 입니다.
 * @screenID:    UI-CRM-F238, UI-CRM-F472
 * @screenPath:  홈 > 마이페이지 > 분실신청
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
CardLostStep2.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export default function CardLostStep2({data, fncCallbackEvent}) {

	const {isMobile} = useScreenSizeContext();
	if (isMobile) return (
		<MoCardLostStep2
			fncCallbackEvent={fncCallbackEvent}
			data={data}
		/>
	);
	else return (
		<DtCardLostStep2
			fncCallbackEvent={fncCallbackEvent}
			data={data}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F238
 */
DtCardLostStep2.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function DtCardLostStep2({data, fncCallbackEvent}) {
	return (
		<TemplateResult
			screen={'desktop'}
			title={'분실 및 환불신청 완료되었습니다!'}
			subTitle={'환불/분실신청 내역에서 승인여부를 확인하세요.'}
			animationSrc={require('@assets/animations/refund_complete.json')}
			buttonText={'확인'}
			buttonAriaLabel={'분실신청 첫 페이지로 이동'}
			onDone={() => fncCallbackEvent('initStep')}
		>
			<div className={'result-table-wrap'} aria-label={`분실신청 결과 정보`}>
				<dl>
					<div>
						<dt>대중교통안심카드</dt>
						<dd>{fncMaskCardNo(data.cardNoEncpt)}</dd>
					</div>
					<div>
						<dt>분실 및 환불신청 일자</dt>
						<dd>{moment().format('YYYY-MM-DD')}</dd>
					</div>
				</dl>
			</div>
		</TemplateResult>
	)
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F472
 */
MoCardLostStep2.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function MoCardLostStep2({data, fncCallbackEvent}) {
	return (
		<TemplateResult
			screen={'mobile'}
			title={'분실 및 환불신청 완료되었습니다!'}
			subTitle={'환불/분실신청 내역에서 승인여부를 확인하세요.'}
			animationSrc={require('@assets/animations/refund_complete.json')}
			buttonText={'확인'}
			buttonAriaLabel={'분실신청 첫 페이지로 이동'}
			onDone={() => fncCallbackEvent('initStep')}
		>
			<div className={'result-table-wrap'} aria-label={`분실신청 결과 정보`}>
				<dl>
					<div>
						<dt>대중교통안심카드</dt>
						<dd>{fncMaskCardNo(data.cardNoEncpt)}</dd>
					</div>
					<div>
						<dt>분실 및 환불신청 일자</dt>
						<dd>{moment().format('YYYY-MM-DD')}</dd>
					</div>
				</dl>
			</div>
		</TemplateResult>
	)
}
