'use client'

import React, {useLayoutEffect} from 'react';
import PropTypes from 'prop-types';

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {useMoHeaderContext} from '@modules/context/MoHeaderContext';
import {useLoadingContext} from '@modules/context/LoadingContext';
import {useWebContext} from '@modules/context/WebviewContext';

// components
import Breadcrumb from '@components/layout/Breadcrumb';

// assets
import {ChevronRight, Consultant} from '@assets/icons/Svgs';


/**
 * @description: 문의하기 화면 입니다.
 * @screenID:    UI-CRM-F270, UI-CRM-F491
 * @screenPath:  홈 > 고객센터 > 문의하기
 * @author       $Author
 * @since        $Date
 * @version      $Revision
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function SupportContact() {

	const {isMobile} = useScreenSizeContext();
	const {isAccApp, reloadKey, fncPostRN, fncFocusLayout} = useWebContext();
	const {fncChangeMoHeader} = useMoHeaderContext();

	useLayoutEffect(() => {
		if (isAccApp) fncFocusLayout();
		if (isMobile) {
			fncChangeMoHeader({
				type: 'back',
				title: '문의하기'
			})
		}
	}, [isMobile, isAccApp, reloadKey])

	// 이동: 한국철도 고객의 소리
	const fncGoKorail = () => {
		const uri = process.env.NEXT_PUBLIC_KORAIL_VOC_URI;
		if(!uri) return;
		if(isAccApp) {
			fncPostRN({
				id: 'WEB_OPEN_URL',
				uri: uri
			})
		} else {
			window.open(uri, '_blank')
		}
	}

	const fncHandlers = {
		goKorail: fncGoKorail,
	}

	const fncCallbackEvent = (fncName, variable, payload = {}) => {
		const fnc = fncHandlers[fncName];
		if (typeof fnc === 'function') return fnc(variable, payload);
	}

	if (isMobile) return (
		<MoSupportContact
			fncCallbackEvent={fncCallbackEvent}
        />
	);
	else return (
		<DtSupportContact
			fncCallbackEvent={fncCallbackEvent}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F270
 */
