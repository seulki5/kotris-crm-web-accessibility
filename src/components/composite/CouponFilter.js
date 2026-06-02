'use client'

import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {FilterCouponState, FilterOrder} from '@modules/consants/Options';

// components
import Button from '@components/common/Button';
import Checkbox from '@components/common/Checkbox';

// assets
import {ChevronUp, Filter, Rotate} from '@assets/icons/Svgs';

// const
export const initCouponConditions = {
	useSeCd: FilterCouponState[0].id,      // 사용유무(00전체,01사용가능,02사용완료,03기한만료)
	sortCrtrCd: FilterOrder[0].id,         // 정렬
}


/**
 * @description: 쿠폰 목록 검색 필터링 컴포넌트 입니다.
 * @screenID:    -
 * @screenPath:  -
 * @author       $Author
 * @since        $Date
 * @version      $Revision
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
CouponFilter.propTypes = {
	data: PropTypes.object,
	isOpen: PropTypes.bool,
	onUpdate: PropTypes.func,
	onSearch: PropTypes.func,
	onInit: PropTypes.func,
	onToggle: PropTypes.func,
};
export default function CouponFilter({
	data,
	isOpen,
	onUpdate,
	onSearch,
	onInit,
	onToggle,
}) {
	const {isMobile} = useScreenSizeContext();

	const [clone, setClone] = useState({
		state: FilterCouponState[0],
		order: FilterOrder[0],
	});
	const [applied, setApplied] = useState({
		state: FilterCouponState[0],
		order: FilterOrder[0]
	});

	// 단일 체크
	const fncSingleCheck = (obj) => {
		onUpdate(obj);
	}

	// 적용
	const fncApply = () => {
		// 사용유무
		let updateState = FilterCouponState.filter((el) => el.id === data.useSeCd)?.[0];

		// 순서
		let updateOrder = FilterOrder.filter((el) => el.id === data.sortCrtrCd)?.[0];

		setClone({
			state: updateState,
			order: updateOrder,
		});

		setApplied({
			state: updateState,
			order: updateOrder
		});

		onSearch();
	}

	// 초기화
	const fncInitialize = () => {
		onInit();
		setClone({
			state: FilterCouponState[0],
			order: FilterOrder[0],
		})
		setApplied({
			state: FilterCouponState[0],
			order: FilterOrder[0]
		})
	}

	// 열기/닫기
	const fncToggle = () => {
		if(isOpen) {
			onUpdate({
				sortCrtrCd: clone.order.id,
				useSeCd: clone.state.id,
			});
		}

		onToggle('toggleFilter');
	}

	const fncHandlers = {
		singleCheck: fncSingleCheck,
		apply: fncApply,
		toggle: fncToggle,
		initialize: fncInitialize,
	}

	const fncCallbackEvent = (fncName, variable, payload = {}) => {
		const fnc = fncHandlers[fncName];
		if (typeof fnc === 'function') return fnc(variable, payload);
	}

	if (isMobile) return (
		<MoCouponFilter
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...data,
				isOpen,
				applied
			}}
		/>
	);
	else return (
		<DtCouponFilter
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...data,
				isOpen,
				applied
			}}
		/>
	)
}

/**
 * @description: Desktop
 * @screenID:    -
 */
