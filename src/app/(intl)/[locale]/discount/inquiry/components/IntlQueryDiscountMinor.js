'use client'

import React from 'react';
import {useLocale, useTranslations} from 'next-intl';
import PropTypes from 'prop-types';
import moment from 'moment';
import clsx from 'clsx';

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {fncMaskCardNo} from '@modules/utils/StringUtils';
import {toMomentFrom14} from "@modules/utils/DateUtils";

// components
import IntlCommentInfo from '@components/intl/IntlCommentInfo';
import Button from '@components/common/Button';

// assets
import {
	FontBody2xlClasses,
	FontBodyMdClasses,
	FontButtonMdClasses,
	FontButtonSmClasses,
	FontHeading3xlClasses,
	FontHeadingLgClasses
} from '@/styles/intlFontSizeClasses';
import {ArrowLeft} from "@assets/icons/Svgs";


/**
 * @description: 다국어 비회원 어린이/청소년 조회 결과 컴포넌트입니다.
 * @screenID:    -
 * @screenPath:  -
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
IntlQueryDiscountMinor.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export default function IntlQueryDiscountMinor({data, fncCallbackEvent}) {
	
	const t = useTranslations();
	const locale = useLocale();
	const {isMobile} = useScreenSizeContext();
	
	// 카드명
	const fncCardName = () => {
		if(data?.cardGdsNm?.includes('대중교통안심')) {
			return t('COMPLETED_PAGE.CARD_SAFE_TRANSIT');
		} else {
			return t('COMPLETED_PAGE.CARD_STANDARD');
		}
	}
	
	// 카드 권종 뱃지
	const fncIntlCardUserTypeBadge = () => {
		switch (data?.cardUserTypeCd) {
			case  '01':
				return (
					<div className={clsx('badge', 'bg-dynamic-bg-other-blue-bold', FontBodyMdClasses[locale])}>
						{t('COMPLETED_PAGE.ADULT')}
					</div>
				)
			case  '02':
				return (
					<div className={clsx('badge', 'bg-dynamic-bg-other-orange-bold', FontBodyMdClasses[locale])}>
						{t('COMPLETED_PAGE.CHILD')}
					</div>
				)
			case  '03':
			case  '04':
				return (
					<div className={clsx('badge', 'bg-dynamic-bg-other-violet-bold', FontBodyMdClasses[locale])}>
						{t('COMPLETED_PAGE.YOUTH')}
					</div>
				)
			default: return <div/>
		}
	}
	
	if (isMobile) return (
		<MoIntlQueryDiscountMinor
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...data,
				transCardName: fncCardName(),
				transCardTypeBadge: fncIntlCardUserTypeBadge()
			}}
		/>
	);
	else return (
		<DtIntlQueryDiscountMinor
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...data,
				transCardName: fncCardName(),
				transCardTypeBadge: fncIntlCardUserTypeBadge()
			}}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F263
 */
