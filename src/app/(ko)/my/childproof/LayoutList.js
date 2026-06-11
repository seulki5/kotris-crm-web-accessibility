'use client'

import React, {useLayoutEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {useRouter} from 'next/navigation';
import moment from 'moment';
import {useMutation} from "@tanstack/react-query";

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {useMoHeaderContext} from '@modules/context/MoHeaderContext';
import {RouteConfig} from '@modules/config/RouteConfig';
import {ChildproofPageOptions} from '@modules/consants/Options';
import {useLoadingContext} from '@modules/context/LoadingContext';
import {useWebContext} from '@modules/context/WebviewContext';
import {useApi} from "@modules/services/useApi";
import {apiChildRegList} from "@/app/_actions/mypage.action";
import {toMomentFrom14} from "@modules/utils/DateUtils";
import {FindChildproofStatusBadge} from "@modules/consants/Objects";
import {useUserContext} from "@modules/context/UserContext";

// components
import Breadcrumb from '@components/layout/Breadcrumb';
import Segment from '@components/common/Segment';
import CommentInfo from '@components/composite/CommentInfo';
import Button from '@components/common/Button';

// assets
import {ChevronRight, EmptyChildproof, Plus} from '@assets/icons/Svgs';


/**
 * @description: 어린이 안심서비스 내 자녀 등록 현황 화면 입니다.
 * @screenID:    UI-CRM-F247, UI-CRM-F458
 * @screenPath:  홈 > 마이페이지 > 어린이 안심서비스
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function LayoutList({onChangeTab}) {

	const router = useRouter();
	const {isMobile} = useScreenSizeContext();
	const {isAccApp, reloadKey, fncFocusLayout} = useWebContext();
	const {fncChangeMoHeader} = useMoHeaderContext();
	const {jsonApiAction} = useApi();
	const {isLogin} = useUserContext();
	const {fncRouteStart} = useLoadingContext();

	// --Api
	// 자녀 목록
	const {mutate: mutQueryChildList, data: queryChildList} = useMutation({
		mutationKey: ['mutQueryChildList'],
		mutationFn: () => jsonApiAction(apiChildRegList, {page: 1, recordCnt: 99999}),
	})

	useLayoutEffect(() => {
		isLogin && mutQueryChildList();
	}, [isLogin]);

	useLayoutEffect(() => {
		if (isAccApp) fncFocusLayout();
		if (isMobile) {
			fncChangeMoHeader({
				type: 'back',
				title: '어린이 안심서비스'
			})
		}
	}, [isMobile, isAccApp, reloadKey])

	// 이동: 등록/수정
	const fncGoRegister = () => {
		const targetUri = RouteConfig.CHILDPROOF_REGISTER.PATH;
		fncRouteStart(targetUri);
		router.push(targetUri);
	}

	// 이동: 등록현황/이용내역
	const fncChangeSegment = (id) => {
		onChangeTab?.(id);
	}

	// 이동: 상세
	const fncGoDetail = (child) => {
		const targetUri = `${RouteConfig.CHILDPROOF_DETAIL.PATH}?id=${child.dmndNo}`;
		fncRouteStart(targetUri);
		router.push(targetUri);
	}

	const fncHandlers = {
		goRegister: fncGoRegister,
		goDetail: fncGoDetail,
		changeSegment: fncChangeSegment,
	}

	const fncCallbackEvent = (fncName, variable, payload = {}) => {
		const fnc = fncHandlers[fncName];
		if (typeof fnc === 'function') return fnc(variable, payload);
	}

	if (isMobile) return (
		<MoMyChildproof
			fncCallbackEvent={fncCallbackEvent}
			data={{
				childList: queryChildList
			}}
        />
	);
	else return (
		<DtMyChildproof
			fncCallbackEvent={fncCallbackEvent}
			data={{
				childList: queryChildList
			}}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F247
 */
DtMyChildproof.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function DtMyChildproof({data, fncCallbackEvent}) {
	return (
		<main id={'my'} className={'body-wrap-618 childproof-wrap'} aria-labelledby={'page-name-dt'}>
			<Breadcrumb addPaths={[]} />
			<h1 id={'page-name-dt'} className={'page-title'}>
				어린이 안심서비스
			</h1>
			<div className={'my-48'}>
				<Segment
					size={'lg'}
					options={ChildproofPageOptions}
					selectedValue={ChildproofPageOptions[0].id}
					fullSize={true}
					onChange={(id) => fncCallbackEvent('changeSegment', id)}
				/>
				{
					data.childList?.length > 0 ? (
						<div className={'kids-list-wrap'}>
							<p className={'title'}>
								{`내 자녀 (${data.childList.length || 0})`}
							</p>
							<div className={'flex-col-center-12 mb-36'}>
								{
									data.childList.map((child) => (
										<button
											key={child.cdrnWebMbrId}
											className={'kids-item'}
											aria-label={'등록한 내 자녀 정보 상세보기'}
											onClick={() => fncCallbackEvent('goDetail', child)}
											onKeyDown={(e) => {
												if(e.key === 'Enter' || e.key === ' ') {
													fncCallbackEvent('goDetail', child)
												}
											}}
										>
											<div className={'flex-row-center'}>
												{child?.stlmSttsCd && FindChildproofStatusBadge[child.stlmSttsCd]}
												<p className={'name'}>
													{child.cdrnNm}
												</p>
												<p className={'reg-date'}>
													{moment(toMomentFrom14(child.frstRegDt)).format('YYYY-MM-DD')}
												</p>
											</div>
											<ChevronRight
												color={'text-dynamic-icon-neutral-primary'}
											/>
										</button>
									))
								}
							</div>
							<div className={'flex-col-center mb-48'}>
								<Button
									theme={'primary'}
									size={'md'}
									text={'자녀 등록 신청'}
									ariaLabel={'자녀 등록 신청'}
									icon={<Plus />}
									iconPosition={'left'}
									onClick={() => fncCallbackEvent('goRegister')}
								/>
							</div>
						</div>
					) : (
						<div className={'empty-wrap'}>
							<EmptyChildproof/>
							<p>등록된 자녀가 없어요.</p>
							<p>자녀를 등록하려면 신청버튼을 클릭해주세요.</p>
							<Button
								theme={'primary'}
								size={'md'}
								text={'자녀 등록 신청'}
								ariaLabel={'자녀 등록 신청'}
								icon={<Plus />}
								iconPosition={'left'}
								onClick={() => fncCallbackEvent('goRegister')}
							/>
						</div>
					)
				}
				<CommentInfo
					title={'이용안내'}
					list={[
						{
							id: 'd-0', textColor: 'text-dynamic-text-negative-primary',
							message: '서비스 대상 : 만 6세 ~ 만 14세 미만의 어린이',
						},
						{
							id: 'd-1', textColor: 'text-dynamic-text-negative-primary',
							message: '서비스 만료 : 어린이가 만 14세가 되는 날 서비스 제공이 종료됩니다.',
						}
					]}
				/>
			</div>
		</main>
	)
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F458
 */
MoMyChildproof.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function MoMyChildproof({data, fncCallbackEvent}) {
	return (
		<main id={'my'} className={'body-wrap-mobile-screen-height childproof-wrap'} aria-labelledby={'page-name-mo'}>
			<h1 id={'page-name-mo'} className={'sr-only'}>어린이 안심서비스 내 자녀 등록현황</h1>
			<div className={'body-inner-wrap-mobile'}>
				<div className={'flex-col-center gap-40 page-bottom-space'}>
					<Segment
						size={'md'}
						options={ChildproofPageOptions}
						selectedValue={ChildproofPageOptions[0].id}
						fullSize={true}
						onChange={(id) => fncCallbackEvent('changeSegment', id)}
					/>
					{
						data.childList?.length > 0 ? (
							<div className={'kids-list-wrap'}>
								<p className={'title'}>
									{`내 자녀 (${data.childList.length || 0})`}
								</p>
								<div className={'flex-col-center-12'}>
									{
										data.childList.map((child) => (
											<button
												key={child.cdrnWebMbrId}
												className={'kids-item'}
												aria-label={'등록한 내 자녀 정보 상세보기'}
												onClick={() => fncCallbackEvent('goDetail', child)}
												onKeyDown={(e) => {
													if(e.key === 'Enter' || e.key === ' ') {
														fncCallbackEvent('goDetail', child)
													}
												}}
											>
												<div className={'flex-row-center'}>
													{child?.stlmSttsCd && FindChildproofStatusBadge[child.stlmSttsCd]}
													<p className={'name'}>
														{child.cdrnNm}
													</p>
													<p className={'reg-date'}>
														{moment(toMomentFrom14(child.frstRegDt)).format('YYYY-MM-DD')}
													</p>
												</div>
												<ChevronRight
													color={'text-dynamic-icon-neutral-primary'}
												/>
											</button>
										))
									}
								</div>
							</div>
						) : (
							<div className={'empty-wrap'}>
								<EmptyChildproof/>
								<p>등록된 자녀가 없어요.</p>
								<p>자녀를 등록하려면 신청버튼을 클릭해주세요.</p>
							</div>
						)
					}
					<CommentInfo
						title={'이용안내'}
						list={[
							{
								id: 'd-0', textColor: 'text-dynamic-text-negative-primary',
								message: '서비스 대상 : 만 6세 ~ 만 14세 미만의 어린이',
							},
							{
								id: 'd-1', textColor: 'text-dynamic-text-negative-primary',
								message: '서비스 만료 : 어린이가 만 14세가 되는 날 서비스 제공이 종료됩니다.',
							}
						]}
					/>
				</div>
			</div>
			<div className={'flex-row-center gap-8'}>
				<Button
					theme={'primary'}
					size={'lg'}
					text={'신청'}
					ariaLabel={'자녀 등록 신청'}
					customStyle={'w-full'}
					disabled={false}
					onClick={() => fncCallbackEvent('goRegister')}
				/>
			</div>
		</main>
	)
}