DtCouponFilter.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func,
};
export function DtCouponFilter({data, fncCallbackEvent}) {
	return (
		<>
			<button
				className={`filter-button-wrap ${data.isFilter && 'bg-dynamic-bg-brand-inverse'}`}
				aria-label={'목록 검색 조건 설정'}
				onClick={() => fncCallbackEvent('toggle')}
				onKeyDown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						fncCallbackEvent('toggle');
					}
				}}
			>
				<p>{`${data.applied.state.name} \u00B7 ${data.applied.order.name}`}</p>
				<Filter
					width={20} height={20}
					color={data.isFilter ? 'text-dynamic-icon-brand-primary' : 'text-dynamic-icon-neutral-primary'}
				/>
			</button>
			<div className={'filter-wrap'}>
				<div
					className={clsx(
						'w-full rounded-16 absolute -top-3 z-5 transition-all duration-200 ease-in-out',
						data.isOpen ? 'max-h-fit py-8 bg-dynamic-bg-neutral-primary' : 'max-h-0 py-0 bg-transparent'
					)}
					style={{boxShadow: `0 2px 10px 0px rgba(0, 0, 0, 0.1)`}}
				>
					{
						data.isOpen && (
							<>
								<div className={'filter-inner-top-wrap'}>
									<fieldset role={'group'} aria-label={'조회기간 설정'} className={'filter-group'}>
										<p className={'filter-name'}>사용유무</p>
										<div className={'flex-row-center gap-20'}>
											{
												FilterCouponState.map((status) => {
													const isChecked = data.useSeCd === status.id;
													return (
														<Checkbox
															key={status.id}
															ariaLabel={status.name}
															type={'square'}
															isChecked={isChecked}
															label={status.name || null}
															onChange={(checked) => fncCallbackEvent('singleCheck', {useSeCd: status.id})}
														/>
													)
												})
											}
										</div>
									</fieldset>
									<fieldset role={'group'} aria-label={'정렬순서 설정'} className={'filter-group'}>
										<p className={'filter-name'}>정렬순서</p>
										<div className={'flex-row-center gap-20'}>
											{
												FilterOrder.map((order) => {
													const isChecked = data.sortCrtrCd === order.id;
													return (
														<Checkbox
															key={order.id}
															ariaLabel={order.name}
															type={'square'}
															isChecked={isChecked}
															label={order.name}
															onChange={(checked) => fncCallbackEvent('singleCheck', {sortCrtrCd: order.id})}
														/>
													)
												})
											}
										</div>
									</fieldset>
								</div>
								<div className={'filter-inner-bottom-wrap'}>
									<Button
										theme={'textOnly'}
										size={'sm'}
										text={'필터 닫기'}
										ariaLabel={'검색 필터 닫기'}
										customStyle={'w-fit'}
										icon={<ChevronUp width={16} height={16}/>}
										iconPosition={'right'}
										onClick={() => fncCallbackEvent('toggle')}
									/>
									<div className={'flex-row-center gap-8'}>
										<Button
											theme={'tertiary'}
											size={'sm'}
											text={'초기화'}
											ariaLabel={'검색 조건 초기화'}
											customStyle={'w-fit'}
											icon={<Rotate width={16} height={16}/>}
											iconPosition={'left'}
											onClick={() => fncCallbackEvent('initialize')}
										/>
										<Button
											theme={'primary'}
											size={'sm'}
											text={'조회하기'}
											ariaLabel={'검색'}
											customStyle={'w-fit'}
											onClick={() => fncCallbackEvent('apply')}
										/>
									</div>
								</div>
							</>
						)
					}
				</div>
			</div>
		</>
	)
}

/**
 * @description: Mobile
 * @screenID:    -
 */
