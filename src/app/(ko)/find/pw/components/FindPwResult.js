'use client'

import React from 'react';
import PropTypes from "prop-types";
import Lottie from "lottie-react";

// modules
import {useScreenSizeContext} from "@modules/context/ScreenContext";

// components
import Button from "@components/common/Button";


/**
 * @description: 비밀번호 찾기 결과 화면 입니다.
 * @screenID:    UI-CRM-F207-01, UI-CRM-F207-02, UI-CRM-F417-01, UI-CRM-F417-02
 * @screenPath:  홈 > 비밀번호 찾기
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
FindPwResult.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export default function FindPwResult({data, fncCallbackEvent}) {
	const {isMobile} = useScreenSizeContext();
	if (isMobile) {
		return (
			<MoFindPwResult
				fncCallbackEvent={fncCallbackEvent}
				data={data}
			/>
		);
	} else {
		return (
			<DtFindPwResult
				fncCallbackEvent={fncCallbackEvent}
				data={data}
			/>
		);
	}
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F207-01, UI-CRM-F207-02
 */
DtFindPwResult.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};

export function DtFindPwResult({data, fncCallbackEvent}) {
	return (
		<>
			{
				data.success ? (
					<>
						<div className={'result-fail-wrap gap-16 page-bottom-space'}>
							<div className={'result-lottie-wrap'}>
								<Lottie
									animationData={require('@assets/animations/find_pw_success.json')}
									loop={true}
									style={{width: '100%', height: '100%'}}
								/>
							</div>
							<div className={'result-fail-wrap'}>
								<p className={'headline'}>
									임시 비밀번호가 전송되었습니다
								</p>
								<p className={'description'}>
									<span>로그인 후 <span className={'text-dynamic-text-brand-primary'}>[마이페이지 내 정보]</span>에서 임시 비밀번호를 변경해 주세요</span>
								</p>
							</div>
						</div>
						<div className={'bottom-wrap'}>
							<Button
								theme={'primary'}
								size={'xl'}
								text={'로그인'}
								customStyle={'w-[240px]'}
								onClick={() => fncCallbackEvent('goLogin')}
							/>
						</div>
					</>
				) : (
					<>
						<div className={'result-fail-wrap gap-16 page-bottom-space'}>
							<div className={'result-lottie-wrap'}>
								<Lottie
									animationData={require('@assets/animations/find_id_fail.json')}
									loop={true}
									style={{width: '100%', height: '100%'}}
								/>
							</div>
							<div className={'result-fail-wrap'}>
								<p className={'headline'}>
									일치하는 아이디가 없습니다
								</p>
								<p className={'description'}>
									회원가입 시 등록한 정보를 다시 한번 확인해 주세요
								</p>
							</div>
						</div>
						<div className={'bottom-wrap'}>
							<Button
								theme={'primary'}
								size={'xl'}
								text={'확인'}
								customStyle={'w-[240px]'}
								onClick={() => fncCallbackEvent('goFindPw')}
							/>
						</div>
					</>
				)
			}
		</>
	)
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F417-01, UI-CRM-F417-02
 */
MoFindPwResult.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};

export function MoFindPwResult({data, fncCallbackEvent}) {
	return (
		<div className={'body-inner-wrap-mobile'}>
			{
				data.success ? (
					<>
						<div className={'flex-col-center-center flex-1 gap-20'}>
							<div className={'result-lottie-wrap'}>
								<Lottie
									animationData={require('@assets/animations/find_pw_success.json')}
									loop={true}
									style={{width: '100%', height: '100%'}}
								/>
							</div>
							<div className={'result-fail-wrap'}>
								<p className={'headline'}>
									임시 비밀번호가 전송되었습니다
								</p>
								<p className={'description'}>
									<span>로그인 후 <span className={'text-dynamic-text-brand-primary'}>[마이페이지 내 정보]</span>에서<br/>임시 비밀번호를 변경해 주세요</span>
								</p>
							</div>
						</div>
						<Button
							theme={'primary'}
							size={'lg'}
							text={'로그인'}
							customStyle={'w-full'}
							onClick={() => fncCallbackEvent('goLogin')}
						/>
					</>
				) : (
					<>
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
								<p className={'description'}>
									{`회원가입 시 등록한 정보를\n다시 한번 확인해 주세요`}
								</p>
							</div>
						</div>
						<Button
							theme={'primary'}
							size={'lg'}
							text={'확인'}
							customStyle={'w-full'}
							onClick={() => fncCallbackEvent('goFindPw')}
						/>
					</>
				)
			}
		</div>
	)
}
