'use client';

import React, {useLayoutEffect, useState} from 'react';
import moment from 'moment';
import {usePathname, useRouter} from 'next/navigation';
import PropTypes from 'prop-types';

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {LinkedSitesOptions, policyOptions} from '@modules/consants/Options';
import {routing} from '@/i18n/routing';
import {useLoadingContext} from '@modules/context/LoadingContext';
import {useWebContext} from '@modules/context/WebviewContext';
import {fncOpenUri} from '@modules/utils/StringUtils';
import {RouteConfig} from '@modules/config/RouteConfig';

// components
import Select from '@components/common/Select';

// assets
import {CSCenter} from '@assets/icons/Svgs';


/**
 * @description: 공통 푸터 입니다.
 * @screenID:    -
 * @screenPath:  -
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function Footer() {

	const router = useRouter();
	const pathname = usePathname();
	const {isMobile} = useScreenSizeContext();
	const {isAccApp, fncPostRN} = useWebContext();
	const {fncRouteStart} = useLoadingContext();

	// 다국어 페이지 진입 여부
	const [isIntl, setIsIntl] = useState(false);

	useLayoutEffect(() => {
		// 다국어 페이지 체크
		const splitPaths = pathname.split('/');
		if(routing.locales.includes(splitPaths[1])){
			setIsIntl(true);
		} else {
			setIsIntl(false);
		}
	}, [pathname])

	// 이동: 관련사이트
	const fncGoSite = (option) => {
		if(isAccApp) {
			fncPostRN({
				id: 'WEB_OPEN_URL',
				uri: option.uri
			});
		} else {
			fncOpenUri(option.uri);
		}
	}

	// 이동: 약관
	const fncGoTerms = (policy) => {
		if(Object.keys(policy).length < 1) return;
		if(policy.link) {
			fncOpenUri(policy.link);
			return;
		}

		const targetUri = `${RouteConfig.TERMS.PATH}?type=${policy.type}`;
        fncRouteStart(targetUri);
		router.push(targetUri);
	}

	const fncHandlers = {
		goSite: fncGoSite,
		goTerms: fncGoTerms
	}

	const fncCallbackEvent = (fncName, variable, payload = {}) => {
		const fnc = fncHandlers[fncName];
		if (typeof fnc === 'function') return fnc(variable, payload);
	}

	return (
		<footer className={'w-full'} aria-label={'푸터'}>
			{/*다국어 페이지 O -> 다국어 Layout 안에 위치*/}
			{
				// 다국어 페이지 X + 모바일 푸터 O
				!isIntl && isMobile && (
					<MoFooter fncCallbackEvent={fncCallbackEvent} />
				)
			}
			{
				// 다국어 페이지 X + 모바일 푸터 X
				!isIntl && !isMobile && (
					<DtFooter fncCallbackEvent={fncCallbackEvent} />
				)
			}
		</footer>
	);
}

/**
 * @description: Desktop
 * @screenID:    -
 */
DtFooter.propTypes = {
	fncCallbackEvent: PropTypes.func
};
export function DtFooter({fncCallbackEvent}) {
	return (
		<div className={'inner-wrap'}>
			<div className={'flex flex-col justify-between gap-20 wide:flex-row'}>
				<div className={'flex flex-col gap-12'}>
					<section className={'flex flex-row gap-6'} aria-labelledby={'cs-heading'}>
						<div aria-hidden={true}>
							<CSCenter color={'text-dynamic-icon-neutral-primary'}/>
						</div>
						<h2 className={'cs-title'} id={'cs-heading'}>
							레일플러스 고객센터
						</h2>
						<a href={'tel:15887788'} className={'text-dynamic-text-brand-primary font-medium ml-13'} aria-label={'일오팔팔 칠칠팔팔'}>
							1588-7788
						</a>
					</section>
					<dl>
						<dt>상호</dt>
						<dd>한국철도공사</dd>
						<dt>사업자등록</dt>
						<dd>
							<span aria-hidden={true}>314-82-10024</span>
							<span className={'sr-only'}>삼일사 팔이 일공공이사</span>
						</dd>
						<dt>통신판매업신고</dt>
						<dd>
							<span aria-hidden={true}>대전 동구-0233호</span>
							<span className={'sr-only'}>대전 동구 공이삼삼호</span>
						</dd>
						<dt>주소</dt>
						<dd>대전광역시 동구 중앙로 240</dd>
					</dl>
					<dl>
						<dt>고객센터</dt>
						<dd>
							<span aria-hidden={true}>1588-7788(이용료:발신자부담)</span>
							<span className={'sr-only'}>일오팔팔 칠칠팔팔 이용료 발신자부담</span>
						</dd>
						<dt>대표전화</dt>
						<dd>
							<span aria-hidden={true}>042-472-5000</span>
							<span className={'sr-only'}>공사이 사칠이 오공공공</span>
						</dd>
						<dt>팩스</dt>
						<dd>
							<span aria-hidden={true}>02-361-8385</span>
							<span className={'sr-only'}>공이 삼육일 팔삼팔오</span>
						</dd>
					</dl>
				</div>
				<div className={'w-full max-w-[218px]'}>
					<Select
						size={'md'}
						options={LinkedSitesOptions}
						placeholder={'관련사이트'}
						transYDirection={'up'}
						id={'linked-site'}
						value={null}
						onSelect={(option) => fncCallbackEvent('goSite', option)}
					/>
				</div>
			</div>
			<div className={'flex flex-row'}>
				{
					policyOptions.filter(el => !el.hide)?.map((policy, index) => (
						<div key={policy.type} className={'flex flex-row items-center'}>
							{
								index > 0 && (
									<div className={'divider-policy'}/>
								)
							}
							<button className={'co-value button-policy'}
							        aria-label={`정책 페이지 이동: ${policy.label}`}
							        onClick={() => fncCallbackEvent('goTerms', policy)}>
								{policy.koName}
							</button>
						</div>
					))
				}
			</div>
			<p className={'text-body-sm text-dynamic-text-neutral-disabled'}>
				{`Copyright ©${moment().year()} KOREA RAILROAD. All Rights Reserved.`}
			</p>
		</div>
	)
}

