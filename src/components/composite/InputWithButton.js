import React, {forwardRef} from 'react';
import PropTypes from "prop-types";

// components
import InputText from "@components/common/InputText";
import Button from "@components/common/Button";

// assets
import {AlertCircleFill, AlertTriangleFill, CheckCircleFill} from "@assets/icons/Svgs";


/**
 * @description: input과 버튼이 함께 있는 컴포넌트 입니다.
 * @screenID:    -
 * @screenPath:  -
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
const InputWithButton = forwardRef(({
    status = 'default',
    size = 'md',
    value = '',
    message = '',
    title = '',
    direction = 'vertical',
    essential = false,
    placeholder = '',
    inputIcon = null,
    dataOnly = false,
    inputDisabled = false,
    onClickIcon = () => {},
    onChangeInput = () => {},
    theme = 'primary',
    buttonText = '',
    disabledButton = false,
    buttonIcon = null,
    buttonIconPosition = null, // left, center, right
    onClickButton = () => {},
	inputId = '',
	buttonAriaLabel = '',
    ...inputProps
}, ref) => {

	const stylesByStatus = {
		default: {
			input: `
                border-dynamic-border-neutral-primary
                text-dynamic-text-neutral-primary
                bg-dynamic-bg-neutral-primary
                hover:border-dynamic-border-neutral-tertiary
                focus:border-dynamic-border-brand-primary-subtle
                focus:text-dynamic-text-neutral-primary
                focus:bg-dynamic-bg-neutral-primary
            `,
			icon: null,
			underMessage: 'text-dynamic-text-neutral-secondary',
		},
		warning: {
			input: 'border-dynamic-border-negative-primary text-dynamic-text-neutral-primary bg-dynamic-bg-neutral-primary',
			icon: <AlertCircleFill width={16} height={16} color='text-dynamic-icon-negative-primary' />,
			underMessage: 'text-dynamic-text-negative-primary-bold',
		},
		success: {
			input: 'border-dynamic-border-positive-primary-bold text-dynamic-text-neutral-primary bg-dynamic-bg-neutral-primary',
			icon: <CheckCircleFill width={16} height={16} color='text-dynamic-icon-positive-primary-bold' />,
			underMessage: 'text-dynamic-text-positive-primary-bold',
		},
		caution: {
			input: 'border-dynamic-border-caution-primary-bold text-dynamic-text-neutral-primary bg-dynamic-bg-neutral-primary',
			icon: <AlertTriangleFill width={16} height={16} color='text-dynamic-icon-caution-primary-bold' />,
			underMessage: 'text-dynamic-text-caution-primary-bold',
		},
		disabled: {
			input: 'bg-dynamic-bg-neutral-disabled text-dynamic-text-neutral-disabled cursor-not-allowed border-transparent'
		}
	};

	return (
		<div>
			<div className={`w-full grid grid-cols-4 mo:grid-cols-3 gap-6 items-end`}>
				<div className={'col-span-3 mo:col-span-2'}>
					<InputText
						ref={ref}
						id={inputId}
						size={size}
						value={value}
						title={title}
						status={status}
						direction={direction}
						essential={essential}
						placeholder={placeholder}
						icon={inputIcon}
						dataOnly={dataOnly}
						disabled={inputDisabled}
						onClickIcon={onClickIcon}
						onChange={onChangeInput}
						{...inputProps}
					/>
				</div>
				<div className={`col-span-1`}>
					<Button
						size={size}
						theme={theme}
						text={buttonText}
						disabled={disabledButton}
						icon={buttonIcon}
						iconPosition={buttonIconPosition}
						ariaLabel={buttonAriaLabel}
						customStyle={'w-full min-w-[66px]'}
						onClick={onClickButton}
					/>
				</div>
			</div>
			{message && (
				<div
					id={message ? `${inputId}Message` : undefined}
					tabIndex={message ? 0 : -1}
					className={'flex items-center gap-2 mt-4 px-5'}
				>
					{!inputDisabled && stylesByStatus[status].icon}
					<p className={`text-label-2xs ${inputDisabled ? 'text-dynamic-text-secondary' : stylesByStatus[status].underMessage}`}>{message}</p>
				</div>
			)}
		</div>
	);
})

InputWithButton.propTypes = {
	status: PropTypes.string,
	size: PropTypes.string,
	value: PropTypes.string,
	message: PropTypes.string,
	title: PropTypes.string,
	direction: PropTypes.string,
	essential: PropTypes.bool,
	placeholder: PropTypes.string,
	inputIcon: PropTypes.any,
	dataOnly: PropTypes.bool,
	inputDisabled: PropTypes.bool,
	onClickIcon: PropTypes.func,
	onChangeInput: PropTypes.func,
	theme: PropTypes.string,
	buttonText: PropTypes.string,
	disabledButton: PropTypes.bool,
	buttonIcon: PropTypes.any,
	buttonIconPosition: PropTypes.string,
	onClickButton: PropTypes.func,
	inputProps: PropTypes.any,
	inputId: PropTypes.string,
	buttonAriaLabel: PropTypes.string,
};
InputWithButton.displayName = "InputWithButton"
export default InputWithButton;