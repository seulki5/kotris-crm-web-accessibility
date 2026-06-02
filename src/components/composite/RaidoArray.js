import React from "react";
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
	return (
		<fieldset className={'w-full'}>
			<legend id={ariaLabelledby} className={'sr-only'}>
				{ariaLabel}
			</legend>
			<div role={'radiogroup'} aria-labelledby={ariaLabelledby} className={`w-full gap-24 grid grid-cols-${grid}`}>
				{
					options && options.length > 0 && (
						options.map((item, index) => {
							const isChecked = value === item.id;
							return (
								<RadioSelector
									key={item.id}
									type={'text'}
									data={item}
									isChecked={isChecked}
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
	onClick: PropTypes.func,
	disabled: PropTypes.bool,
};
export function RadioSelector({
	type = 'text',
	data = {},
	isChecked = false,
	onClick = () => {},
	disabled = false
}) {
	
	const stylesByTheme = {
		default: {
			border: isChecked ? 'border-dynamic-border-brand-primary-subtle' : 'border-dynamic-border-neutral-primary',
			bg: isChecked ? 'bg-dynamic-bg-brand-inverse-subtle' : 'bg-transparent',
			text: 'text-dynamic-text-neutral-primary',
			icon: isChecked && 'bg-dynamic-bg-brand-primary'
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
	
	return (
		<div
			role={'radio'}
			aria-checked={isChecked}
			aria-disabled={disabled}
			tabIndex={(isChecked && !disabled) ? 0 : -1}
			onClick={handleClick}
			onKeyDown={(e) => {
				if(e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					handleClick();
				}
			}}
			className={`
				w-full flex flex-row items-start justify-between relative rounded-12 p-20 min-h-[92px] cursor-pointer
				border border-solid
				${disabled ? stylesByTheme['disabled'].bg : stylesByTheme['default'].bg}
				${disabled ? stylesByTheme['disabled'].border : stylesByTheme['default'].border}
			`}>
			{
				type === 'card' ? (
					<div className={'mx-8 mo:mx-12 mo:my-12'}>
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
					<p className={clsx(
						'text-label-xl font-medium whitespace-pre-wrap text-start ml-8',
						disabled ? stylesByTheme['disabled'].text : stylesByTheme['default'].text
					)}>
						{data.name}
					</p>
				)
			}
			<div className={clsx(
                'w-[20px] h-[20px] flex items-center justify-center rounded-full transition-colors relative border-[1.5px] text-dynamic-icon-neutral-inverse',
                disabled ? stylesByTheme['disabled'].border : stylesByTheme['default'].border,
				disabled ? stylesByTheme['disabled'].icon : stylesByTheme['default'].icon
			)}>
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
