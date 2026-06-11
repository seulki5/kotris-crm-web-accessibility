'use client'

import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {fncMaskCardNo} from '@modules/utils/StringUtils';
import {toMomentFrom14} from "@modules/utils/DateUtils";

// components
import CommentInfo from '@components/composite/CommentInfo';
import Button from '@components/common/Button';
import Badge from "@components/composite/Badge";

// assets
import {ArrowLeft} from '@assets/icons/Svgs';


/**
 * @description: 어린이 및 청소년 할인 조회 결과 컴포넌트 입니다.
 * @screenID:    UI-CRM-F263
 * @screenPath:  홈 > 고객센터 > 비회원 할인등록 > 어린이 및 청소년 할인 조회
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
QueryDiscountMinor.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export default function QueryDiscountMinor({data, fncCallbackEvent}) {

	const {isMobile} = useScreenSizeContext();
	if (isMobile) return (
		<MoQueryDiscountMinor
			fncCallbackEvent={fncCallbackEvent}
			data={data}
		/>
	);
	else return (
		<DtQueryDiscountMinor
			fncCallbackEvent={fncCallbackEvent}
			data={data}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F263
 */
DtQueryDiscountMinor.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function DtQueryDiscountMinor({data, fncCallbackEvent}) {
	return (
		<>
			<button
				className={'back-arrow-wrap'}
		        aria-label={'이전페이지로 이동'}
				onClick={() => fncCallbackEvent('goBack')}
				onKeyDown={(e) => {
					if(e.key === 'Enter' || e.key === ' ') {
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
				<p>이전으로</p>
			</button>
			<h1 id={'page-name-dt'} className={'page-title'}>
				어린이 및 청소년 할인 등록정보
			</h1>
			<div className={'inquiry-table-wrap'}>
				<dl>
					<div>
						<dt>카드유형</dt>
						<dd>{data?.cardGdsNm || '-'}</dd>
					</div>
					<div>
						<dt>카드번호</dt>
						<dd>
							{data?.cardUserTypeCd && <Badge id={'cardUserTypeCd'} code={data?.cardUserTypeCd} />}
							{data?.cardNoEncpt ? fncMaskCardNo(data?.cardNoEncpt) : '-'}
						</dd>
					</div>
					<div>
						<dt>생년월일</dt>
						<dd>{data?.custBrdt ? moment(data?.custBrdt).format('YYYY-MM-DD') : '-'}</dd>
					</div>
					<div>
						<dt>발급일자</dt>
						<dd>{data?.regDt ? moment(toMomentFrom14(data?.regDt)).format('YYYY-MM-DD') : '-'}</dd>
					</div>
				</dl>
				<CommentInfo
					title={'이용안내'}
					list={[
						{
							id: 'd-0',
							textColor: 'text-dynamic-text-neutral-secondary',
							message: <span>어린이 요금 <span className={'text-dynamic-text-neutral-primary'}>적용 만 9세 이상 ~ 만 12세 이하</span>, 청소년 요금 적용 <span className={'text-dynamic-text-neutral-primary'}>만 13세 이상~ 만 18세 이하</span> 입니다.</span>,
						},
						{
							id: 'd-1', textColor: 'text-dynamic-text-neutral-secondary',
							message: '할인카드 등록 이후 영업일 기준 3일 이후부터 적용됩니다.',
						},
						{
							id: 'd-2', textColor: 'text-dynamic-text-neutral-secondary',
							message: '회원가입 후 어린이/청소년 카드 등록을 하시면 소득공제, 거래내역 조회를 하실 수 있습니다.',
						},
						{
							id: 'd-3', textColor: 'text-dynamic-text-neutral-secondary',
							message: '반드시 사용할 어린이/청소년 사용자의 정보를 입력하셔야 하며 입력된 정보는 할인등록을 위한 용도로만 이용됩니다.',
						},
						{
							id: 'd-4', textColor: 'text-dynamic-text-neutral-primary',
							message: '본인이 보유하지 않은 카드를 허위로 등록할 경우 발생하게 되는 모든 책임은 카드 사용자에게 있으며 일반인이 어린이/청소년 카드 사용으로 적발될 시 철도사업법 및 경범죄처벌법에 의거하여 승차구간 운임과 그 30배의 부가운임을 징수 하오니 유의하시기 바랍니다.',
						},
					]}
				/>
				<CommentInfo
					title={'CU레일플러스카드 및 토스유스카드 안내'}
					list={[
						{
							id: 'd-0', textColor: 'text-dynamic-text-neutral-secondary',
							message: 'CU레일플러스카드의 어린이/청소년 할인요금 적용은 CU 편의점에서 생년월일 등록 후 가능합니다.'
						},
						{
							id: 'd-1', textColor: 'text-dynamic-text-neutral-secondary',
							message: 'CU레일플러스카드의 할인요금 적용은 가까운 CU 편의점을 방문하여 주시기 바랍니다. (별도 등록 불필요)'
						},
						{
							id: 'd-2', textColor: 'text-dynamic-text-neutral-secondary',
							message: '토스유스카드의 어린이/청소년 할인요금은 발급 시 적용됩니다. (별도 등록 불필요)'
						},
					]}
				/>
			</div>
			<div className={'page-bottom-button-wrap'}>
				<Button
					theme={'delete'}
					size={'xl'}
					text={'해지'}
					ariaLabel={'등록된 어린이 및 청소년 할인 해지'}
					customStyle={'w-[240px]'}
					onClick={() => fncCallbackEvent('showDelCheckPop')}
				/>
			</div>
		</>
	)
}

/**
 * @description: Mobile
 * @screenID:    -
 */
MoQueryDiscountMinor.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function MoQueryDiscountMinor({data, fncCallbackEvent}) {
	return (
		<>
			<h1 id={'page-name-mo'} className={'sr-only'}>
				어린이 및 청소년 할인 등록정보
			</h1>
			<div className={'inquiry-table-wrap page-bottom-space'}>
				<dl>
					<div>
						<dt>카드유형</dt>
						<dd>{data?.cardGdsNm || '-'}</dd>
					</div>
					<div>
						<dt>카드번호</dt>
						<dd>
							{data?.cardUserTypeCd && <Badge id={'cardUserTypeCd'} code={data?.cardUserTypeCd} />}
							{data?.cardNoEncpt ? fncMaskCardNo(data?.cardNoEncpt) : '-'}
						</dd>
					</div>
					<div>
						<dt>생년월일</dt>
						<dd>{data?.custBrdt ? moment(data?.custBrdt).format('YYYY-MM-DD') : '-'}</dd>
					</div>
					<div>
						<dt>발급일자</dt>
						<dd>{data?.regDt ? moment(toMomentFrom14(data?.regDt)).format('YYYY-MM-DD') : '-'}</dd>
					</div>
				</dl>
				<CommentInfo
					title={'이용안내'}
					list={[
						{
							id: 'd-0', textColor: 'text-dynamic-text-neutral-secondary',
							message: <span>어린이 요금 <span className={'text-dynamic-text-neutral-primary'}>적용 만 9세 이상 ~ 만 12세 이하</span>, 청소년 요금 적용 <span className={'text-dynamic-text-neutral-primary'}>만 13세 이상~ 만 18세 이하</span> 입니다.</span>,
						},
						{
							id: 'd-1', textColor: 'text-dynamic-text-neutral-secondary',
							message: '할인카드 등록 이후 영업일 기준 3일 이후부터 적용됩니다.',
						},
						{
							id: 'd-2', textColor: 'text-dynamic-text-neutral-secondary',
							message: '회원가입 후 어린이/청소년 카드 등록을 하시면 소득공제, 거래내역 조회를 하실 수 있습니다.',
						},
						{
							id: 'd-3', textColor: 'text-dynamic-text-neutral-secondary',
							message: '반드시 사용할 어린이/청소년 사용자의 정보를 입력하셔야 하며 입력된 정보는 할인등록을 위한 용도로만 이용됩니다.',
						},
						{
							id: 'd-4', textColor: 'text-dynamic-text-neutral-primary',
							message: '본인이 보유하지 않은 카드를 허위로 등록할 경우 발생하게 되는 모든 책임은 카드 사용자에게 있으며 일반인이 어린이/청소년 카드 사용으로 적발될 시 철도사업법 및 경범죄처벌법에 의거하여 승차구간 운임과 그 30배의 부가운임을 징수 하오니 유의하시기 바랍니다.',
						},
					]}
				/>
				<CommentInfo
					title={'CU레일플러스카드 및 토스유스카드 안내'}
					list={[
						{
							id: 'd-0', textColor: 'text-dynamic-text-neutral-secondary',
							message: 'CU레일플러스카드의 어린이/청소년 할인요금 적용은 CU 편의점에서 생년월일 등록 후 가능합니다.'
						},
						{
							id: 'd-1', textColor: 'text-dynamic-text-neutral-secondary',
							message: 'CU레일플러스카드의 할인요금 적용은 가까운 CU 편의점을 방문하여 주시기 바랍니다. (별도 등록 불필요)'
						},
						{
							id: 'd-2', textColor: 'text-dynamic-text-neutral-secondary',
							message: '토스유스카드의 어린이/청소년 할인요금은 발급 시 적용됩니다. (별도 등록 불필요)'
						},
					]}
				/>
			</div>
			<div className={'page-bottom-button-wrap'}>
				<Button
					theme={'delete'}
					size={'lg'}
					text={'해지'}
					ariaLabel={'등록된 어린이 및 청소년 할인 해지'}
					customStyle={'w-full'}
					onClick={() => fncCallbackEvent('showDelCheckPop')}
				/>
			</div>
		</>
	)
}


