'use client'

import React, {useState} from "react";
import {useLocale, useTranslations} from 'next-intl';
import PropTypes from "prop-types";
import clsx from "clsx";
import {useMutation} from "@tanstack/react-query";
import moment from "moment/moment";

// modules
import {useRouter} from '@/i18n/navigation';
import {useScreenSizeContext} from "@modules/context/ScreenContext";
import {useLoadingContext} from "@modules/context/LoadingContext";
import {useScrollContext} from "@modules/context/ScrollContext";
import {usePopContext} from "@modules/context/PopContext";
import {useApi} from "@modules/services/useApi";
import {CODE} from "@modules/consants/Objects";
import {apiDelDiscountMinor, apiViewDiscount} from "@/app/_actions/mypage.action";
import {fncValiState, validate, VALIDATE_RULES} from "@modules/utils/ValidateUtils";
import {fncMaskCardNo} from "@modules/utils/StringUtils";
import {useUserContext} from "@modules/context/UserContext";

// components
import IntlBreadcrumb from "@components/intl/IntlBreadcrumb";
import IntlCommentInfo from "@components/intl/IntlCommentInfo";
import Button from "@components/common/Button";
import InputText from "@components/common/InputText";
import IntlQueryDiscountMinor from "@/app/(intl)/[locale]/discount/inquiry/components/IntlQueryDiscountMinor";

// assets
import {
	FontButtonMdClasses,
	FontButtonSmClasses,
	FontHeading3xlClasses,
	FontHeadingLgClasses
} from "@/styles/intlFontSizeClasses";


/**
 * @description: 다국어 비회원 어린이/청소년 조회 화면 입니다.
 * @screenID:    UI-CRM-F261-01, UI-CRM-F258-01, UI-CRM-F263
 * @screenPath:  홈 > 다국어 > 비회원 어린이/청소년 조회
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function IntlDiscountInquiry() {

	const t = useTranslations();
	const currentLocale = useLocale();
	const router = useRouter();
	const {isMobile} = useScreenSizeContext();
	const {fncScrollToTop} = useScrollContext();
	const {fncShowPop, fncClosePop} = usePopContext();
	const {jsonApiAction} = useApi();
	const {fncRouteStart} = useLoadingContext();
	const {fncEncode} = useUserContext();

	// 파라미터
	const [valid, setValid] = useState({});
	const [params, setParams] = useState({
		dscntAplySe: CODE.DC_MINOR,
		cardNoEncpt: '',
		custBrdt: '',
	});

	// 조회
	const [dscntDetail, setDscntDetail] = useState(null);

	// --Api
	// 조회
	const {mutate: mutQueryGlobalDiscountMinor} = useMutation({
		mutationKey: ['mutQueryGlobalDiscountMinor'],
		mutationFn: (payload) => jsonApiAction(apiViewDiscount, {...payload, __localHandle: true}),
		onSuccess: (res) => {
			if(res.length > 0) {
				setDscntDetail(res[0])
			} else {
				fncShowPop({
					mainText: t('INQUIRY_PAGE.NO_REGISTERED'),
					primaryText: t('BUTTON.CONFIRM'),
					onClickPrimary: () => fncClosePop(),
				});
			}
			if(!isMobile) fncScrollToTop();
		},
		onError: (error) => {
			fncShowPop({
				mainText: t('INQUIRY_PAGE.NO_REGISTERED'),
				primaryText: t('BUTTON.CONFIRM'),
				onClickPrimary: () => fncClosePop(),
			});
		}
	})

	// 해지
	const {mutate: mutDelGlobalDiscountMinor} = useMutation({
		mutationKey: ['mutDelGlobalDiscountMinor'],
		mutationFn: (payload) => jsonApiAction(apiDelDiscountMinor, {...payload, __localHandle: true}),
		onSuccess: (res) => {
			fncShowPop({
				mainText: t('COMPLETED_PAGE.COMPLETED'),
				primaryText: t('BUTTON.CONFIRM'),
				onClickPrimary: () => {
					fncClosePop();
					fncGoBack();
				}
			})
		},
		onError: () => {
			fncShowPop({
				mainText: t('COMPLETED_PAGE.ERROR_DELETE'),
				primaryText: t('BUTTON.CONFIRM'),
				onClickPrimary: () => fncClosePop()
			})
		}
	})

	// 값 체크 제거
	const fncDelValid = (key) => {
		if(!key) return;
		setValid(prev => {
			const base = prev ?? {}
			return Object.fromEntries(
				Object.entries(base).filter(([k]) => k !== key)
			)
		});
	}

	// 입력
	const fncChangeInput = (e) => {
		if(Object.keys(valid).length) fncDelValid(e.target.id);
		setParams({
			...params,
			[e.target.id]: e.target.value
		})
	}

	// 카드 조회
	const fncSearch = async () => {
		const rules = {
			cardNoEncpt: [
				{type: VALIDATE_RULES.CARD_NO},
			],
			custBrdt: [
				{type: VALIDATE_RULES.NUMERIC},
				{type: VALIDATE_RULES.MIN_LENGTH, value: 8},
				{type: VALIDATE_RULES.MAX_LENGTH, value: 8},
				{type: VALIDATE_RULES.MIN_AGE, value: 6},
				{type: VALIDATE_RULES.MAX_AGE, value: 18}
			]
		}

		const res = validate(params, rules);
		if(Object.keys(res).length === 0) {
			const encoded = await fncEncode(params.cardNoEncpt);
			if(!encoded) return;
			mutQueryGlobalDiscountMinor({
				cardNoEncpt: encoded,
				custBrdt: params.custBrdt
			})
		} else {
			setValid(res);
			fncScrollToTop();
		}
	}

	// 팝업
	const fncShowDelCheckPop = () => {
		fncShowPop({
			mainText: t('COMPLETED_PAGE.WANNA_CANCEL_TITLE'),
			description: t('COMPLETED_PAGE.WANNA_CANCEL_DESCRIPTION'),
			tertiaryText: t('BUTTON.CANCEL'),
			onClickTertiary: () => fncClosePop(),
			warningText: t('BUTTON.UNREGISTER'),
			onClickWarning: () => {
				fncClosePop();
				fncDeleteCard();
			}
		})
	}

	// 카드 해지
	const fncDeleteCard = async () => {
		if(!dscntDetail.cardNoEncpt || !dscntDetail.custBrdt) return;
		const encoded = await fncEncode(dscntDetail.cardNoEncpt);
		if(!encoded) return;
		mutDelGlobalDiscountMinor({
			cardNoEncpt: encoded,
			custBrdt: dscntDetail.custBrdt
		})
	}

	// 이동: 이전
	const fncGoBack = () => {
		router.back();
	}

	const fncHandlers = {
		goBack: fncGoBack,
		changeInput: fncChangeInput,
		showDelCheckPop: fncShowDelCheckPop,
		search: fncSearch
	}

	const fncCallbackEvent = (fncName, variable, payload = {}) => {
		const fnc = fncHandlers[fncName];
		if (typeof fnc === 'function') return fnc(variable, payload);
	}

	if (isMobile) return (
		<MoIntlDiscountInquiry
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...params,
				valid,
				result: dscntDetail
			}}
		/>
	);
	else return (
		<DtIntlDiscountInquiry
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...params,
				valid,
				result: dscntDetail,
			}}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F261-01, UI-CRM-F258-01
 */
