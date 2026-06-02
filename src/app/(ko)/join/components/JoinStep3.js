'use client'

import React, {useLayoutEffect, useRef, useState} from 'react';
import PropTypes from "prop-types";
import {useMutation} from "@tanstack/react-query";

// modules
import {useScreenSizeContext} from "@modules/context/ScreenContext";
import {fncValiState} from "@modules/utils/ValidateUtils";
import {useApi} from "@modules/services/useApi";
import {apiTelecomList} from "@/app/_actions/user.action";

// components
import InputText from "@components/common/InputText";
import Button from "@components/common/Button";
import InputWithButton from "@components/composite/InputWithButton";
import InputWithSelect from "@components/composite/InputWithSelect";

// assets
import {ArrowRight} from "@assets/icons/Svgs";


/**
 * @description: 회원 가입 Step3 화면 입니다.
 * @screenID:    UI-CRM-F203, UI-CRM-F410
 * @screenPath:  홈 > 회원가입
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
JoinStep3.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export default function JoinStep3({data, fncCallbackEvent}) {

	const {isMobile} = useScreenSizeContext();
	const {jsonApiAction} = useApi();

	// 이동통신사 목록
	const [telecomList, setTelecomList] = useState([]);

	//-- Api
	// 통신사 목록
	const {mutate: mutQueryTelecom} = useMutation({
		mutationKey: ['mutQueryTelecom'],
		mutationFn: () => jsonApiAction(apiTelecomList, {}),
		onSuccess: (res) => {
			if(res) {
				const formatted = res.filter(el => Number(el.comnCdVlCn) > 0).map(i => ({
					...i,
					id: i.comnCdVlCn,
					name: i.comnCdVlCn === '04' ? '알뜰폰' : i.comnCdVlNm
				}))

				setTelecomList(formatted);
			}
		}
	})

	useLayoutEffect(() => {
		mutQueryTelecom();
	}, []);

	if (isMobile) {
		return (
			<MoJoinStep3
				fncCallbackEvent={fncCallbackEvent}
				data={{
					...data,
					telecomList,
				}}
			/>
		);
	} else {
		return (
			<DtJoinStep3
				fncCallbackEvent={fncCallbackEvent}
				data={{
					...data,
					telecomList
				}}
			/>
		);
	}
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F203, UI-CRM-F203-01, UI-CRM-F203-02
 */
