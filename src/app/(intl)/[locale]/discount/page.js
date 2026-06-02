'use client'

import React, {useLayoutEffect} from 'react';
import {useTranslations, useLocale} from 'next-intl';
import PropTypes from 'prop-types';
import clsx from 'clsx';

// modules
import {redirect, usePathname, useRouter, getPathname} from '@/i18n/navigation';
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {RouteIntlConfig} from '@modules/config/RouteConfig';
import {useLoadingContext} from '@modules/context/LoadingContext';

// components
import IntlBreadcrumb from '@components/intl/IntlBreadcrumb';
import IntlCommentInfo from '@components/intl/IntlCommentInfo';
import Button from '@components/common/Button';

// assets
import {Check, CheckBold, Plus, Search} from '@assets/icons/Svgs';
import {
	FontBody3xlClasses, FontBodyLgClasses, FontBodyMdClasses, FontBodyXlClasses,
	FontButtonMdClasses, FontButtonSmClasses,
	FontHeading3xlClasses, FontHeadingLgClasses, FontHeadingMdClasses, FontHeadingSmClasses
} from '@/styles/intlFontSizeClasses';


/**
 * @description: 다국어 비회원 할인등록 선택 화면 입니다.
 * @screenID:    UI-CRM-F256
 * @screenPath:  홈 > 다국어 > 비회원 할인등록 선택
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function IntlDiscount() {
	
	const router = useRouter();
	const currentLocale = useLocale();
	const {isMobile} = useScreenSizeContext();
	const {fncRouteStart} = useLoadingContext();

	// 이동: 등록
	const fncGoRegister = () => {
		const targetUri = RouteIntlConfig.REGISTRATION.PATH;
		fncRouteStart(targetUri,{locale: currentLocale});
		router.push(targetUri);
	}
	
	// 이동: 조회
	const fncGoSearch = () => {
		const targetUri = RouteIntlConfig.INQUIRY.PATH;
        fncRouteStart(targetUri, {locale: currentLocale});
		router.push(targetUri);
	}
	
	const fncHandlers = {
		goRegister: fncGoRegister,
		goSearch: fncGoSearch
	}
	
	const fncCallbackEvent = (fncName, variable, payload = {}) => {
		const fnc = fncHandlers[fncName];
		if (typeof fnc === 'function') return fnc(variable, payload);
	}
	
	if (isMobile) return (
		<MoIntlDiscount
			fncCallbackEvent={fncCallbackEvent}
			data={{
			}}/>
	);
	else return (
		<DtIntlDiscount
			fncCallbackEvent={fncCallbackEvent}
			data={{
			}}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F256
 */
DtIntlDiscount.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function DtIntlDiscount({data, fncCallbackEvent}) {
	
	const t = useTranslations();
	const locale = useLocale();
	
	return (
		<main id={'intlDiscount'} aria-labelledby={'page-name-dt'}>
			<div className={'body-wrap-618'}>
				<IntlBreadcrumb paths={[
					t('BREADCRUMB.HOME'),
					t('BREADCRUMB.REGISTER_RAILPLUS_CARD'),
					t('BREADCRUMB.REGISTER_VIEW_DISCOUNT_CARD')
				]} />
				<div className={'page-space-intl'}>
					<div>
						<h1 id={'page-name-dt'} className={clsx('page-title-intl', FontHeading3xlClasses[locale])}>
							{t('DISCOUNT_PAGE.PAGE_TITLE')}
						</h1>
						<h2 className={clsx('page-sub-title-intl', FontBody3xlClasses[locale])}>
							{t('DISCOUNT_PAGE.PAGE_SUB_TITLE')}
						</h2>
					</div>
					<div className={'box-wrap'}>
						<p className={clsx('title', FontHeadingMdClasses[locale])}>
							{t('DISCOUNT_PAGE.REGISTER_TITLE')}
						</p>
						<div className={'flex flex-col gap-4'}>
							<div className={'flex-row-center gap-6'}>
								<Check
									width={20} height={20}
									color={'text-dynamic-icon-other-orange'}
								/>
								<span className={clsx('target', FontBodyXlClasses[locale])}>
									{t('DISCOUNT_PAGE.CHILD')}
								</span>
							</div>
							<div className={'flex-row-center gap-6'}>
								<Check
									width={20} height={20}
									color={'text-dynamic-icon-other-orange'}
								/>
								<span className={clsx('target', FontBodyXlClasses[locale])}>
									{t('DISCOUNT_PAGE.TEENAGER')}
								</span>
							</div>
						</div>
						<div className={'button-wrap'}>
							<Button
								theme={'primary'}
								size={'md'}
								text={t('BUTTON.REGISTER')}
								ariaLabel={t('BUTTON.REGISTER')}
								customStyle={clsx('w-full', FontButtonMdClasses[locale])}
								icon={<Plus />}
								iconPosition={'left'}
								onClick={() => fncCallbackEvent('goRegister')}
							/>
							<Button
								theme={'tertiary'}
								size={'md'}
								text={t('BUTTON.VIEW')}
								ariaLabel={t('BUTTON.VIEW')}
								customStyle={clsx('w-full', FontButtonMdClasses[locale])}
								icon={<Search />}
								iconPosition={'left'}
								onClick={() => fncCallbackEvent('goSearch')}
							/>
						</div>
					</div>
					<div className={'comment-wrap'}>
						<IntlCommentInfo
							title={t('COMMENT.NOTICE')}
							list={[
								{
									id: 'd-0', textColor: 'text-dynamic-text-neutral-secondary',
									message: (
										<span><span className={'text-dynamic-text-neutral-primary'}>{t('COMMENT.NOTICE_01_01')}</span>{t('COMMENT.NOTICE_01_02')}</span>
									)
								},
								{
									id: 'd-1', textColor: 'text-dynamic-text-neutral-secondary',
									message: t('COMMENT.NOTICE_02'),
								},
								{
									id: 'd-2', textColor: 'text-dynamic-text-neutral-primary',
									message: t('COMMENT.NOTICE_03'),
								},
							]}
						/>
						<IntlCommentInfo
							title={t('COMMENT.INFORMATION')}
							list={[
								{
									id: 'd-0', textColor: 'text-dynamic-text-neutral-secondary',
									message: t('COMMENT.INFORMATION_01')
								},
								{
									id: 'd-1', textColor: 'text-dynamic-text-neutral-secondary',
									message: t('COMMENT.INFORMATION_02')
								},
								{
									id: 'd-2', textColor: 'text-dynamic-text-neutral-secondary',
									message: t('COMMENT.INFORMATION_03'),
								},
							]}
						/>
					</div>
				</div>
			</div>
		</main>
	)
}