DtSupportContact.propTypes = {
	fncCallbackEvent: PropTypes.func
};
export function DtSupportContact({fncCallbackEvent}) {
	return (
		<main id={'support'} className={'body-wrap-832 contact-wrap'} aria-labelledby={'page-name-dt'}>
			<Breadcrumb addPaths={[]} />
			<h1 id={'page-name-dt'} className={'page-title'}>
				문의하기
			</h1>
			<div className={'mt-56 flex-col-center gap-72'}>
				<section className={'call-wrap'}>
					<div>
						<h2>전화상담</h2>
						<p aria-label={'대표번호: 일오팔팔 칠칠팔팔. 평일 09:00 부터 18:00 까지 가능 (주말, 공휴일 휴무)'}>
							<a href={'tel:15887788'} aria-label={'일오팔팔 칠칠팔팔'}>1588-7788</a>
						</p>
						<p aria-hidden={true}>
							평일 09:00 ~ 18:00 (주말, 공휴일 휴무)
						</p>
					</div>
					<Consultant />
				</section>
				<section>
					<dl>
						<div className={'flex-row-center'}>
							<dt>
								<h2>고객의 소리</h2>
							</dt>
							<dd>
								<p>
									한국철도 고객의 소리 신청 및 처리결과 확인은 고객의 소리 홈페이지에서 이용하실 수 있습니다.<br/>
									고객의 소리는 회원로그인 혹은 비회원(휴대전화) 인증이 필요한 서비스입니다.
								</p>
								<button
									type={'button'}
									aria-label={'한국철도 고객의 소리 링크'}
									onClick={() => fncCallbackEvent('goKorail')}>
									바로가기
									<ChevronRight width={20} height={20} />
								</button>
							</dd>
						</div>
						<div className={'divider '} />
						<div className={'flex-row-center'}>
							<dt>
								<h2>제휴 문의</h2>
							</dt>
							<dd>
								<p aria-hidden={true}>여러분의 사업에 신속하고 정확한 Rail+ 결제시스템이 필요하시다면 회사소개서나 제안서를 첨부하여 아래 담당자에게 메일을 보내주십시오. 담당자가 면밀히 검토 후 바로 연락 드리도록 하겠습니다.</p>
								<p aria-hidden={true}>Rail+ 결제시스템은 언제나 혁신적인 여러분들의 사업번영을 위해 안전하고 믿음직한 비즈니스 파트너로서 지원을 아끼지 않겠습니다.</p>
								<span className={'sr-only'}>
									여러분의 사업에 신속하고 정확한 Rail+ 결제시스템이 필요하시다면 회사소개서나 제안서를 첨부하여 아래 담당자에게 메일을 보내주십시오. 담당자가 면밀히 검토 후 바로 연락 드리도록 하겠습니다.
									Rail+ 결제시스템은 언제나 혁신적인 여러분들의 사업번영을 위해 안전하고 믿음직한 비즈니스 파트너로서 지원을 아끼지 않겠습니다.
									이메일 문의: smart@korail.com
								</span>
								<div className={'flex-row'}>
									<span aria-hidden={true} className={'mr-10'}>이메일 문의</span>
									<a href={'mailto:smart@korail.com'} className={'text-blue-600 text-dynamic-text-neutral-primary underline ml-2 '}>
										smart@korail.com
									</a>
								</div>
							</dd>
						</div>
					</dl>
				</section>
			</div>
		</main>
	)
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F491
 */
MoSupportContact.propTypes = {
	fncCallbackEvent: PropTypes.func
};
export function MoSupportContact({fncCallbackEvent}) {
	return (
		<main id={'support'} className={'body-wrap-mobile-screen-height contact-wrap'} aria-labelledby={'page-name-mo'} style={{padding: 0}}>
			<h1 id={'page-name-mo'} className={'sr-only'}>문의하기</h1>
			<div className={'flex-col-center'}>
				<section className={'call-wrap'}>
					<div>
						<h2>전화상담</h2>
						<p aria-label={'대표번호: 일오팔팔 칠칠팔팔. 평일 09:00 부터 18:00 까지 가능 (주말, 공휴일 휴무)'}>
							<a href={'tel:15887788'} aria-label={'일오팔팔 칠칠팔팔'}>1588-7788</a>
						</p>
						<p aria-hidden={true}>
							평일 09:00 ~ 18:00 (주말, 공휴일 휴무)
						</p>
					</div>
					<Consultant />
				</section>
				<section>
					<dl>
						<div className={'flex-col-center'}>
							<dt>
								<h2>고객의 소리</h2>
							</dt>
							<dd>
								<p>
									한국철도 고객의 소리 신청 및 처리결과 확인은 고객의 소리 홈페이지에서 이용하실 수 있습니다.<br/>
									고객의 소리는 회원로그인 혹은 비회원(휴대전화) 인증이 필요한 서비스입니다.
								</p>
								<button
									type={'button'}
									aria-label={'한국철도 고객의 소리 링크'}
									onClick={() => fncCallbackEvent('goKorail')}>
									바로가기
									<ChevronRight width={16} height={16} />
								</button>
							</dd>
						</div>
						<div className={'divider '} />
						<div className={'flex-col-center'}>
							<dt>
								<h2>제휴 문의</h2>
							</dt>
							<dd>
								<p aria-hidden={true}>여러분의 사업에 신속하고 정확한 Rail+ 결제시스템이 필요하시다면 회사소개서나 제안서를 첨부하여 아래 담당자에게 메일을 보내주십시오. 담당자가 면밀히 검토 후 바로 연락 드리도록 하겠습니다.</p>
								<p aria-hidden={true}>Rail+ 결제시스템은 언제나 혁신적인 여러분들의 사업번영을 위해 안전하고 믿음직한 비즈니스 파트너로서 지원을 아끼지 않겠습니다.</p>
								<span className={'sr-only'}>
									여러분의 사업에 신속하고 정확한 Rail+ 결제시스템이 필요하시다면 회사소개서나 제안서를 첨부하여 아래 담당자에게 메일을 보내주십시오. 담당자가 면밀히 검토 후 바로 연락 드리도록 하겠습니다.
									Rail+ 결제시스템은 언제나 혁신적인 여러분들의 사업번영을 위해 안전하고 믿음직한 비즈니스 파트너로서 지원을 아끼지 않겠습니다.
									이메일 문의: smart@korail.com
								</span>
								<div className={'flex-row'} aria-hidden={true}>
									<span aria-hidden={true} className={'mr-10'}>이메일 문의</span>
									<a href={'mailto:smart@korail.com'} className={'text-dynamic-text-neutral-primary'}>
										smart@korail.com
									</a>
								</div>
							</dd>
					</div>
					</dl>
				</section>
			</div>
		</main>
	)
}
