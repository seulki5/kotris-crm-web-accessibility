'use client'

import React, {useLayoutEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {AnimatePresence, motion} from 'framer-motion';
import {useMutation} from '@tanstack/react-query';
import {useSearchParams} from "next/navigation";
import dynamic from "next/dynamic";

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {RefundReasonOptions} from '@modules/consants/Options';
import {fncMaskComma} from '@modules/utils/NumberUitls';
import {useApi} from '@modules/services/useApi';
import {apiBankList, apiClaimCardList} from '@/app/_actions/mypage.action';
import {CODE} from '@modules/consants/Objects';
import {fncAllDefined, fncValiState} from '@modules/utils/ValidateUtils';
import {useWebContext} from '@modules/context/WebviewContext';
import {apiTerms} from '@/app/_actions/common.action';
import {usePopContext} from '@modules/context/PopContext';
import {fncMaskCardNo} from "@modules/utils/StringUtils";
import {useUserContext} from "@modules/context/UserContext";
import {fncGetBaseUrl} from "@modules/services/api.service";

// components
import Button from '@components/common/Button';
import InputText from '@components/common/InputText';
import InputWithButton from '@components/composite/InputWithButton';
import Select from '@components/common/Select';
import Checkbox from '@components/common/Checkbox';
import FieldTitle from '@components/composite/FieldTitle';
import Textarea from '@components/common/Textarea';
import Tooltip from '@components/common/Tooltip';
import CommentInfo from '@components/composite/CommentInfo';
import TermsPop from "@components/popup/TermsPop";
import PostPop from "@components/popup/PostPop";
import Loading from "@/app/loading";
const ToastViewer = dynamic(() => import('@components/common/Editor'), {
	ssr: false,
	loading: () => <Loading />
})

// assets
import {ExternalLink, HelpCircle, X} from '@assets/icons/Svgs';


/**
 * @description: 환불신청 Step1 화면 입니다.
 * @screenID:    UI-CRM-F232-01, UI-CRM-F467-01
 * @screenPath:  홈 > 마이페이지 > 환불신청
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
CardRefundStep1.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export default function CardRefundStep1({data, fncCallbackEvent}) {

	const searchParams = useSearchParams();
	const cardNo = searchParams.get('no');
	const {isMobile} = useScreenSizeContext();
	const {jsonApiAction} = useApi();
	const {fncShowPop, fncClosePop} = usePopContext();
	const {isLogin} = useUserContext();

	// 은행 목록
	const [refundBankList, setRefundBankList] = useState([]);

	// 카드 목록
	const [refundCardList, setRefundCardList] = useState([]);

	// 주소 검색
	const [isPostPop, setIsPostPop] = useState(false);

	// 다음 단계 이동 가능 여부
	const [blockNext, setBlockNext] = useState(true);

	// 모바일카드
	const [typeMo, setTypeMo] = useState(false);

	// 실물카드
	const [typePla, setTypePla] = useState(false);

	// --Api
	// 환불 은행 목록
	const {mutate: mutQueryBankList} = useMutation({
		mutationKey: ['mutQueryBankList'],
		mutationFn: () => jsonApiAction(apiBankList, {}),
		onSuccess: (res) => {
			if(res?.length) {
				const formMap = res.filter(el => el.comnCdVlCn !== '00')?.map((bank) => ({
					id: bank.comnCdVlCn,
					name: bank.comnCdVlNm
				}))
				setRefundBankList(formMap);
			}
		}
	})

	// 환불 약관 조회
	const {mutate: mutQueryTerms, data: termsRefund} = useMutation({
		mutationKey: ['mutQueryTerms'],
		mutationFn: (payload) => jsonApiAction(apiTerms, payload),
		onError: (error) => {
			fncShowPop({
				mainText: '약관 정보 조회에 실패했습니다.',
				primaryText: '확인',
				onClickPrimary: () => fncClosePop(),
			})
		}
	})

	// 환불 카드 목록
	const {mutate: mutQueryCardList} = useMutation({
		mutationKey: ['mutQueryCardList'],
		mutationFn: () => jsonApiAction(apiClaimCardList, {}),
		onSuccess: (res) => {
			if(res?.length) {
				const formMap = res.map((card) => ({
					...card,
					id: card.cardNoEncpt,
					name: `${fncMaskCardNo(card.cardNoEncpt)} (${card.cardNcknmNm || '레일플러스'})`
				}))
				setRefundCardList(formMap);

				if(cardNo) {
					let find = formMap.filter((el) => el.cardNoEncpt === cardNo)?.[0] || {};
					if(find) fncCallbackEvent('selectCard', find)
				}
			}
		}
	})

	useLayoutEffect(() => {
		if(isLogin) {
			mutQueryBankList();
			mutQueryTerms({trmsTypeCd: process.env.NEXT_PUBLIC_PII_REFUND});
			mutQueryCardList();
		}
	}, [isLogin]);

	useLayoutEffect(() => {
		// 카드 타입 구분
		const cardTypeMo = [CODE.CARD_SEG_MO_PRE, CODE.CARD_SEG_MO_POST].includes(data.selectedCard?.mypgCardSeCd);
		const cardTypePla = [CODE.CARD_SEG_PLA_DEFAULT, CODE.CARD_SEG_PLA_SAFE].includes(data.selectedCard?.mypgCardSeCd);
		if(cardTypeMo) {
			setTypeMo(true);
			setTypePla(false);
		}
		if(cardTypePla) {
			setTypePla(true);
			setTypeMo(false);
		}
	}, [data.selectedCard?.mypgCardSeCd]);

	useLayoutEffect(() => {
		let defined = true;
		// 실물카드
		if(typePla) {
			defined = fncAllDefined([
				data.rqstrNm,
                data.cardNoEncpt,
				data.micBankCd,
				data.bacntOwnrNm,
				data.dpstActnoEncpt,
				data.rqstrTelno,
				data.rfndDmndCd,
                data.zoneCd,
                data.address1,
                data.address2,
                data.refundTerms,
			]);
		}

		// 앱카드
		if(typeMo) {
			defined = fncAllDefined([
				data.cardNoEncpt,
				data.rqstrNm,
				data.micBankCd,
				data.bacntOwnrNm,
				data.dpstActnoEncpt,
			]);
		}

		setBlockNext (!defined);

	}, [data, typeMo, typePla]);

	// 우편번호 검색 팝업
	const fncTogglePost = () => {
		setIsPostPop(!isPostPop);
	}

	if (isMobile) return (
		<MoCardRefundStep1
			fncCallbackEvent={fncCallbackEvent}
			fncTogglePost={fncTogglePost}
			data={{
				...data,
				cardList: refundCardList,
				bankList: refundBankList,
				termsRefund,
				isPostPop,
				blockNext,
				typeMo,
				typePla,
			}}
        />
	);
	else return (
		<DtCardRefundStep1
			fncCallbackEvent={fncCallbackEvent}
			fncTogglePost={fncTogglePost}
			data={{
				...data,
				cardList: refundCardList,
				bankList: refundBankList,
				termsRefund,
				isPostPop,
				blockNext,
				typeMo,
				typePla,
			}}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F232-01
 */
DtCardRefundStep1.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func,
	fncTogglePost: PropTypes.func,
};
export function DtCardRefundStep1({data, fncCallbackEvent, fncTogglePost}) {

	// 툴팁: 총 환불
	const [tooltipTotal, setTooltipTotal] = useState(false);

	// 툴팁: 총 누적 환불
	const [tooltipCumulative, setTooltipCumulative] = useState(false);

	const fncHoverTooltipTotal = () => {
		setTooltipTotal(!tooltipTotal);
	}

	const fncHoverTooltipCumulative = () => {
		setTooltipCumulative(!tooltipCumulative);
	}

	return (
		<>
			<div className={'flex flex-col gap-36 refund-wrap'}>
				<div>
					<p className={'step-title-number'}>
						Step1.
					</p>
					<h2 className={'step-title-text'}>
						환불 신청서를 작성해주세요
					</h2>
				</div>
				<InputText
					size={'lg'}
					fitWidth={true}
					title={'이름'}
					id={'rqstrNm'}
					value={data.rqstrNm}
					disabled={true}
				/>
				<Select
					size={'lg'}
					options={data.cardList}
					title={'카드번호'}
					essential={true}
					placeholder={'카드번호(별칭)를 선택해 주세요'}
					emptyMsg={'선택 가능한 카드'}
					status={fncValiState('cardNoEncpt', data.valid)}
					value={data.cardNoEncpt}
					onSelect={(option) => fncCallbackEvent('selectCard', option)}
				/>
				<Select
					size={'lg'}
					options={data.bankList}
					title={'환불 받을 은행'}
					essential={true}
					placeholder={'환불 받을 은행을 선택해 주세요'}
					status={fncValiState('micBankCd', data.valid)}
					value={data.micBankCd}
					onSelect={(option) => fncCallbackEvent('selectBank', option)}
				/>
				<InputText
					size={'lg'}
					fitWidth={true}
					title={'예금주'}
					essential={true}
					placeholder={'예금주'}
					allows={['alpha']}
					maxLength={6}
					status={fncValiState('bacntOwnrNm', data.valid)}
					message={fncValiState('bacntOwnrNm', data.valid) === 'warning' && '예금주를 다시 입력해주세요.'}
					id={'bacntOwnrNm'}
					value={data.bacntOwnrNm}
					onChange={(e) => fncCallbackEvent('changeInput', e)}
				/>
				<InputText
					size={'lg'}
					fitWidth={true}
					title={'계좌번호'}
					essential={true}
					placeholder={`'-'없이 입력`}
					allows={['num']}
					maxLength={20}
					status={fncValiState('dpstActnoEncpt', data.valid)}
					message={fncValiState('dpstActnoEncpt', data.valid) === 'warning' && '계좌번호를 다시 입력해주세요.'}
					id={'dpstActnoEncpt'}
					value={data.dpstActnoEncpt}
					onChange={(e) => fncCallbackEvent('changeInput', e)}
				/>
				<AnimatePresence initial={false} mode={'wait'}>
					{
						// 실물카드
						data.typePla && (
							<motion.div
								initial={{height: 0, opacity: 0, y: -8}}
								animate={{height: 'auto', opacity: 1, y: 0}}
								exit={{height: 0, opacity: 0, y: -8}}
								transition={{duration: 0.32, ease: 'easeInOut'}}
								style={{overflow: 'hidden'}}
								className={'flex flex-col gap-36'}
							>
								<InputText
									size={'lg'}
									fitWidth={true}
									title={'휴대폰번호'}
									essential={true}
									placeholder={`'-'없이 입력`}
									allows={['num']}
									maxLength={11}
									status={fncValiState('rqstrTelno', data.valid)}
									message={fncValiState('rqstrTelno', data.valid) === 'warning' && '휴대폰번호를 다시 입력해주세요.'}
									id={'rqstrTelno'}
									value={data.rqstrTelno}
									onChange={(e) => fncCallbackEvent('changeInput', e)}
								/>
								<fieldset className={'flex flex-col gap-12'}>
									<legend className={'sr-only'}>주소 입력</legend>
									<InputWithButton
										size={'lg'}
										title={'거주지'}
										essential={true}
										placeholder={'우편번호 검색'}
										maxLength={5}
										inputId={'zoneCd'}
										value={data.zoneCd}
										buttonAriaLabel={'우편번호 검색 팝업 열기'}
										status={fncValiState('zoneCd', data.valid)}
										buttonText={'우편번호 검색'}
										onChangeInput={(e) => fncCallbackEvent('changeInput', e)}
										onClickButton={() => fncTogglePost()}
										onFocus={() => fncTogglePost()}
									/>
									<InputText
										size={'lg'}
										fitWidth={true}
										placeholder={'주소'}
										allows={['alnum', 'kor', 'space', 'dash']}
										maxLength={100}
										status={fncValiState('zoneCd', data.valid)}
										id={'address1'}
										value={data.address1}
										onChange={(e) => fncCallbackEvent('changeInput', e)}
										onFocus={() => {
											if(!data.zoneCd) fncTogglePost();
										}}
									/>
									<InputText
										size={'lg'}
										fitWidth={true}
										placeholder={'상세주소 입력를 입력해주세요.'}
										allows={['alnum', 'kor', 'space', 'dash']}
										maxLength={100}
										status={fncValiState('zoneCd', data.valid)}
										message={fncValiState('zoneCd', data.valid) === 'warning' && '주소를 다시 입력해주세요.'}
										id={'address2'}
										value={data.address2}
										onChange={(e) => fncCallbackEvent('changeInput', e)}
									/>
								</fieldset>
								<fieldset className={'flex flex-col gap-12'}>
									<legend className={'sr-only'}>반환사유 선택</legend>
									<FieldTitle
										title={'반환사유'}
										essential={true}
									/>
									<div className={'grid grid-cols-2 gap-8'}>
										{
											RefundReasonOptions.map((check) => {
												const isChecked = check.id === data.rfndDmndCd;
												return (
													<Checkbox
														key={check.id}
														id={check.id}
														type={'square'}
														label={check.name}
														ariaLabel={`반환사유 선택: ${check.name}`}
														isChecked={isChecked}
														onChange={(checked) => {
															fncCallbackEvent('changeCheckbox', 'rfndDmndCd', check.id)
														}}
													/>
												)
											})
										}
										<div className={'col-span-2'}>
											<Textarea
												size={'lg'}
												placeholder={'기타 상세내용을 작성해 주세요.'}
												maxLength={200}
												disabled={!(data.rfndDmndCd === CODE.REFUND_CLAIM_ETC)}
												status={fncValiState('rfndDmndCn', data.valid)}
												message={fncValiState('rfndDmndCn', data.valid) === 'warning' && '기타 상세내용을 작성해 주세요.'}
												id={'rfndDmndCn'}
												value={data.rfndDmndCn}
												onChange={(e) => fncCallbackEvent('changeInput', e)}
											/>
										</div>
									</div>
								</fieldset>
								<div className={'flex flex-col gap-12'}>
									<Checkbox
										type={'square'}
										label={'반환을 위한 개인정보 수집 및 이용 동의'}
										essentialLabel={'필수'}
										isChecked={data.refundTerms}
										onChange={(checked) => {
											fncCallbackEvent('changeCheckbox', 'refundTerms', checked)
										}}
									/>
									<div className={'term-container'}>
										<ToastViewer
											className={'text-dynamic-text-neutral-primary dark:text-dynamic-text-neutral-primary'}
											initialValue={data.termsRefund?.trmsDtlCn ?? ''}
										/>
									</div>
								</div>
							</motion.div>
						)
					}
					{
						// 앱카드
						data.typeMo && (
							<motion.div
								initial={{ height: 0, opacity: 0 }}
								animate={{ height: 'auto', opacity: 1 }}
								exit={{ height: 0, opacity: 0 }}
								transition={{ duration: 0.4 }}
								className={'my-32'}
							>
								<h2 className={'text-heading-md text-dynamic-text-neutral-primary font-semibold'}>
									환불금액
								</h2>
								<div className={'table-total'}>
									<dl className={'flex-row-center'}>
										<dt>보유금액</dt>
										<dd className={'color-info'}>
											{`${fncMaskComma(data.selectedCard?.blncSum)}원`}
										</dd>
									</dl>
									<dl className={'flex-row-center'}>
										<dt>현금환불 가능금액</dt>
										<dd>{`${fncMaskComma(data.selectedCard?.cashSum)}원`}</dd>
									</dl>
									<dl className={'flex-row-center'}>
										<dt>마일리지 복구금액</dt>
										<dd>{`${fncMaskComma(data.selectedCard?.mlgSum)}원`}</dd>
									</dl>
									<dl className={'flex-row-center'}>
										<dt>환불 수수료</dt>
										<dd className={'color-tertiary'}>
											{`${fncMaskComma(data.selectedCard?.rfndFee)}원`}
										</dd>
									</dl>
									<div className={'divider'} />
									<dl className={'flex-row-center'}>
										<dt className={'bold flex-row-center'}>
											<span>총 환불금액</span>
											<div className={'relative flex items-center'}>
												<button
													onMouseEnter={fncHoverTooltipTotal}
													onMouseLeave={fncHoverTooltipTotal}
													onClick={fncHoverTooltipTotal}
													onKeyDown={(e) => {
														if(e.key === 'Enter' || e.key === ' ') {
															e.preventDefault();
															fncHoverTooltipTotal();
														}
													}}
												>
													<HelpCircle
														width={16} height={16}
														color={'text-dynamic-icon-neutral-secondary'}
													/>
												</button>
												{
													tooltipTotal && (
														<div className='absolute bottom-full -left-[10px] -mb-3 z-3'>
															<Tooltip
																size={'sm'}
																text={'보유금액에서 환불 수수료를 뺀 나머지 금액입니다'}
																direction={'down'}
																position={'start'}
															/>
														</div>
													)
												}
											</div>
										</dt>
										<dd className={'color-alert'}>
											{/* 보유금액 - 환불 수수료 */}
											{`${fncMaskComma(Number(data.selectedCard?.blncSum) - Number(data.selectedCard?.rfndFee))}원`}
										</dd>
									</dl>
									<dl className={'flex-row-center'}>
										<dt className={'flex-row-center'}>
											<span>총 누적 환불금액</span>
											<div className={'relative flex items-center'}>
												<button
													onMouseEnter={fncHoverTooltipCumulative}
													onMouseLeave={fncHoverTooltipCumulative}
													onClick={fncHoverTooltipCumulative}
													onKeyDown={(e) => {
														if(e.key === 'Enter' || e.key === ' ') {
															e.preventDefault();
															fncHoverTooltipCumulative();
														}
													}}
												>
													<HelpCircle
														width={16} height={16}
														color={'text-dynamic-icon-neutral-secondary'}
													/>
												</button>
												{
													tooltipCumulative && (
														<div className='absolute bottom-full -left-[10px] -mb-3 z-3'>
															<Tooltip
																size={'sm'}
																text={'환불신청 1일 1회/월 3회 가능하며\n연 누적 최대 50만원까지 가능합니다'}
																direction={'down'}
																position={'start'}
															/>
														</div>
													)
												}
											</div>
										</dt>
										<dd>
											{/* 연간 누적 환불 금액 + 보유 금액 */}
											{`${fncMaskComma(Number(data.selectedCard?.acmRfndAmt) + Number(data.selectedCard?.blncSum))}원`}
										</dd>
									</dl>
								</div>
								<div className={'mt-48 flex flex-col gap-36'}>
									<CommentInfo
										title={'환불관련 이용안내'}
										list={[
											{
												id: 'd-0', textColor: 'text-dynamic-text-neutral-secondary',
												message: '충전일로부터 7일까지는 환불수수료가 없으나, 7일 이후에는 500원의 환불수수료가 발생합니다.',
											},
											{
												id: 'd-1', textColor: 'text-dynamic-text-neutral-secondary',
												message: '충전금액의 60% 이상(1만원 이하는 80% 이상) 사용한 경우는 환불 수수료가 없습니다.',
											},
											{
												id: 'd-2', textColor: 'text-dynamic-text-neutral-secondary',
												message: '단, 앞선 1~2번의 안내와는 별도로 신용카드로 충전한 경우에는 다음의 기준에 따라 환불수수료가 부과됩니다.',
												subList: [
													{id: 'sub-0', message: '환불 신청금액이 20만원 미만일 경우 환불수수료 500원'},
													{id: 'sub-1', message: '환불 신청금액이 20만원 이상, 40만원 이하일 경우 환불수수료 2%'},
													{id: 'sub-2', message: '환불 신청금액이 40만원 초과일 경우 환불수수료 4%'}
												],
											},
											{
												id: 'd-3', textColor: 'text-dynamic-text-neutral-secondary',
												message: '환불신청 완료 이후에는 취소할 수 없습니다.',
											},
											{
												id: 'd-4', textColor: 'text-dynamic-text-neutral-secondary',
												message: '환불금액은 보유금액에서 KTX 마일리지 복구금액과 환불수수료를 제외한 금액입니다.',
											},
											{
												id: 'd-5', textColor: 'text-dynamic-text-neutral-secondary',
												message: '환불금액 입금은 평균 2~3일 소요(최대 14일)되며, 본인명의(휴대폰 명의)의 입금계좌로 환불됩니다.',
											},
											{
												id: 'd-6', textColor: 'text-dynamic-text-neutral-secondary',
												message: '환불신청은 1일 1회/월 3회 가능하며, 연 누적 최대 50만원까지 가능합니다.',
											}
										]}
									/>
									<CommentInfo
										title={'기타 안내'}
										list={[
											{
												id: 'd-0', textColor: 'text-dynamic-text-neutral-secondary',
												message: '코레일톡에서 KTX 마일리지 자동전환 기능을 이용하는 경우, 환불신청 완료 이후 반드시 자동전환 기능 해지 상태를 확인하여 주시기 바랍니다.',
											},
											{
												id: 'd-1', textColor: 'text-dynamic-text-neutral-secondary',
												message: 'KTX 마일리지로 충전(전환)한 금액은 현금으로 환불되지 않으며, 코레일 멤버쉽 회원 본인의 KTX 마일리지로 복구됩니다.',
											},
											{
												id: 'd-2', textColor: 'text-dynamic-text-neutral-secondary',
												message: '코레일 멤버쉽 회원 탈퇴 시 KTX 마일리지로 복구되지 않습니다.',
											},
											{
												id: 'd-3', textColor: 'text-dynamic-text-neutral-secondary',
												message: '환불금액의 입금계좌 및 예금주가 휴대폰 명의자와 달라서 생기는 문제의 책임은 운영사에 있지 않습니다.',
											},
											{
												id: 'd-4', textColor: 'text-dynamic-text-neutral-secondary',
												message: '환불금액은 보유금액에서 KTX 마일리지 복구금액과 환불수수료를 제외한 금액입니다.',
											}
										]}
									/>
								</div>
							</motion.div>
						)
					}
				</AnimatePresence>
			</div>
			<div className={'page-bottom-button-wrap'}>
				<Button
					theme={'secondary'}
					size={'xl'}
					text={'취소'}
					ariaLabel={'환불 신청 취소'}
					customStyle={'w-[240px]'}
					onClick={() => fncCallbackEvent('goBack')}
				/>
				<Button
					theme={'primary'}
					size={'xl'}
					text={'환불 신청'}
					ariaLabel={'환불 신청'}
					customStyle={'w-[240px]'}
					disabled={data.blockNext}
					onClick={() => fncCallbackEvent('nextStep')}
				/>
			</div>

			{
				// 주소 검색 팝업
				data.isPostPop && (
					<PostPop
						onClose={fncTogglePost}
						onComplete={(post) => {
							fncCallbackEvent('changeAddress', post);
							fncTogglePost();
						}}
					/>
				)
			}
		</>
	)
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F467-01
 */
MoCardRefundStep1.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func,
	fncTogglePost: PropTypes.func
};