DtIntlQueryDiscountMinor.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function DtIntlQueryDiscountMinor({data, fncCallbackEvent}) {
	
	const t = useTranslations();
	const locale = useLocale();
	
	return (
		<div className={'page-space-intl'}>
			<button
				className={'back-arrow-wrap'}
				style={{marginTop: 0, marginBlock: 0}}
				aria-label={t('BUTTON.BACK')}
				onClick={() => fncCallbackEvent('goBack')}
				onKeyDown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						fncCallbackEvent('goBack');
					}
				}}
			>
				<div className={'icon-wrap'}>
					<ArrowLeft
						width={16} height={16}
						color={'text-dynamic-icon-neutral-primary'}
					/>
				</div>
				<p>{t('BUTTON.BACK')}</p>
			</button>
			<h1 id={'page-name-dt'} className={clsx('page-title-intl', FontHeading3xlClasses[locale])}>
				{t('COMPLETED_PAGE.PAGE_TITLE')}
			</h1>
			<div className={clsx('table-wrap', FontBody2xlClasses[locale])}>
				<dl>
					<dt>{t('COMPLETED_PAGE.CARD_TYPE')}</dt>
					<dd>{data?.transCardName}</dd>
				</dl>
				<dl>
					<dt>{t('COMPLETED_PAGE.CARD_NUMBER')}</dt>
					<dd className={'flex-row-center gap-8'}>
						{data?.transCardTypeBadge}
						{fncMaskCardNo(data.cardNoEncpt)}
					</dd>
				</dl>
				<dl>
					<dt>{t('COMPLETED_PAGE.DATE_OF_BIRTH')}</dt>
					<dd>{data?.custBrdt ? moment(data?.custBrdt).format('YYYY-MM-DD') : '-'}</dd>
				</dl>
				<dl>
					<dt>{t('COMPLETED_PAGE.REGISTRATION_DATE')}</dt>
					<dd>{data?.regDt ? moment(toMomentFrom14(data?.regDt)).format('YYYY-MM-DD') : '-'}</dd>
				</dl>
			</div>
			<div className={'comment-wrap'}>
				<IntlCommentInfo
					title={t('COMMENT.NOTICE')}
					list={[
						{
							id: 'd-0', textColor: 'text-dynamic-text-neutral-secondary',
							message: (
								<span><span
									className={'text-dynamic-text-neutral-primary'}>{t('COMMENT.NOTICE_01_01')}</span>{t('COMMENT.NOTICE_01_02')}</span>
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
			<div className={'page-bottom-button-wrap'}>
				<Button
					theme={'deleteIntl'}
					size={'xl'}
					text={t('BUTTON.CANCEL_REGISTRATION')}
					ariaLabel={t('BUTTON.CANCEL_REGISTRATION')}
					customStyle={clsx('w-[240px]', FontButtonMdClasses[locale])}
					onClick={() => fncCallbackEvent('showDelCheckPop')}
				/>
			</div>
		</div>
	)
}

/**
 * @description: Mobile
 * @screenID:    -
 */
MoIntlQueryDiscountMinor.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};

export function MoIntlQueryDiscountMinor({data, fncCallbackEvent}) {

	const t = useTranslations();
	const locale = useLocale();

	return (
		<div className={'body-inner-wrap-mobile-intl'}>
			<h1 id={'page-name-mo'} className={clsx('page-title-intl', FontHeadingLgClasses[locale])}>
				{t('COMPLETED_PAGE.PAGE_TITLE')}
			</h1>
			<div className={clsx('table-wrap', FontBodyMdClasses[locale])}>
				<dl>
					<dt>{t('COMPLETED_PAGE.CARD_TYPE')}</dt>
					<dd>{data?.transCardName}</dd>
				</dl>
				<dl>
					<dt>{t('COMPLETED_PAGE.CARD_NUMBER')}</dt>
					<dd className={'flex-row-center gap-8 mo:justify-end'}>
						{data?.transCardTypeBadge}
						{fncMaskCardNo(data.cardNoEncpt)}
					</dd>
				</dl>
				<dl>
					<dt>{t('COMPLETED_PAGE.DATE_OF_BIRTH')}</dt>
					<dd>{data?.custBrdt ? moment(data?.custBrdt).format('YYYY-MM-DD') : '-'}</dd>
				</dl>
				<dl>
					<dt>{t('COMPLETED_PAGE.REGISTRATION_DATE')}</dt>
					<dd>{data?.regDt ? moment(toMomentFrom14(data?.regDt)).format('YYYY-MM-DD') : '-'}</dd>
				</dl>
			</div>
			<div className={'comment-wrap'}>
				<IntlCommentInfo
					title={t('COMMENT.NOTICE')}
					list={[
						{
							id: 'd-0', textColor: 'text-dynamic-text-neutral-secondary',
							message: (
								<span><span
									className={'text-dynamic-text-neutral-primary'}>{t('COMMENT.NOTICE_01_01')}</span>{t('COMMENT.NOTICE_01_02')}</span>
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
			<div className={'page-bottom-button-wrap'}>
				<Button
					theme={'deleteIntl'}
					size={'lg'}
					text={t('BUTTON.CANCEL_REGISTRATION_WITH_LINEBREAK')}
					ariaLabel={t('BUTTON.CANCEL_REGISTRATION_WITH_LINEBREAK')}
					customStyle={clsx('w-full', FontButtonSmClasses[locale])}
					onClick={() => fncCallbackEvent('showDelCheckPop')}
				/>
			</div>
		</div>
	)
}


