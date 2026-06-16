'use client'

import React from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {fncMaskCardNo, fncMaskContactNo} from "@modules/utils/StringUtils";
import {RefundReasonOptions} from "@modules/consants/Options";

// components
import Button from '@components/common/Button';
import CommentWarning from "@components/composite/CommentWarning";
import FileDownload from "@components/composite/FileDownload";

// assets
import envelopeImage from '@assets/images/envelope.png';


/**
 * @description: 환불신청 Step2 화면 입니다.
 * @screenID:    UI-CRM-F232-02
 * @screenPath:  홈 > 마이페이지 > 환불신청
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
CardRefundStep2.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export default function CardRefundStep2({data, fncCallbackEvent}) {

	const {isMobile} = useScreenSizeContext();

	// 반환 사유 옵션
	const demandInfo = RefundReasonOptions.filter((el) => el.id === data.rfndDmndCd)?.[0] || {};
	const rfndDmndNm = demandInfo?.name || '';

	if (isMobile) return (
		<MoCardRefundStep2
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...data,
				rfndDmndNm
			}}
		/>
	);
	else return (
		<DtCardRefundStep2
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...data,
				rfndDmndNm
			}}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F232-02
 */
DtCardRefundStep2.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function DtCardRefundStep2({data, fncCallbackEvent}) {
	return (
		<>
			<div className={'flex flex-col gap-56 refund-wrap'}>
				<fieldset className={'flex flex-col'}>
					<legend className={'sr-only'}>환불 신청서와 환불봉투 안내 영역</legend>
					<div>
						<h3 className={'step-title-number'}>
							Step2.
						</h3>
						<h2 className={'step-title-text'}>
							환불 신청서와 환불봉투를 다운받아주세요
						</h2>
					</div>
					<div className={'envelope-wrap mt-40'}>
						<div className={'relative'}>
							<div className={'step-bar'}/>
							<div className={'step-circle-wrap'}>1</div>
						</div>
						<div className={'detail-wrap pb-[60px]'}>
							<p className={'description'}>
								입력하신 정보가 포함된 <span className={'text-dynamic-text-brand-primary'}>신청서를 다운로드하여 출력</span>해 주세요
							</p>
							<fieldset>
								<legend className={'sr-only'}>환불 신청정보</legend>
								<p className={'table-title'}>
									환불 신청정보
								</p>
								<dl className={'flex-row-center'}>
									<dt>카드번호</dt>
									<dd>{fncMaskCardNo(data.cardNoEncpt)}</dd>
								</dl>
								<dl className={'flex-row-center'}>
									<dt>환불 받을 은행</dt>
									<dd>{data.micBankNm || '-'}</dd>
								</dl>
								<dl className={'flex-row-center'}>
									<dt>예금주</dt>
									<dd>{data.bacntOwnrNm || '-'}</dd>
								</dl>
								<dl className={'flex-row-center'}>
									<dt>계좌번호</dt>
									<dd>{data.dpstActnoEncpt || '-'}</dd>
								</dl>
								<dl className={'flex-row-center'}>
									<dt>핸드폰번호</dt>
									<dd>{fncMaskContactNo(data.rqstrTelno)}</dd>
								</dl>
								<dl className={'flex-row-center'}>
									<dt>반환사유</dt>
									<dd>{`(${data.rfndDmndNm}) ${data.rfndDmndCn}`}</dd>
								</dl>
							</fieldset>
							<div className={'flex-row-center gap-12'}>
								<FileDownload
									type={'button'}
									name={'신청서 다운로드'}
									fileName={'신청서.pdf'}
									size={'xl'}
									customStyle={'w-[60%]'}
									onDownload={() => fncCallbackEvent('downloadForm', 'apply')}
								/>
								<Button
									theme={'tertiary'}
									size={'xl'}
									text={'신청서 다시 작성'}
									ariaLabel={'신청서 다시 작성'}
									customStyle={'w-[40%]'}
									disabled={false}
									onClick={() => fncCallbackEvent('initStep')}
								/>
							</div>
							<div className={'warning-wrap'} role={'alert'}>
								<p className={'head'}>{`\u00B7`}</p>
								<p className={'body'}>
									신청서 미동봉 시 환불이 지연될 수 있습니다.
								</p>
							</div>
						</div>
					</div>
					<div className={'envelope-wrap'}>
						<div className={'relative'}>
							<div className={'step-bar'}/>
							<div className={'step-circle-wrap'}>2</div>
						</div>
						<div className={'detail-wrap'}>
							<p className={'description'}>
								<span className={'text-dynamic-text-brand-primary'}>우편환불봉투를 다운로드 후 출력</span>한 다음,<br/>절취선대로 오려 규격 봉투 앞면에 붙여 주세요.
							</p>
							<Image src={envelopeImage} alt={'환불봉투 양식 미리보기 이미지'} />
							<FileDownload
								type={'button'}
								name={'우편환불봉투 다운로드'}
								fileName={'우편환불봉투.jpg'}
								size={'xl'}
                                onDownload={() => fncCallbackEvent('downloadForm', 'envelope')}
							/>
							<div className={'warning-wrap'} role={'alert'}>
								<p className={'head'}>{`\u00B7`}</p>
								<p className={'body'}>
									반드시 흰색규격 편지봉투(100mmX220mm)를 이용하시고, 우편배송 시 봉투가 찢어지거나 파손되어 환불이 불가할 수 있으니 봉투 한장에 한 개의 카드만 동봉하여 접수해주시기 바랍니다.
								</p>
							</div>
						</div>
					</div>
				</fieldset>
				<fieldset className={'flex flex-col gap-12'}>
					<legend className={'sr-only'}>우편환불봉투를 부착한 규격 봉투에 신청서와 레일플러스 카드를 함께 동봉하여 가까운 우체통에 접수해 주세요.</legend>
					<div>
						<h3 className={'step-title-number'}>
							Step3.
						</h3>
						<h2 className={'step-title-text'}>
							우편환불봉투를 부착한 규격 봉투에 신청서와 레일플러스 카드를 함께 동봉하여 가까운 우체통에 접수해 주세요.
						</h2>
					</div>
				</fieldset>
				<CommentWarning
					title={'주의사항'}
					list={[
						{
							id: 'd-0', textColor: 'text-dynamic-text-neutral-primary',
							message: '카드 상태를 확인하신 후 신청서를 작성해주십시오. (접수된 카드는 반환되지 않습니다.)',
						},
						{
							id: 'd-1', textColor: 'text-dynamic-text-neutral-secondary',
							message: '충전 후 1년 이내 불량카드는 카드 재교부 및 카드 값을 지급해드립니다.',
						},
						{
							id: 'd-2', textColor: 'text-dynamic-text-neutral-secondary',
							message: '파손카드는 구멍 뚫림, 구김, 휘어짐, 찍힘, 태움, 조각남, 깨짐, 갈라짐, 카드번호 지워짐, 칩손상, 안테나손상, 등 고객의 고의 또는 과실로 훼손된 Rail+ 카드 입니다.',
						},
						{
							id: 'd-3', textColor: 'text-dynamic-text-neutral-secondary',
							message: '충전기에서 잔액인식이 가능한 경우 20만원 이하는 반환접수를 받지 않습니다.',
						}
					]}
				/>
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
					text={'환불 신청완료'}
					ariaLabel={'환불 신청하기'}
					customStyle={'w-[240px]'}
					disabled={false}
					onClick={() => fncCallbackEvent('doRefund')}
				/>
			</div>
		</>
	)
}