DtIntlDiscountInquiry.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function DtIntlDiscountInquiry({data, fncCallbackEvent}) {

	const t = useTranslations();
	const locale = useLocale();

	return (
		<main id={'intlDiscount'} aria-labelledby={'page-name-dt'}>
			<div className={'body-wrap-618'}>
				<IntlBreadcrumb paths={[
					t('BREADCRUMB.HOME'),
					t('BREADCRUMB.REGISTER_RAILPLUS_CARD'),
					t('BREADCRUMB.REGISTER_VIEW_DISCOUNT_CARD'),
					t('BREADCRUMB.INQUIRY'),
				]} />
				{
					data.result && Object.keys(data.result).length > 0 ? (
						<IntlQueryDiscountMinor
							fncCallbackEvent={fncCallbackEvent}
							data={data.result}
						/>
					) : (
						<div className={'page-space-intl'}>
							<h1 id={'page-name-dt'} className={clsx('page-title-intl', FontHeading3xlClasses[locale])}>
								{t('INQUIRY_PAGE.PAGE_TITLE')}
							</h1>
							<div className={'input-wrap'}>
								<InputText
									size={'lg'}
									fitWidth={true}
									title={t('INQUIRY_PAGE.CARD_NUMBER')}
									essential={true}
									placeholder={'0000-0000-0000-0000'}
									allows={['num']}
									status={fncValiState('cardNoEncpt', data.valid)}
									message={fncValiState('cardNoEncpt', data.valid) === 'warning' && t('REGISTRATION_PAGE.WARNING_CARD_NUMBER')}
									id={'cardNoEncpt'}
									value={fncMaskCardNo(data.cardNoEncpt)}
									onChange={(e) => fncCallbackEvent('changeInput', e)}
								/>
								<InputText
									size={'lg'}
									fitWidth={true}
									title={t('INQUIRY_PAGE.DATE_OF_BIRTH')}
									essential={true}
									placeholder={`Ex) ${moment().year()}0101 YYYYMMDD`}
									allows={['num']}
									status={fncValiState('custBrdt', data.valid)}
									message={fncValiState('custBrdt', data.valid) === 'warning' && t('REGISTRATION_PAGE.WARNING_DATE_OF_BIRTH')}
									id={'custBrdt'}
									value={data.custBrdt}
									onChange={(e) => fncCallbackEvent('changeInput', e)}
								/>
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
							<div className={'button-wrap'}>
								<Button
									theme={'secondary'}
									size={'xl'}
									text={t('BUTTON.CANCEL')}
									ariaLabel={t('BUTTON.CANCEL')}
									customStyle={clsx('w-full', FontButtonMdClasses[locale])}
									onClick={() => fncCallbackEvent('goBack')}
								/>
								<Button
									theme={'primary'}
									size={'xl'}
									text={t('BUTTON.SEARCH')}
									ariaLabel={t('BUTTON.SEARCH')}
									customStyle={clsx('w-full', FontButtonMdClasses[locale])}
									disabled={!(data?.cardNoEncpt && data.custBrdt)}
									onClick={() => fncCallbackEvent('search')}
								/>
							</div>
						</div>
					)
				}
			</div>
		</main>
	)
}

