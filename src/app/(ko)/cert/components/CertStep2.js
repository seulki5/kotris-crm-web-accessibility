'use client'

import React, {useLayoutEffect, useState} from 'react';
import PropTypes from 'prop-types';

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {ageOptions} from '@modules/consants/Options';

// components
import Button from '@components/common/Button';
import RadioArray from '@components/composite/RaidoArray';
import IdentityVerification from '@components/composite/IdentityVerification';


/**
 * @description: 본인인증 화면 입니다.
 * @screenID:    -
 * @screenPath:  홈 > 본인인증
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by S  Traffic co.,Ltd. All right reserved.
 */
CertStep2.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export default function CertStep2({data, fncCallbackEvent}) {
	
	const {isMobile} = useScreenSizeContext();

	// 나이 구분
	const [ageType, setAgeType] = useState(ageOptions[0].id);

	// 초기화
	useLayoutEffect(() => {
		fncCallbackEvent('updateObj', {prvcMkusAgreYn: false})
		data?.selectedMethod && setAgeType(data?.selectedMethod);
	}, [data?.selectedMethod]);
	
	// 본인인증 진행방식 변경
	const fncChangeAgeType = (type) => {
		setAgeType(type);
	}
	
	if (isMobile) {
		return (
			<MoCertStep2
				fncCallbackEvent={fncCallbackEvent}
				fncChangeAgeType={fncChangeAgeType}
				data={{
					...data,
					ageType: ageType
				}}
			/>
		);
	} else {
		return (
			<DtCertStep2
				fncCallbackEvent={fncCallbackEvent}
				fncChangeAgeType={fncChangeAgeType}
				data={{
					...data,
					ageType: ageType
				}}
			/>
		);
	}
}

/**
 * @description: Desktop
 * @screenID:    -
 */
DtCertStep2.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func,
	fncChangeAgeType: PropTypes.func
};
export function DtCertStep2({data, fncCallbackEvent, fncChangeAgeType}) {
	return (
		<>
			<div className={'flex flex-col gap-48'}>
				<RadioArray
					options={ageOptions}
					value={data.ageType}
					disabled={data.rid || data.custIpnNo}
					onChange={fncChangeAgeType}
				/>
				<IdentityVerification
					type={data.ageType}
					disabled={data.rid || data.custIpnNo}
					store={{
						prvcMkusAgreYn: data.prvcMkusAgreYn,
						mktgMkusAgreYn: data.mktgMkusAgreYn,
						smsSndngYn: data.smsSndngYn,
						emlSndngYn: data.emlSndngYn,
						pushSndngYn: data.pushSndngYn,
						srvcNotiRcptnAgreYn: data.srvcNotiRcptnAgreYn,
					}}
					onUpdate={(obj) => fncCallbackEvent('updateObj', obj)}
				/>
			</div>
			<div className={'page-bottom-button-wrap'}>
				<Button
					theme={'primary'}
					size={'xl'}
					text={'다음'}
					customStyle={'w-[240px]'}
					disabled={data.blockNext}
					onClick={() => fncCallbackEvent('doCert')}
				/>
			</div>
		</>
	)
}

/**
 * @description: Mobile
 * @screenID:    -
 */
MoCertStep2.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func,
	fncChangeAgeType: PropTypes.func
};
export function MoCertStep2({data, fncCallbackEvent, fncChangeAgeType}) {
	return (
		<>
			<div className={'flex flex-col mt-40 page-bottom-space'} style={{gap: data.ageType === ageOptions[1].id ? 10 : 40}}>
				<RadioArray
					options={ageOptions}
					value={data.ageType}
					disabled={data.rid || data.custIpnNo}
					onChange={fncChangeAgeType}
				/>
				<IdentityVerification
					type={data.ageType}
					disabled={data.rid || data.custIpnNo}
					store={{
						prvcMkusAgreYn: data.prvcMkusAgreYn,
						mktgMkusAgreYn: data.mktgMkusAgreYn,
						smsSndngYn: data.smsSndngYn,
						emlSndngYn: data.emlSndngYn,
						pushSndngYn: data.pushSndngYn,
						srvcNotiRcptnAgreYn: data.srvcNotiRcptnAgreYn,
					}}
					onUpdate={(obj) => fncCallbackEvent('updateObj', obj)}
				/>
			</div>
			<div className={'page-bottom-button-wrap'}>
				<Button
					theme={'primary'}
					size={'lg'}
					text={'다음'}
					customStyle={'w-full'}
					disabled={data.blockNext}
					onClick={() => fncCallbackEvent('doCert')}
				/>
			</div>
		</>
	)
}
