'use client'

import React, {useLayoutEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {useMutation} from '@tanstack/react-query';
import {useSearchParams} from "next/navigation";
import dynamic from "next/dynamic";

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {useApi} from '@modules/services/useApi';
import {apiBankList, apiClaimCardList} from '@/app/_actions/mypage.action';
import {CODE} from '@modules/consants/Objects';
import {fncAllDefined, fncValiState} from '@modules/utils/ValidateUtils';
import {fncMaskCardNo} from "@modules/utils/StringUtils";
import {useUserContext} from "@modules/context/UserContext";
import {usePopContext} from "@modules/context/PopContext";
import {apiTerms} from "@/app/_actions/common.action";

// components
import Button from '@components/common/Button';
import InputText from '@components/common/InputText';
import Select from '@components/common/Select';
import Checkbox from '@components/common/Checkbox';
import CommentInfo from '@components/composite/CommentInfo';
import CommentTable from '@components/composite/CommentTable';
import TermsPop from "@components/popup/TermsPop";
import Loading from "@/app/loading";
const ToastViewer = dynamic(() => import('@components/common/Editor'), {
	ssr: false,
	loading: () => <Loading />
})


/**
 * @description: 환불신청 Step1 화면 입니다.
 * @screenID:    UI-CRM-F232-01, UI-CRM-F467-01
 * @screenPath:  홈 > 마이페이지 > 환불신청
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
CardLostStep1.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export default function CardLostStep1({data, fncCallbackEvent}) {

	const searchParams = useSearchParams();
	const cardNo = searchParams.get('no');
	const {isMobile} = useScreenSizeContext();
	const {jsonApiAction} = useApi();
	const {fncShowPop, fncClosePop} = usePopContext();
	const {isLogin} = useUserContext();

	// 은행 목록
    const [lostBankList, setLostBankList] = useState([]);

	// 카드 목록
	const [lostCardList, setLostCardList] = useState([]);

	// 다음 단계 이동 가능 여부
    const [blockNext, setBlockNext] = useState(true);

	// --Api
	// 은행 목록
	const {mutate: mutQueryBankList} = useMutation({
		mutationKey: ['mutQueryBankList'],
		mutationFn: () => jsonApiAction(apiBankList, {}),
		onSuccess: (res) => {
			if(res?.length) {
				const formMap = res.filter((el) => el.comnCdVlCn !== '00')?.map((bank) => ({
					id: bank.comnCdVlCn,
					name: bank.comnCdVlNm
				}))
				setLostBankList(formMap);
			}
		}
	})

	// 분실 약관 조회
	const {mutate: mutQueryTerms, data: termsLost} = useMutation({
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

	// 카드 목록
	const {mutate: mutQueryCardList} = useMutation({
		mutationKey: ['mutQueryCardList'],
		mutationFn: () => jsonApiAction(apiClaimCardList, {mypgCardSeCd: '02'}),
		onSuccess: (res) => {
			if(res?.length) {
				const formMap = res.filter(el => el.mypgCardSeCd === CODE.CARD_SEG_PLA_SAFE)?.map((card) => ({
					...card,
					id: card.cardNoEncpt,
					name: `${fncMaskCardNo(card.cardNoEncpt)} (${card.cardNcknmNm || '레일플러스'})`
				}))
				setLostCardList(formMap);

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
			mutQueryTerms({trmsTypeCd: process.env.NEXT_PUBLIC_PII_LOST});
			mutQueryCardList();
		}
	}, [isLogin]);

    useLayoutEffect(() => {
        let defined = fncAllDefined([
            data.rqstrNm,
            data.cardNoEncpt,
            data.micBankCd,
            data.bacntOwnrNm,
            data.dpstActnoEncpt,
            data.rqstrTelno,
            data.refundTerms,
        ]);

        setBlockNext (!defined);
    }, [data]);

	if (isMobile) return (
		<MoCardLostStep1
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...data,
				cardList: lostCardList,
				bankList: lostBankList,
                blockNext,
				termsLost
			}}
        />
	);
	else return (
		<DtCardLostStep1
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...data,
				cardList: lostCardList,
				bankList: lostBankList,
                blockNext,
				termsLost
			}}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F232-01
 */
DtCardLostStep1.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function DtCardLostStep1({data, fncCallbackEvent}) {

	return (
		<>
			<div className={'flex flex-col gap-36 lost-wrap'}>
				<InputText
					size={'lg'}
					fitWidth={true}
					title={'이름'}
					id={'rqstrNm'}
					value={data.rqstrNm}
					disabled={true}
				/>
				<div className={'relative'}>
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
					<div
						className={'flex items-center gap-2 px-5 absolute -top-[15px] left-[80px]'}
						style={{marginTop: fncValiState('cardNoEncpt', data.valid) ? 20 : 4}}
					>
						<p className={'text-body-sm text-dynamic-text-neutral-secondary font-normal'}>
							분실신청은 대중교통안심카드만 가능
						</p>
					</div>
				</div>
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
				<div className={'flex flex-col gap-12'}>
					<Checkbox
						type={'square'}
						label={'분실/환불 신청을 위한 개인정보 수집 및 이용 동의'}
						essentialLabel={'필수'}
						ariaLabel={'분실/환불을 위한 개인정보 수집 및 이용 동의(필수)'}
						isChecked={data.refundTerms}
						onChange={(value) => fncCallbackEvent('changeCheckbox', value)}
					/>
					<div className={'term-container'}>
						<ToastViewer
							className={'text-dynamic-text-neutral-primary dark:text-dynamic-text-neutral-primary'}
							initialValue={data.termsLost?.trmsDtlCn ?? ''}
						/>
					</div>
				</div>
				<CommentInfo
					title={'분실 및 환불신청 안내'}
					list={[
						{
							id: 'd-0', textColor: 'text-dynamic-text-neutral-secondary',
							message: '홈페이지 가입을 통한 카드등록 이후에 가능합니다.',
						},
						{
							id: 'd-1', textColor: 'text-dynamic-text-neutral-secondary',
							message: '대중교통 안심카드에 한하여 분실 신청 및 신청결과 조회 가능합니다.',
						},
						{
							id: 'd-2', textColor: 'text-dynamic-text-neutral-secondary',
							message: '환불은 본인 명의계좌에 한하여 신청할 수 있으며, 14세 미만 어린이/청소년의 경우 본인명의 계좌가 없을 경우 대리인(보호자) 명의 계좌로도 신청 가능합니다.',
						},
						{
							id: 'd-3', textColor: 'text-dynamic-text-neutral-secondary',
							message: '분실신청(카드사용정지) 이후에는 카드를 다시 습득하더라도 재등록 및 사용이 불가합니다.',
						},
						{
							id: 'd-4', textColor: 'text-dynamic-text-neutral-secondary',
							message: '분실신청 승인완료 후에는 철회가 불가합니다.',
						}
					]}
				/>
				<CommentTable type={'lost'} />
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
					text={'분실신청'}
					ariaLabel={'분실신청'}
					customStyle={'w-[240px]'}
					disabled={data.blockNext}
					onClick={() => fncCallbackEvent('register')}
				/>
			</div>
		</>
	)
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F467-01
 */
MoCardLostStep1.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function MoCardLostStep1({data, fncCallbackEvent}) {

	// 팝업: 분실/환불 약관
	const [popTerms, setPopTerms] = useState(false);

	// 약관 팝업 토글
	const fncToggleTermsPop = () => {
		setPopTerms(!popTerms);
	}

	return (
		<>
			<div className={'flex flex-col gap-30 page-bottom-space'}>
				<InputText
					size={'md'}
					fitWidth={true}
					id={'rqstrNm'}
					value={data.rqstrNm}
					disabled={true}
				/>
				<div className={'relative'}>
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
					<div
						className={'flex items-center gap-2 px-5 absolute -top-[18px] left-[65px]'}
						style={{marginTop: fncValiState('cardNoEncpt', data.valid) ? 20 : 4}}
					>
						<p className={'text-body-2xs text-dynamic-text-neutral-secondary font-normal'}>
							분실신청은 대중교통안심카드만 가능
						</p>
					</div>
				</div>
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
				<div className={'flex-row-center justify-between'}>
					<Checkbox
						type={'brand'}
						label={'분실/환불 신청을 위한 개인정보 수집 및 이용 동의'}
						essentialLabel={'필수'}
                        isChecked={data.refundTerms}
                        onChange={(value) => fncCallbackEvent('changeCheckbox', value)}
					/>
					<button
						className={'w-[40px] text-button-xs text-dynamic-text-neutral-secondary underline font-semibold text-right'}
						onClick={fncToggleTermsPop}
						onKeyDown={(e) => {
							if(e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								fncToggleTermsPop();
							}
						}}
					>
						보기
					</button>
				</div>
				<CommentInfo
					title={'분실 및 환불신청 안내'}
					list={[
						{
							id: 'd-0', textColor: 'text-dynamic-text-neutral-secondary',
							message: '홈페이지 가입을 통한 카드등록 이후에 가능합니다.',
						},
						{
							id: 'd-1', textColor: 'text-dynamic-text-neutral-secondary',
							message: '대중교통 안심카드에 한하여 분실 신청 및 신청결과 조회 가능합니다.',
						},
						{
							id: 'd-2', textColor: 'text-dynamic-text-neutral-secondary',
							message: '환불은 본인 명의계좌에 한하여 신청할 수 있으며, 14세 미만 어린이/청소년의 경우 본인명의 계좌가 없을 경우 대리인(보호자) 명의 계좌로도 신청 가능합니다.',
						},
						{
							id: 'd-3', textColor: 'text-dynamic-text-neutral-secondary',
							message: '분실신청(카드사용정지) 이후에는 카드를 다시 습득하더라도 재등록 및 사용이 불가합니다.',
						},
						{
							id: 'd-4', textColor: 'text-dynamic-text-neutral-secondary',
							message: '분실신청 승인완료 후에는 철회가 불가합니다.',
						}
					]}
				/>
				<CommentTable type={'lost'} />
			</div>
			<div className={'page-bottom-button-wrap'}>
				<Button
					theme={'secondary'}
					size={'lg'}
					text={'취소'}
					ariaLabel={'분실 신청 취소'}
					customStyle={'w-full'}
					onClick={() => fncCallbackEvent('goBack')}
				/>
				<Button
					theme={'primary'}
					size={'lg'}
					text={'분실신청'}
					ariaLabel={'분실신청'}
					customStyle={'w-full'}
                    disabled={data.blockNext}
					onClick={() => fncCallbackEvent('register')}
				/>
			</div>

			{
				// 팝업: 약관
				popTerms && (
					<TermsPop
						data={{terms: data.termsLost}}
						id={'terms'}
						buttonLabel={'확인'}
						onClose={fncToggleTermsPop}
						onDone={fncToggleTermsPop}
					/>
				)
			}
		</>
	)
}
