'use client'

import React, {useLayoutEffect, useState} from "react";
import {useLocale, useTranslations} from 'next-intl';
import PropTypes from "prop-types";
import moment from "moment";
import clsx from "clsx";
import {useMutation} from "@tanstack/react-query";
import dynamic from "next/dynamic";

// modules
import {useRouter} from '@/i18n/navigation';
import {useScreenSizeContext} from "@modules/context/ScreenContext";
import {useScrollContext} from "@modules/context/ScrollContext";
import {usePopContext} from "@modules/context/PopContext";
import {useApi} from "@modules/services/useApi";
import {apiCreateDiscountMinor} from "@/app/_actions/mypage.action";
import {fncValiState, validate, VALIDATE_RULES} from "@modules/utils/ValidateUtils";
import {fncMaskCardNo} from "@modules/utils/StringUtils";
import {useUserContext} from "@modules/context/UserContext";
import {apiTerms} from '@/app/_actions/common.action';

// components
import IntlBreadcrumb from "@components/intl/IntlBreadcrumb";
import IntlCommentInfo from "@components/intl/IntlCommentInfo";
import Button from "@components/common/Button";
import InputText from "@components/common/InputText";
import TemplateResult from "@components/composite/TemplateResult";
import Checkbox from "@components/common/Checkbox";
import TermsPop from "@components/popup/TermsPop";
import Loading from "@/app/loading";
const ToastViewer = dynamic(() => import('@components/common/Editor'), {
	ssr: false,
	loading: () => <Loading />
})

// assets
import {
	FontBody3xlClasses,
	FontBodyXlClasses,
	FontButtonMdClasses,
	FontButtonSmClasses,
	FontHeading3xlClasses,
	FontHeadingLgClasses
} from "@/styles/intlFontSizeClasses";

// const
const termIdByLocale = {
	'en': process.env.NEXT_PUBLIC_PII_DSCNT_EN,
	'ja': process.env.NEXT_PUBLIC_PII_DSCNT_JA,
	'zh': process.env.NEXT_PUBLIC_PII_DSCNT_ZH,
}