/**
 * @description: Mobile
 * @screenID:    -
 */
MoFooter.propTypes = {
	fncCallbackEvent: PropTypes.func
};
export function MoFooter({fncCallbackEvent}) {

	const pathname = usePathname();

	if(pathname === '/') {
		return (
			<div className={'inner-wrap'}>
				<div className={'flex flex-col justify-between gap-20 wide:flex-row'}>
					<div className={'flex flex-col gap-12'}>
						<section className={'flex flex-row gap-6'}>
							<div aria-hidden={true}>
								<CSCenter color={'text-dynamic-icon-neutral-primary'}/>
							</div>
							<h2 className={'cs-title'}>
								레일플러스 고객센터{' '}
							</h2>
							<a
								href={'tel:15887788'}
								className={'text-dynamic-text-brand-primary font-medium ml-13'}
								aria-label={'일오팔팔 칠칠팔팔'}
							>
								1588-7788
							</a>
						</section>
						<dl style={{flexDirection: 'column'}}>
							<div>
								<dt>상호</dt>
								<dd>한국철도공사</dd>
							</div>
							<div>
								<dt>사업자등록</dt>
								<dd>
									<span aria-hidden={true}>314-82-10024</span>
									<span className={'sr-only'}>삼일사 팔이 일공공이사</span>
								</dd>
							</div>
							<div>
								<dt>통신판매업신고</dt>
								<dd>
									<span aria-hidden={true}>대전 동구-0233호</span>
									<span className={'sr-only'}>대전 동구 공이삼삼호</span>
								</dd>
							</div>
							<div>
								<dt>주소</dt>
								<dd>대전광역시 동구 중앙로 240</dd>
							</div>
							<div>
								<dt>고객센터</dt>
								<dd>
									<span aria-hidden={true}>1588-7788(이용료:발신자부담)</span>
									<span className={'sr-only'}>일오팔팔 칠칠팔팔 이용료 발신자부담</span>
								</dd>
							</div>
							<div>
								<dt>대표전화</dt>
								<dd>
									<span aria-hidden={true}>042-472-5000</span>
									<span className={'sr-only'}>공사이 사칠이 오공공공</span>
								</dd>
							</div>
							<div>
								<dt>팩스</dt>
								<dd>
									<span aria-hidden={true}>02-361-8385</span>
									<span className={'sr-only'}>공이 삼육일 팔삼팔오</span>
								</dd>
							</div>
						</dl>
					</div>
					<div className={'w-full max-w-[218px]'}>
						<Select
							size={'sm'}
							options={LinkedSitesOptions}
							placeholder={'관련사이트'}
							id={'linked-site'}
							value={null}
							onSelect={(option) => fncCallbackEvent('goSite', option)}
						/>
					</div>
				</div>
				<div className={'flex flex-row'}>
					{
						policyOptions.filter(el => !el.hide)?.map((policy, index) => (
							<div key={policy.type} className={'flex flex-row items-center'}>
								{
									index > 0 && (
										<div className={'divider-policy'}/>
									)
								}
								<button className={'co-value button-policy'}
								        aria-label={`정책 페이지 이동: ${policy.label}`}
								        onClick={() => fncCallbackEvent('goTerms', policy)}>
									{policy.koName}
								</button>
							</div>
						))
					}
				</div>
				<p className={'copyright'}>
					{`Copyright ©${moment().year()} KOREA RAILROAD. All Rights Reserved.`}
				</p>
			</div>
		)
	} else {
		return null;
	}
}