MoCouponFilter.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function MoCouponFilter({data, fncCallbackEvent}) {

	// 모바일 컨텐츠 높이 조정 여부
	const [moContentHeight, setMoContentHeight] = useState(false);

	// 모바일의 경우 콘텐츠 영역 조절이 필요
	useEffect(() => {
		// 언어설정 드롭다운 열릴시 헤더 배경색 변경
		const handleMoFilterHeight = () => {
			setMoContentHeight(prev => {
				return !prev;
			});
		}
		window.addEventListener('eventMoFilterHeight', handleMoFilterHeight);

		return () => {
			window.removeEventListener('eventMoFilterHeight', handleMoFilterHeight);
		}
	}, [])

	return (
		<>
			<button
				className={'filter-button-wrap'}
				aria-label={'목록 검색 조건 설정'}
				onClick={() => fncCallbackEvent('toggle')}
				onKeyDown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						fncCallbackEvent('toggle');
					}
				}}
			>
				<p>{`${data.applied.state.name} \u00B7 ${data.applied.order.name}`}</p>
				<Filter
					width={20} height={20}
					color={'text-dynamic-icon-neutral-primary'}
				/>
			</button>
			<div className={'filter-wrap'}>
				<div className={clsx(
						 'fixed inset-x-0 bottom-0 z-50 w-full shadow-lg',
						 'pt-40 px-20 pb-48',
						 moContentHeight ? 'h-full max-h-screen flex items-end bg-transparent' : 'h-fit max-h-[80%] rounded-t-[32px] bg-dynamic-bg-neutral-base',
						 'transform-gpu transition-transform duration-300 ease-out will-change-transform',
						 data.isOpen ? 'translate-y-0' : 'translate-y-full',
						 'scrollbar-thin scrollbar-thumb-dynamic-border-neutral-secondary scrollbar-thumb-rounded-full scrollbar-track-transparent',
					 )}
				>
					<div className={'filter-inner-top-wrap'}>
						{
							!moContentHeight && (
								<>
									<fieldset role={'group'} aria-label={'사용유무 설정'} className={'filter-group'}>
										<p className={'filter-name'}>사용유무</p>
										<div className={'grid grid-cols-3 gap-12'}>
											{
												FilterCouponState.map((status) => {
													const isChecked = data.useSeCd === status.id;
													return (
														<button
															key={status.id}
															aria-label={status.name}
															className={clsx('filter-item', isChecked && 'checked')}
															onClick={(checked) => fncCallbackEvent('singleCheck', {useSeCd: status.id})}
															onKeyDown={(e) => {
																if (e.key === 'Enter' || e.key === ' ') {
																	fncCallbackEvent('singleCheck', {useSeCd: status.id});
																}
															}}
														>
															{status.name || null}
														</button>
													)
												})
											}
										</div>
									</fieldset>
									<fieldset role={'group'} aria-label={'정렬순서 설정'} className={'filter-group'}>
										<p className={'filter-name'}>정렬순서</p>
										<div className={'grid grid-cols-3 gap-12'}>
											{
												FilterOrder.map((order) => {
													const isChecked = data.sortCrtrCd === order.id;
													return (
														<button
															key={order.id}
															aria-label={order.name}
															className={clsx('filter-item', isChecked && 'checked')}
															onClick={(checked) => fncCallbackEvent('singleCheck', {sortCrtrCd: order.id})}
															onKeyDown={(e) => {
																if (e.key === 'Enter' || e.key === ' ') {
																	fncCallbackEvent('singleCheck', {sortCrtrCd: order.id});
																}
															}}
														>
															{order.name || null}
														</button>
													)
												})
											}
										</div>
									</fieldset>
								</>
							)
						}
					</div>
					<div className={'filter-inner-bottom-wrap'}>
						<Button
							theme={'tertiary'}
							size={'lg'}
							text={'초기화'}
							ariaLabel={'검색 조건 초기화'}
							customStyle={'w-1/3'}
							icon={<Rotate width={16} height={16}/>}
							iconPosition={'left'}
							onClick={() => fncCallbackEvent('initialize')}
						/>
						<Button
							theme={'primary'}
							size={'lg'}
							text={'조회하기'}
							ariaLabel={'검색'}
							customStyle={'w-2/3'}
							onClick={() => fncCallbackEvent('apply')}
						/>
					</div>
				</div>
				{/*딤디드*/}
				{
					!moContentHeight && (
						<button
							onClick={() => fncCallbackEvent('toggle')}
							className={clsx(
								'fixed top-0 left-0 w-full h-full z-10 bg-neutral-10 transition-opacity duration-300',
								data.isOpen ? 'opacity-80 pointer-events-auto' : 'opacity-0 pointer-events-none',
							)}
							aria-label={'필터 닫기'}
						/>
					)
				}
			</div>
		</>
	)
}
