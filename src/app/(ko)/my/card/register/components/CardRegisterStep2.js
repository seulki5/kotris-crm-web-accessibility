'use client'

import React, {useLayoutEffect, useState} from "react";
import PropTypes from "prop-types";
import {useMutation} from "@tanstack/react-query";

// modules
import {useScreenSizeContext} from "@modules/context/ScreenContext";
import {IssueCardOptions} from "@modules/consants/Options";
import {useApi} from "@modules/services/useApi";
import {apiCheckCard, apiCheckRelaxCard} from "@/app/_actions/mypage.action";
import {usePopContext} from "@modules/context/PopContext";
import {validate, VALIDATE_RULES} from "@modules/utils/ValidateUtils";
import {useUserContext} from "@modules/context/UserContext";
import {fncMaskCardNo} from "@modules/utils/StringUtils";

// components
import Button from "@components/common/Button";
import InputText from "@components/common/InputText";
import InputWithButton from "@components/composite/InputWithButton";
import ToggleSwitch from "@components/common/ToggleSwitch";
import CommentInfo from "@components/composite/CommentInfo";
import CommentWarning from "@components/composite/CommentWarning";
import CommentTable from "@components/composite/CommentTable";
import TaxDeductionPop from "@components/popup/TaxDeductionPop";
import Checkbox from "@components/common/Checkbox";
import TermsPop from "@components/popup/TermsPop";
import dynamic from "next/dynamic";
import Loading from "@/app/loading";
const ToastViewer = dynamic(() => import('@components/common/Editor'), {
	ssr: false,
	loading: () => <Loading />
})