/**
 * @description: 다국어 비회원 어린이/청소년 등록 및 완료 화면 입니다.
 * @screenID:    UI-CRM-F261, UI-CRM-F276
 * @screenPath:  홈 > 다국어 > 비회원 어린이/청소년 등록 및 완료
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function IntlDiscountRegistration() {

	const t = useTranslations();
	const locale = useLocale();
	const router = useRouter();
	const {isMobile} = useScreenSizeContext();
	const {fncScrollToTop} = useScrollContext();
	const {fncShowPop, fncClosePop} = usePopContext();
	const {jsonApiAction} = useApi();
	const {fncEncode} = useUserContext();

	// 파라미터
	const [valid, setValid] = useState({});
	const [params, setParams] = useState({
		cardNoEncpt: '',
		custBrdt: '',
		agreDscnPii: false,
	});

	// 결과
	const [resCreate, setResCreate] = useState(null);

	// --Api
	// 조회(할인등록 개인정보 수집 및 이용)
	const {mutate: mutQueryDscnPii, data: termDscnPii} = useMutation({
		mutationKey: ['mutQueryDscnPii'],
		mutationFn: (payload) => jsonApiAction(apiTerms, payload)
	})

	// 등록
	const {mutate: mutCreateGlobalDiscountMinor} = useMutation({
		mutationKey: ['mutCreateGlobalDiscountMinor'],
		mutationFn: (payload) => jsonApiAction(apiCreateDiscountMinor, {...payload, __localHandle: true}),
		onSuccess: (res) => {
			if(res?.res > 0) {
				setResCreate(res);
			} else {
				fncShowPop({
					mainText: t('REGISTRATION_PAGE.ALREADY_REGISTERED'),
					primaryText: t('BUTTON.CONFIRM'),
					onClickPrimary: () => fncClosePop(),
				})
			}
		},
		onError: (error) => {
			// [다국어] 등록 실패 유형별
			let errMainText;
			if(error.message.includes('카드번호를 입력')) {
				errMainText = t('REGISTRATION_PAGE.REG_ERR_NEED_CARD_NUM');
			} else if(error.message.includes('TOSS_CRDNO')) {
				errMainText = t('REGISTRATION_PAGE.REG_ERR_NEED_CARD_TOSS');
			} else if(error.message.includes('카드 등록이 불가능한 카드')) {
				errMainText = t('REGISTRATION_PAGE.REG_ERR_NEED_CARD_UNAVAILABLE');
			} else if(error.message.includes('존재하지 않은 카드')) {
				errMainText = t('REGISTRATION_PAGE.REG_ERR_NEED_CARD_NONEXIST');
			} else if(error.message.includes('국가신분증')) {
				errMainText = t('REGISTRATION_PAGE.REG_ERR_NEED_CARD_SAFE');
			} else if(error.message.includes('이미 할인이 등록된') || error.message.includes('이미 등록된')) {
				errMainText = t('REGISTRATION_PAGE.REG_ERR_NEED_CARD_REGISTERED');
			} else if(error.message.includes('아닌 사람')) {
				errMainText = t('REGISTRATION_PAGE.REG_ERR_NEED_CARD_ADULT');
			} else if(error.message.includes('6세 미만의 어린이')) {
				errMainText = t('REGISTRATION_PAGE.REG_ERR_NEED_CARD_UNDER_SIX');
			} else if(error.message.includes('생년월일')) {
				errMainText = t('REGISTRATION_PAGE.REG_ERR_NEED_BIRTH_UNAVAILABLE');
			} else if(error.message.includes('사용이 정지 된 카드')) {
				errMainText = t('REGISTRATION_PAGE.REG_ERR_NEED_CARD_BLOCK');
			} else if(error.message.includes('고객 등록에 실패')) {
				errMainText = t('REGISTRATION_PAGE.REG_ERR_NEED_REG_FAIL');
			} else {
				errMainText = error.message;
			}

			if(errMainText) {
				fncShowPop({
					mainText: errMainText,
					primaryText: t('BUTTON.CONFIRM'),
					onClickPrimary: () => fncClosePop(),
				});
			}
		}
	})

	useLayoutEffect(() => {
		const termId = termIdByLocale[locale];
		if(termId) {
			mutQueryDscnPii({trmsTypeCd: termId});
		}
	}, [locale]);

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

	// 등록/수정
	const fncSave = async () => {
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
			mutCreateGlobalDiscountMinor({
				cardNoEncpt: encoded,
				custBrdt: params.custBrdt
			})
		} else {
			setValid(res);
			fncScrollToTop();
		}
	}

	// 약관 동의 업데이트
	const fncUpdateObj = (obj) => {
		setParams({
			...params,
			...obj
		})
	}

	// 이동: 이전
	const fncGoBack = () => {
		router.back();
	}

	const fncHandlers = {
		goBack: fncGoBack,
		changeInput: fncChangeInput,
		save: fncSave,
		updateObj: fncUpdateObj,
	}

	const fncCallbackEvent = (fncName, variable, payload = {}) => {
		const fnc = fncHandlers[fncName];
		if (typeof fnc === 'function') return fnc(variable, payload);
	}

	if (isMobile) return (
		<MoIntlDiscountRegistration
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...params,
				valid,
				result: resCreate,
				termDscnPii
			}}
		/>
	);
	else return (
		<DtIntlDiscountRegistration
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...params,
				valid,
				result: resCreate,
				termDscnPii
			}}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F261, UI-CRM-F276
 */
