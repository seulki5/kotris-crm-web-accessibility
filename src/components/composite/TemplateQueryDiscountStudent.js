'use client'

import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {toMomentFrom14} from '@modules/utils/DateUtils';
import {fncMaskCardNo, fncMaskContactNo} from '@modules/utils/StringUtils';

// components
import CommentInfo from '@components/composite/CommentInfo';
import Button from '@components/common/Button';
import FileDownload from '@components/composite/FileDownload';

// assets
import {ArrowLeft} from '@assets/icons/Svgs';


/**
 * @description: 청소년 연령 초과 학생 할인 조회 컴포넌트입니다.
 * @screenID:    -
 * @screenPath:  -
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
TemplateQueryDiscountStudent.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export default function TemplateQueryDiscountStudent({data, fncCallbackEvent}) {

	const {isMobile} = useScreenSizeContext();
	if (isMobile) return (
		<MoTemplateQueryDiscountStudent
			fncCallbackEvent={fncCallbackEvent}
			data={data}
		/>
	);
	else return (
		<DtTemplateQueryDiscountStudent
			fncCallbackEvent={fncCallbackEvent}
			data={data}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F242
 */
DtTemplateQueryDiscountStudent.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function DtTemplateQueryDiscountStudent({data, fncCallbackEvent}) {
	return (
		<>
			<button
				type={'button'}
				className={'back-arrow-wrap'}
				aria-label={'이전페이지로 이동'}
				onClick={() => fncCallbackEvent('goBack')}
				onKeyDown={(e) => {
					if(e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						fncCallbackEvent('goBack');
					}
				}}
			>
				<div className={'icon-wrap'}>
					<ArrowLeft
						width={16} height={16}
						color={'text-dynamic-icon-neutral-primary'}
						aria-hidden={true}
					/>
				</div>
				<p>이전으로</p>
			</button>
			<h1 id={'page-name-dt'}
			    className={`
			        text-heading-lg text-dynamic-text-neutral-primary font-semibold
			        mo:text-heading-md  mo:whitespace-break-spaces
			    `}>
				청소년 연령초과 학생 할인 등록정보
			</h1>
			<div className={'inquiry-table-wrap wide page-bottom-space'}>
				<dl>
					<div>
						<dt>카드번호</dt>
						<dd>
							{data?.cardNoEncpt ? fncMaskCardNo(data?.cardNoEncpt) : '-'}
						</dd>
					</div>
					<div>
						<dt>이름</dt>
						<dd>{data?.custNm || '-'}</dd>
					</div>
					<div>
						<dt>생년월일</dt>
						<dd>{data?.custBrdt ? moment(toMomentFrom14(data?.custBrdt)).format('YYYY-MM-DD') : '-'}</dd>
					</div>
					<div>
						<dt>핸드폰번호</dt>
						<dd>{fncMaskContactNo(data?.mblTelno) || '-'}</dd>
					</div>
					<div>
						<dt>고등학교 졸업예정일</dt>
						<dd>{data?.hsclGrdtnPrnmntYmd ? moment(toMomentFrom14(data?.hsclGrdtnPrnmntYmd)).format('YYYY-MM-DD') : '-'}</dd>
					</div>
					<div>
						<dt>첨부파일</dt>
						<dd className={'attachment attachment-wrap'}>
							{
								data?.atchFileList?.map((file) => (
									<FileDownload
										type={'text'}
										name={file.atchFileNm}
										fileId={file.atchFileId}
										fileName={file.atchFileNm}
										key={file.atchFileId}
									/>
								))
							}
						</dd>
					</div>
					<div>
						<dt>등록일자</dt>
						<dd>{data?.regDt ? moment(toMomentFrom14(data?.regDt)).format('YYYY-MM-DD') : '-'}</dd>
					</div>
					<div>
						<dt>처리상태</dt>
						<dd>{data?.stlmSttsNm ? data.stlmSttsNm : '-'}</dd>
					</div>
				</dl>
				{
					(data?.rjctRsnCn && data?.stlmSttsCd !== '03') && (
						<>
							<div className={'divider'} role={'none'}/>
							<div className={'reject-wrap'} aria-label={'반려 사유'}>
								<p>반려 사유</p>
								<p>{data.rjctRsnCn}</p>
							</div>
						</>
					)
				}
				<CommentInfo
					title={'이용안내'}
					list={[
						{
							id: 'd-0', textColor: 'text-dynamic-text-neutral-secondary',
							message: '청소년 연령초과 학생은 초중등 교육법 제2조에 의거하여 학생 신분임을 증명하셔야 할인 혜택을 받으실 수 있습니다.',
						},
						{
							id: 'd-1', textColor: 'text-dynamic-text-neutral-primary',
							message: '청소년 연령초과 학생 할인을 통해 해당 학교의 재학증명서를 제출하여 할인 혜택을 받으세요.',
						},
						{
							id: 'd-2', textColor: 'text-dynamic-text-neutral-secondary',
							message: '할인 등록시 정확한 정보를 입력하셔야 할인 요금을 적용 받으실 수 있으며, 허위정보 및 타인 입력으로 발생된 고객 불이익 및 변경된 정보로 인한 문제에 대해서는 등록자의 책임임을 유의하여 주시기 바랍니다.',
						}
					]}
				/>
			</div>
			<div className={'flex justify-center gap-12'}>
				{
					data?.stlmSttsCd !== '02' ? (
						<>
							<Button
								theme={'secondary'}
								size={'xl'}
								text={'취소'}
								ariaLabel={'취소'}
								customStyle={'w-[240px]'}
								onClick={() => fncCallbackEvent('goBack')}
							/>
							<Button
								theme={'primary'}
								size={'xl'}
								text={'수정'}
								ariaLabel={'수정'}
								customStyle={'w-[240px]'}
								disabled={false}
								onClick={() => fncCallbackEvent('goRegister')}
							/>
						</>
					) : (
						<Button
							theme={'secondary'}
							size={'xl'}
							text={'확인'}
							ariaLabel={'확인'}
							customStyle={'w-[240px]'}
							onClick={() => fncCallbackEvent('goBack')}
						/>
					)
				}
			</div>
		</>
	)
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F476
 */
MoTemplateQueryDiscountStudent.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function MoTemplateQueryDiscountStudent({data, fncCallbackEvent}) {
	return (
		<>
			<h1 id={'page-name-mo'} className={'sr-only'}>
				청소년 연령초과 학생 할인 등록정보
			</h1>
			<div className={'inquiry-table-wrap page-bottom-space'}>
				<dl>
					<div>
						<dt>카드번호</dt>
						<dd>
							{data?.cardNoEncpt ? fncMaskCardNo(data?.cardNoEncpt) : '-'}
						</dd>
					</div>
					<div>
						<dt>이름</dt>
						<dd>{data?.custNm || '-'}</dd>
					</div>
					<div>
						<dt>생년월일</dt>
						<dd>{data?.custBrdt ? moment(toMomentFrom14(data?.custBrdt)).format('YYYY-MM-DD') : '-'}</dd>
					</div>
					<div>
						<dt>핸드폰번호</dt>
						<dd>{fncMaskContactNo(data?.mblTelno) || '-'}</dd>
					</div>
					<div>
						<dt>고등학교 졸업예정일</dt>
						<dd>{data?.hsclGrdtnPrnmntYmd ? moment(toMomentFrom14(data?.hsclGrdtnPrnmntYmd)).format('YYYY-MM-DD') : '-'}</dd>
					</div>
					<div>
						<dt>첨부파일</dt>
						<dd className={'attachment attachment-wrap'} style={{marginTop: 0}}>
							{
								data?.atchFileList?.map((file) => (
									<FileDownload
										type={'text'}
										name={file.atchFileNm}
										fileId={file.atchFileId}
										fileName={file.atchFileNm}
										key={file.atchFileId}
									/>
								))
							}
						</dd>
					</div>
					<div>
						<dt>등록일자</dt>
						<dd>{data?.regDt ? moment(toMomentFrom14(data?.regDt)).format('YYYY-MM-DD') : '-'}</dd>
					</div>
					<div>
						<dt>처리상태</dt>
						<dd>{data?.stlmSttsNm ? data.stlmSttsNm : '-'}</dd>
					</div>
				</dl>
				{
					(data?.rjctRsnCn && data?.stlmSttsCd !== '03') && (
						<>
							<div className={'divider'} role={'none'}/>
							<div className={'reject-wrap'} aria-label={'반려 사유'}>
								<p>반려 사유</p>
								<p>{data.rjctRsnCn}</p>
							</div>
						</>
					)
				}
				<CommentInfo
					title={'이용안내'}
					list={[
						{
							id: 'd-0', textColor: 'text-dynamic-text-neutral-secondary',
							message: '청소년 연령초과 학생은 초중등 교육법 제2조에 의거하여 학생 신분임을 증명하셔야 할인 혜택을 받으실 수 있습니다.',
						},
						{
							id: 'd-1', textColor: 'text-dynamic-text-neutral-primary',
							message: '청소년 연령초과 학생 할인을 통해 해당 학교의 재학증명서를 제출하여 할인 혜택을 받으세요.',
						},
						{
							id: 'd-2', textColor: 'text-dynamic-text-neutral-secondary',
							message: '할인 등록시 정확한 정보를 입력하셔야 할인 요금을 적용 받으실 수 있으며, 허위정보 및 타인 입력으로 발생된 고객 불이익 및 변경된 정보로 인한 문제에 대해서는 등록자의 책임임을 유의하여 주시기 바랍니다.',
						}
					]}
				/>
			</div>
			<div className={'flex-row-center gap-8'}>
				{
					data?.stlmSttsCd !== '02' ? (
						<>
							<Button
								theme={'secondary'}
								size={'lg'}
								text={'취소'}
								ariaLabel={'취소'}
								customStyle={'flex-1'}
								onClick={() => fncCallbackEvent('goBack')}
							/>
							<Button
								theme={'primary'}
								size={'lg'}
								text={'수정'}
								ariaLabel={'수정'}
								customStyle={'flex-1'}
								disabled={false}
								onClick={() => fncCallbackEvent('goRegister')}
							/>
						</>
					) : (
						<Button
							theme={'secondary'}
							size={'lg'}
							text={'확인'}
							ariaLabel={'확인'}
							customStyle={'flex-1'}
							onClick={() => fncCallbackEvent('goBack')}
						/>
					)
				}
			</div>
		</>
	)
}


