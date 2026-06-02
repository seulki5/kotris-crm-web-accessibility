'use client'

import React, {useState} from 'react';
import PropTypes from 'prop-types';
import dynamic from "next/dynamic";

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {fncMaskCardNo} from "@modules/utils/StringUtils";
import {fncValiState} from "@modules/utils/ValidateUtils";

// components
import Button from '@components/common/Button';
import InputText from '@components/common/InputText';
import CommentInfo from "@components/composite/CommentInfo";
import Checkbox from "@components/common/Checkbox";
import TermsPop from "@components/popup/TermsPop";
import Loading from "@/app/loading";
const ToastViewer = dynamic(() => import('@components/common/Editor'), {
	ssr: false,
	loading: () => <Loading />
})


/**
 * @description: 국가신분증 등록/수정 화면 입니다.
 * @screenID:    UI-CRM-F241,  UI-CRM-F475,
 *               UI-CRM-F257
 * @screenPath:  홈 > 마이페이지 > 할인등록 > 국가신분증 등록/수정,
 *               홈 > 고객센터 > 비회원 할인등록 > 국가신분증 등록/수정
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
DiscountTeenRegisterStep1.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export default function DiscountTeenRegisterStep1({data, fncCallbackEvent}) {

	const {isMobile} = useScreenSizeContext();
	if (isMobile) return (
		<MoDiscountTeenCardStep1
			fncCallbackEvent={fncCallbackEvent}
			data={data}
        />
	);
	else return (
		<DtDiscountTeenCardStep1
			fncCallbackEvent={fncCallbackEvent}
			data={data}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F241, UI-CRM-F257
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
					message={fncValiState('cardNoEncpt', data.valid) === 'warning' && '카드번호를 다시 입력해주세요.'}
					id={'cardNoEncpt'}
					value={fncMaskCardNo(data.cardNoEncpt)}
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
					message={fncValiState('custBrdt', data.valid) === 'warning' && '할인대상이 아닙니다. 생년월일을 다시 입력해주세요.'}
					id={'custBrdt'}
					value={data.custBrdt}
					onChange={(e) => fncCallbackEvent('changeInput', e)}
				/>
				<div className={'checkbox-wrap'}>
					<Checkbox
						type={'square'}
						label={'개인정보 수집 및 이용에 관한 동의'}
						essentialLabel={'필수'}
						isChecked={data.agreDscnPii}
						onChange={() => fncCallbackEvent('updateObj', {agreDscnPii: !data.agreDscnPii})}
					/>
					<div className={'term-wrap'}>
						<ToastViewer
							className={'text-dynamic-text-neutral-primary dark:text-dynamic-text-neutral-primary'}
							initialValue={data.termDscnPii?.trmsDtlCn}
						/>
					</div>
				</div>
				<div className={'mt-12'}>
					<CommentInfo
						title={'할인대상'}
						list={[
							{
								id: 'd-0', textColor: 'text-dynamic-text-alert-primary',
								message: '어린이 : 만 9세 이상 ~ 만 12세 이하',
							},
							{
								id: 'd-1', textColor: 'text-dynamic-text-alert-primary',
								message: '청소년 : 만 13세 이상~ 만 18세 이하',
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
						},
						{
							id: 'd-1', textColor: 'text-dynamic-text-neutral-primary',
							message: '최초 사용일로부터 10일 이내 카드번호를 등록해 주셔야 지속적인 할인 혜택을을 받으실 수 있습니다.',
						},
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
					disabled={!(data.cardNoEncpt && data.custBrdt && data.agreDscnPii)}
				/>
			</div>
		</>
	)
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F475
 */
MoDiscountTeenCardStep1.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function MoDiscountTeenCardStep1({data, fncCallbackEvent}) {

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
		<>
			<div className={'flex-col-start-48'}>
				<h1 id={'page-name-mo'} className={'page-title'}>
					{`국가신분증(청소년증)\n정보를 입력해 주세요`}
				</h1>
				<div className={'flex-col-start gap-30 page-bottom-space'}>
					<InputText
						size={'md'}
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
						size={'md'}
						fitWidth={true}
						title={'생년월일'}
						essential={true}
						placeholder={'YYYYMMDD'}
						allows={['num']}
						maxLength={8}
						status={fncValiState('custBrdt', data.valid)}
						message={fncValiState('custBrdt', data.valid) === 'warning' && '할인대상이 아닙니다. 생년월일을 다시 입력해주세요.'}
						id={'custBrdt'}
						value={data.custBrdt}
						onChange={(e) => fncCallbackEvent('changeInput', e)}
					/>
					<div className={'checkbox-wrap'}>
						<Checkbox
							type={'brand'}
							label={'개인정보 수집 및 이용에 관한 동의'}
							essentialLabel={'필수'}
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
					<div className={'mt-10'}>
						<CommentInfo
							title={'할인대상'}
							list={[
								{
									id: 'd-0', textColor: 'text-dynamic-text-alert-primary',
									message: '어린이 : 만 9세 이상 ~ 만 12세 이하',
								},
								{
									id: 'd-1', textColor: 'text-dynamic-text-alert-primary',
									message: '청소년 : 만 13세 이상~ 만 18세 이하',
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
							},
							{
								id: 'd-1', textColor: 'text-dynamic-text-neutral-primary',
								message: '최초 사용일로부터 10일 이내 카드번호를 등록해 주셔야 지속적인 할인 혜택을을 받으실 수 있습니다.',
							},
						]}
					/>
				</div>
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
					disabled={!(data.cardNoEncpt && data.custBrdt && data.agreDscnPii)}
				/>
			</div>

			{
				termId && (
					<TermsPop
						data={data}
						id={termId}
						buttonLabel={'확인'}
						onClose={fncCloseTermsPop}
						onDone={fncCloseTermsPop}
					/>
				)
			}
		</>
	)
}
