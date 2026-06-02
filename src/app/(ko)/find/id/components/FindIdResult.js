'use client'

import React from 'react';
import PropTypes from "prop-types";
import moment from "moment";
import Lottie from "lottie-react";

// modules
import {useScreenSizeContext} from "@modules/context/ScreenContext";
import {toMomentFrom14} from "@modules/utils/DateUtils";

// components
import Button from "@components/common/Button";

// assets
import {ChevronRight} from "@assets/icons/Svgs";


/**
 * @description: 아이디 찾기 결과 화면 입니다.
 * @screenID:    UI-CRM-F205-01, UI-CRM-F205-02, UI-CRM-F415-01, UI-CRM-F415-02
 * @screenPath:  홈 > 아이디 찾기
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
FindIdResult.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export default function FindIdResult({data, fncCallbackEvent}) {
	const {isMobile} = useScreenSizeContext();
	if (isMobile) {
		return (
			<MoFindIdResult
				fncCallbackEvent={fncCallbackEvent}
				data={data}
			/>
		);
	} else {
		return (
			<DtFindIdResult
				fncCallbackEvent={fncCallbackEvent}
				data={data}
			/>
		);
	}
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F205-01, UI-CRM-F205-02
 */
DtFindIdResult.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};

export function DtFindIdResult({data, fncCallbackEvent}) {
	return (
		<>
			{
				data?.webMbrId ? (
					<div className={'result-success-wrap'}>
						<p className={'headline'}>인증하신 정보와 일치하는 아이디입니다</p>
						<p className={'id'}>{data.webMbrId || '-'}</p>
						<p className={'date'}>
							{`가입일 | ${data?.regYmd ? moment(toMomentFrom14(data?.regYmd)).format('YYYY-MM-DD') : '-'}`}
						</p>
					</div>
				) : (
					<div className={'result-fail-wrap gap-16 page-bottom-space'}>
						<Lottie
							animationData={require('@assets/animations/find_id_fail.json')}
							loop={true}
							style={{width: 160, height: 160}}
						/>
						<p className={'headline'}>
							일치하는 아이디가 없습니다
						</p>
					</div>
				)
			}
			<div className={'bottom-wrap'}>
				{
					data?.webMbrId ? (
						<Button
							theme={'primary'}
							size={'xl'}
							text={'로그인'}
							customStyle={'w-[240px]'}
							onClick={() => fncCallbackEvent('goLogin')}
						/>
					) : (
						<div className={'flex-row-center w-full gap-12'}>
							<Button
								theme={'secondary'}
								size={'xl'}
								text={'로그인'}
								customStyle={'w-full'}
								onClick={() => fncCallbackEvent('goLogin')}
							/>
							<Button
								theme={'primary'}
								size={'xl'}
								text={'회원가입하기'}
								customStyle={'w-full'}
								onClick={() => fncCallbackEvent('goJoin')}
							/>
						</div>
					)
				}
				<div className={'forget-wrap'}>
					<p className={'forget-label'}>
						비밀번호가 기억나지 않으세요?
					</p>
					<button
						onClick={() => fncCallbackEvent('goFindPwd')}
						onKeyDown={(e) => {
							if(e.key === 'Enter' || e.key === ' ') fncCallbackEvent('goFindPwd')
						}}
					>
						<span className={'leading-snug'}>비밀번호 찾기</span>
						<ChevronRight
							width={20} height={20}
							color={'text-dynamic-icon-brand-primary'}
						/>
					</button>
				</div>
			</div>
		</>
	)
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F415-01, UI-CRM-F415-02
 */
MoFindIdResult.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};

export function MoFindIdResult({data, fncCallbackEvent}) {
	return (
		<div className={'body-inner-wrap-mobile'}>
			{
				data?.webMbrId ? (
					<div className={'flex-col-center-center flex-1 gap-24 px-20'}>
						<p className={'headline'}>
							{`인증하신 정보와\n일치하는 아이디입니다`}
						</p>
						<div className={'result-success-wrap'}>
							<p className={'id'}>{data.webMbrId || '-'}</p>
							<p className={'date'}>
								{`가입일 | ${data?.regYmd ? moment(toMomentFrom14(data?.regYmd)).format('YYYY-MM-DD') : '-'}`}
							</p>
						</div>
					</div>
				) : (
					<div className={'flex-col-center-center flex-1 gap-20'}>
						<div className={'result-lottie-wrap'}>
							<Lottie
								animationData={require('@assets/animations/find_id_fail.json')}
								loop={true}
								style={{width: '100%', height: '100%'}}
							/>
						</div>
						<div className={'result-fail-wrap'}>
							<p className={'headline'}>
								일치하는 아이디가 없습니다.
							</p>
							<button onClick={() => fncCallbackEvent('goJoin')}>
								<span>회원가입 하기</span>
								<ChevronRight
									width={20} height={20}
									color={'text-dynamic-icon-brand-parimary'}/>
							</button>
						</div>
					</div>
				)
			}
			<div className={'forget-wrap'}>
				<p className={'forget-label'}>
					비밀번호가 기억나지 않으세요?
				</p>
				<button
					onClick={() => fncCallbackEvent('goFindPwd')}
					onKeyDown={(e) => {
						if(e.key === 'Enter' || e.key === ' ') fncCallbackEvent('goFindPwd')
					}}
				>
					비밀번호 찾기
				</button>
			</div>
			<Button
				theme={'primary'}
				size={'lg'}
				text={'로그인'}
				customStyle={'w-full'}
				onClick={() => fncCallbackEvent('goLogin')}
			/>
		</div>
	)
}
