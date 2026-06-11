'use client'

import React from 'react';
import {useLocale, useTranslations} from 'next-intl';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Image from 'next/image';

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {IntlGuideTable} from '@modules/consants/IntlGuide';

// assets
import {Korail} from '@assets/icons/IntlSvgs';
import {
	FontBody2xlClasses, FontBody3xlClasses, FontBodyLgClasses, FontBodyMdClasses, FontBodyXlClasses, FontBodyXsClasses,
	FontHeading3xlClasses, FontHeadingLgClasses, FontHeadingMdClasses, FontHeadingXlClasses, FontLabelMdClasses,
	FontLabelXlClasses
} from '@/styles/intlFontSizeClasses';
import {ChevronRight} from '@assets/icons/Svgs';
import process01Image from '@assets/images/intl_process_01.png';
import process02Image from '@assets/images/intl_process_02.png';
import process03Image from '@assets/images/intl_process_03.png';
import flagImage from '@assets/images/flag.webp';


/**
 * @description: 다국어 레일플러스 소개 화면 입니다.
 * @screenID:    UI-CRM-F279
 * @screenPath:  홈 > 다국어 > 레일플러스 소개
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function IntlHowToUse() {
	
	const {isMobile} = useScreenSizeContext();

	if (isMobile) return <MoIntlHowToUse />
	else return <DtIntlHowToUse />
	
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F279
 */
DtIntlHowToUse.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function DtIntlHowToUse({data, fncCallbackEvent}) {
	
	const t = useTranslations();
	const locale = useLocale();
	
	const renderTable = (table) => {
		return (
			<dl key={table.id}>
				<dt className={FontBody3xlClasses[locale]}>
					{t(table.name)}
				</dt>
				<dd>
					{
						table.items.map((item) => {
							return (
								<div key={item.id}>
									<div className={'image-box'}>{item.image}</div>
									<p className={FontLabelXlClasses[locale]}>{t(item.label)}</p>
								</div>
							)
						})
					}
				
				</dd>
			</dl>
		)
	}
	
	const renderDetails = ({color, gap, fontSize, list}) => {
		return (
			<>
				{
					list.map((item) => (
						<div key={item.id} className={clsx('detail-wrap', color, gap, fontSize)} >
							<p>{`\u00B7`}</p>
							<p>{t(item.message)}</p>
						</div>
					))
				}
			</>
		)
	}
	
	return (
		<main id={'intlHowToUse'} aria-labelledby={'page-name-dt'}>
			<h1 id={'page-name-dt'} className={'sr-only'}>
				{t('GNB.HOW_TO_USE')}
			</h1>
			<div className={'hero-image-wrap intl-bg-image-dt'}>
				<div className={'body-wrap-618 flex-col-center justify-around'}>
					<div className={clsx('welcome-wrap', FontBodyMdClasses[locale])}>
						<p>{t('HOW_TO_USE_PAGE.WELCOME_TO_KOREA_START')}</p>
						<Image
							className={'emoji-flag'}
							src={flagImage}
							alt={`${t('HOW_TO_USE_PAGE.PROCESS_01')} ${t('HOW_TO_USE_PAGE.IMAGE')}`}
						/>
						<p>{t('HOW_TO_USE_PAGE.WELCOME_TO_KOREA_END')}</p>
					</div>
					<div className={'catchphrase-wrap'}>
						<p className={FontHeading3xlClasses[locale]}>
							{t('HOW_TO_USE_PAGE.CATCHPHRASE')}
						</p>
						<p className={FontBody2xlClasses[locale]}>
							{t('HOW_TO_USE_PAGE.CATCHPHRASE_DETAIL')}
						</p>
					</div>
					<Korail />
				</div>
			</div>
			<div className={'body-wrap-832 body-inner-warp'}>
				<div role={'group'} aria-label={t('HOW_TO_USE_PAGE.USABLE_SERVICE')}>
					<p className={clsx('title', FontHeadingLgClasses[locale])}>
						{t('HOW_TO_USE_PAGE.USABLE_SERVICE')}
					</p>
					<div className={'table-wrap'}>
						{
							IntlGuideTable['USABLE_SERVICE'].map((table) => renderTable(table))
						}
					</div>
				</div>
				<div role={'group'} aria-label={t('HOW_TO_USE_PAGE.RECHARGE')}>
					<p className={clsx('title', FontHeadingLgClasses[locale])}>
						{t('HOW_TO_USE_PAGE.RECHARGE')}
					</p>
					{
						renderDetails({
							color: 'text-dynamic-text-info-primary',
							gap: 4,
							fontSize: FontBodyLgClasses[locale],
							list: [{id: 'recharge_01', message: 'HOW_TO_USE_PAGE.RECHARGE_SUB_01'}]
						})
					}
					<div className={'table-wrap'}>
						{
							IntlGuideTable['RECHARGE'].map((table) => renderTable(table))
						}
					</div>
				</div>
				<div role={'group'} aria-label={t('HOW_TO_USE_PAGE.REFUND')}>
					<p className={clsx('title', FontHeadingLgClasses[locale])}>
						{t('HOW_TO_USE_PAGE.REFUND')}
					</p>
					{
						renderDetails({
							color: 'text-dynamic-text-info-primary',
							gap: 4,
							fontSize: FontBodyLgClasses[locale],
							list: [
								{id: 'refund_01', message: 'HOW_TO_USE_PAGE.REFUND_SUB_01'},
								{id: 'refund_02', message: 'HOW_TO_USE_PAGE.REFUND_SUB_02'},
								{id: 'refund_03', message: 'HOW_TO_USE_PAGE.REFUND_SUB_03'}
							]
						})
					}
					<div className={'table-wrap'}>
						{
							IntlGuideTable['REFUND'].map((table) => renderTable(table))
						}
					</div>
				</div>
				<div role={'group'} aria-label={t('HOW_TO_USE_PAGE.DISCOUNT_FOR_YOUTH_AND_CHILD')}>
					<p className={clsx('title', FontHeadingLgClasses[locale])}>
						{t('HOW_TO_USE_PAGE.DISCOUNT_FOR_YOUTH_AND_CHILD')}
					</p>
					<div className={'table-wrap process-wrap'}>
						<div>
							<div className={'image-box'}>
								<Image
									src={process01Image}
							        alt={`${t('HOW_TO_USE_PAGE.PROCESS_01')} ${t('HOW_TO_USE_PAGE.IMAGE')}`}
								/>
							</div>
							<p className={FontBody2xlClasses[locale]}>
								{t('HOW_TO_USE_PAGE.PROCESS_01')}
							</p>
						</div>
						<div className={'arrow-wrap'}>
							<ChevronRight
								width={32} height={32}
								color={'text-dynamic-icon-neutral-primary'}
							/>
						</div>
						<div>
							<div className={'image-box'}>
								<Image
									src={process02Image}
									alt={`${t('HOW_TO_USE_PAGE.PROCESS_02')} ${t('HOW_TO_USE_PAGE.IMAGE')}`}
								/>
							</div>
							<p className={FontBody2xlClasses[locale]}>
								{t('HOW_TO_USE_PAGE.PROCESS_02')}
							</p>
						</div>
						<div className={'arrow-wrap'}>
							<ChevronRight
								width={32} height={32}
								color={'text-dynamic-icon-neutral-primary'}
							/>
						</div>
						<div>
							<div className={'image-box'}>
								<Image
									src={process03Image}
									alt={`${t('HOW_TO_USE_PAGE.PROCESS_03')} ${t('HOW_TO_USE_PAGE.IMAGE')}`}
									style={{width: '100%', height: '100%'}}
								/>
							</div>
							<p className={FontBody2xlClasses[locale]}>
								{t('HOW_TO_USE_PAGE.PROCESS_03')}
							</p>
						</div>
					</div>
					{
						renderDetails({
							color: 'text-dynamic-text-neutral-primary',
							gap: 6,
							fontSize: FontBody2xlClasses[locale],
							list: [
								{id: 'discount_01', message: 'HOW_TO_USE_PAGE.DISCOUNT_FOR_SUB_01'},
								{id: 'discount_02', message: 'HOW_TO_USE_PAGE.DISCOUNT_FOR_SUB_02'}
							]
						})
					}
				</div>
			</div>
		</main>
	)
}