export function MoCardRefundStep1({data, fncCallbackEvent, fncTogglePost}) {

	const {isAccApp, fncPostRN} = useWebContext();

	// 툴팁: 총 환불
	const [tooltipTotal, setTooltipTotal] = useState(false);

	// 툴팁: 총 누적 환불
	const [tooltipCumulative, setTooltipCumulative] = useState(false);

	// 팝업: 환불 약관
	const [popTerms, setPopTerms] = useState(false);

	useLayoutEffect(() => {
		let timer;
		if (tooltipTotal) {
			timer = setTimeout(() => {
				setTooltipTotal(false);
			}, 2000)
		}

		return () => {
			timer && clearTimeout(timer);
		}
	}, [tooltipTotal]);

	useLayoutEffect(() => {
		let timer;
		if(tooltipCumulative) {
			timer = setTimeout(() => {
				setTooltipCumulative(false);
			}, 2000)
		}

		return () => {
			timer && clearTimeout(timer);
		}
	}, [tooltipCumulative]);

	// 툴팁 핸들러: 총 합계
	const fncHoverTooltipTotal = () => {
		setTooltipTotal(!tooltipTotal);
	}

	// 툴팁 핸들러: 총 누적 환불 금액
	const fncHoverTooltipCumulative = () => {
		setTooltipCumulative(!tooltipCumulative);
	}

	// 약관 팝업 토글
	const fncToggleTermsPop = () => {
		setPopTerms(!popTerms);
	}

	// App 기본 브라우저로 환불 페이지 열기
	const fncAppOpenUrl = async () => {
		const apiUrl = await fncGetBaseUrl();
		if(apiUrl) {
			fncPostRN({
				id: 'WEB_OPEN_URL',
				uri: `${apiUrl}/login`
			})
		}
	}

	return (
		<div className={'flex flex-col flex-1 justify-between'}>
			<div className={'flex flex-col h-full gap-30 page-bottom-space'}>
				<div>
					<p className={'step-title-number'}>
						Step1.
					</p>
					<h2 className={'step-title-text'}>
						환불 신청서를 작성해주세요
					</h2>
				</div>
				<InputText
					size={'md'}
					fitWidth={true}
					title={'이름'}
					id={'rqstrNm'}
					value={data.rqstrNm}
					disabled={true}
				/>
				<Select
					size={'md'}
					options={data.cardList}
					title={'카드번호'}
					essential={true}
					placeholder={'카드번호(별칭)를 선택해 주세요'}
					emptyMsg={'선택 가능한 카드'}
					status={fncValiState('cardNoEncpt', data.valid)}
					value={data.cardNoEncpt}
					onSelect={(option) => fncCallbackEvent('selectCard', option)}
				/>
				<AnimatePresence mode={'wait'}>
					{
						// PC접속 이거나 모바일 앱(모바일 카드만)
						(!isAccApp || (isAccApp && data.typeMo)) && (
							<motion.div
								key={'refund_ani_section_1'}
								initial={{ height: 0, opacity: 0 }}
								animate={{ height: 'auto', opacity: 1 }}
								exit={{ height: 0, opacity: 0 }}
								transition={{ duration: 0.4 }}
								layout={false}
								style={{
									overflow: 'hidden',
									position: 'relative'
								}}
								className={'flex flex-col gap-36'}
							>
								<Select
									size={'md'}
									options={data.bankList}
									title={'환불 받을 은행'}
									essential={true}
									placeholder={'환불 받을 은행을 선택해 주세요'}
									status={fncValiState('micBankCd', data.valid)}
									value={data.micBankCd}
									onSelect={(option) => fncCallbackEvent('selectBank', option)}
								/>
								<InputText
									size={'md'}
									fitWidth={true}
									title={'예금주'}
									essential={true}
									placeholder={'예금주'}
									allows={['alpha']}
									maxLength={6}
									status={fncValiState('bacntOwnrNm', data.valid)}
									message={fncValiState('bacntOwnrNm', data.valid) === 'warning' && '예금주를 다시 입력해주세요.'}
									id={'bacntOwnrNm'}
									value={data.bacntOwnrNm}
									onChange={(e) => fncCallbackEvent('changeInput', e)}
								/>
								<InputText
									size={'md'}
									fitWidth={true}
									title={'계좌번호'}
									essential={true}
									placeholder={`'-'없이 입력`}
									allows={['num']}
									maxLength={20}
									status={fncValiState('dpstActnoEncpt', data.valid)}
									message={fncValiState('dpstActnoEncpt', data.valid) === 'warning' && '계좌번호를 다시 입력해주세요.'}
									id={'dpstActnoEncpt'}
									value={data.dpstActnoEncpt}
									onChange={(e) => fncCallbackEvent('changeInput', e)}
								/>
							</motion.div>
						)
					}
				</AnimatePresence>
				<AnimatePresence mode={'wait'}>
					{
						// 실물카드
						data.typePla && (
							<motion.div
								key={'refund_ani_section_2'}
								initial={{ height: 0, opacity: 0 }}
								animate={{ height: 'auto', opacity: 1 }}
								exit={{ height: 0, opacity: 0 }}
								transition={{ duration: 0.4 }}
								style={{
									overflow: 'hidden',
									position: 'relative'
								}}
								className={'flex flex-col gap-36'}
							>
								<>
									{
										isAccApp ? (
											// 모바일 앱 접속: 신청 불가
											<>
												<CommentInfo
													title={'실물카드 환불신청 안내'}
													list={[
														{
															id: 'd-0', textColor: 'text-dynamic-text-neutral-secondary',
															message: '일반 Rail+카드와 대중교통안심카드의 환불신청은 홈페이지에서 진행해주세요.',
														},
													]}
												/>
												<Button
													theme={'secondary'}
													size={'md'}
													text={'홈페이지에서 환불 신청하기'}
													ariaLabel={'홈페이지에서 환불 신청하기'}
													icon={<ExternalLink />}
													iconPosition={'right'}
													customStyle={'w-full'}
													onClick={fncAppOpenUrl}
												/>
											</>
										) : (
											// PC 반응형 접속: 신청 가능
											<>
												<InputText
													size={'md'}
													fitWidth={true}
													title={'휴대폰번호'}
													essential={true}
													placeholder={`'-'없이 입력`}
													allows={['num']}
													maxLength={11}
													status={fncValiState('rqstrTelno', data.valid)}
													message={fncValiState('rqstrTelno', data.valid) === 'warning' && '휴대폰번호를 다시 입력해주세요.'}
													id={'rqstrTelno'}
													value={data.rqstrTelno}
													onChange={(e) => fncCallbackEvent('changeInput', e)}
												/>
												<fieldset className={'flex-col-center gap-8'}>
													<legend className={'sr-only'}></legend>
													<InputWithButton
														size={'md'}
														title={'거주지'}
														essential={true}
														placeholder={'우편번호 검색'}
														maxLength={5}
														inputId={'zoneCd'}
														value={data.zoneCd}
														buttonAriaLabel={'우편번호 검색 팝업 열기'}
														status={fncValiState('zoneCd', data.valid)}
														buttonText={'우편번호 검색'}
														onChangeInput={(e) => fncCallbackEvent('changeInput', e)}
														onClickButton={() => fncTogglePost()}
														onFocus={() => fncTogglePost()}
													/>
													<InputText
														size={'md'}
														fitWidth={true}
														placeholder={'주소'}
														allows={['alnum', 'kor', 'space', 'dash']}
														maxLength={100}
														status={fncValiState('zoneCd', data.valid)}
														id={'address1'}
														value={data.address1}
														onChange={(e) => fncCallbackEvent('changeInput', e)}
														onFocus={() => {
															if(!data.zoneCd) fncTogglePost();
														}}
													/>
													<InputText
														size={'md'}
														fitWidth={true}
														placeholder={'상세주소 입력를 입력해주세요.'}
														allows={['alnum', 'kor', 'space', 'dash']}
														maxLength={100}
														status={fncValiState('zoneCd', data.valid)}
														message={fncValiState('zoneCd', data.valid) === 'warning' && '주소를 다시 입력해주세요.'}
														id={'address2'}
														value={data.address2}
														onChange={(e) => fncCallbackEvent('changeInput', e)}
													/>
												</fieldset>
												<fieldset className={'flex flex-col gap-8'}>
													<legend className={'sr-only'}>반환사유 선택</legend>
													<FieldTitle
														title={'반환사유'}
														essential={true}
													/>
													<div className={'grid grid-cols-2 gap-8'}>
														{
															RefundReasonOptions.map((check) => {
																const isChecked = check.id === data.rfndDmndCd;
																return (
																	<Checkbox
																		key={check.id}
																		id={check.id}
																		type={'square'}
																		label={check.name}
																		ariaLabel={`반환사유 선택: ${check.name}`}
																		isChecked={isChecked}
																		onChange={(checked) => {
																			fncCallbackEvent('changeCheckbox', 'rfndDmndCd', check.id)
																		}}
																	/>
																)
															})
														}
														<div className={'col-span-2'}>
															<Textarea
																size={'lg'}
																placeholder={'기타 상세내용을 작성해 주세요.'}
																maxLength={200}
																disabled={!(data.rfndDmndCd === CODE.REFUND_CLAIM_ETC)}
																status={fncValiState('rfndDmndCn', data.valid)}
																message={fncValiState('rfndDmndCn', data.valid) === 'warning' && '기타 상세내용을 작성해 주세요.'}
																id={'rfndDmndCn'}
																value={data.rfndDmndCn}
																onChange={(e) => fncCallbackEvent('changeInput', e)}
															/>
														</div>
													</div>
												</fieldset>
												<div className={'checkbox-wrap'}>
													<Checkbox
														type={'square'}
														label={'반환을 위한 개인정보 수집 및 이용 동의'}
														essentialLabel={'필수'}
														isChecked={data.refundTerms}
														onChange={(checked) => fncCallbackEvent('changeCheckbox', 'refundTerms', checked)}
													/>
													<button
														className={'terms'}
														onClick={fncToggleTermsPop}
														onKeyDown={(e) => {
															if (e.key === 'Enter' || e.key === ' ') {
																e.preventDefault();
																fncToggleTermsPop();
															}
														}}
													>
														보기
													</button>
												</div>
											</>
										)
									}
								</>
							</motion.div>
						)
					}
					{
						// 앱카드
						data.typeMo && (
							<motion.div
								key={'refund_ani_section_3'}
								initial={{height: 0, opacity: 0}}
								animate={{height: 'auto', opacity: 1}}
								exit={{height: 0, opacity: 0}}
								transition={{ duration: 0.4 }}
								style={{
									overflow: 'hidden',
									position: 'relative'
								}}
								className={'my-32'}
							>
								<h2 className={'text-heading-md text-dynamic-text-neutral-primary font-semibold'}>
									환불금액
								</h2>
								<div className={'table-total'}>
									<dl className={'flex-row-center justify-between'}>
										<dt>보유금액</dt>
										<dd className={'color-info'}>
											{`${fncMaskComma(data.selectedCard?.blncSum)}원`}
										</dd>
									</dl>
									<dl className={'flex-row-center justify-between'}>
										<dt>현금환불 가능금액</dt>
										<dd>{`${fncMaskComma(data.selectedCard?.cashRfndPsbltyAmt)}원`}</dd>
									</dl>
									<dl className={'flex-row-center justify-between'}>
										<dt>마일리지 복구금액</dt>
										<dd>{`${fncMaskComma(data.selectedCard?.mlgRstrAmt)}원`}</dd>
									</dl>
									<dl className={'flex-row-center justify-between'}>
										<dt>환불 수수료</dt>
										<dd className={'color-tertiary'}>
											{`${fncMaskComma(data.selectedCard?.rfndFee)}원`}
										</dd>
									</dl>
									<div className={'divider'} />
									<dl className={'flex-row-center justify-between'}>
										<dt className={'bold flex-row-center'}>
											<span>총 환불금액</span>
											<div className={'relative flex items-center'}>
												<button
													onMouseEnter={fncHoverTooltipTotal}
													onMouseLeave={fncHoverTooltipTotal}
													onClick={fncHoverTooltipTotal}
													onKeyDown={(e) => {
														if(e.key === 'Enter' || e.key === ' ') {
															e.preventDefault();
															fncHoverTooltipTotal();
														}
													}}
												>
													<HelpCircle
														width={16} height={16}
														color={'text-dynamic-icon-neutral-secondary'}
													/>
												</button>
												{
													tooltipTotal && (
														<div className='absolute bottom-full -left-[10px] -mb-3 z-3'>
															<Tooltip
																size={'sm'}
																text={'보유금액에서 환불 수수료를 뺀 나머지 금액입니다'}
																direction={'down'}
																position={'start'}
															/>
														</div>
													)
												}
											</div>
										</dt>
										{/* 보유금액 - 환불 수수료 */}
										{`${fncMaskComma(Number(data.selectedCard?.blncSum) - Number(data.selectedCard?.rfndFee))}원`}
									</dl>
									<dl className={'flex-row-center justify-between'}>
										<dt className={'flex-row-center'}>
											<span>총 누적 환불금액</span>
											<div className={'relative flex items-center'}>
												<button
													onMouseEnter={fncHoverTooltipCumulative}
													onMouseLeave={fncHoverTooltipCumulative}
													onClick={fncHoverTooltipCumulative}
													onKeyDown={(e) => {
														if(e.key === 'Enter' || e.key === ' ') {
															e.preventDefault();
															fncHoverTooltipCumulative();
														}
													}}
												>
													<HelpCircle
														width={16} height={16}
														color={'text-dynamic-icon-neutral-secondary'}
													/>
												</button>
												{
													tooltipCumulative && (
														<div className='absolute bottom-full -left-[10px] -mb-3 z-3'>
															<Tooltip
																size={'sm'}
																text={'환불신청 1일 1회/월 3회 가능하며\n연 누적 최대 50만원까지 가능합니다'}
																direction={'down'}
																position={'start'}
															/>
														</div>
													)
												}
											</div>
										</dt>
										<dd>
											{/* 연간 누적 환불 금액 + 보유 금액 */}
											{`${fncMaskComma(Number(data.selectedCard?.acmRfndAmt) + Number(data.selectedCard?.blncSum))}원`}
										</dd>
									</dl>
								</div>
								<div className={'mt-48 flex flex-col gap-36'}>
									<CommentInfo
										title={'환불관련 이용안내'}
										list={[
											{
												id: 'd-0', textColor: 'text-dynamic-text-neutral-secondary',
												message: '충전일로부터 7일까지는 환불수수료가 없으나, 7일 이후에는 500원의 환불수수료가 발생합니다.',
											},
											{
												id: 'd-1', textColor: 'text-dynamic-text-neutral-secondary',
												message: '충전금액의 60% 이상(1만원 이하는 80% 이상) 사용한 경우는 환불 수수료가 없습니다.',
											},
											{
												id: 'd-2', textColor: 'text-dynamic-text-neutral-secondary',
												message: '단, 앞선 1~2번의 안내와는 별도로 신용카드로 충전한 경우에는 다음의 기준에 따라 환불수수료가 부과됩니다.',
												subList: [
													{id: 'sub-0', message: '환불 신청금액이 20만원 미만일 경우 환불수수료 500원'},
													{id: 'sub-1', message: '환불 신청금액이 20만원 이상, 40만원 이하일 경우 환불수수료 2%'},
													{id: 'sub-2', message: '환불 신청금액이 40만원 초과일 경우 환불수수료 4%'}
												],
											},
											{
												id: 'd-3', textColor: 'text-dynamic-text-neutral-secondary',
												message: '환불신청 완료 이후에는 취소할 수 없습니다.',
											},
											{
												id: 'd-4', textColor: 'text-dynamic-text-neutral-secondary',
												message: '환불금액은 보유금액에서 KTX 마일리지 복구금액과 환불수수료를 제외한 금액입니다.',
											},
											{
												id: 'd-5', textColor: 'text-dynamic-text-neutral-secondary',
												message: '환불금액 입금은 평균 2~3일 소요(최대 14일)되며, 본인명의(휴대폰 명의)의 입금계좌로 환불됩니다.',
											},
											{
												id: 'd-6', textColor: 'text-dynamic-text-neutral-secondary',
												message: '환불신청은 1일 1회/월 3회 가능하며, 연 누적 최대 50만원까지 가능합니다.',
											}
										]}
									/>
									<CommentInfo
										title={'기타 안내'}
										list={[
											{
												id: 'd-0', textColor: 'text-dynamic-text-neutral-secondary',
												message: '코레일톡에서 KTX 마일리지 자동전환 기능을 이용하는 경우, 환불신청 완료 이후 반드시 자동전환 기능 해지 상태를 확인하여 주시기 바랍니다.',
											},
											{
												id: 'd-1', textColor: 'text-dynamic-text-neutral-secondary',
												message: 'KTX 마일리지로 충전(전환)한 금액은 현금으로 환불되지 않으며, 코레일 멤버쉽 회원 본인의 KTX 마일리지로 복구됩니다.',
											},
											{
												id: 'd-2', textColor: 'text-dynamic-text-neutral-secondary',
												message: '코레일 멤버쉽 회원 탈퇴 시 KTX 마일리지로 복구되지 않습니다.',
											},
											{
												id: 'd-3', textColor: 'text-dynamic-text-neutral-secondary',
												message: '환불금액의 입금계좌 및 예금주가 휴대폰 명의자와 달라서 생기는 문제의 책임은 운영사에 있지 않습니다.',
											},
											{
												id: 'd-4', textColor: 'text-dynamic-text-neutral-secondary',
												message: '환불금액은 보유금액에서 KTX 마일리지 복구금액과 환불수수료를 제외한 금액입니다.',
											}
										]}
									/>
								</div>
							</motion.div>
						)
					}
				</AnimatePresence>
			</div>
			<div className={'page-bottom-button-wrap'}>
				<Button
					theme={'secondary'}
					size={'lg'}
					text={'취소'}
					ariaLabel={'환불 신청 취소'}
					customStyle={'w-full'}
					onClick={() => fncCallbackEvent('goBack')}
				/>
				<Button
					theme={'primary'}
					size={'lg'}
					text={'환불 신청'}
					ariaLabel={'환불 신청'}
					customStyle={'w-full'}
					disabled={data.blockNext}
					onClick={() => fncCallbackEvent('nextStep')}
				/>
			</div>

			{
				// 주소 검색 팝업
				data.isPostPop && (
					<PostPop
						onClose={fncTogglePost}
						onComplete={(post) => {
							fncCallbackEvent('changeAddress', post);
							fncTogglePost();
						}}
					/>
				)
			}

			{
				// 팝업: 약관
				popTerms && (
					<TermsPop
						data={{terms: data.termsRefund}}
						id={'terms'}
						buttonLabel={'확인'}
						onClose={fncToggleTermsPop}
						onDone={fncToggleTermsPop}
					/>
				)
			}
		</div>
	)
}
