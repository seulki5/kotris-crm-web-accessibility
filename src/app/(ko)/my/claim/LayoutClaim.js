'use client'

import React, {useLayoutEffect} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {useRouter} from 'next/navigation';
import {useMutation} from '@tanstack/react-query';
import {pdf} from '@react-pdf/renderer';

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {useMoHeaderContext} from '@modules/context/MoHeaderContext';
import {RefundAndLostOptions} from '@modules/consants/Options';
import {fncMaskComma} from '@modules/utils/NumberUitls';
import {fncMaskCardNo} from '@modules/utils/StringUtils';
import {CODE, FindCardProductName, FindRefundStatusBadge} from '@modules/consants/Objects';
import {useLoadingContext} from '@modules/context/LoadingContext';
import {useWebContext} from '@modules/context/WebviewContext';
import {useApi} from '@modules/services/useApi';
import {apiCancelLost, apiCancelRefund, apiClaimList} from '@/app/_actions/mypage.action';
import {toMomentFrom14} from '@modules/utils/DateUtils';
import {usePopContext} from '@modules/context/PopContext';
import {useUserContext} from "@modules/context/UserContext";

// components
import Breadcrumb from '@components/layout/Breadcrumb';
import Segment from '@components/common/Segment';
import Button from '@components/common/Button';
import Textarea from '@components/common/Textarea';
import FileDownload from '@components/composite/FileDownload';
import PDFRefundForm from '@components/composite/PDFRefundForm';

// assets
import {ChevronRight, EmptyDefault} from '@assets/icons/Svgs';


/**
 * @description: 환불/분실신청 내역 화면 입니다.
 * @screenID:    UI-CRM-F236, UI-CRM-F470
 * @screenPath:  홈 > 마이페이지 > 환불/분실신청 내역
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function LayoutClaim({onChangeTab}) {

	const router = useRouter();
	const {isMobile} = useScreenSizeContext();
	const {isAccApp, reloadKey, fncFocusLayout} = useWebContext();
	const {fncChangeMoHeader} = useMoHeaderContext();
	const {jsonApiAction} = useApi();
	const {fncShowPop, fncClosePop, fncErrorPop} = usePopContext();
	const {isLogin} = useUserContext();
	const {fncRouteStart} = useLoadingContext();

	// --Api
	// 신청 목록
	const {mutate: mutQueryClaimList, data: claimList} = useMutation({
		mutationKey: ['mutQueryClaimList'],
		mutationFn: () => jsonApiAction(apiClaimList, {}),
	})

	// 환불 취소
	const {mutate: mutCancelRefund} = useMutation({
		mutationKey: ['mutCancelRefund'],
		mutationFn: (payload) => jsonApiAction(apiCancelRefund, payload),
		onSuccess: (res) => {
			if(res > 0) {
				fncShowPop({
					mainText: '환불/분실 신청이 취소되었습니다.',
					primaryText: '확인',
					onClickPrimary: () => {
						fncClosePop();
						mutQueryClaimList();
					}
				})
			} else {
				fncErrorPop();
			}
		}
	})

	// 분실 취소
	const {mutate: mutCancelLost} = useMutation({
		mutationKey: ['mutCancelLost'],
		mutationFn: (payload) => jsonApiAction(apiCancelLost, payload),
		onSuccess: (res) => {
			if(res > 0) {
				fncShowPop({
					mainText: '환불/분실 신청이 취소되었습니다.',
					primaryText: '확인',
					onClickPrimary: () => {
						fncClosePop();
						mutQueryClaimList();
					}
				})
			} else {
				fncErrorPop();
			}
		}
	})

	useLayoutEffect(() => {
		isLogin && mutQueryClaimList();
	}, [isLogin]);

	useLayoutEffect(() => {
		if (isAccApp) fncFocusLayout();
		if (isMobile) {
			fncChangeMoHeader({
				type: 'back',
				title: '환불/분실 신청내역'
			})
		}
	}, [isMobile, isAccApp, reloadKey])

	// segment 클릭
	const fncChangeSegment = (id) => {
		onChangeTab?.(id);
	}

	// 환불/분실 신청 취소
	const fncCancel = (item) => {
		if(item.dmgeRfndPrcsSttsCd !== '01') return;
		switch (item.rfndLsSeCd) {
			case '01':  // 환불
				return mutCancelRefund({dmgeRfndNo: item.dmgeRfndNo});
			case '02':  // 분실
				return mutCancelLost({dmgeRfndNo: item.dmgeRfndNo});
			default: return;
		}
	}

	// 신청서 다운로드
	const fncDownloadForm = async (item) => {
		let doc = <PDFRefundForm form={item} />;
		let fileName = '환불신청서';

		try {
			if (!doc || !fileName) return;

			const blob = await pdf(doc).toBlob();
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `${fileName}.pdf`;
			document.body.appendChild(a);
			a.click();
			a.remove();
			URL.revokeObjectURL(url);

		} catch (err) {
			fncErrorPop();
		}
	}

	const fncHandlers = {
		changeSegment: fncChangeSegment,
		downloadForm: fncDownloadForm,
		cancel: fncCancel,
	}

	const fncCallbackEvent = (fncName, variable, payload = {}) => {
		const fnc = fncHandlers[fncName];
		if (typeof fnc === 'function') return fnc(variable, payload);
	}

	if (isMobile) return (
		<MoMyClaim
			fncCallbackEvent={fncCallbackEvent}
			data={{
				claimList
			}}
        />
	);
	else return (
		<DtMyClaim
			fncCallbackEvent={fncCallbackEvent}
			data={{
				claimList
			}}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F236
 */