DtJoinStep3.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function DtJoinStep3({data, fncCallbackEvent}) {

	const webMbrIdRef = useRef(null);
	const webMbrPswdEncptRef = useRef(null);
	const reWebMbrPswdEncptRef = useRef(null);
	const mblTelnoRef = useRef(null);
	const emlAddrRef = useRef(null);

	return (
		<>
			<div className={'flex flex-col gap-36'}>
				<InputWithButton
					ref={webMbrIdRef}
					size={'lg'}
					title={'아이디'}
					essential={true}
					placeholder={'영소문자+숫자 6~12자리'}
					allows={['lowAlnum']}
					minLength={6}
					maxLength={12}
					status={fncValiState('webMbrId', data.valid)}
					message={fncValiState('webMbrId', data.valid) === 'warning' && '영소문자, 숫자의 조합으로 6~12자를 입력해주세요.'}
					inputId={'webMbrId'}
					value={data.webMbrId}
					onChangeInput={(e) => fncCallbackEvent('changeInput', e)}
					buttonText={'중복확인'}
					disabledButton={!data.webMbrId || data.dupleId}
					onClickButton={() => fncCallbackEvent('checkDupleId')}
				/>
				<InputText
					ref={webMbrPswdEncptRef}
					size={'lg'}
					fitWidth={true}
					title={'비밀번호'}
					essential={true}
					placeholder={'영문+숫자+특수문자(!,@,#,$,%,^,&,*) 9~20자리'}
					inputType={'password'}
					keypad={'password'}
					allows={['alnum', 'pwChar']}
					status={fncValiState('webMbrPswdEncpt', data.valid)}
					message={fncValiState('webMbrPswdEncpt', data.valid) === 'warning' && '영문, 숫자, 특수문자(!,@,#,$,%,^,&,* 중 하나 이상)의 조합으로 9~20자를 입력해주세요.'}
					minLength={9}
					maxLength={20}
					id={'webMbrPswdEncpt'}
					value={data.webMbrPswdEncpt}
					onChange={(e) => fncCallbackEvent('changeInput', e)}
				/>
				<InputText
					ref={reWebMbrPswdEncptRef}
					size={'lg'}
					fitWidth={true}
					title={'비밀번호 확인'}
					essential={true}
					placeholder={'영문+숫자+특수문자(!,@,#,$,%,^,&,*) 9~20자리'}
					inputType={'password'}
					keypad={'password'}
					allows={['alnum', 'pwChar']}
					status={fncValiState('reWebMbrPswdEncpt', data.valid)}
					message={fncValiState('reWebMbrPswdEncpt', data.valid) === 'warning' && '비밀번호가 일치하지 않습니다.  다시 입력해주세요.'}
					minLength={9}
					maxLength={20}
					id={'reWebMbrPswdEncpt'}
					value={data.reWebMbrPswdEncpt}
					onChange={(e) => fncCallbackEvent('changeInput', e)}
				/>
				<div>
					<InputWithSelect
						ref={mblTelnoRef}
						title={'휴대폰번호'}
						essential={true}
						emptyMsg={'통신사'}
						inputPlaceholder={`'-' 없이 숫자만 입력`}
						allows={['num']}
						status={fncValiState('mblTelno', data.valid)}
						message={fncValiState('mblTelno', data.valid) === 'warning' && '휴대폰번호를 확인해주세요.'}
						maxLength={13}
						inputId={'mblTelno'}
						inputValue={data.mblTelno}
						onChangeInput={(e) => fncCallbackEvent('changeInput', e)}
						options={data.telecomList}
						selectPlaceholder={'통신사'}
						selectValue={data.mvmnComCoSeCd}
						onSelect={(option) => fncCallbackEvent('updateObj', {mvmnComCoSeCd: option.id})}
					/>
				</div>
				<InputText
					ref={emlAddrRef}
					size={'lg'}
					fitWidth={true}
					title={'이메일'}
					essential={true}
					placeholder={'이메일 주소 입력'}
					allows={['emailLocal']}
					maxLength={100}
					status={fncValiState('emlAddr', data.valid)}
					message={fncValiState('emlAddr', data.valid) === 'warning' && '이메일을 확인해주세요.'}
					id={'emlAddr'}
					value={data.emlAddr}
					onChange={(e) => fncCallbackEvent('changeInput', e)}
				/>
			</div>
			<div className={'page-bottom-button-wrap'}>
				<Button
					theme={'primary'}
					size={'xl'}
					text={'다음'}
					customStyle={'w-[240px]'}
					icon={<ArrowRight />}
					iconPosition={'right'}
					disabled={data.blockNext}
					onClick={() => fncCallbackEvent('doJoin')}
				/>
			</div>
		</>
	)
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F410, UI-CRM-F410-01, UI-CRM-F410-02
 */
MoJoinStep3.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function MoJoinStep3({data, fncCallbackEvent}) {

	const webMbrIdRef = useRef(null);
	const webMbrPswdEncptRef = useRef(null);
	const reWebMbrPswdEncptRef = useRef(null);
	const mblTelnoRef = useRef(null);
	const emlAddrRef = useRef(null);

	return (
		<>
			<div className={'flex flex-col gap-40 mt-40 page-bottom-space'}>
				<div className={'flex flex-col gap-28'}>
					<InputWithButton
						ref={webMbrIdRef}
						size={'md'}
						title={'아이디'}
						essential={true}
						placeholder={'영소문자+숫자 6~12자리'}
						allows={['lowAlnum']}
						minLength={6}
						maxLength={12}
						status={fncValiState('webMbrId', data.valid)}
						message={fncValiState('webMbrId', data.valid) === 'warning' && '아이디를 확인해주세요.'}
						inputId={'webMbrId'}
						value={data.webMbrId}
						onChangeInput={(e) => fncCallbackEvent('changeInput', e)}
						buttonText={'중복확인'}
						disabledButton={!data.webMbrId || data.dupleId}
						onClickButton={() => fncCallbackEvent('checkDupleId')}
					/>
					<InputText
						ref={webMbrPswdEncptRef}
						size={'md'}
						fitWidth={true}
						title={'비밀번호'}
						essential={true}
						placeholder={'영문+숫자+특수문자(!,@,#,$,%,^,&,*) 9~20자리'}
						inputType={'password'}
						keypad={'password'}
						allows={['alnum', 'pwChar']}
						status={fncValiState('webMbrPswdEncpt', data.valid)}
						message={fncValiState('webMbrPswdEncpt', data.valid) === 'warning' && '영문, 숫자, 특수문자(!,@,#,$,%,^,&,* 중 하나 이상)의 조합으로 9~20자를 입력해주세요.'}
						minLength={9}
						maxLength={20}
						id={'webMbrPswdEncpt'}
						value={data.webMbrPswdEncpt}
						onChange={(e) => fncCallbackEvent('changeInput', e)}
					/>
					<InputText
						ref={reWebMbrPswdEncptRef}
						size={'md'}
						fitWidth={true}
						title={'비밀번호 확인'}
						essential={true}
						placeholder={'영문+숫자+특수문자(!,@,#,$,%,^,&,*) 9~20자리'}
						inputType={'password'}
						keypad={'password'}
						allows={['alnum', 'pwChar']}
						status={fncValiState('reWebMbrPswdEncpt', data.valid)}
						message={fncValiState('reWebMbrPswdEncpt', data.valid) === 'warning' && '비밀번호가 일치하지 않습니다.'}
						minLength={9}
						maxLength={20}
						id={'reWebMbrPswdEncpt'}
						value={data.reWebMbrPswdEncpt}
						onChange={(e) => fncCallbackEvent('changeInput', e)}
					/>
					<InputWithSelect
						ref={mblTelnoRef}
						title={'휴대폰번호'}
						essential={true}
						emptyMsg={'통신사'}
						inputPlaceholder={`'-' 없이 숫자만 입력`}
						allows={['num']}
						status={fncValiState('mblTelno', data.valid)}
						message={fncValiState('mblTelno', data.valid) === 'warning' && '휴대폰번호를 확인해주세요.'}
						maxLength={13}
						inputId={'mblTelno'}
						inputValue={data.mblTelno}
						onChangeInput={(e) => fncCallbackEvent('changeInput', e)}
						options={data.telecomList}
						selectPlaceholder={'통신사'}
						selectValue={data.mvmnComCoSeCd}
						onSelect={(option) => fncCallbackEvent('updateObj', {mvmnComCoSeCd: option.id})}
					/>
					<InputText
						ref={emlAddrRef}
						size={'md'}
						fitWidth={true}
						title={'이메일'}
						essential={true}
						placeholder={'이메일 주소 입력'}
						allows={['emailLocal']}
						maxLength={100}
						status={fncValiState('emlAddr', data.valid)}
						message={fncValiState('emlAddr', data.valid) === 'warning' && '이메일을 확인해주세요.'}
						id={'emlAddr'}
						value={data.emlAddr}
						onChange={(e) => fncCallbackEvent('changeInput', e)}
					/>
				</div>
			</div>
			<div className={'page-bottom-button-wrap'}>
				<Button
					theme={'primary'}
					size={'lg'}
					text={'다음'}
					customStyle={'w-full'}
					disabled={data.blockNext}
					onClick={() => fncCallbackEvent('doJoin')}
				/>
			</div>
		</>
	)
}