/**
 * @description: Mobile
 * @screenID:    -
 */
MoCardRefundStep2.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function MoCardRefundStep2({data, fncCallbackEvent}) {


	return (
		<>
			<div className={'flex flex-col gap-30 page-bottom-space'}>
				<fieldset className={'flex flex-col gap-40'}>
					<legend className={'sr-only'}>환불 신청서와 환불봉투 안내 영역</legend>
					<div>
						<h3 className={'step-title-number'}>
							Step2.
						</h3>
						<h2 className={'step-title-text'}>
							환불 신청서와 환불봉투를 다운받아주세요
						</h2>
					</div>
					<div className={'envelope-wrap'}>
						<div className={'relative'}>
							<div className={'step-bar'}/>
							<div className={'step-circle-wrap'}>1</div>
						</div>
						<div className={'detail-wrap'}>
							<p className={'description'}>
								입력하신 정보가 포함된 <span className={'text-dynamic-text-brand-primary'}>신청서를 다운로드하여 출력</span>해 주세요
							</p>
							<fieldset>
								<legend className={'sr-only'}>환불 신청정보</legend>
								<p className={'table-title'}>
									환불 신청정보
								</p>
								<dl className={'flex-row-center'}>
									<dt>카드번호</dt>
									<dd>{fncMaskCardNo(data.cardNoEncpt)}</dd>
								</dl>
								<dl className={'flex-row-center'}>
									<dt>환불 받을 은행</dt>
									<dd>{data.micBankNm || '-'}</dd>
								</dl>
								<dl className={'flex-row-center'}>
									<dt>예금주</dt>
									<dd>{data.bacntOwnrNm || '-'}</dd>
								</dl>
								<dl className={'flex-row-center'}>
									<dt>계좌번호</dt>
									<dd>{data.dpstActnoEncpt || '-'}</dd>
								</dl>
								<dl className={'flex-row-center'}>
									<dt>핸드폰번호</dt>
									<dd>{fncMaskContactNo(data.rqstrTelno)}</dd>
								</dl>
								<dl className={'flex-row-center'}>
									<dt>반환사유</dt>
									<dd>{`(${data.rfndDmndNm}) ${data.rfndDmndCn}`}</dd>
								</dl>
							</fieldset>
							<div className={'flex-row-center gap-12'}>
								<FileDownload
									type={'button'}
									name={'신청서 다운로드'}
									fileName={'신청서.pdf'}
									size={'lg'}
                                    onDownload={() => fncCallbackEvent('downloadForm', 'apply')}
								/>
								<Button
									theme={'tertiary'}
									size={'lg'}
									text={'신청서 다시 작성'}
									ariaLabel={'신청서 다시 작성'}
									customStyle={'w-[179px]'}
									disabled={false}
									onClick={() => fncCallbackEvent('initStep')}
								/>
							</div>
							<div className={'warning-wrap'} role={'alert'}>
								<p className={'head'}>{`\u00B7`}</p>
								<p className={'body'}>
									신청서 미동봉 시 환불이 지연될 수 있습니다.
								</p>
							</div>
						</div>
					</div>
					<div className={'envelope-wrap'}>
						<div className={'relative'}>
							<div className={'step-bar'}/>
							<div className={'step-circle-wrap'}>2</div>
						</div>
						<div className={'detail-wrap'}>
							<p className={'description'}>
								<span className={'text-dynamic-text-brand-primary'}>우편환불봉투를 다운로드 후 출력</span>한 다음,<br/>절취선대로 오려 규격 봉투 앞면에 붙여 주세요.
							</p>
							<Image src={envelopeImage} alt={'환불봉투 양식 미리보기 이미지'} />
							<FileDownload
								type={'button'}
								name={'우편환불봉투 다운로드'}
								fileName={'우편환불봉투.jpg'}
								size={'lg'}
                                onDownload={() => fncCallbackEvent('downloadForm', 'envelope')}
							/>
							<div className={'warning-wrap'} role={'alert'}>
								<p className={'head'}>{`\u00B7`}</p>
								<p className={'body'}>
									반드시 흰색규격 편지봉투(100mmX220mm)를 이용하시고, 우편배송 시 봉투가 찢어지거나 파손되어 환불이 불가할 수 있으니 봉투 한장에 한 개의 카드만 동봉하여 접수해주시기 바랍니다.
								</p>
							</div>
						</div>
					</div>
				</fieldset>
				<fieldset className={'flex flex-col gap-12'}>
					<legend className={'sr-only'}>우편환불봉투를 부착한 규격 봉투에 신청서와 레일플러스 카드를 함께 동봉하여 가까운 우체통에 접수해 주세요.</legend>
					<div>
						<h3 className={'step-title-number'}>
							Step3.
						</h3>
						<h2 className={'step-title-text'}>
							우편환불봉투를 부착한 규격 봉투에 신청서와 레일플러스 카드를 함께 동봉하여 가까운 우체통에 접수해 주세요.
						</h2>
					</div>
				</fieldset>
				<CommentWarning
					title={'주의사항'}
					list={[
						{
							id: 'd-0', textColor: 'text-dynamic-text-neutral-primary',
							message: '카드 상태를 확인하신 후 신청서를 작성해주십시오. (접수된 카드는 반환되지 않습니다.)',
						},
						{
							id: 'd-1', textColor: 'text-dynamic-text-neutral-secondary',
							message: '충전 후 1년 이내 불량카드는 카드 재교부 및 카드 값을 지급해드립니다.',
						},
						{
							id: 'd-2', textColor: 'text-dynamic-text-neutral-secondary',
							message: '파손카드는 구멍 뚫림, 구김, 휘어짐, 찍힘, 태움, 조각남, 깨짐, 갈라짐, 카드번호 지워짐, 칩손상, 안테나손상, 등 고객의 고의 또는 과실로 훼손된 Rail+ 카드 입니다.',
						},
						{
							id: 'd-3', textColor: 'text-dynamic-text-neutral-secondary',
							message: '충전기에서 잔액인식이 가능한 경우 20만원 이하는 반환접수를 받지 않습니다.',
						}
					]}
				/>
			</div>
			<div className={'page-bottom-button-wrap'}>
				<Button
					theme={'secondary'}
					size={'lg'}
					text={'취소'}
					ariaLabel={'환불신청 취소'}
					customStyle={'w-full'}
					onClick={() => fncCallbackEvent('goBack')}
				/>
				<Button
					theme={'primary'}
					size={'lg'}
					text={'환불 신청완료'}
					ariaLabel={'환불 신청하기'}
					customStyle={'w-full'}
					disabled={false}
					onClick={() => fncCallbackEvent('doRefund')}
				/>
			</div>
		</>
	)
}