DtIntlDiscountRegistration.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function DtIntlDiscountRegistration({data, fncCallbackEvent}) {

	const t = useTranslations();
	const locale = useLocale();

	return (
		<main id={'intlDiscount'} aria-labelledby={'page-name-dt'}>
			<div className={'body-wrap-618'}>
				{
					data.result?.res > 0 ? (
						<TemplateResult
							screen={'desktop'}
							title={t('REGISTRATION_PAGE.SUCCESS_TITLE')}
							subTitle={t('REGISTRATION_PAGE.SUCCESS_DESCRIPTION')}
							animationSrc={require('@assets/animations/register_complete.json')}
						>
							<div className={clsx('table-wrap my-56', FontBody3xlClasses[locale])}>
								<dl>
									<dt>
										{t('REGISTRATION_PAGE.CARD_NUMBER')}
									</dt>
									<dd className={'text-end'}>
										{fncMaskCardNo(data.cardNoEncpt)}
									</dd>
								</dl>
								<dl>
									<dt>
										{t('REGISTRATION_PAGE.REGISTRATION_DATE')}
									</dt>
									<dd className={'text-end'}>
										{moment().format("YYYY-MM-DD")}
									</dd>
								</dl>
							</div>
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
						</TemplateResult>
					) : (
						<>
							<IntlBreadcrumb paths={[
								t('BREADCRUMB.HOME'),
								t('BREADCRUMB.REGISTER_RAILPLUS_CARD'),
								t('BREADCRUMB.REGISTER_VIEW_DISCOUNT_CARD'),
								t('BREADCRUMB.REGISTRATION'),
							]}/>
							<div className={'page-space-intl'}>
								<h1 id={'page-name-dt'}
									className={clsx('page-title-intl', FontHeading3xlClasses[locale])}>
									{t('REGISTRATION_PAGE.PAGE_TITLE')}
								</h1>
								<div className={'input-wrap'}>
									<InputText
										size={'lg'}
										fitWidth={true}
										title={t('REGISTRATION_PAGE.CARD_NUMBER')}
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
										title={t('REGISTRATION_PAGE.DATE_OF_BIRTH')}
										essential={true}
										placeholder={`Ex) ${moment().year()}0101 YYYYMMDD`}
										allows={['num']}
										maxLength={8}
										status={fncValiState('custBrdt', data.valid)}
										message={fncValiState('custBrdt', data.valid) === 'warning' && t('REGISTRATION_PAGE.WARNING_DATE_OF_BIRTH')}
										id={'custBrdt'}
										value={data.custBrdt}
										onChange={(e) => fncCallbackEvent('changeInput', e)}
									/>
								</div>
								<div className={'checkbox-wrap'}>
									<Checkbox
										type={'square'}
										label={t('REGISTRATION_PAGE.TERM_PII_TITLE')}
										essentialLabel={t('REGISTRATION_PAGE.TERM_PII_NECESSARY')}
										isChecked={data.agreDscnPii}
										onChange={() => fncCallbackEvent('updateObj', {agreDscnPii: !data.agreDscnPii})}
									/>
									<div className={'term-wrap'}>
										<ToastViewer
											className={'text-dynamic-text-neutral-primary dark:text-dynamic-text-neutral-primary'}
											initialValue={data?.termDscnPii?.trmsDtlCn ?? ''}
										/>
									</div>
								</div>
								<div className={'comment-wrap'}>
									<IntlCommentInfo
										title={t('COMMENT.ELIGIBLE_DISCOUNT')}
										list={[
											{
												id: 'd-0', textColor: 'text-dynamic-text-negative-primary',
												message: t('COMMENT.ELIGIBLE_01'),
											},
											{
												id: 'd-1', textColor: 'text-dynamic-text-negative-primary',
												message: t('COMMENT.ELIGIBLE_02'),
											},
										]}
									/>
									<IntlCommentInfo
										title={t('COMMENT.GUIDE')}
										list={[
											{
												id: 'd-0', textColor: 'text-dynamic-text-neutral-secondary',
												message: t('COMMENT.GUIDE_01')
											},
											{
												id: 'd-1', textColor: 'text-dynamic-text-neutral-primary',
												message: t('COMMENT.GUIDE_02')
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
										text={t('BUTTON.SAVE')}
										ariaLabel={t('BUTTON.SAVE')}
										customStyle={clsx('w-full', FontButtonMdClasses[locale])}
										onClick={() => fncCallbackEvent('save')}
										disabled={!(data.cardNoEncpt && data.custBrdt && data.agreDscnPii)}
									/>
								</div>
							</div>
						</>
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
MoIntlDiscountRegistration.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};

export function MoIntlDiscountRegistration({data, fncCallbackEvent}) {

	const t = useTranslations();
	const locale = useLocale();

	// 팝업: 약관
	const [termId, setTermId] = useState(null);

	// 약관 팝업 열기
	const fncShowTermsPop = () => {
		setTermId('termDscnPii');
	}

	// 약관 팝업 닫기
	const fncCloseTermsPop = () => {
		setTermId(null);
	}

	// 약관 동의하고 팝업 닫기
	const fncAgreeTerms = () => {
		fncCallbackEvent('updateObj', {agreDscnPii: true});
		fncCloseTermsPop();
	}

	return (
		<main id={'intlDiscount'} className={'body-wrap-mobile'} aria-labelledby={'page-name-mo'}>
			{
				data.result?.res > 0 ? (
					<TemplateResult
						screen={'mobile'}
						title={t('REGISTRATION_PAGE.SUCCESS_TITLE')}
						subTitle={t('REGISTRATION_PAGE.SUCCESS_DESCRIPTION')}
						animationSrc={require('@assets/animations/register_complete.json')}
					>
						<div className={clsx('table-wrap my-56', FontBodyXlClasses[locale])}>
							<dl>
								<dt>
									{t('REGISTRATION_PAGE.CARD_NUMBER')}
								</dt>
								<dd className={'text-end'}>
									{fncMaskCardNo(data.cardNoEncpt)}
								</dd>
							</dl>
							<dl>
								<dt>
									{t('REGISTRATION_PAGE.REGISTRATION_DATE')}
								</dt>
								<dd className={'text-end'}>
									{moment().format("YYYY-MM-DD")}
								</dd>
							</dl>
						</div>
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
					</TemplateResult>
				) : (
					<div className={'body-inner-wrap-mobile-intl'}>
						<h1 id={'page-name-mo'} className={clsx('page-title-intl', FontHeadingLgClasses[locale])}>
							{t('REGISTRATION_PAGE.PAGE_TITLE')}
						</h1>
						<div className={'input-wrap'}>
							<InputText
								size={'md'}
								fitWidth={true}
								title={t('REGISTRATION_PAGE.CARD_NUMBER')}
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
								title={t('REGISTRATION_PAGE.DATE_OF_BIRTH')}
								essential={true}
								placeholder={`Ex) ${moment().year()}0101 YYYYMMDD`}
								allows={['num']}
								maxLength={8}
								status={fncValiState('custBrdt', data.valid)}
								message={fncValiState('custBrdt', data.valid) === 'warning' && t('REGISTRATION_PAGE.WARNING_DATE_OF_BIRTH')}
								id={'custBrdt'}
								value={data.custBrdt}
								onChange={(e) => fncCallbackEvent('changeInput', e)}
							/>
						</div>
						<div className={'checkbox-wrap'}>
							<Checkbox
								type={'brand'}
								label={t('REGISTRATION_PAGE.TERM_PII_TITLE')}
								essentialLabel={t('REGISTRATION_PAGE.TERM_PII_NECESSARY')}
								isChecked={data.agreDscnPii}
								onChange={() => fncCallbackEvent('updateObj', {agreDscnPii: !data.agreDscnPii})}
							/>
							<button
								className={'terms'}
								onClick={() => fncShowTermsPop()}
								onKeyDown={(e) => {
									if (e.key === 'Enter') fncShowTermsPop();
								}}>
								보기
							</button>
						</div>
						<div className={'comment-wrap'}>
							<IntlCommentInfo
								title={t('COMMENT.ELIGIBLE_DISCOUNT')}
								list={[
									{
										id: 'd-0', textColor: 'text-dynamic-text-negative-primary',
										message: t('COMMENT.ELIGIBLE_01'),
									},
									{
										id: 'd-1', textColor: 'text-dynamic-text-negative-primary',
										message: t('COMMENT.ELIGIBLE_02'),
									},
								]}
							/>
							<IntlCommentInfo
								title={t('COMMENT.GUIDE')}
								list={[
									{
										id: 'd-0', textColor: 'text-dynamic-text-neutral-secondary',
										message: t('COMMENT.GUIDE_01')
									},
									{
										id: 'd-1', textColor: 'text-dynamic-text-neutral-primary',
										message: t('COMMENT.GUIDE_02')
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
								text={t('BUTTON.SAVE')}
								ariaLabel={t('BUTTON.SAVE')}
								customStyle={clsx('w-full', FontButtonSmClasses[locale])}
								onClick={() => fncCallbackEvent('save')}
								disabled={!(data.cardNoEncpt && data.custBrdt && data.agreDscnPii)}
							/>
						</div>
					</div>
				)
			}

			{
				termId && (
					<TermsPop
						data={data}
						id={termId}
						onClose={fncCloseTermsPop}
						onDone={fncCloseTermsPop}
					/>
				)
			}
		</main>
	)
}


