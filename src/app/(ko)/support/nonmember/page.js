'use client'

import React, {useLayoutEffect} from 'react';
import {useRouter} from 'next/navigation';
import PropTypes from 'prop-types';

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {useMoHeaderContext} from '@modules/context/MoHeaderContext';
import {NonMemberDiscountOptions} from '@modules/consants/Options';
import {useLoadingContext} from '@modules/context/LoadingContext';
import {useWebContext} from '@modules/context/WebviewContext';
import {useUserContext} from "@modules/context/UserContext";

// components
import Breadcrumb from '@components/layout/Breadcrumb';
import CommentInfo from '@components/composite/CommentInfo';
import DiscountBox from '@components/composite/DiscountBox';


/**
 * @description: (비회원) 할인등록 선택 화면 입니다.
 * @screenID:    UI-CRM-F256
 * @screenPath:  홈 > 고객센터 > 할인등록 선택
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function SupportNonMember() {
	
	const router = useRouter();
	const {isMobile} = useScreenSizeContext();
	const {isAccApp, reloadKey, fncFocusLayout} = useWebContext();
	const {fncChangeMoHeader} = useMoHeaderContext();
	const {fncRouteStart} = useLoadingContext();
	const {isLogin} = useUserContext();

	useLayoutEffect(() => {
		if (isAccApp) fncFocusLayout();
		if (isMobile) {
			fncChangeMoHeader({
				type: 'back',
				title: '비회원 할인등록'
			})
		}
	}, [isMobile, isAccApp, reloadKey])
	
	// 이동: 등록
	const fncGoRegister = (uri) => {
		if(isLogin) return;
		fncRouteStart(uri);
		router.push(uri);
	}
	
	// 이동: 조회
	const fncGoSearch = (uri) => {
		if(isLogin) return;
		fncRouteStart(uri);
		router.push(uri);
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
		<MoSupportNonMember
			fncCallbackEvent={fncCallbackEvent}
		/>
	);
	else return (
		<DtSupportNonMember
			fncCallbackEvent={fncCallbackEvent}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F256
 */
DtSupportNonMember.propTypes = {
	fncCallbackEvent: PropTypes.func
};
export function DtSupportNonMember({fncCallbackEvent}) {

	const {isLogin} = useUserContext();

	return (
		<main id={'support'} className={'body-wrap-618 nonmember-wrap'} aria-labelledby={'page-name-dt'}>
			<Breadcrumb addPaths={[]}/>
			<div>
				<h1 id={'page-name-dt'} className={'page-title'}>
					비회원 할인등록
				</h1>
				<h2 className={'page-sub-title'}>
					할인등록할 항목을 선택해 주세요
				</h2>
			</div>
			<div className={'flex flex-col gap-20'}>
				{
					NonMemberDiscountOptions.map((select) => (
						<DiscountBox
							key={select.id}
							name={select.name}
							iconColor={select.iconColor}
							conditions={select.conditions}
							badges={select.badges}
							disabled={isLogin}
							onClickRegister={() => fncCallbackEvent('goRegister', select.registerUrl)}
							onClickSearch={() => fncCallbackEvent('goRegister', select.searchUrl)}
						/>
					))
				}
			</div>
			<div className={'comment-wrap'}>
				<CommentInfo
					title={'이용안내'}
					list={[
						{
							id: 'd-0', textColor: 'text-dynamic-text-neutral-secondary',
							message: '할인카드 등록 이후 영업일 기준 3일 이후부터 적용됩니다.'
						},
						{
							id: 'd-1', textColor: 'text-dynamic-text-neutral-secondary',
							message: '회원가입 후 어린이/청소년 카드 등록을 하시면 소득공제, 거래내역 조회를 하실 수 있습니다.'
						},
						{
							id: 'd-2', textColor: 'text-dynamic-text-neutral-secondary',
							message: '반드시 사용할 어린이/청소년 사용자의 정보를 입력하셔야 하며 입력된 정보는 할인등록을 위한 용도로만 이용됩니다.'
						},
						{
							id: 'd-3', textColor: 'text-dynamic-text-neutral-primary',
							message: '본인이 보유하지 않은 카드를 허위로 등록할 경우 발생하게 되는 모든 책임은 카드 사용자에게 있으며 일반인이 어린이/청소년 카드 사용으로 적발될 시 철도사업법 및 경범죄처벌법에 의거하여 승차구간 운임과 그 30배의 부가운임을 징수 하오니 유의하시기 바랍니다.'
						},
					]}
				/>
				<CommentInfo
					title={'CU레일플러스카드 및 토스유스카드 안내'}
					list={[
						{
							id: 'd-0', textColor: 'text-dynamic-text-neutral-secondary',
							message: 'CU레일플러스카드의 어린이/청소년 할인요금 적용은 CU 편의점에서 생년월일 등록 후 가능합니다.'
						},
						{
							id: 'd-1', textColor: 'text-dynamic-text-neutral-secondary',
							message: 'CU레일플러스카드의 할인요금 적용은 가까운 CU 편의점을 방문하여 주시기 바랍니다. (별도 등록 불필요)'
						},
						{
							id: 'd-2', textColor: 'text-dynamic-text-neutral-secondary',
							message: '토스유스카드의 어린이/청소년 할인요금은 발급 시 적용됩니다. (별도 등록 불필요)'
						},
					]}
				/>
				<CommentInfo
					title={'청소년 연령 초과 학생의 경우'}
					list={[
						{
							id: 'd-0', textColor: 'text-dynamic-text-neutral-secondary',
							message: '청소년 연령초과 학생은 초중등 교육법 제2조에 의거하여 학생 신분임을 증명하셔야 할인 혜택을 받으실 수 있습니다.'
						},
						{
							id: 'd-1', textColor: 'text-dynamic-text-neutral-primary',
							message: '청소년 연령초과 학생 할인을 통해 해당 학교의 재학증명서를 제출하여 할인 혜택을 받으세요.'
						},
						{
							id: 'd-2', textColor: 'text-dynamic-text-neutral-secondary',
							message: '할인 등록시 정확한 정보를 입력하셔야 할인 요금을 적용 받으실 수 있으며, 허위정보 및 타인 입력으로 발생된 고객 불이익 및 변경된 정보로 인한 문제에 대해서는 등록자의 책임임을 유의하여 주시기 바랍니다.'
						},
					]}
				/>
			</div>
		</main>
	)
}