DtMyClaim.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function DtMyClaim({data, fncCallbackEvent}) {
	return (
		<main id={'my'} className={'body-wrap-618'} aria-labelledby={'page-name-dt'}>
			<Breadcrumb addPaths={[]} />
			<h1 id={'page-name-dt'} className={'page-title'}>
				환불/분실 신청내역
			</h1>
			<div className={'my-48'}>
				<Segment
					size={'lg'}
					options={RefundAndLostOptions}
					selectedValue={RefundAndLostOptions[2].id}
					fullSize={true}
					onChange={(id) => fncCallbackEvent('changeSegment', id)}
				/>
			</div>
			<div className={'page-bottom-space claim-wrap'}>
				{
					data.claimList?.length > 0 ? (
						<div className={'min-h-[calc(40dvh+144px)]'}>
							{
								data.claimList.map((item, index) => {
									return (
										<div key={item.rfndSn}>
											{index > 0 && <div className={'divider'}/>}
											<div className={'list-item'}>
												<div className={'flex-row-center justify-between'}>
													<div className={'flex-row-center gap-12'}>
														<span className={'card-name'}>
															{item.mypgCardSeCd ? FindCardProductName[item.mypgCardSeCd] : '-'}
														</span>
														<span className={'w-[68px]'}>
															{FindRefundStatusBadge[item.dmgeRfndPrcsSttsCd]}
														</span>
													</div>
													{
														item.dmgeRfndPrcsSttsCd === CODE.REFUND_APPLIED && (
															<Button
																theme={'textOnly'}
																size={'sm'}
																text={'환불/분실신청 취소'}
																ariaLabel={`${item.cardNoEncpt} 카드의 환불/분실신청 취소`}
																customStyle={'w-fit'}
																icon={<ChevronRight color={'text-dynamic-icon-brand-primary'}/>}
																iconPosition={'right'}
																onClick={() => fncCallbackEvent('cancel', item)}
															/>
														)
													}
												</div>
												<dl className={'flex-col-center-12'}>
													<div>
														<dt>카드번호</dt>
														<dd>{fncMaskCardNo(item.cardNoEncpt)}</dd>
													</div>
													<div>
														<dt>환불신청 일시</dt>
														<dd>{moment(toMomentFrom14(item.frstRegDt)).format('YYYY-MM-DD HH:mm:ss')}</dd>
													</div>
													<div>
														<dt>환불예정 금액</dt>
														<dd>{fncMaskComma(item.rfndAmt)}</dd>
													</div>
													<div>
														<dt>환불계좌</dt>
														<dd>{item.dpstActnoEncpt && item.micBankNm ? `${item.micBankNm} (${item.dpstActnoEncpt})` : '-'}</dd>
													</div>
													<div>
														<dt>예금주</dt>
														<dd>{item.bacntOwnrNm || '-'}</dd>
													</div>
												</dl>
												{
													(item.aprvImpbRsnCd && item.dmgeRfndPrcsSttsCd === CODE.REFUND_HOLD) && (
														<div>
															<p className={'table-key mb-8'}>
																승인불가 사유
															</p>
															<Textarea
																size={'lg'}
																id={'term'}
																ariaLabel={'승인 불가 사유'}
																maxLength={0}
																dataOnly={true}
																value={item.aprvImpbRsnNm || '-'}
																customStyle={'bg-dynamic-bg-neutral-disabled text-dynamic-text-neutral-secondary'}
															/>
														</div>
													)
												}
												{
													// 환불만 다운로드 가능
													item.rfndLsSeCd === '01' && (
														<div className={'flex flex-row gap-8'}>
															<FileDownload
																type={'button'}
																size={'sm'}
																buttonTheme={'tertiary'}
																name={'신청서 다운로드'}
																fileName={'신청서.pdf'}
																onDownload={() => fncCallbackEvent('downloadForm', item)}
															/>
															<FileDownload
																type={'button'}
																size={'sm'}
																buttonTheme={'tertiary'}
																name={'우편환불봉투 다운로드'}
																fileName={'우편환불봉투.jpg'}
																fileId={process.env.NEXT_PUBLIC_FILE_ID_REFUND_ENVELOPE}
															/>
														</div>
													)
												}
											</div>
										</div>
									)
								})
							}
						</div>
					) : (
						<div className={'empty-wrap'} style={{minHeight: '40dvh'}}>
							<EmptyDefault />
							<p>환불/분실신청 내역이 없어요</p>
							<p>환불 또는 분실 신청을 진행해 주세요.</p>
						</div>
					)
				}
			</div>
		</main>
	)
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F470
 */
MoMyClaim.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function MoMyClaim({data, fncCallbackEvent}) {
	return (
		<main id={'my'} className={'body-wrap-mobile'} aria-labelledby={'page-name-mo'}>
			<h1 id={'page-name-mo'} className={'sr-only'}>환불/분실신청</h1>
			<div className={'body-inner-wrap-mobile claim-wrap'}>
				<Segment
					size={'md'}
					options={RefundAndLostOptions}
					selectedValue={RefundAndLostOptions[2].id}
					fullSize={true}
					onChange={(id) => fncCallbackEvent('changeSegment', id)}
				/>
				{
					data.claimList?.length > 0 ? (
						data.claimList.map((item, index) => {
							return (
								<div key={item.rfndSn}>
									{index > 0 && <div className={'divider'} />}
									<div className={'list-item'}>
										<div className={'flex-row-center gap-12 mo:justify-between'}>
											<span className={'card-name'}>
												{item.mypgCardSeCd ? FindCardProductName[item.mypgCardSeCd] : '-'}
											</span>
											<span className={'w-[68px] mo:w-fit'}>
												{FindRefundStatusBadge[item.dmgeRfndPrcsSttsCd]}
											</span>
										</div>
										<div className={'flex-col-center-12'}>
											<dl>
												<div>
													<dt>카드번호</dt>
													<dd>{fncMaskCardNo(item.cardNoEncpt)}</dd>
												</div>
												<div>
													<dt>환불신청 일시</dt>
													<dd>{moment(toMomentFrom14(item.frstRegDt)).format('YYYY-MM-DD HH:mm:ss')}</dd>
												</div>
												<div>
													<dt>환불예정 금액</dt>
													<dd>{fncMaskComma(item.rfndAmt)}</dd>
												</div>
												<div>
													<dt>환불계좌</dt>
													<dd>{item.dpstActnoEncpt && item.micBankNm ? `${item.micBankNm} (${item.dpstActnoEncpt})` : '-'}</dd>
												</div>
												<div>
													<dt>예금주</dt>
													<dd>{item.bacntOwnrNm || '-'}</dd>
												</div>
											</dl>
										</div>
										{
											(item.aprvImpbRsnCd && item.dmgeRfndPrcsSttsCd === CODE.REFUND_HOLD) && (
												<div>
													<p className={'table-key mb-8'}>
														승인불가 사유
													</p>
													<Textarea
														size={'lg'}
														id={'term'}
														ariaLabel={'승인 불가 사유'}
														maxLength={0}
														dataOnly={true}
														value={item.aprvImpbRsnNm || '-'}
														customStyle={'bg-dynamic-bg-neutral-disabled text-dynamic-text-neutral-secondary'}
													/>
												</div>

											)
										}
										{
											[CODE.REFUND_APPLIED].includes(item.dmgeRfndPrcsSttsCd) && (
												<Button
													theme={'tertiary'}
													size={'sm'}
													text={'신청 취소'}
													ariaLabel={'환불/분실신청 취소'}
													customStyle={'w-full'}
													onClick={() => fncCallbackEvent('cancel', item)}
												/>
											)
										}
									</div>
								</div>
							)
						})
					) : (
						<div className={'empty-wrap'}>
							<EmptyDefault />
							<p>환불/분실신청 내역이 없어요</p>
							<p>환불 또는 분실 신청을 진행해 주세요.</p>
						</div>
					)
				}
			</div>
		</main>
	)
}