/**
 * @description: Mobile
 * @screenID:    -
 */
MoIntlDiscount.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function MoIntlDiscount({data, fncCallbackEvent}) {
	
	const t = useTranslations();
	const locale = useLocale();
	
	return (
		<main id={'intlDiscount'} className={'body-wrap-mobile'} aria-labelledby={'page-name-mo'}>
			<div className={'body-inner-wrap-mobile-intl'}>
				<div>
					<h1 id={'page-name-mo'} className={clsx('page-title-intl', FontHeadingLgClasses[locale])}>
						{t('DISCOUNT_PAGE.PAGE_TITLE')}
					</h1>
					<h2 className={clsx('page-sub-title-intl', FontBodyLgClasses[locale])}>
						{t('DISCOUNT_PAGE.PAGE_SUB_TITLE')}
					</h2>
				</div>
				<div className={'box-wrap'}>
					<p className={clsx('title', FontHeadingSmClasses[locale])}>
						{t('DISCOUNT_PAGE.REGISTER_TITLE')}
					</p>
					<div className={'flex flex-col gap-4 mo:gap-2'}>
						<div className={'flex-row-center gap-6'}>
							<CheckBold
								width={20} height={20}
								color={'text-dynamic-icon-other-orange'}
							/>
							<span className={clsx('target', FontBodyMdClasses[locale])}>
								{t('DISCOUNT_PAGE.CHILD')}
							</span>
						</div>
						<div className={'flex-row-center gap-6'}>
							<CheckBold
								width={20} height={20}
								color={'text-dynamic-icon-other-orange'}
							/>
							<span className={clsx('target', FontBodyMdClasses[locale])}>
								{t('DISCOUNT_PAGE.TEENAGER')}
							</span>
						</div>
					</div>
					<div className={'button-wrap'}>
						<Button
							theme={'primary'}
							size={'sm'}
							text={t('BUTTON.REGISTER')}
							ariaLabel={t('BUTTON.REGISTER')}
							customStyle={clsx('w-full', FontButtonSmClasses[locale])}
							icon={<Plus />}
							iconPosition={'left'}
							onClick={() => fncCallbackEvent('goRegister')}
						/>
						<Button
							theme={'tertiary'}
							size={'sm'}
							text={t('BUTTON.VIEW')}
							ariaLabel={t('BUTTON.VIEW')}
							customStyle={clsx('w-full', FontButtonSmClasses[locale])}
							icon={<Search />}
							iconPosition={'left'}
							onClick={() => fncCallbackEvent('goSearch')}
						/>
					</div>
				</div>
				<div className={'comment-wrap'}>
					<IntlCommentInfo
						title={t('COMMENT.NOTICE')}
						list={[
							{
								id: 'd-0', textColor: 'text-dynamic-text-neutral-secondary',
								message: (
									<span><span className={'text-dynamic-text-neutral-primary'}>{t('COMMENT.NOTICE_01_01')}</span>{t('COMMENT.NOTICE_01_02')}</span>
								)
							},
							{
								id: 'd-1', textColor: 'text-dynamic-text-neutral-secondary',
								message: t('COMMENT.NOTICE_02'),
							},
							{
								id: 'd-2', textColor: 'text-dynamic-text-neutral-primary',
								message: t('COMMENT.NOTICE_03'),
							},
						]}
					/>
					<IntlCommentInfo
						title={t('COMMENT.INFORMATION')}
						list={[
							{
								id: 'd-0', textColor: 'text-dynamic-text-neutral-secondary',
								message: t('COMMENT.INFORMATION_01')
							},
							{
								id: 'd-1', textColor: 'text-dynamic-text-neutral-secondary',
								message: t('COMMENT.INFORMATION_02')
							},
							{
								id: 'd-2', textColor: 'text-dynamic-text-neutral-secondary',
								message: t('COMMENT.INFORMATION_03'),
							},
						]}
					/>
				</div>
			</div>
		</main>
	)
}


