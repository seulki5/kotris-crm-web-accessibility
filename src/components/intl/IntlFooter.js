'use client';

import React, {useLayoutEffect, useState} from 'react';
import moment from 'moment';
import {useRouter} from 'next/navigation';
import PropTypes from 'prop-types';
import {useLocale, useTranslations} from 'next-intl';
import clsx from 'clsx';

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {LinkedSitesOptions, policyOptions} from '@modules/consants/Options';
import {useLoadingContext} from '@modules/context/LoadingContext';
import {useWebContext} from '@modules/context/WebviewContext';
import {fncOpenUri} from '@modules/utils/StringUtils';

// components
import Select from '@components/common/Select';

// assets
import {CSCenter} from '@assets/icons/Svgs';
import {
	FontBody2xlClasses,
	FontBodyLgClasses,
	FontBodyMdClasses, FontBodySmClasses,
	FontBodyXlClasses, FontBodyXsClasses
} from '@/styles/intlFontSizeClasses';


/**
 * @description: 공통 푸터 입니다.
 * @screenID:    -
 * @screenPath:  -
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function IntlFooter() {
	
	const router = useRouter();
	const {isMobile} = useScreenSizeContext();
	const {isAccApp, fncPostRN} = useWebContext();
	const {fncRouteStart} = useLoadingContext();
	const t = useTranslations();
	
	const [siteOptions, setSiteOptions] = useState([]);
	
	useLayoutEffect(() => {
		const translation = LinkedSitesOptions.map((item) => ({
			...item,
			name: t(item.intlName),
		}));
		
		setSiteOptions(translation);
	}, []);
	
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

		const targetUri = `/terms?type=${policy.type}`;
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
		<footer aria-label={'레일플러스 하단 정보'}>
			{
				isMobile ? (
					<MoIntlFooter
						fncCallbackEvent={fncCallbackEvent}
						data={{siteOptions}}
					/>
				) : (
					<DtIntlFooter
						fncCallbackEvent={fncCallbackEvent}
						data={{siteOptions}}
					/>
				)
			}
		</footer>
	);
}

/**
 * @description: Desktop
 * @screenID:    -
 */
DtIntlFooter.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func,
};
export function DtIntlFooter({data, fncCallbackEvent}) {
	
	const t = useTranslations();
	const locale = useLocale();
	
	return (
		<div className={'inner-wrap'}>
			<div className={'flex flex-col justify-between gap-20 wide:flex-row'}>
				<div className={'flex flex-col gap-12'}>
					<div className={'flex flex-row gap-6'} aria-label={t('FOOTER.CS_CENTER')}>
						<div aria-hidden={true}>
							<CSCenter color={'text-dynamic-icon-neutral-primary'}/>
						</div>
						<div className={clsx('cs-title-intl', FontBody2xlClasses[locale])}>
							{t('FOOTER.CS_CENTER')}{' '}
							<a href={'tel:15887788'} className={'text-dynamic-text-brand-primary font-medium ml-13'}>
								1588-7788
							</a>
						</div>
					</div>
					<dl>
						<dt className={clsx('intl', FontBodyXlClasses[locale])}>
							{t('FOOTER.KORAIL_COMPANY')}
						</dt>
						<dd className={clsx('intl', FontBodyLgClasses[locale])}>
							{t('FOOTER.KORAIL_ADDRESS')}
						</dd>
						<dt className={clsx('intl', FontBodyXlClasses[locale])}>
							{t('FOOTER.CEO')}
						</dt>
						<dd className={clsx('intl', FontBodyLgClasses[locale])}>
							{t('FOOTER.KORAIL_CEO')}
						</dd>
						<dt className={clsx('intl', FontBodyXlClasses[locale])}>
							{t('FOOTER.BUSINESS_NO')}
						</dt>
						<dd className={clsx('intl', FontBodyLgClasses[locale])}>
							318-82-10024
						</dd>
						<dt className={clsx('intl', FontBodyXlClasses[locale])}>
							{t('FOOTER.ECOMMERCE_NO')}
						</dt>
						<dd className={clsx('intl', FontBodyLgClasses[locale])}>
							{t('FOOTER.KORAIL_ECOMMERCE_NO')}
						</dd>
					</dl>
				</div>
				<div className={'w-full max-w-[218px]'}>
					<Select
						size={'md'}
						options={data?.siteOptions || []}
						placeholder={t('FOOTER.FAMILY_SITE')}
						transYDirection={'up'}
						id={'linked-site'}
						value={null}
						onSelect={(option) => fncCallbackEvent('goSite', option)}
					/>
				</div>
			</div>
			<div className={'flex flex-row'}>
				{
					policyOptions.filter(el => el.type !== 'svcMkt' && !el.hide && el.intlName)?.map((policy, index) => (
						<div key={policy.type} className={'flex flex-row items-center'}>
							{
								index > 0 && (
									<div className={'divider-policy'}/>
								)
							}
							<button className={clsx('button-policy-intl', FontBodyLgClasses[locale])}
							        aria-label={`${t('FOOTER.MOVE')}: ${policy.label}`}
							        onClick={() => fncCallbackEvent('goTerms', policy)}>
								{t(policy.intlName)}
							</button>
						</div>
					))
				}
			</div>
			<p className={clsx('copyright-intl', FontBodySmClasses[locale])}>
				{`Copyright ©${moment().year()} KOREA RAILROAD. All Rights Reserved.`}
			</p>
		</div>
	);
}

