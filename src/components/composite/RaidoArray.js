import React, {useRef} from "react";
import PropTypes from "prop-types";

// components
import {Check, CheckBold} from "@assets/icons/Svgs";
import clsx from "clsx";


/**
 * @description: 공통 선택 컴포넌트 입니다.
 * @screenID:    -
 * @screenPath:  -
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
RadioArray.propTypes = {
	grid: PropTypes.number,
	options: PropTypes.array,
	value: PropTypes.string,
	onChange: PropTypes.func,
	ariaLabel: PropTypes.string,
	ariaLabelledby: PropTypes.string,
	disabled: PropTypes.bool
};
export default function RadioArray({
	grid = 2, // grid-columns
	options = [], // 라디오버튼 만들 선택지
	value = "", // 현재 선택한 옵션
	onChange = () => {}, // Radio 클릭 이벤트
	ariaLabel = '',
	ariaLabelledby = '',
	disabled = false
}) {
	
	const groupRef = useRef(null);
	const fncHandleKeyDown = (e) => {
		if(disabled) return;
		const enabledRadios = Array.from(
			groupRef.current.querySelectorAll('[role="radio"]:not([aria-disabled="true"])')
		)
		if (!enabledRadios.length) return;
		
		const currentIndex = enabledRadios.findIndex(el => el === document.activeElement);
		if (currentIndex === -1) return;
		
		let nextIndex = currentIndex;
		
		if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
			e.preventDefault();
			nextIndex = (currentIndex + 1) % enabledRadios.length;
		} else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
			e.preventDefault();
			nextIndex = (currentIndex - 1 + enabledRadios.length) % enabledRadios.length;
		} else if (e.key === ' ' || e.key === 'Enter') {
			e.preventDefault();
			// 현재 초점이 맞춰진 엘리먼트의 클릭 이벤트를 강제 트리거
			enabledRadios[currentIndex].click();
			return;
		} else {
			return; // 다른 키 입력은 기본 브라우저 동작 유지
		}
		
		// 새 타겟에 포커스를 주고 상태(onChange)를 업데이트하여 선택을 동기화시킵니다.
		enabledRadios[nextIndex].focus();
		
		// DOM 엘리먼트에 커스텀으로 심어둔 data-id 값을 가져와 이벤트를 실행합니다.
		const targetId = enabledRadios[nextIndex].getAttribute('data-id');
		if (targetId) onChange(targetId);
	}
	
	const hasSelectedValue = options.some(item => item.id === value);
	
	return (
		<fieldset className={'w-full'}>
			<legend id={ariaLabelledby} className={'sr-only'}>
				{ariaLabel}
			</legend>
			<div
				ref={groupRef}
				role={'radiogroup'}
				aria-labelledby={ariaLabelledby}
				className={`w-full gap-24 grid grid-cols-${grid}`}
				onKeyDown={fncHandleKeyDown}
			>
				{
					options && options.length > 0 && (
						options.map((item, index) => {
							const isChecked = value === item.id;
							const isFirstEntry = hasSelectedValue ? isChecked : index === 0;
							return (
								<RadioSelector
									key={item.id}
									type={'text'}
									data={item}
									isChecked={isChecked}
									isFirstEntry={isFirstEntry}
									onClick={onChange}
									disabled={disabled}
								/>
							);
						})
					)
				}
			</div>
		</fieldset>
	)
}

RadioSelector.propTypes = {
	type: PropTypes.string,
	data: PropTypes.object,
	isChecked: PropTypes.bool,
	isFirstEntry: PropTypes.bool,
	onClick: PropTypes.func,
	disabled: PropTypes.bool,
};
export function RadioSelector({
	type = 'text',
	data = {},
	isChecked = false,
	isFirstEntry = false,
	onClick = () => {},
	disabled = false
}) {
	
	const stylesByTheme = {
		default: {
			border: isChecked ? 'border-dynamic-border-brand-primary-subtle' : 'border-dynamic-border-neutral-primary',
			bg: isChecked ? 'bg-dynamic-bg-brand-inverse-subtle' : 'bg-transparent',
			text: 'text-dynamic-text-neutral-primary',
			icon: isChecked ? 'bg-dynamic-bg-brand-primary' : 'bg-transparent',
		},
		disabled: {
			border: 'border-dynamic-border-neutral-primary',
			bg: 'bg-transparent',
			text: 'text-dynamic-text-neutral-secondary',
			icon: 'bg-dynamic-icon-neutral-quarternary'
		}
	}
	
	const handleClick = () => {
		if(disabled) return;
		onClick(data.id);
	}
	
	const getTabIndex = () => {
		if(disabled) return -1;
		return isFirstEntry ? 0 : -1;
	}
	
	return (
		<div
			role={'radio'}
			aria-checked={isChecked}
			aria-disabled={disabled}
			aria-label={`${data.name} ${isChecked ? '선택 됨' : '선택 안됨'}`}
			tabIndex={getTabIndex()}
			data-id={data.id}
			onClick={handleClick}
			className={`
				w-full flex flex-row items-start justify-between relative rounded-12 p-20 min-h-[92px] cursor-pointer
				border border-solid
				${disabled ? stylesByTheme['disabled'].bg : stylesByTheme['default'].bg}
				${disabled ? stylesByTheme['disabled'].border : stylesByTheme['default'].border}
			`}>
			{
				type === 'card' ? (
					<div className={'mx-8 mo:mx-12 mo:my-12'} aria-hidden={true}>
						<p className={'text-heading-md text-dynamic-text-neutral-primary font-semibold whitespace-pre-wrap text-start mb-16 mo:text-heading-sm mo:mb-20'}>
							{data.name}
						</p>
						{
							data.details.map((detail) => {
								return (
									<div key={detail.id} className={'flex-row-center gap-6'}>
										<Check
											width={16} height={16}
											color={data.color}
										/>
										<span className={'text-body-xl text-dynamic-icon-neutral-primary font-medium mo:text-body-md'}>
											{detail.body}
										</span>
									</div>
								);
							})
						}
						{
							data.comment !== null && data.comment?.length > 0 && (
								<div className={'mt-8 mo:mt-12'}>
									{
										data.comment.map((comment) => (
											<div className={'flex flex-row mt-4'} key={comment.id}>
												<p className={'text-label-md text-dynamic-text-alert-primary font-medium mr-2 mo:text-label-xs'}>
													*
												</p>
												<p className={'text-label-md text-dynamic-text-neutral-secondary font-medium mo:text-label-xs mo:text-start'}>
													{comment.message}
												</p>
											</div>
										))
									}
								</div>
							)
						}
					</div>
				) : (
					<p
						className={clsx(
							'text-label-xl font-medium whitespace-pre-wrap text-start ml-8',
							disabled ? stylesByTheme['disabled'].text : stylesByTheme['default'].text
						)}
						aria-hidden={true}
					>
						{data.name}
					</p>
				)
			}
			<div
				className={clsx(
	                'w-[20px] h-[20px] flex items-center justify-center rounded-full transition-colors relative border-[1.5px] text-dynamic-icon-neutral-inverse',
	                disabled ? stylesByTheme['disabled'].border : stylesByTheme['default'].border,
					disabled ? stylesByTheme['disabled'].icon : stylesByTheme['default'].icon
				)}
				aria-hidden={true}
			>
				{isChecked && (
					<CheckBold
						width={13} height={13}
						color={'text-dynamic-icon-neutral-inverse'}
					/>
				)}
			</div>
		</div>
	)
}
