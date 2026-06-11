'use client'

import React, {useLayoutEffect} from 'react';
import PropTypes from 'prop-types';
import moment from "moment";

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {fncMaskCardNo} from "@modules/utils/StringUtils";
import {useScrollContext} from "@modules/context/ScrollContext";

// components
import TemplateResult from "@components/composite/TemplateResult";
import Badge from "@components/composite/Badge";


/**
 * @description: 국가신분증 등록/수정 화면 입니다.
 * @screenID:    UI-CRM-F273, UI-CRM-F514
 * @screenPath:  홈 > 마이페이지 > 할인등록 > 국가신분증 등록/수정
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
DiscountTeenRegisterStep2.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export default function DiscountTeenRegisterStep2({data, fncCallbackEvent}) {

	const {isMobile} = useScreenSizeContext();
	const {fncScrollToTop} = useScrollContext();
	
	useLayoutEffect(() => {
		fncScrollToTop();
	}, []);
	
	if (isMobile) return (
		<MoDiscountTeenCardStep2
			fncCallbackEvent={fncCallbackEvent}
			data={data}
        />
	);
	else return (
		<DtDiscountTeenCardStep2
			fncCallbackEvent={fncCallbackEvent}
			data={data}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F273
 */
DtDiscountTeenCardStep2.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function DtDiscountTeenCardStep2({data, fncCallbackEvent}) {
	return (
		<TemplateResult
			screen={'desktop'}
			title={`국가신분증(청소년증)\n할인 등록이 완료되었습니다!`}
			subTitle={'영업일 기준 3일 이후부터 적용됩니다.'}
			animationSrc={require('@assets/animations/discount_complete.json')}
			buttonText={'확인'}
			buttonAriaLabel={'할인등록 페이지로 이동'}
			onDone={() => fncCallbackEvent('goBack')}
		>
			<div className={'result-table-wrap'} aria-label={`국가신분증 등록/수정 결과 정보`}>
				<dl>
					<div>
						<dt>카드번호</dt>
						<dd className={'flex-row-center gap-12'}>
							{data.result?.crdUsrTpCd && <Badge id={'crdUsrTpCd'} code={data.result.crdUsrTpCd} />}
							{fncMaskCardNo(data.cardNoEncpt)}
						</dd>
					</div>
					<div>
						<dt>등록일자</dt>
						<dd>{data.cardNoEncpt ? moment().format('YYYY-MM-DD') : '-'}</dd>
					</div>
				</dl>
			</div>
		</TemplateResult>
	)
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F514
 */
MoDiscountTeenCardStep2.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function MoDiscountTeenCardStep2({data, fncCallbackEvent}) {
	return (
		<TemplateResult
			screen={'mobile'}
			title={`국가신분증(청소년증)\n할인 등록이 완료되었습니다!`}
			subTitle={'영업일 기준 3일 이후부터 적용됩니다.'}
			animationSrc={require('@assets/animations/discount_complete.json')}
			buttonText={'확인'}
			buttonAriaLabel={'할인등록 페이지로 이동'}
			onDone={() => fncCallbackEvent('goBack')}
		>
			<div className={'result-table-wrap'} aria-label={`국가신분증 등록/수정 결과 정보`}>
				<dl>
					<div>
						<dt>카드번호</dt>
						<dd className={'flex-row-center gap-12 mo:gap-8'}>
							{data.result?.crdUsrTpCd && <Badge id={'crdUsrTpCd'} code={data.result.crdUsrTpCd} />}
							{fncMaskCardNo(data.cardNoEncpt)}
						</dd>
					</div>
					<div>
						<dt>등록일자</dt>
						<dd>{data.cardNoEncpt ? moment().format('YYYY-MM-DD') : '-'}</dd>
					</div>
				</dl>
			</div>
		</TemplateResult>
	)
}