/**
 * @description: Mobile
 * @screenID:    -
 */
MoIntlFooter.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function MoIntlFooter({data, fncCallbackEvent}) {
	
	const t = useTranslations();
	const locale = useLocale();
	
	return (
		<div className={'inner-wrap'}>
			<div className={'flex flex-col justify-between gap-20 wide:flex-row'}>
				<div className={'flex flex-col gap-12'}>
					<div className={'flex flex-row gap-6'} aria-label={t('FOOTER.CS_CENTER')}>
						<div aria-hidden={true}>
							<CSCenter color={'text-dynamic-icon-neutral-primary'}/>
						</div>
						<p className={clsx('cs-title-intl', FontBodyXlClasses[locale])}>
							{t('FOOTER.CS_CENTER')}{' '}
							<a href={'tel:15887788'}
							   className={'text-dynamic-text-brand-primary font-medium ml-13'}>
								1588-7788
							</a>
						</p>
					</div>
					<dl className={'flex-col'}>
						<dt className={clsx('intl', FontBodyMdClasses[locale])}>
							{t('FOOTER.KORAIL_COMPANY')}
						</dt>
						<dd className={clsx('intl', FontBodyMdClasses[locale])}>
							{t('FOOTER.KORAIL_ADDRESS')}
						</dd>
					</dl>
					<dl>
						<dt className={clsx('intl', FontBodyMdClasses[locale])}>
							{t('FOOTER.CEO')}
						</dt>
						<dd className={clsx('intl', FontBodyMdClasses[locale])}>
							{t('FOOTER.KORAIL_CEO')}
						</dd>
					</dl>
					<dl>
						<dt className={clsx('intl', FontBodyMdClasses[locale])}>
							{t('FOOTER.BUSINESS_NO')}
						</dt>
						<dd className={clsx('intl', FontBodyMdClasses[locale])}>
							318-82-10024
						</dd>
					</dl>
					<dl>
						<dt className={clsx('intl', FontBodyMdClasses[locale])}>
							{t('FOOTER.ECOMMERCE_NO')}
						</dt>
						<dd className={clsx('intl', FontBodyMdClasses[locale])}>
							{t('FOOTER.KORAIL_ECOMMERCE_NO')}
						</dd>
					</dl>
				</div>
				<div className={'w-full max-w-[218px]'}>
					<Select
						size={'sm'}
						options={data?.siteOptions || []}
						placeholder={t('FOOTER.FAMILY_SITE')}
						id={'linked-site'}
						value={null}
						onSelect={(option) => fncCallbackEvent('goSite', option)}
					/>
				</div>
			</div>
			<div className={'flex flex-row'}>
				{
					policyOptions.filter(el => el.type !== 'svcMkt' && !el.hide && el.intlName)?.map((policy, index) => (
						<div key={policy.type} className={'flex flex-row items-center'}>
							{
								index > 0 && (
									<div className={'divider-policy'}/>
								)
							}
							<button className={clsx('button-policy-intl', FontBodyMdClasses[locale])}
							        aria-label={`${t('FOOTER.MOVE')}: ${policy.label}`}
							        onClick={() => fncCallbackEvent('goTerms', policy)}>
								{t(policy.intlName)}
							</button>
						</div>
					))
				}
			</div>
			<p className={clsx('copyright-intl', FontBodyXsClasses[locale])}>
				{`Copyright ©${moment().year()} KOREA RAILROAD. All Rights Reserved.`}
			</p>
		</div>
	)
}
