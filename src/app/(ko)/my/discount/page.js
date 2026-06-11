'use client'

import React, {useLayoutEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {useRouter} from 'next/navigation';
import {useMutation} from "@tanstack/react-query";

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {useMoHeaderContext} from '@modules/context/MoHeaderContext';
import {DiscountOptions} from '@modules/consants/Options';
import {useLoadingContext} from '@modules/context/LoadingContext';
import {useWebContext} from "@modules/context/WebviewContext";
import {usePopContext} from "@modules/context/PopContext";
import {useScrollContext} from "@modules/context/ScrollContext";
import {useApi} from "@modules/services/useApi";
import {apiViewDiscount} from "@/app/_actions/mypage.action";

// components
import Breadcrumb from '@components/layout/Breadcrumb';
import CommentInfo from '@components/composite/CommentInfo';
import DiscountBox from '@components/composite/DiscountBox';


/**
 * @description: 할인등록 화면 입니다.
 * @screenID:    UI-CRM-F240, UI-CRM-F474
 * @screenPath:  홈 > 마이페이지 > 할인등록
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function MyDiscount() {

	const router = useRouter();
	const {isMobile} = useScreenSizeContext();
	const {isAccApp, reloadKey, fncFocusLayout} = useWebContext();
	const {fncChangeMoHeader} = useMoHeaderContext();
	const {fncShowPop, fncClosePop} = usePopContext();
	const {fncScrollToTop} = useScrollContext();
	const {jsonApiAction} = useApi();
	const {fncRouteStart} = useLoadingContext();

	// 선택한 옵션
	const [isOption, setIsOption] = useState(null);

	// --Api
	// 등록 여부 조회
	const {mutate: mutQueryDiscount} = useMutation({
		mutationKey: ['mutQueryDiscount'],
		mutationFn: (code) => jsonApiAction(apiViewDiscount, {
			dscntAplySe: code,
			memberYn: 'Y',
			__localHandle: true
		}),
		onSuccess: (res) => {
			if(!res || res.length < 1){
				return fncShowPop({
					mainText: '할인등록된 내역이 없습니다.\n등록 후 이용해주세요.',
					primaryText: '확인',
					onClickPrimary: () => fncClosePop(),
				});
			}

			if(!isMobile) fncScrollToTop();

			// 이동: 조회
			const targetUri = isOption.searchUrl;
			fncRouteStart(targetUri);
			router.push(targetUri);
		},
		onError: (error) => {
			fncShowPop({
				mainText: error.message,
				primaryText: '확인',
				onClickPrimary: () => fncClosePop(),
			})
		}
	})

	useLayoutEffect(() => {
		if (isAccApp) fncFocusLayout();
		if (isMobile) {
			fncChangeMoHeader({
				type: 'back',
				title: '할인등록'
			})
		}
	}, [isMobile, isAccApp, reloadKey])

	// 할인등록 조회
	const fncGoSearch = (select) => {
		setIsOption(select);
		mutQueryDiscount(select.id);
	}

	// 이동: 할인등록 등록/수정
	const fncGoRegister = (select) => {
		const targetUri = select.registerUrl;
		fncRouteStart(targetUri);
		router.push(targetUri);
	}

	const fncHandlers = {
		goRegister: fncGoRegister,
		goSearch: fncGoSearch,
	}

	const fncCallbackEvent = (fncName, variable, payload = {}) => {
		const fnc = fncHandlers[fncName];
		if (typeof fnc === 'function') return fnc(variable, payload);
	}

	if (isMobile) return (
		<MoMyDiscount
			fncCallbackEvent={fncCallbackEvent}
		/>
	);
	else return (
		<DtMyDiscount
			fncCallbackEvent={fncCallbackEvent}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F240
 */
DtMyDiscount.propTypes = {
	fncCallbackEvent: PropTypes.func
};
export function DtMyDiscount({fncCallbackEvent}) {
	return (
		<main id={'my'} className={'body-wrap-618'} aria-labelledby={'page-name-dt'}>
			<Breadcrumb addPaths={[]} />
			<h1 id={'page-name-dt'} className={'page-title'}>
				할인등록
			</h1>
			<p className={'page-sub-title'} aria-live={'polite'}>
				할인등록할 항목을 선택해 주세요
			</p>
			<fieldset className={'page-bottom-space'}>
				<legend id={'legend-card-type-dt'} className={'sr-only'} aria-labelledby={'legend-card-type-dt'}>
					할인 종류 선택
				</legend>
				<div className={'flex-col-center gap-20'}>
					{
						DiscountOptions.map((select) => (
							<DiscountBox
								key={select.id}
								name={select.name}
								iconColor={select.iconColor}
								conditions={select.conditions}
								badges={select.badges}
								onClickRegister={() => fncCallbackEvent('goRegister', select)}
								onClickSearch={() => fncCallbackEvent('goSearch', select)}
							/>
						))
					}
				</div>
			</fieldset>
			<div className={'flex flex-col gap-36'}>
				<CommentInfo
					title={'이용안내'}
					list={[
						{
							id: 'd-0', textColor: 'text-dynamic-text-neutral-secondary',
							message: '할인카드 등록 이후 영업일 기준 3일 이후부터 적용됩니다.',
						},
						{
							id: 'd-1', textColor: 'text-dynamic-text-neutral-secondary',
							message: '회원가입 후 어린이/청소년 카드 등록을 하시면 소득공제, 거래내역 조회를 하실 수 있습니다.',
						},
						{
							id: 'd-2', textColor: 'text-dynamic-text-neutral-secondary',
							message: '반드시 사용할 어린이/청소년 사용자의 정보를 입력하셔야 하며 입력된 정보는 할인등록을 위한 용도로만 이용됩니다.',
						},
						{
							id: 'd-3', textColor: 'text-dynamic-text-neutral-primary',
							message: '본인이 보유하지 않은 카드를 허위로 등록할 경우 발생하게 되는 모든 책임은 카드 사용자에게 있으며 일반인이 어린이/청소년 카드 사용으로 적발될 시 철도사업법 및 경범죄처벌법에 의거하여 승차구간 운임과 그 30배의 부가운임을 징수 하오니 유의하시기 바랍니다.',
						}
					]}
				/>
				<CommentInfo
					title={'청소년 연령 초과 학생의 경우'}
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
		</main>
	)
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F474
 */
MoMyDiscount.propTypes = {
	fncCallbackEvent: PropTypes.func
};
export function MoMyDiscount({fncCallbackEvent}) {
	return (
		<main id={'my'} className={'body-wrap-mobile-screen-height'} aria-labelledby={'page-name-mo'}>
			<div className={'body-inner-wrap-mobile'} style={{justifyContent: 'flex-start'}}>
				<h1 id={'page-name-mo'} className={'page-title'}>
					{`할인등록할 항목을\n선택해 주세요`}
				</h1>
				<div className={'flex flex-col gap-20'}>
					{
						DiscountOptions.map((select) => (
							<DiscountBox
								key={select.id}
								name={select.name}
								iconColor={select.iconColor}
								conditions={select.conditions}
								badges={select.badges}
								onClickRegister={() => fncCallbackEvent('goRegister', select)}
								onClickSearch={() => fncCallbackEvent('goSearch', select)}
							/>
						))
					}
				</div>
				<div className={'flex flex-col gap-36'}>
					<CommentInfo
						title={'이용안내'}
						list={[
							{
								id: 'd-0', textColor: 'text-dynamic-text-neutral-secondary',
								message: '할인카드 등록 이후 영업일 기준 3일 이후부터 적용됩니다.',
							},
							{
								id: 'd-1', textColor: 'text-dynamic-text-neutral-secondary',
								message: '회원가입 후 어린이/청소년 카드 등록을 하시면 소득공제, 거래내역 조회를 하실 수 있습니다.',
							},
							{
								id: 'd-2', textColor: 'text-dynamic-text-neutral-secondary',
								message: '반드시 사용할 어린이/청소년 사용자의 정보를 입력하셔야 하며 입력된 정보는 할인등록을 위한 용도로만 이용됩니다.',
							},
							{
								id: 'd-3', textColor: 'text-dynamic-text-neutral-primary',
								message: '본인이 보유하지 않은 카드를 허위로 등록할 경우 발생하게 되는 모든 책임은 카드 사용자에게 있으며 일반인이 어린이/청소년 카드 사용으로 적발될 시 철도사업법 및 경범죄처벌법에 의거하여 승차구간 운임과 그 30배의 부가운임을 징수 하오니 유의하시기 바랍니다.',
							}
						]}
					/>
					<CommentInfo
						title={'청소년 연령 초과 학생의 경우'}
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
			</div>
		</main>
	)
}