/**
 * @description: Mobile
 * @screenID:    -
 */
MoIntlDiscountInquiry.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function MoIntlDiscountInquiry({data, fncCallbackEvent}) {

	const t = useTranslations();
	const locale = useLocale();

	return (
		<main id={'intlDiscount'} className={'body-wrap-mobile'} aria-labelledby={'page-name-mo'}>
			{
				data.result && Object.keys(data.result).length > 0 ? (
					<IntlQueryDiscountMinor
						fncCallbackEvent={fncCallbackEvent}
						data={data.result}
					/>
				) : (
					<div className={'body-inner-wrap-mobile-intl'}>
						<h1 id={'page-name-mo'} className={clsx('page-title-intl', FontHeadingLgClasses[locale])}>
							{t('INQUIRY_PAGE.PAGE_TITLE')}
						</h1>
						<div className={'input-wrap'}>
							<InputText
								size={'md'}
								fitWidth={true}
								title={t('INQUIRY_PAGE.CARD_NUMBER')}
								essential={true}
								placeholder={'0000-0000-0000-0000'}
								allows={['num']}
								status={fncValiState('cardNoEncpt', data.valid)}
								message={fncValiState('cardNoEncpt', data.valid) === 'warning' && t('REGISTRATION_PAGE.WARNING_CARD_NUMBER')}
								id={'cardNoEncpt'}
								value={fncMaskCardNo(data.cardNoEncpt)}
								onChange={(e) => fncCallbackEvent('changeInput', e)}
							/>
							<InputText
								size={'md'}
								fitWidth={true}
								title={t('INQUIRY_PAGE.DATE_OF_BIRTH')}
								essential={true}
								placeholder={`Ex) ${moment().year()}0101 YYYYMMDD`}
								allows={['num']}
								status={fncValiState('custBrdt', data.valid)}
								message={fncValiState('custBrdt', data.valid) === 'warning' && t('REGISTRATION_PAGE.WARNING_DATE_OF_BIRTH')}
								id={'custBrdt'}
								value={data.custBrdt}
								onChange={(e) => fncCallbackEvent('changeInput', e)}
							/>
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
						<div className={'button-wrap'}>
							<Button
								theme={'secondary'}
								size={'lg'}
								text={t('BUTTON.CANCEL')}
								ariaLabel={t('BUTTON.CANCEL')}
								customStyle={clsx('w-full', FontButtonSmClasses[locale])}
								onClick={() => fncCallbackEvent('goBack')}
							/>
							<Button
								theme={'primary'}
								size={'lg'}
								text={t('BUTTON.SEARCH')}
								ariaLabel={t('BUTTON.SEARCH')}
								customStyle={clsx('w-full', FontButtonSmClasses[locale])}
								disabled={!(data?.cardNoEncpt && data.custBrdt)}
								onClick={() => fncCallbackEvent('search')}
							/>
						</div>
					</div>
				)
			}
		</main>
	)
}