/**
 * @description: 카드 등록 > 정보 입력 화면 입니다.
 * @screenID:    UI-CRM-F227, UI-CRM-F455
 * @screenPath:  홈 > 마이페이지 > 내 카드 > 카드 등록
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
CardRegisterStep2.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export default function CardRegisterStep2({data, fncCallbackEvent}) {

	const {isMobile} = useScreenSizeContext();
	const {jsonApiAction} = useApi();
	const {fncShowPop, fncClosePop} = usePopContext();
	const {fncEncode} = useUserContext();

	// 유효성
	const [valid, setValid] = useState({state: 'default', message: null});1

	// 다음단계
	const [blockNext, setBlockNext] = useState(true);

	// --Api
	// 카드 검증
	const {mutate: mutCheckRelaxCard} = useMutation({
		mutationKey: ['mutCheckRelaxCard'],
		mutationFn: (payload) => jsonApiAction(apiCheckRelaxCard, {...payload, __localHandle: true}),
		onSuccess: (res) => {
			if(res?.rsltYn === 'Y') {
				fncCallbackEvent('updateObj', {passCardCheck: true});
				setValid({
					state: 'success',
					message: '카드조회가 완료되었습니다.'
				});

			} else {
				fncCallbackEvent('updateObj', {passCardCheck: false});
				if(res?.msg?.includes('아닙니다')) {
					setValid({
						state: 'warning',
						message: '대중교통안심카드가 아닙니다.'
					});
				} else if(res?.msg?.includes('CU 레일플러스') || res?.msg?.includes('토스유스')) {
					fncShowPop({
						mainText: res.msg,
						primaryText: '확인',
						onClickPrimary: () => fncClosePop()
					});
				} else {
					setValid({
						state: 'warning',
						message: res?.msg || ''
					});
				}
			}
		},
		onError: () => {
			fncCallbackEvent('updateObj', {passCardCheck: false});
			setValid({
				state: 'warning',
				message: '카드 번호 조회에 실패했습니다.'
			});
		}
	})

	const {mutate: mutCheckDefaultCard} = useMutation({
		mutationKey: ['mutCheckDefaultCard'],
		mutationFn: (payload) => jsonApiAction(apiCheckCard, {...payload, __localHandle: true}),
		onSuccess: (res) => {
			if(res?.rsltYn === 'Y') {
				fncCallbackEvent('updateObj', {passCardCheck: true});
				setValid({
					state: 'success',
					message: '카드조회가 완료되었습니다.'
				});
			} else if(res?.msg?.includes('CU 레일플러스') || res?.msg?.includes('토스유스')) {
				fncShowPop({
					mainText: res.msg,
					primaryText: '확인',
					onClickPrimary: () => fncClosePop()
				});
			} else {
				fncCallbackEvent('updateObj', {passCardCheck: false});
				setValid({
					state: 'warning',
					message: res?.msg ?? '카드 번호 조회에 실패했습니다.'
				});
			}
		},
		onError: () => {
			fncCallbackEvent('updateObj', {passCardCheck: false});
			setValid({
				state: 'warning',
				message: '카드 번호 조회에 실패했습니다.'
			});
		}
	})

	useLayoutEffect(() => {
		setBlockNext(!(data.agreCardRegPii && data.passCardCheck));
	}, [data.agreCardRegPii, data.passCardCheck]);

	// 카드번호 조회
	const fncCheckCardNo = async () => {
		if(!data.cardNoEncpt) {
			return fncShowPop({
				mainText: '카드번호를 입력해주세요.',
				primaryText: '확인',
				onClickPrimary: () => fncClosePop()
			})
		}

		let rules = {
			cardNoEncpt: [
				{type: VALIDATE_RULES.NUMERIC},
			],
		}

		if(data.cardNcknmNm.length > 0) {
			rules = {
				...rules,
				cardNcknmNm: [
					{type: VALIDATE_RULES.MAX_LENGTH, value: 6},
				]
			};
		}

		const res = validate(data, rules);
		if(Object.keys(res).length === 0) {
			const encodedNo = await fncEncode(data.cardNoEncpt)
			if(!encodedNo) return;

			// 대중교통안심
			if(data.utztnDsctnSeCd === IssueCardOptions[0].id) {
				mutCheckRelaxCard({cardNoEncpt: encodedNo});
			}

			// 일반
			if(data.utztnDsctnSeCd === IssueCardOptions[1].id) {
				mutCheckDefaultCard({cardNoEncpt: encodedNo});
			}

		} else {
			setValid({
				state: 'warning',
				message: res[0]
			});
		}
	}

	if (isMobile) return (
		<MoCardRegisterStep2
			fncCallbackEvent={fncCallbackEvent}
			fncCheckCardNo={fncCheckCardNo}
			data={{
				...data,
				blockNext,
				valid
			}}
        />
	);
	else return (
		<DtCardRegisterStep2
			fncCallbackEvent={fncCallbackEvent}
			fncCheckCardNo={fncCheckCardNo}
			data={{
				...data,
				blockNext,
				valid
			}}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F227
 */
