'use client'

import React, {useState} from 'react';
import PropTypes from 'prop-types';
import dynamic from "next/dynamic";

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {fncValiState} from "@modules/utils/ValidateUtils";
import {fncMaskCardNo} from "@modules/utils/StringUtils";

// components
import Button from '@components/common/Button';
import InputText from '@components/common/InputText';
import CommentInfo from "@components/composite/CommentInfo";
import FileUpload from "@components/composite/FileUpload";
import Checkbox from "@components/common/Checkbox";
import TermsPop from "@components/popup/TermsPop";
import Loading from "@/app/loading";
const ToastViewer = dynamic(() => import('@components/common/Editor'), {
	ssr: false,
	loading: () => <Loading />
})


/**
 * @description: 청소년 연령초과 학생 할인 등록/수정 화면 입니다.
 * @screenID:    UI-CRM-F266
 * @screenPath:  홈 > 고객센터 > 비회원 할인등록 > 청소년 연령초과 학생 할인 등록/수정
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
DiscountStudentRegisterStep1.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export default function DiscountStudentRegisterStep1({data, fncCallbackEvent}) {

	const {isMobile} = useScreenSizeContext();
	if (isMobile) return (
		<MoDiscountTeenCardStep1
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...data
			}}
        />
	);
	else return (
		<DtDiscountTeenCardStep1
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...data
			}}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F266
 */
DtDiscountTeenCardStep1.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function DtDiscountTeenCardStep1({data, fncCallbackEvent}) {

	return (
		<>
			<div className={'flex flex-col gap-36 page-bottom-space'}>
				<InputText
					size={'lg'}
					fitWidth={true}
					title={'카드번호'}
					essential={true}
					placeholder={'0000-0000-0000-0000'}
					allows={['num']}
					maxLength={19}
					status={fncValiState('cardNoEncpt', data.valid)}
					message={fncValiState('carcardNoEncptdNo', data.valid) === 'warning' && '카드번호를 다시 입력해주세요.'}
					id={'cardNoEncpt'}
					value={fncMaskCardNo(data.cardNoEncpt)}
					onChange={(e) => fncCallbackEvent('changeInput', e)}
				/>
				<InputText
					size={'lg'}
					fitWidth={true}
					title={'이름'}
					essential={true}
					placeholder={'이름 입력'}
					allows={['kor', 'eng']}
					status={fncValiState('custNm', data.valid)}
					message={fncValiState('custNm', data.valid) === 'warning' && '이름을 다시 입력해주세요.'}
					id={'custNm'}
					value={data.custNm}
					onChange={(e) => fncCallbackEvent('changeInput', e)}
				/>
				<InputText
					size={'lg'}
					fitWidth={true}
					title={'생년월일'}
					essential={true}
					placeholder={'YYYYMMDD'}
					allows={['num']}
					maxLength={8}
					status={fncValiState('custBrdt', data.valid)}
					message={fncValiState('custBrdt', data.valid) === 'warning' && '생년월일을 다시 입력해주세요.'}
					id={'custBrdt'}
					value={data.custBrdt}
					onChange={(e) => fncCallbackEvent('changeInput', e)}
				/>
				<InputText
					size={'lg'}
					fitWidth={true}
					title={'휴대폰번호'}
					essential={true}
					placeholder={`'-'없이 숫자만 입력`}
					allows={['num']}
					maxLength={11}
					status={fncValiState('mblTelno', data.valid)}
					message={fncValiState('mblTelno', data.valid) === 'warning' && '휴대폰번호를 다시 입력해주세요.'}
					id={'mblTelno'}
					value={data.mblTelno}
					onChange={(e) => fncCallbackEvent('changeInput', e)}
				/>
				<InputText
					size={'lg'}
					fitWidth={true}
					title={'고등학교 졸업예정 일자'}
					essential={true}
					placeholder={'YYYYMMDD'}
					allows={['num']}
					maxLength={8}
					status={fncValiState('hsclGrdtnPrnmntYmd', data.valid)}
					message={fncValiState('hsclGrdtnPrnmntYmd', data.valid) === 'warning' && '고등학교 졸업예정 일자를 다시 입력해주세요.'}
					id={'hsclGrdtnPrnmntYmd'}
					value={data.hsclGrdtnPrnmntYmd}
					onChange={(e) => fncCallbackEvent('changeInput', e)}
				/>
				<FileUpload
					fileArr={data.atchFileList}
					comments={['개인정보 보호를 위해 재학증명서 첨부 시 주민등록번호는 생년월일만 보이도록 가려주세요.']}
					onUpdate={(files) => fncCallbackEvent('updateUploaded', files)}
				/>
				<div className={'checkbox-wrap'}>
					<Checkbox
						type={'square'}
						label={'개인정보 수집 및 이용에 관한 동의'}
						essentialLabel={'필수'}
						isChecked={data.prvcClctUtztnAgreYn}
						onChange={() => fncCallbackEvent('updateObj', {prvcClctUtztnAgreYn: !data.prvcClctUtztnAgreYn})}
					/>
					<div className={'term-wrap'}>
						<ToastViewer
							className={'text-dynamic-text-neutral-primary dark:text-dynamic-text-neutral-primary'}
							initialValue={data?.termDscnPii?.trmsDtlCn ?? ''}
						/>
					</div>
				</div>
				<div className={'checkbox-wrap'}>
					<Checkbox
						type={'square'}
						label={'청소년 요금 사용기간 연장 신청 안내'}
						essentialLabel={'필수'}
						isChecked={data.yuthFareUseExtnsnAplyLeadYn}
						onChange={() => fncCallbackEvent('updateObj', {yuthFareUseExtnsnAplyLeadYn: !data.yuthFareUseExtnsnAplyLeadYn})}
					/>
					<div className={'term-wrap'}>
						<ToastViewer
							className={'text-dynamic-text-neutral-primary dark:text-dynamic-text-neutral-primary'}
							initialValue={data?.termExtendYouth?.trmsDtlCn ?? ''}
						/>
					</div>
				</div>
				<div className={'mt-12'}>
					<CommentInfo
						title={'할인대상'}
						list={[
							{
								id: 'd-0', textColor: 'text-dynamic-text-alert-primary',
								message: '청소년 연령 이상이지만 학생인 경우',
							},
						]}
					/>
				</div>
				<CommentInfo
					title={'등록안내'}
					list={[
						{
							id: 'd-0', textColor: 'text-dynamic-text-neutral-secondary',
							message: '할인 대상의 경우 할인카드 등록을 하시면 대중교통(버스, 지하철) 이용시 할인 혜택을 받으실 수 있습니다.',
						}
					]}
				/>
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
							message: '할인 등록시 정확한 정보를 입력하셔야 할인 요금을 적용 받으실 수 있으며, 허위정보 및 타인 입력으로 발생된 고객 불이익 및 변경된 정보로 인한 문제에 대해서는 등록자의 책임임을 유의하여 주시기 바랍니다.'
						}
					]}
				/>
			</div>
			<div className={'flex justify-center gap-12'}>
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
					text={'저장'}
					ariaLabel={'저장'}
					customStyle={'w-[240px]'}
					onClick={() => fncCallbackEvent('save')}
					disabled={data.blockNext}
				/>
			</div>
		</>
	)
}

