'use client'

import React, {useLayoutEffect} from 'react';
import PropTypes from 'prop-types';
import moment from "moment";

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {useScrollContext} from "@modules/context/ScrollContext";

// components
import TemplateResult from "@components/composite/TemplateResult";


/**
 * @description: 청소년 연령초과 학생 할인 등록/수정 결과 화면 입니다.
 * @screenID:    UI-CRM-F274, UI-CRM-F478
 * @screenPath:  홈 > 마이페이지 > 할인등록 > 청소년 연령초과 학생 할인 등록/수정
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
DiscountStudentRegisterStep2.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export default function DiscountStudentRegisterStep2({fncCallbackEvent}) {
	
	const {isMobile} = useScreenSizeContext();
	const {fncScrollToTop} = useScrollContext();

	useLayoutEffect(() => {
		fncScrollToTop();
	}, []);

	if (isMobile) return (
		<MoDiscountTeenCardStep2
			fncCallbackEvent={fncCallbackEvent}
        />
	);
	else return (
		<DtDiscountTeenCardStep2
			fncCallbackEvent={fncCallbackEvent}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F274
 */
DtDiscountTeenCardStep2.propTypes = {
	fncCallbackEvent: PropTypes.func
};
export function DtDiscountTeenCardStep2({fncCallbackEvent}) {
	return (
		<TemplateResult
			screen={'desktop'}
			title={`청소년 연령초과 학생 할인\n등록이 완료되었습니다!`}
			subTitle={'신청 결과는 알림 메시지로 안내해 드립니다.'}
			animationSrc={require('@assets/animations/discount_complete.json')}
			buttonText={'확인'}
			buttonAriaLabel={'할인등록 페이지로 이동'}
			onDone={() => fncCallbackEvent('goBack')}
		>
			<div className={'result-table-wrap'} aria-label={`청소년 연령초과 학생 할인 등록/수정 결과 정보`}>
				<dl>
					<div>
						<dt>등록일자</dt>
						<dd>{moment().format('YYYY-MM-DD')}</dd>
					</div>
				</dl>
			</div>
		</TemplateResult>
	)
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F478
 */
MoDiscountTeenCardStep2.propTypes = {
	fncCallbackEvent: PropTypes.func
};
export function MoDiscountTeenCardStep2({fncCallbackEvent}) {
	return (
		<TemplateResult
			screen={'mobile'}
			title={`청소년 연령초과 학생 할인\n등록이 완료되었습니다!`}
			subTitle={'신청 결과는 알림 메시지로 안내해 드립니다.'}
			animationSrc={require('@assets/animations/discount_complete.json')}
			buttonText={'확인'}
			buttonAriaLabel={'할인등록 페이지로 이동'}
			onDone={() => fncCallbackEvent('goBack')}
		>
			<div className={'result-table-wrap'} aria-label={`청소년 연령초과 학생 할인 등록/수정 결과 정보`}>
				<dl>
					<div>
						<dt>등록일자</dt>
						<dd>{moment().format('YYYY-MM-DD')}</dd>
					</div>
				</dl>
			</div>
		</TemplateResult>
	)
}
