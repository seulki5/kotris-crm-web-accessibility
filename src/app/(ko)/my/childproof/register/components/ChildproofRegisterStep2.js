'use client'

import React from 'react';
import PropTypes from 'prop-types';
import moment from "moment";

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';

// components
import TemplateResult from "@components/composite/TemplateResult";


/**
 * @description: 어린이 안심서비스 내 자녀 등록/수정 화면 입니다.
 * @screenID:    UI-CRM-F249, UI-CRM-F480
 * @screenPath:  홈 > 마이페이지 > 어린이 안심서비스 > 내 자녀 등록/수정
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
ChildproofRegisterStep2.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export default function ChildproofRegisterStep2({data, fncCallbackEvent}) {
	
	const {isMobile} = useScreenSizeContext();
	if (isMobile) return (
		<MoChildproofRegisterStep2
			fncCallbackEvent={fncCallbackEvent}
			data={data}
        />
	);
	else return (
		<DtChildproofRegisterStep2
			fncCallbackEvent={fncCallbackEvent}
			data={data}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F249
 */
DtChildproofRegisterStep2.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function DtChildproofRegisterStep2({data, fncCallbackEvent}) {
	return (
		<TemplateResult
			screen={'desktop'}
			title={`어린이 안심서비스\n내 자녀 신청이 완료되었습니다!`}
			subTitle={'신청 결과는 알림 메시지로 안내해 드립니다.'}
			animationSrc={require('@assets/animations/childproof_complete.json')}
			buttonText={'확인'}
			buttonAriaLabel={'어린이 안심서비스 자녀 목록으로 이동'}
			onDone={() => fncCallbackEvent('goList')}
		>
			<div className={'result-table-wrap'} aria-label={`어린이 안심서비스 내 자녀 등록/수정 결과 정보`}>
				<dl>
					<div>
						<dt>자녀 이름</dt>
						<dd>{data?.cdrnNm || '-'}</dd>
					</div>
					<div>
						<dt>자녀 아이디</dt>
						<dd>{data?.cdrnWebMbrId || '-'}</dd>
					</div>
					<div>
						<dt>자녀 생년월일</dt>
						<dd>{data.cdrnBrdt ? moment(data.cdrnBrdt, 'YYYYMMDD').format('YYYY-MM-DD') : '-'}</dd>
					</div>
					<div>
						<dt>등록일자</dt>
						<dd>{data?.custBrdt ? data.custBrdt : moment().format('YYYY-MM-DD')}</dd>
					</div>
				</dl>
			</div>
		</TemplateResult>
	)
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F480
 */
MoChildproofRegisterStep2.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function MoChildproofRegisterStep2({data, fncCallbackEvent}) {
	return (
		<TemplateResult
			screen={'mobile'}
			title={`어린이 안심서비스\n내 자녀 신청이 완료되었습니다!`}
			subTitle={'신청 결과는 알림 메시지로 안내해 드립니다.'}
			animationSrc={require('@assets/animations/childproof_complete.json')}
			buttonText={'확인'}
			buttonAriaLabel={'어린이 안심서비스 자녀 목록으로 이동'}
			onDone={() => fncCallbackEvent('goList')}
		>
			<div className={'result-table-wrap'} aria-label={`어린이 안심서비스 내 자녀 등록/수정 결과 정보`}>
				<dl>
					<div>
						<dt>자녀 이름</dt>
						<dd>{data?.cdrnNm || '-'}</dd>
					</div>
					<div>
						<dt>자녀 아이디</dt>
						<dd>{data?.cdrnWebMbrId || '-'}</dd>
					</div>
					<div>
						<dt>자녀 생년월일</dt>
						<dd>{data.cdrnBrdt ? moment(data.cdrnBrdt, 'YYYYMMDD').format('YYYY-MM-DD') : '-'}</dd>
					</div>
					<div>
						<dt>등록일자</dt>
						<dd>{data?.custBrdt ? data.custBrdt : moment().format('YYYY-MM-DD')}</dd>
					</div>
				</dl>
			</div>
		</TemplateResult>
	)
}
