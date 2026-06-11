'use client'

import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {fncMaskCardNo} from '@modules/utils/StringUtils';

// components
import TemplateResult from '@components/composite/TemplateResult';
import Badge from '@components/composite/Badge';


/**
 * @description: 카드 등록 > 등록 완료 화면 입니다.
 * @screenID:    UI-CRM-F229, UI-CRM-F457
 * @screenPath:  홈 > 마이페이지 > 내 카드 > 카드 등록
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
CardRegisterStep3.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export default function CardRegisterStep3({data, fncCallbackEvent}) {

	const {isMobile} = useScreenSizeContext();

	if (isMobile) return (
		<MoCardRegisterStep3
			fncCallbackEvent={fncCallbackEvent}
			data={data}
        />
	);
	else return (
		<DtCardRegisterStep3
			fncCallbackEvent={fncCallbackEvent}
			data={data}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F229
 */
DtCardRegisterStep3.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function DtCardRegisterStep3({data, fncCallbackEvent}) {
	return (
		<TemplateResult
			screen={'desktop'}
			title={`${data.utztnDsctnSeNm || '-'}가\n성공적으로 등록되었습니다!`}
			subTitle={'어린이/청소년 권종은 등록 이후 영업일 기준 3일 이후부터 적용됩니다.'}
			animationSrc={require('@assets/animations/issue_complete.json')}
			buttonText={'확인'}
			buttonAriaLabel={'내 카드 목록으로 이동'}
			onDone={() => fncCallbackEvent('goBack')}
		>
			<div className={'result-table-wrap'} aria-label={'등록 결과 정보'}>
				<dl>
					<div>
						<dt>카드번호</dt>
						<dd>{fncMaskCardNo(data.cardNoEncpt)}</dd>
					</div>
					<div>
						<dt>등록일</dt>
						<dd>{moment().format('YYYY-MM-DD')}</dd>
					</div>
					<div>
						<dt>권종</dt>
						<dd>
							<Badge
								id={'issuCardPssrTypeCd'}
								code={data.issuCardPssrTypeCd}
							/>
						</dd>
					</div>
				</dl>
			</div>
		</TemplateResult>
	)
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F457
 */
MoCardRegisterStep3.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function MoCardRegisterStep3({data, fncCallbackEvent}) {
	return (
		<TemplateResult
			screen={'mobile'}
			title={`${data.utztnDsctnSeNm || '-'}가\n성공적으로 등록되었습니다!`}
			subTitle={`어린이 / 청소년 권종은 등록 이후\n영업일 기준 3일 이후부터 적용됩니다.`}
			animationSrc={require('@assets/animations/issue_complete.json')}
			buttonText={'확인'}
			buttonAriaLabel={'내 카드 목록으로 이동'}
			onDone={() => fncCallbackEvent('goBack')}
		>
			<div className={'result-table-wrap'} aria-label={'등록 결과 정보'}>
				<dl>
					<div>
						<dt>카드번호</dt>
						<dd>{fncMaskCardNo(data.cardNoEncpt)}</dd>
					</div>
					<div>
						<dt>등록일</dt>
						<dd>{moment().format('YYYY-MM-DD')}</dd>
					</div>
					<div>
						<dt>권종</dt>
						<dd>
							<Badge
								id={'issuCardPssrTypeCd'}
								code={data.issuCardPssrTypeCd}
							/>
						</dd>
					</div>
				</dl>
			</div>
		</TemplateResult>
	)
}
