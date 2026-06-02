'use client'

import React, {useState} from 'react';
import PropTypes from 'prop-types';
import dynamic from "next/dynamic";

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {fncValiState} from "@modules/utils/ValidateUtils";

// components
import Button from '@components/common/Button';
import InputText from '@components/common/InputText';
import CommentInfo from "@components/composite/CommentInfo";
import FieldTitle from "@components/composite/FieldTitle";
import FileUpload from "@components/composite/FileUpload";
import FileDownload from "@components/composite/FileDownload";
import Checkbox from "@components/common/Checkbox";
import TermsPop from "@components/popup/TermsPop";
import Loading from "@/app/loading";
const ToastViewer = dynamic(() => import('@components/common/Editor'), {
	ssr: false,
	loading: () => <Loading />
})


/**
 * @description: 어린이 안심서비스 내 자녀 등록/수정 화면 입니다.
 * @screenID:    UI-CRM-F248, UI-CRM-F479
 * @screenPath:  홈 > 마이페이지 > 어린이 안심서비스 > 내 자녀 등록/수정
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
ChildproofRegisterStep1.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export default function ChildproofRegisterStep1({data, fncCallbackEvent}) {
	
	const {isMobile} = useScreenSizeContext();
	if (isMobile) return (
		<MoChildproofRegisterStep1
			fncCallbackEvent={fncCallbackEvent}
			data={data}
        />
	);
	else return (
		<DtChildproofRegisterStep1
			fncCallbackEvent={fncCallbackEvent}
			data={data}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F248
 */