DtCardRegisterStep2.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func,
	fncCheckCardNo: PropTypes.func
};
export function DtCardRegisterStep2({data, fncCallbackEvent, fncCheckCardNo}) {
	return (
		<>
			<div className={'flex flex-col gap-36'}>
				<InputWithButton
					size={'lg'}
					title={'카드번호'}
					essential={true}
					placeholder={'0000-0000-0000-0000'}
					allows={['num']}
					inputId={'cardNoEncpt'}
					buttonAriaLabel={'입력한 카드번호 조회'}
					status={data.valid.state}
					message={data.valid.message}
					buttonText={'조회'}
					maxLength={19}
					value={fncMaskCardNo(data.cardNoEncpt)}
					disabledButton={data.cardNoEncpt.length < 16}
					onChangeInput={(e) => fncCallbackEvent('changeInput', e)}
					onClickButton={fncCheckCardNo}
				/>
				<InputText
					size={'lg'}
					title={'별칭'}
					placeholder={'카드에 등록할 별칭 최대 20자리 입력'}
					allows={['alnum', 'kor', 'space']}
					id={'cardNcknmNm'}
					maxLength={20}
					fitWidth={true}
					value={data.cardNcknmNm}
					onChange={(e) => fncCallbackEvent('changeInput', e)}
				/>
				<div className={'flex-row-center'}>
					<p className={'text-body-3xl text-dynamic-icon-neutral-primary font-medium mr-20'}>
						소득공제 연동
					</p>
					<div className={'table-value'}>
						<ToggleSwitch
							size={'md'}
							isChecked={data?.earnDdcYn === 'Y'}
							label={data?.earnDdcYn === 'Y' ? '연동' : '미연동'}
							onChange={() => fncCallbackEvent('showDeduction')}
						/>
					</div>
				</div>
				<div className={'checkbox-wrap mb-48'}>
					<Checkbox
						type={'square'}
						label={'개인정보 수집 및 이용에 관한 동의'}
						essentialLabel={'필수'}
						isChecked={data.agreCardRegPii}
						onChange={() => fncCallbackEvent('updateObj', {agreCardRegPii: !data.agreCardRegPii})}
					/>
					<div className={'term-wrap'}>
						<ToastViewer
							className={'prose max-w-none dark:text-dynamic-text-neutral-primary'}
							initialValue={data?.termCardRegPii?.trmsDtlCn ?? ''}
						/>
					</div>
				</div>
				{
					// 대중교통안심카드 주석
					data.utztnDsctnSeCd === IssueCardOptions[0].id && (
						<>
							<CommentInfo
								title={'카드 등록 및 등록 혜택 안내'}
								list={[
									{
										id: 'd-0', textColor: 'text-dynamic-text-neutral-secondary',
										message: `주민등록번호 기준으로 1인 1카드만 등록/사용이 원칙이며, 타인에게 양도/양수할 수 없습니다.`,
									},
									{
										id: 'd-1', textColor: 'text-dynamic-text-neutral-secondary',
										message: `어린이, 청소년 카드는 반드시 사용 후 10일 이내 할인 카드 등록해야 버스/지하철 요금 할인은 받을 수 있습니다.`,
									},
									{
										id: 'd-2', textColor: 'text-dynamic-text-neutral-secondary',
										message: `개정된 조세특례제한법(2014.02.01 적용)에 따라 레일프러스카다로 사용한 모든 금액을 신용카드와 동일하게 소득공제 혜택을 받을실 수 있습니다.`,
									},
									{
										id: 'd-3', textColor: 'text-dynamic-text-neutral-secondary',
										composite: true,
										word: '국세청 홈페이지',
										url: 'https://www.nts.go.kr/',
										message: '소득공제 확인서는 연말에 국세청 홈페이지 통해서도 가능합니다.',
									},
									{
										id: 'd-4', textColor: 'text-dynamic-text-neutral-secondary',
										message: `카드를 분실해도 분실 신청을 통해 카드 내 충전 잔액을 환불받으실 수 있습니다.`,
									},
									{
										id: 'd-5', textColor: 'text-dynamic-text-neutral-secondary',
										message: `분실 신청 및 환불은 홈페이지 또는 Rail+ 앱 가입을 통한 카드 등록이 된 경우에만 가능합니다.`,
									},
								]}
							/>
							<CommentWarning
								title={'분실신청 및 환불 이후, 새로운 카드를 등록할 경우'}
								list={[
									{
										id: 'd-0', textColor: 'text-dynamic-text-neutral-secondary',
										message: `기존 카드를 '카드 해지' 이후 새 카드 '등록'을 진행하시기 바랍니다.`,
									},
									{
										id: 'd-1', textColor: 'text-dynamic-text-neutral-secondary',
										message: (
											<span>
									카드 해지는 <span
												className={'text-dynamic-text-brand-primary'}>[마이페이지 {`\u003e`} 내 카드]</span>에서 진행하실 수 있습니다.
								</span>
										),
									},
								]}
							/>
						</>
					)
				}
				{
					// 일반 Rail+ 카드 주석
					data.utztnDsctnSeCd === IssueCardOptions[1].id && (
						<>
							<CommentInfo
								title={'카드 발급 및 등록 혜택 안내'}
								list={[
									{
										id: 'd-0', textColor: 'text-dynamic-text-neutral-secondary',
										message: `카드 종류별 기본적인 카드 기능은 동일 카드 내 개인정보 기록 여부에 따라 기명과 무기명 카드로 구분하고 있습니다.`,
									},
									{
										id: 'd-1', textColor: 'text-dynamic-text-neutral-secondary',
										message: `코레일에서는 무기명카드만 발급하고 있습니다.`,
									},
									{
										id: 'd-2', textColor: 'text-dynamic-text-neutral-secondary',
										message: `어린이, 청소년 카드는 반드시 사용 후 10일 이내 할인 카드 등록해야 버스/지하철 요금 할인은 받을 수 있습니다.`,
									},
									{
										id: 'd-3', textColor: 'text-dynamic-text-neutral-secondary',
										message: `개정된 조세특례제한법(2014.02.01 적용)에 따라 레일프러스카다로 사용한 모든 금액을 신용카드와 동일하게 소득공제 혜택을 받을실 수 있습니다.`,
									},
									{
										id: 'd-4', textColor: 'text-dynamic-text-neutral-secondary',
										composite: true,
										word: '국세청 홈페이지',
										url: 'https://www.nts.go.kr/',
										message: '소득공제 확인서는 연말에 국세청 홈페이지 통해서도 가능합니다.',
									},
								]}
							/>
							<CommentTable type={'issue'}/>
							<CommentInfo
								title={'CU레일플러스카드 및 토스유스카드 안내'}
								list={[
									{
										id: 'd-0', textColor: 'text-dynamic-text-neutral-secondary',
										message: 'CU레일플러스카드의 어린이/청소년 할인요금 적용은 CU 편의점에서 생년월일 등록 후 가능합니다.',
									},
									{
										id: 'd-1', textColor: 'text-dynamic-text-neutral-secondary',
										message: 'CU레일플러스카드의 할인요금 적용은 가까운 CU 편의점을 방문하여 주시기 바랍니다. (별도 등록 불필요)',
									},
									{
										id: 'd-2', textColor: 'text-dynamic-text-neutral-secondary',
										message: '토스유스카드의 어린이/청소년 할인요금은 발급 시 적용됩니다. (별도 등록 불필요)',
									},
								]}
							/>
						</>
					)
				}
			</div>
			<div className={'page-bottom-button-wrap'}>
				<Button
					theme={'primary'}
					size={'xl'}
					text={'등록'}
					ariaLabel={'등록'}
					customStyle={'w-[240px]'}
					disabled={data.blockNext}
					onClick={() => fncCallbackEvent('add')}
				/>
			</div>

			{
				// 팝업: 소득공제
				data.popTaxDeduction && (
					<TaxDeductionPop
						store={data}
						onClose={() => fncCallbackEvent('closeDeduction')}
						onDone={(obj) => fncCallbackEvent('updateObj', obj)}
					/>
				)
			}
		</>
	)
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F455
 */
MoCardRegisterStep2.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func,
	fncCheckCardNo: PropTypes.func
};
export function MoCardRegisterStep2({data, fncCallbackEvent, fncCheckCardNo}) {

	// 팝업: 약관
	const [termId, setTermId] = useState(null);

	// 약관 팝업 열기
	const fncShowTermsPop = () => {
		setTermId('termCardRegPii');
	}

	// 약관 팝업 닫기
	const fncCloseTermsPop = () => {
		setTermId(null);
	}

	return (
		<>
			<div className={'flex flex-col gap-20 page-bottom-space'}>
				<p className={'page-title mb-40'} aria-describedby={'legond-card-type-mo'}>
					{`${data.utztnDsctnSeNm}의\n정보를 입력해 주세요`}
				</p>
				<InputWithButton
					size={'md'}
					title={'카드번호'}
					essential={true}
					placeholder={'0000-0000-0000-0000'}
					allows={['num']}
					inputId={'cardNoEncpt'}
					buttonAriaLabel={'입력한 카드번호 조회'}
					status={data.valid.state}
					message={data.valid.message}
					buttonText={'조회'}
					maxLength={19}
					value={fncMaskCardNo(data.cardNoEncpt)}
					disabledButton={data.cardNoEncpt.length < 16}
					onChangeInput={(e) => fncCallbackEvent('changeInput', e)}
					onClickButton={fncCheckCardNo}
				/>
				<InputText
					size={'md'}
					title={'별칭'}
					placeholder={'카드에 등록할 별칭 최대 20자리 입력'}
					allows={['alnum', 'kor', 'space']}
					id={'cardNcknmNm'}
					maxLength={20}
					fitWidth={true}
					value={data.cardNcknmNm}
					onChange={(e) => fncCallbackEvent('changeInput', e)}
				/>
				<div className={'flex-row-center justify-between mb-48 mo:my-40'}>
					<p className={'text-body-3xl text-dynamic-icon-neutral-primary font-medium mr-20 mo:text-body-2xl'}>
						소득공제 연동
					</p>
					<div className={'table-value'}>
						<ToggleSwitch
							size={'md'}
							isChecked={data?.earnDdcYn === 'Y'}
							label={data?.earnDdcYn === 'Y' ? '연동' : '미연동'}
							onChange={() => fncCallbackEvent('showDeduction')}
						/>
					</div>
				</div>
				<div className={'checkbox-wrap'}>
					<Checkbox
						type={'brand'}
						label={'개인정보 수집 및 이용에 관한 동의'}
						essentialLabel={'필수'}
						isChecked={data.agreCardRegPii}
						onChange={() => fncCallbackEvent('updateObj', {agreCardRegPii: !data.agreCardRegPii})}
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
				{
					// 대중교통안심카드 주석
					data.utztnDsctnSeCd === IssueCardOptions[0].id && (
						<>
							<CommentInfo
								title={'카드 등록 및 등록 혜택 안내'}
								list={[
									{
										id: 'd-0', textColor: 'text-dynamic-text-neutral-secondary',
										message: `주민등록번호 기준으로 1인 1카드만 등록/사용이 원칙이며, 타인에게 양도/양수할 수 없습니다.`,
									},
									{
										id: 'd-1', textColor: 'text-dynamic-text-neutral-secondary',
										message: `어린이, 청소년 카드는 반드시 사용 후 10일 이내 할인 카드 등록해야 버스/지하철 요금 할인은 받을 수 있습니다.`,
									},
									{
										id: 'd-2', textColor: 'text-dynamic-text-neutral-secondary',
										message: `개정된 조세특례제한법(2014.02.01 적용)에 따라 레일프러스카다로 사용한 모든 금액을 신용카드와 동일하게 소득공제 혜택을 받을실 수 있습니다.`,
									},
									{
										id: 'd-3', textColor: 'text-dynamic-text-neutral-secondary',
										composite: true,
										word: '국세청 홈페이지',
										url: 'https://www.nts.go.kr/',
										message: '소득공제 확인서는 연말에 국세청 홈페이지 통해서도 가능합니다.',
									},
									{
										id: 'd-4', textColor: 'text-dynamic-text-neutral-secondary',
										message: `카드를 분실해도 분실 신청을 통해 카드 내 충전 잔액을 환불받으실 수 있습니다.`,
									},
									{
										id: 'd-5', textColor: 'text-dynamic-text-neutral-secondary',
										message: `분실 신청 및 환불은 홈페이지 또는 Rail+ 앱 가입을 통한 카드 등록이 된 경우에만 가능합니다.`,
									},
								]}
							/>
							<CommentWarning
								title={'분실신청 및 환불 이후, 새로운 카드를 등록할 경우'}
								list={[
									{
										id: 'd-0', textColor: 'text-dynamic-text-neutral-secondary',
										message: `기존 카드를 '카드 해지' 이후 새 카드 '등록'을 진행하시기 바랍니다.`,
									},
									{
										id: 'd-1', textColor: 'text-dynamic-text-neutral-secondary',
										message: (
											<span>
									카드 해지는 <span
												className={'text-dynamic-text-brand-primary'}>[마이페이지 {`\u003e`} 내 카드]</span>에서 진행하실 수 있습니다.
								</span>
										),
									},
								]}
							/>
						</>
					)
				}
				{
					// 일반 Rail+ 카드 주석
					data.utztnDsctnSeCd === IssueCardOptions[1].id && (
						<>
							<CommentInfo
								title={'카드 발급 및 등록 혜택 안내'}
								list={[
									{
										id: 'd-0', textColor: 'text-dynamic-text-neutral-secondary',
										message: `카드 종류별 기본적인 카드 기능은 동일 카드 내 개인정보 기록 여부에 따라 기명과 무기명 카드로 구분하고 있습니다.`,
									},
									{
										id: 'd-1', textColor: 'text-dynamic-text-neutral-secondary',
										message: `코레일에서는 무기명카드만 발급하고 있습니다.`,
									},
									{
										id: 'd-2', textColor: 'text-dynamic-text-neutral-secondary',
										message: `어린이, 청소년 카드는 반드시 사용 후 10일 이내 할인 카드 등록해야 버스/지하철 요금 할인은 받을 수 있습니다.`,
									},
									{
										id: 'd-3', textColor: 'text-dynamic-text-neutral-secondary',
										message: `개정된 조세특례제한법(2014.02.01 적용)에 따라 레일프러스카다로 사용한 모든 금액을 신용카드와 동일하게 소득공제 혜택을 받을실 수 있습니다.`,
									},
									{
										id: 'd-4', textColor: 'text-dynamic-text-neutral-secondary',
										composite: true,
										word: '국세청 홈페이지',
										url: 'https://www.nts.go.kr/',
										message: '소득공제 확인서는 연말에 국세청 홈페이지 통해서도 가능합니다.',
									},
								]}
							/>
							<CommentTable type={'issue'}/>
							<CommentInfo
								title={'CU레일플러스카드 및 토스유스카드 안내'}
								list={[
									{
										id: 'd-0', textColor: 'text-dynamic-text-neutral-secondary',
										message: 'CU레일플러스카드의 어린이/청소년 할인요금 적용은 CU 편의점에서 생년월일 등록 후 가능합니다.',
									},
									{
										id: 'd-1', textColor: 'text-dynamic-text-neutral-secondary',
										message: 'CU레일플러스카드의 할인요금 적용은 가까운 CU 편의점을 방문하여 주시기 바랍니다. (별도 등록 불필요)',
									},
									{
										id: 'd-2', textColor: 'text-dynamic-text-neutral-secondary',
										message: '토스유스카드의 어린이/청소년 할인요금은 발급 시 적용됩니다. (별도 등록 불필요)',
									},
								]}
							/>
						</>
					)
				}
			</div>
			<div className={'page-bottom-button-wrap'}>
				<Button
					theme={'primary'}
					size={'lg'}
					text={'등록'}
					ariaLabel={'등록'}
					customStyle={'w-full'}
					disabled={data.blockNext}
					onClick={() => fncCallbackEvent('add')}
				/>
			</div>

			{
				// 팝업: 소득공제
				data.popTaxDeduction && (
					<TaxDeductionPop
						store={{
							cardNcknmNm: data.cardNcknmNm,
							cardNoEncpt: data.cardNoEncpt,
							utztnDsctnSeCd: data.utztnDsctnSeCd,
							utztnDsctnSeNm: data.utztnDsctnSeNm,
							agreCardRegPii: data.agreCardRegPii,
							passCardCheck: data.passCardCheck,
							moRealnameRes: data.moRealnameRes
						}}
						onClose={() => fncCallbackEvent('closeDeduction')}
						onDone={(obj) => fncCallbackEvent('updateObj', obj)}
					/>
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
		</>
	)
}