/**
 * @description: Mobile
 * @screenID:    -
 */
MoSupportNonMember.propTypes = {
	fncCallbackEvent: PropTypes.func
};
export function MoSupportNonMember({fncCallbackEvent}) {

	const {isLogin} = useUserContext();

	return (
		<main id={'support'} className={'body-wrap-mobile nonmember-wrap'} aria-labelledby={'page-name-mo'}>
			<div className={'body-inner-wrap-mobile'}>
				<div>
					<h1 id={'page-name-mo'} className={'page-title'}>
						비회원 할인등록
					</h1>
					<h2 className={'page-sub-title'}>
						할인등록할 항목을 선택해 주세요
					</h2>
				</div>
				<div className={'flex flex-col gap-15'}>
					{
						NonMemberDiscountOptions.map((select) => (
							<DiscountBox
								key={select.id}
								name={select.name}
								iconColor={select.iconColor}
								conditions={select.conditions}
								badges={select.badges}
								disabled={isLogin}
								onClickRegister={() => fncCallbackEvent('goRegister', select.registerUrl)}
								onClickSearch={() => fncCallbackEvent('goRegister', select.searchUrl)}
							/>
						))
					}
				</div>
				<div className={'comment-wrap'}>
					<CommentInfo
						title={'이용안내'}
						list={[
							{
								id: 'd-0', textColor: 'text-dynamic-text-neutral-secondary',
								message: '할인카드 등록 이후 영업일 기준 3일 이후부터 적용됩니다.'
							},
							{
								id: 'd-1', textColor: 'text-dynamic-text-neutral-secondary',
								message: '회원가입 후 어린이/청소년 카드 등록을 하시면 소득공제, 거래내역 조회를 하실 수 있습니다.'
							},
							{
								id: 'd-2', textColor: 'text-dynamic-text-neutral-secondary',
								message: '반드시 사용할 어린이/청소년 사용자의 정보를 입력하셔야 하며 입력된 정보는 할인등록을 위한 용도로만 이용됩니다.'
							},
							{
								id: 'd-3', textColor: 'text-dynamic-text-neutral-primary',
								message: '본인이 보유하지 않은 카드를 허위로 등록할 경우 발생하게 되는 모든 책임은 카드 사용자에게 있으며 일반인이 어린이/청소년 카드 사용으로 적발될 시 철도사업법 및 경범죄처벌법에 의거하여 승차구간 운임과 그 30배의 부가운임을 징수 하오니 유의하시기 바랍니다.'
							},
						]}
					/>
					<CommentInfo
						title={'CU레일플러스카드 및 토스유스카드 안내'}
						list={[
							{
								id: 'd-0', textColor: 'text-dynamic-text-neutral-secondary',
								message: 'CU레일플러스카드의 어린이/청소년 할인요금 적용은 CU 편의점에서 생년월일 등록 후 가능합니다.'
							},
							{
								id: 'd-1', textColor: 'text-dynamic-text-neutral-secondary',
								message: 'CU레일플러스카드의 할인요금 적용은 가까운 CU 편의점을 방문하여 주시기 바랍니다. (별도 등록 불필요)'
							},
							{
								id: 'd-2', textColor: 'text-dynamic-text-neutral-secondary',
								message: '토스유스카드의 어린이/청소년 할인요금은 발급 시 적용됩니다. (별도 등록 불필요)'
							},
						]}
					/>
					<CommentInfo
						title={'청소년 연령 초과 학생의 경우'}
						list={[
							{
								id: 'd-0', textColor: 'text-dynamic-text-neutral-secondary',
								message: '청소년 연령초과 학생은 초중등 교육법 제2조에 의거하여 학생 신분임을 증명하셔야 할인 혜택을 받으실 수 있습니다.'
							},
							{
								id: 'd-1', textColor: 'text-dynamic-text-neutral-primary',
								message: '청소년 연령초과 학생 할인을 통해 해당 학교의 재학증명서를 제출하여 할인 혜택을 받으세요.'
							},
							{
								id: 'd-2', textColor: 'text-dynamic-text-neutral-secondary',
								message: '할인 등록시 정확한 정보를 입력하셔야 할인 요금을 적용 받으실 수 있으며, 허위정보 및 타인 입력으로 발생된 고객 불이익 및 변경된 정보로 인한 문제에 대해서는 등록자의 책임임을 유의하여 주시기 바랍니다.'
							},
						]}
					/>
				</div>
			</div>
		</main>
	)
}