/**
 * @description: Mobile
 * @screenID:    -
 */
MoDiscountTeenCardStep1.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function MoDiscountTeenCardStep1({data, fncCallbackEvent}) {
	
	// 팝업: 약관
	const [termId, setTermId] = useState(null);
	
	// 약관 팝업 열기
	const fncShowTermsPop = (id) => {
		if(!id) return;
		setTermId(id);
	}
	
	// 약관 팝업 닫기
	const fncCloseTermsPop = () => {
		setTermId(null);
	}
	
	// 약관 동의하고 팝업 닫기
	const fncAgreeTerms = () => {
		const replaceVar = termId.replace('term', 'agre');
		fncCallbackEvent('updateObj', {[replaceVar]: true});
		fncCloseTermsPop();
	}
	
	return (
		<>
			<h1 id={'page-name-mo'} className={'page-title'}>
				{`청소년 연령초과 학생 할인\n정보를 입력해 주세요`}
			</h1>
			<div className={'flex flex-col gap-30 page-bottom-space'}>
				<InputText
					size={'lg'}
					fitWidth={true}
					title={'카드번호'}
					essential={true}
					placeholder={'0000-0000-0000-0000'}
					allows={['num']}
					maxLength={19}
					status={fncValiState('cardNoEncpt', data.valid)}
					message={fncValiState('cardNoEncpt', data.valid) === 'warning' && '카드번호를 다시 입력해주세요.'}
					id={'cardNoEncpt'}
					value={fncMaskCardNo(data.cardNoEncpt)}
					onChange={(e) => fncCallbackEvent('changeInput', e)}
				/>
				<InputText
					size={'lg'}
					fitWidth={true}
					title={'이름'}
					essential={true}
					placeholder={'이름 입력'}
					allows={['kor', 'eng']}
					status={fncValiState('custNm', data.valid)}
					message={fncValiState('custNm', data.valid) === 'warning' && '이름을 다시 입력해주세요.'}
					id={'custNm'}
					value={data.custNm}
					onChange={(e) => fncCallbackEvent('changeInput', e)}
				/>
				<InputText
					size={'lg'}
					fitWidth={true}
					title={'생년월일'}
					essential={true}
					placeholder={'YYYYMMDD'}
					allows={['num']}
					maxLength={8}
					status={fncValiState('custBrdt', data.valid)}
					message={fncValiState('custBrdt', data.valid) === 'warning' && '생년월일을 다시 입력해주세요.'}
					id={'custBrdt'}
					value={data.custBrdt}
					onChange={(e) => fncCallbackEvent('changeInput', e)}
				/>
				<InputText
					size={'lg'}
					fitWidth={true}
					title={'휴대폰번호'}
					essential={true}
					placeholder={`'-'없이 숫자만 입력`}
					allows={['num']}
					maxLength={11}
					status={fncValiState('mblTelno', data.valid)}
					message={fncValiState('mblTelno', data.valid) === 'warning' && '휴대폰번호를 다시 입력해주세요.'}
					id={'mblTelno'}
					value={data.mblTelno}
					onChange={(e) => fncCallbackEvent('changeInput', e)}
				/>
				<InputText
					size={'md'}
					fitWidth={true}
					title={'고등학교 졸업예정 일자'}
					essential={true}
					placeholder={'YYYYMMDD'}
					allows={['num']}
					maxLength={8}
					status={fncValiState('hsclGrdtnPrnmntYmd', data.valid)}
					message={fncValiState('hsclGrdtnPrnmntYmd', data.valid) === 'warning' && '고등학교 졸업예정 일자를 다시 입력해주세요.'}
					id={'hsclGrdtnPrnmntYmd'}
					value={data.hsclGrdtnPrnmntYmd}
					onChange={(e) => fncCallbackEvent('changeInput', e)}
				/>
				<FileUpload
					fileArr={data.atchFileList}
					comments={['개인정보 보호를 위해 재학증명서 첨부 시 주민등록번호는 생년월일만 보이도록 가려주세요.']}
					onUpdate={(files) => fncCallbackEvent('updateUploaded', files)}
				/>
				<div className={'flex-col-start'}>
					<div className={'checkbox-wrap'}>
						<Checkbox
							type={'brand'}
							label={'개인정보 수집 및 이용에 관한 동의'}
							essentialLabel={'필수'}
							isChecked={data.prvcClctUtztnAgreYn}
							onChange={() => fncCallbackEvent('updateObj', {prvcClctUtztnAgreYn: !data.prvcClctUtztnAgreYn})}
						/>
						<button
							className={'terms'}
							onClick={() => fncShowTermsPop('termDscnPii')}
							onKeyDown={(e) => {
								if (e.key === 'Enter') fncShowTermsPop('termDscnPii');
							}}>
							보기
						</button>
					</div>
					<div className={'checkbox-wrap'}>
						<Checkbox
							type={'brand'}
							label={'청소년 요금 사용기간 연장 신청 안내'}
							essentialLabel={'필수'}
							isChecked={data.yuthFareUseExtnsnAplyLeadYn}
							onChange={() => fncCallbackEvent('updateObj', {yuthFareUseExtnsnAplyLeadYn: !data.yuthFareUseExtnsnAplyLeadYn})}
						/>
						<button
							className={'terms'}
							onClick={() => fncShowTermsPop('termExtendYouth')}
							onKeyDown={(e) => {
								if (e.key === 'Enter') fncShowTermsPop('termExtendYouth');
							}}>
							보기
						</button>
					</div>
				</div>
				<div className={'mt-10'}>
					<CommentInfo
						title={'할인대상'}
						list={[
							{
								id: 'd-0', textColor: 'text-dynamic-text-alert-primary',
								message: '청소년 연령 이상이지만 학생인 경우',
							},
						]}
					/>
				</div>
				<CommentInfo
					title={'등록안내'}
					list={[
						{
							id: 'd-0', textColor: 'text-dynamic-text-neutral-secondary',
							message: '할인 대상의 경우 할인카드 등록을 하시면 대중교통(버스, 지하철) 이용시 할인 혜택을 받으실 수 있습니다.',
						}
					]}
				/>
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
							message: '할인 등록시 정확한 정보를 입력하셔야 할인 요금을 적용 받으실 수 있으며, 허위정보 및 타인 입력으로 발생된 고객 불이익 및 변경된 정보로 인한 문제에 대해서는 등록자의 책임임을 유의하여 주시기 바랍니다.'
						}
					]}
				/>
			</div>
			<div className={'flex-row-center gap-8'}>
				<Button
					theme={'secondary'}
					size={'lg'}
					text={'취소'}
					ariaLabel={'취소'}
					customStyle={'w-full'}
					onClick={() => fncCallbackEvent('goBack')}
				/>
				<Button
					theme={'primary'}
					size={'lg'}
					text={'저장'}
					ariaLabel={'저장'}
					customStyle={'w-full'}
					onClick={() => fncCallbackEvent('save')}
					disabled={data.blockNext}
				/>
			</div>
			
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
		</>
	)
}