/**
 * @description: Mobile
 * @screenID:    -
 */
MoIntlHowToUse.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function MoIntlHowToUse({data, fncCallbackEvent}) {
	
	const t = useTranslations();
	const locale = useLocale();
	
	const renderTable = (table) => {
		return (
			<dl key={table.id}>
				<dt className={FontBody3xlClasses[locale]}>
					{t(table.name)}
				</dt>
				<dd>
					{
						table.items.map((item) => {
							return (
								<div key={item.id}>
									<div className={'image-box'}>{item.image}</div>
									<p className={FontLabelMdClasses[locale]}>{t(item.label)}</p>
								</div>
							)
						})
					}
				
				</dd>
			</dl>
		)
	}
	
	const renderDetails = ({color, gap, fontSize, list}) => {
		return (
			<>
				{
					list.map((item) => (
						<div key={item.id} className={clsx('detail-wrap', color, gap, fontSize)} >
							<p>{`\u00B7`}</p>
							<p>{t(item.message)}</p>
						</div>
					))
				}
			</>
		)
	}
	
	return (
		<main id={'intlHowToUse'}
		      className={'body-wrap-mobile'}
		      aria-labelledby={'page-name-mo'}
		      style={{padding: 0}}
		>
			<h1 id={'page-name-mo'} className={'sr-only'}>
				{t('GNB.HOW_TO_USE')}
			</h1>
			<div className={'hero-image-wrap intl-bg-image-mo'}>
				<div className={'flex-col-center justify-around'} >
					<div className={clsx('welcome-wrap', FontBodyXsClasses[locale])}>
						<p>{t('HOW_TO_USE_PAGE.WELCOME_TO_KOREA_START')}</p>
						<Image
							className={'emoji-flag'}
							src={flagImage}
							alt={`${t('HOW_TO_USE_PAGE.PROCESS_01')} ${t('HOW_TO_USE_PAGE.IMAGE')}`}
						/>
						<p>{t('HOW_TO_USE_PAGE.WELCOME_TO_KOREA_END')}</p>
					</div>
					<div className={'catchphrase-wrap'}>
						<p className={FontHeadingXlClasses[locale]}>
							{t('HOW_TO_USE_PAGE.CATCHPHRASE')}
						</p>
						<p className={FontBodyMdClasses[locale]}>
							{t('HOW_TO_USE_PAGE.CATCHPHRASE_DETAIL')}
						</p>
					</div>
					<Korail width={54} height={13.5} />
				</div>
			</div>
			<div className={'body-inner-warp'}>
				<div role={'group'} aria-label={t('HOW_TO_USE_PAGE.USABLE_SERVICE')}>
					<p className={clsx('title', FontHeadingMdClasses[locale])}>
						{t('HOW_TO_USE_PAGE.USABLE_SERVICE')}
					</p>
					<div className={'table-wrap'}>
						{
							IntlGuideTable['USABLE_SERVICE'].map((table) => renderTable(table))
						}
					</div>
				</div>
				<div role={'group'} aria-label={t('HOW_TO_USE_PAGE.RECHARGE')}>
					<p className={clsx('title', FontHeadingMdClasses[locale])}>
						{t('HOW_TO_USE_PAGE.RECHARGE')}
					</p>
					{
						renderDetails({
							color: 'text-dynamic-text-info-primary',
							gap: 6,
							fontSize: FontBodyMdClasses[locale],
							list: [{id: 'recharge_01', message: 'HOW_TO_USE_PAGE.RECHARGE_SUB_01'}]
						})
					}
					<div className={'table-wrap'}>
						{
							IntlGuideTable['RECHARGE'].map((table) => renderTable(table))
						}
					</div>
				</div>
				<div role={'group'} aria-label={t('HOW_TO_USE_PAGE.REFUND')}>
					<p className={clsx('title', FontHeadingMdClasses[locale])}>
						{t('HOW_TO_USE_PAGE.REFUND')}
					</p>
					{
						renderDetails({
							color: 'text-dynamic-text-info-primary',
							gap: 6,
							fontSize: FontBodyMdClasses[locale],
							list: [
								{id: 'refund_01', message: 'HOW_TO_USE_PAGE.REFUND_SUB_01'},
								{id: 'refund_02', message: 'HOW_TO_USE_PAGE.REFUND_SUB_02'},
								{id: 'refund_03', message: 'HOW_TO_USE_PAGE.REFUND_SUB_03'}
							]
						})
					}
					<div className={'table-wrap'}>
						{
							IntlGuideTable['REFUND'].map((table) => renderTable(table))
						}
					</div>
				</div>
				<div role={'group'} aria-label={t('HOW_TO_USE_PAGE.DISCOUNT_FOR_YOUTH_AND_CHILD')}>
					<p className={clsx('title', FontHeadingMdClasses[locale])}>
						{t('HOW_TO_USE_PAGE.DISCOUNT_FOR_YOUTH_AND_CHILD')}
					</p>
					<div className={'table-wrap process-wrap'}>
						<div>
							<Image
								src={process01Image}
								className={'image-box'}
								alt={`${t('HOW_TO_USE_PAGE.PROCESS_01')} ${t('HOW_TO_USE_PAGE.IMAGE')}`}
							/>
							<p className={FontBody2xlClasses[locale]}>
								{t('HOW_TO_USE_PAGE.PROCESS_01')}
							</p>
						</div>
						<div>
							<Image
								src={process02Image}
								className={'image-box'}
								alt={`${t('HOW_TO_USE_PAGE.PROCESS_02')} ${t('HOW_TO_USE_PAGE.IMAGE')}`}
							/>
							<p className={FontBody2xlClasses[locale]}>
								{t('HOW_TO_USE_PAGE.PROCESS_02')}
							</p>
						</div>
						<div>
							<Image
								src={process03Image}
								className={'image-box'}
								alt={`${t('HOW_TO_USE_PAGE.PROCESS_03')} ${t('HOW_TO_USE_PAGE.IMAGE')}`}
							/>
							<p className={FontBody2xlClasses[locale]}>
								{t('HOW_TO_USE_PAGE.PROCESS_03')}
							</p>
						</div>
					</div>
					{
						renderDetails({
							color: 'text-dynamic-text-neutral-primary',
							gap: 6,
							fontSize: FontBodyXlClasses[locale],
							list: [
								{id: 'discount_01', message: 'HOW_TO_USE_PAGE.DISCOUNT_FOR_SUB_01'},
								{id: 'discount_02', message: 'HOW_TO_USE_PAGE.DISCOUNT_FOR_SUB_02'}
							]
						})
					}
				</div>
			</div>
		</main>
	)
}