DtChildproofRegisterStep1.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function DtChildproofRegisterStep1({data, fncCallbackEvent}) {
	return (
		<>
			<div className={'flex flex-col gap-36'}>
				<InputText
					size={'lg'}
					fitWidth={true}
					title={'자녀 이름'}
					essential={true}
					placeholder={'자녀 이름 입력'}
					allows={['kor', 'eng']}
					maxLength={10}
					status={fncValiState('cdrnNm', data.valid)}
					message={fncValiState('cdrnNm', data.valid) === 'warning' && '자녀 이름을 다시 입력해주세요.'}
					id={'cdrnNm'}
					value={data.cdrnNm}
					onChange={(e) => fncCallbackEvent('changeInput', e)}
				/>
				<InputText
					size={'lg'}
					fitWidth={true}
					title={'자녀 아이디'}
					essential={true}
					placeholder={'자녀 아이디 입력'}
					allows={['alnum']}
					maxLength={20}
					status={fncValiState('cdrnWebMbrId', data.valid)}
					message={fncValiState('cdrnWebMbrId', data.valid) === 'warning' && '자녀 아이디를 다시 입력해주세요.'}
					id={'cdrnWebMbrId'}
					value={data.cdrnWebMbrId}
					onChange={(e) => fncCallbackEvent('changeInput', e)}
				/>
				<InputText
					size={'lg'}
					fitWidth={true}
					title={'자녀 생년월일'}
					essential={true}
					placeholder={'예) 20250101 YYYYMMDD'}
					allows={['num']}
					maxLength={8}
					status={fncValiState('cdrnBrdt', data.valid)}
					message={fncValiState('cdrnBrdt', data.valid) === 'warning' && '자녀 생년월일을 다시 입력해주세요.'}
					id={'cdrnBrdt'}
					value={data.cdrnBrdt}
					onChange={(e) => fncCallbackEvent('changeInput', e)}
				/>
				<fieldset role={'group'} aria-label={'신청서 다운로드'}>
					<FieldTitle title={'신청서'} essential={true}/>
					<FileDownload
						type={'button'}
						name={'신청서 다운로드'}
						fileName={'어린이 안심서비스 신청서.hwp'}
						fileId={process.env.NEXT_PUBLIC_FILE_ID_FORM_CHILDPROOF}
					/>
				</fieldset>
				<FileUpload
					fileArr={data.atchFileList}
					onUpdate={(files) => fncCallbackEvent('updateUploaded', files)}
				/>
				<div className={'checkbox-wrap'}>
					<Checkbox
						type={'square'}
						label={'개인정보 수집 및 이용에 관한 동의'}
						essentialLabel={'필수'}
						isChecked={data.agreChdpfPii}
						onChange={() => fncCallbackEvent('updateObj', {agreChdpfPii: !data.agreChdpfPii})}
					/>
					<div className={'term-wrap'}>
						<ToastViewer
							className={'text-dynamic-text-neutral-primary dark:text-dynamic-text-neutral-primary'}
							initialValue={data?.termChdpfPii?.trmsDtlCn ?? ''}
						/>
					</div>
				</div>
				<div className={'mt-12'}>
					<CommentInfo
						title={'할인대상'}
						list={[
							{
								id: 'd-0', textColor: 'text-dynamic-text-alert-primary',
								message: '서비스 대상 : 만 6세 ~ 만 14세 미만의 어린이',
							},
							{
								id: 'd-1', textColor: 'text-dynamic-text-alert-primary',
								message: '서비스 만료 : 어린이가 만 14세가 되는 날 서비스 제공이 종료됩니다.',
							},
						]}
					/>
				</div>
				<CommentInfo
					title={'이용안내'}
					list={[
						{
							id: 'd-0', textColor: 'text-dynamic-text-neutral-secondary',
							message: '본 서비스의 신청인은 거래내역 정보를 제공할 만 14세 미만의 자녀로, 신청인이 만 14세 이상이 되는 경우, 서비스는 자동 종료됩니다.',
						},
						{
							id: 'd-1', textColor: 'text-dynamic-text-neutral-secondary',
							message: '레일플러스 회원 정보와 작성해주신 회원정보가 상이한 경우, 서비스 신청에 대한 승인은 이루어지지 않습니다.',
						},
						{
							id: 'd-2', textColor: 'text-dynamic-text-neutral-secondary',
							message: '신청인 본인이 반드시 자필로 서명해야 하며, 신청서와 주민등록번호 뒷자리가 가림 처리된 3개월 이내 발급된 가족관계(주민등록등본/가족관계증명서) 증빙서류 1부를 레일플러스 홈페이지 또는 앱에 업로드 해주시기 바랍니다.',
						},
					]}
				/>
			</div>
			<div className={'page-bottom-button-wrap'}>
				<Button
					theme={'secondary'}
					size={'xl'}
					text={'취소'}
					ariaLabel={'분실 신청 취소'}
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
 * @screenID:    UI-CRM-F479
 */
MoChildproofRegisterStep1.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function MoChildproofRegisterStep1({data, fncCallbackEvent}) {

	// 팝업: 약관
	const [termId, setTermId] = useState(null);

	// 약관 팝업 열기
	const fncShowTermsPop = () => {
		setTermId('termChdpfPii');
	}

	// 약관 팝업 닫기
	const fncCloseTermsPop = () => {
		setTermId(null);
	}

	// 약관 동의하고 팝업 닫기
	const fncAgreeTerms = () => {
		fncCallbackEvent('updateObj', {agreChdpfPii: true});
		fncCloseTermsPop();
	}

	return (
		<>
			<h1 id={'page-name-mo'} className={'page-title'}>
				{`등록할 자녀의\n정보를 입력해 주세요`}
			</h1>
			<div className={'flex flex-col gap-30 page-bottom-space'}>
				<InputText
					size={'lg'}
					fitWidth={true}
					title={'자녀 이름'}
					essential={true}
					placeholder={'자녀 이름 입력'}
					allows={['kor']}
					maxLength={10}
					status={fncValiState('cdrnNm', data.valid)}
					message={fncValiState('cdrnNm', data.valid) === 'warning' && '자녀 이름을 다시 입력해주세요.'}
					id={'cdrnNm'}
					value={data.cdrnNm}
					onChange={(e) => fncCallbackEvent('changeInput', e)}
				/>
				<InputText
					size={'lg'}
					fitWidth={true}
					title={'자녀 아이디'}
					essential={true}
					placeholder={'자녀 아이디 입력'}
					allows={['alnum']}
					maxLength={20}
					status={fncValiState('cdrnWebMbrId', data.valid)}
					message={fncValiState('cdrnWebMbrId', data.valid) === 'warning' && '자녀 아이디를 다시 입력해주세요.'}
					id={'cdrnWebMbrId'}
					value={data.cdrnWebMbrId}
					onChange={(e) => fncCallbackEvent('changeInput', e)}
				/>
				<InputText
					size={'lg'}
					fitWidth={true}
					title={'자녀 생년월일'}
					essential={true}
					placeholder={'예) 20250101 YYYYMMDD'}
					allows={['num']}
					maxLength={8}
					status={fncValiState('cdrnBrdt', data.valid)}
					message={fncValiState('cdrnBrdt', data.valid) === 'warning' && '자녀 생년월일을 다시 입력해주세요.'}
					id={'cdrnBrdt'}
					value={data.cdrnBrdt}
					onChange={(e) => fncCallbackEvent('changeInput', e)}
				/>
				<fieldset role={'group'} aria-label={'신청서 다운로드'}>
					<FieldTitle title={'신청서'} essential={true}/>
					<FileDownload
						type={'button'}
						name={'신청서 다운로드'}
						fileName={'어린이 안심서비스 신청서.hwp'}
						fileId={process.env.NEXT_PUBLIC_FILE_ID_FORM_CHILDPROOF}
					/>
				</fieldset>
				<FileUpload
					fileArr={data.atchFileList}
					onUpdate={(files) => fncCallbackEvent('updateUploaded', files)}
				/>
				<div className={'checkbox-wrap'}>
					<Checkbox
						type={'brand'}
						label={'개인정보 수집 및 이용에 관한 동의'}
						essentialLabel={'필수'}
						isChecked={data.agreChdpfPii}
						onChange={() => fncCallbackEvent('updateObj', {agreChdpfPii: !data.agreChdpfPii})}
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
				<div className={'mt-10'}>
					<CommentInfo
						title={'할인대상'}
						list={[
							{
								id: 'd-0', textColor: 'text-dynamic-text-alert-primary',
								message: '서비스 대상 : 만 6세 ~ 만 14세 미만의 어린이',
							},
							{
								id: 'd-1', textColor: 'text-dynamic-text-alert-primary',
								message: '서비스 만료 : 어린이가 만 14세가 되는 날 서비스 제공이 종료됩니다.',
							},
						]}
					/>
				</div>
				<CommentInfo
					title={'이용안내'}
					list={[
						{
							id: 'd-0', textColor: 'text-dynamic-text-neutral-secondary',
							message: '본 서비스의 신청인은 거래내역 정보를 제공할 만 14세 미만의 자녀로, 신청인이 만 14세 이상이 되는 경우, 서비스는 자동 종료됩니다.',
						},
						{
							id: 'd-1', textColor: 'text-dynamic-text-neutral-secondary',
							message: '레일플러스 회원 정보와 작성해주신 회원정보가 상이한 경우, 서비스 신청에 대한 승인은 이루어지지 않습니다.',
						},
						{
							id: 'd-2', textColor: 'text-dynamic-text-neutral-secondary',
							message: '신청인 본인이 반드시 자필로 서명해야 하며, 신청서와 주민등록번호 뒷자리가 가림 처리된 3개월 이내 발급된 가족관계(주민등록등본/가족관계증명서) 증빙서류 1부를 레일플러스 홈페이지 또는 앱에 업로드 해주시기 바랍니다.',
						},
					]}
				/>
			</div>
			<div className={'page-bottom-button-wrap'}>
				<Button
					theme={'secondary'}
					size={'lg'}
					text={'취소'}
					ariaLabel={'국가신분증 등록/수정 취소'}
					customStyle={'w-full'}
					onClick={() => fncCallbackEvent('goBack')}
				/>
				<Button
					theme={'primary'}
					size={'lg'}
					text={'저장'}
					ariaLabel={'국가신분증 저장'}
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
