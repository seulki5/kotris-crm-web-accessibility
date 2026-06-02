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
		<div className={'w-full'}>
			{/*다국어 페이지 O -> 다국어 Layout 안에 위치*/}
			{
				// 다국어 페이지 X + 모바일 푸터 O
				!isIntl && isMobile && (
					<footer>
						<MoFooter fncCallbackEvent={fncCallbackEvent} />
					</footer>
				)
			}
			{
				// 다국어 페이지 X + 모바일 푸터 X
				!isIntl && !isMobile && (
					<footer>
						<DtFooter fncCallbackEvent={fncCallbackEvent} />
					</footer>
				)
			}
		</div>
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
		<div className={'inner-wrap'} style={{maxWidth: '100vw'}} aria-label={'레일플러스 하단 정보'}>
			<div className={'flex flex-col justify-between gap-20 wide:flex-row'}>
				<div className={'flex flex-col gap-12'}>
					<div className={'flex flex-row gap-6'} aria-label={'고객센터 정보'}>
						<div aria-hidden={true}>
							<CSCenter color={'text-dynamic-icon-neutral-primary'}/>
						</div>
						<div className={'cs-title'}>
							레일플러스 고객센터{' '}
							<a href={'tel:15887788'} className={'text-dynamic-text-brand-primary font-medium ml-13'}>
								1588-7788
							</a>
						</div>
					</div>
					<dl>
						<dt>상호</dt>
						<dd>한국철도공사</dd>
						<dt>사업자등록</dt>
						<dd>314-82-10024</dd>
						<dt>통신판매업신고</dt>
						<dd>대전 동구-0233호</dd>
						<dt>주소</dt>
						<dd>대전광역시 동구 중앙로 240</dd>
					</dl>
					<dl>
						<dt>고객센터</dt>
						<dd>1588-7788(이용료:발신자부담)</dd>
						<dt>대표전화</dt>
						<dd>042-472-5000</dd>
						<dt>팩스</dt>
						<dd>02-361-8385</dd>
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
			<footer className={'inner-wrap'} aria-label={'레일플러스 하단 정보'}>
				<div className={'flex flex-col justify-between gap-20 wide:flex-row'}>
					<div className={'flex flex-col gap-12'}>
						<div className={'flex flex-row gap-6'} aria-label={'고객센터 정보'}>
							<div aria-hidden={true}>
								<CSCenter color={'text-dynamic-icon-neutral-primary'}/>
							</div>
							<p className={'cs-title'}>
								레일플러스 고객센터{' '}
								<a href={'tel:15887788'}
								   className={'text-dynamic-text-brand-primary font-medium ml-13'}>
									1588-7788
								</a>
							</p>
						</div>
						<dl>
							<dt>상호</dt>
							<dd>한국철도공사</dd>
						</dl>
						<dl>
							<dt>사업자등록</dt>
							<dd>314-82-10024</dd>
						</dl>
						<dl>
							<dt>통신판매업신고</dt>
							<dd>대전 동구-0233호</dd>
						</dl>
						<dl>
							<dt>주소</dt>
							<dd>대전광역시 동구 중앙로 240</dd>
						</dl>
						<dl>
							<dt>고객센터</dt>
							<dd>1588-7788(이용료:발신자부담)</dd>
						</dl>
						<dl>
							<dt>대표전화</dt>
							<dd>042-472-5000</dd>
						</dl>
						<dl>
							<dt>팩스</dt>
							<dd>02-361-8385</dd>
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
			</footer>
		)
	} else {
		return null;
	}
}
