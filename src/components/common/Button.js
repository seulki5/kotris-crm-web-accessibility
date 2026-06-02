'use client'

import React from 'react';
import PropTypes from 'prop-types';

Button.propTypes = {
	theme: PropTypes.string,
	size: PropTypes.string,
	text: PropTypes.string,
	ariaLabel: PropTypes.string,
	disabled: PropTypes.bool,
	icon: PropTypes.any,
	iconPosition: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
	customStyle: PropTypes.string,
	onClick: PropTypes,
};
export default function Button({
   theme = 'primary',
   size = 'md',
   text = '',
   ariaLabel = '',
   disabled = false,
   icon = null,
   iconPosition = null, // left, center, right
   customStyle = '',
   onClick = () => { },
   ...props
}) {
	// button 사이즈별 스타일
	const sizesBySize = {
		xs: {
			icon: {width: 12, height: 12},
			iconOnly: {width: 16, height: 16},
			button: `
	            h-[32px] rounded-8 gap-2
	            whitespace-nowrap text-button-sm
	        `,
			iconOnlyButton: `w-[32px] h-[32px] rounded-full gap-4`,
			paddingHorizontal: 12,
		},
		sm: {
			icon: {width: 16, height: 16},
			iconOnly: {width: 20, height: 20},
			button: `
	            h-[40px] rounded-8 gap-4
	            whitespace-nowrap text-button-md
	        `,
			iconOnlyButton: `w-[40px] h-[40px] rounded-full gap-4`,
			paddingHorizontal: 16,
		},
		md: {
			icon: {width: 16, height: 16},
			iconOnly: {width: 24, height: 24},
			button: `
	            h-[48px] rounded-12 gap-4
	            whitespace-nowrap text-button-lg
	        `,
			iconOnlyButton: `w-[48px] h-[48px] rounded-full gap-4`,
			paddingHorizontal: 20,
		},
		lg: {
			icon: {width: 20, height: 20},
			iconOnly: {width: 32, height: 32},
			button: `
	            h-[56px] rounded-12 gap-6
	            whitespace-nowrap text-button-xl
	        `,
			iconOnlyButton: `w-[56px] h-[56px] rounded-full gap-6`,
			paddingHorizontal: 28,
		},
		xl: {
			icon: {width: 24, height: 24},
			iconOnly: {width: 32, height: 32},
			button: `
	            h-[64px] rounded-12 gap-6
	            whitespace-nowrap text-button-xl
	        `,
			iconOnlyButton: `w-[64px] h-[64px] rounded-full gap-6`,
			paddingHorizontal: 32,
		},
		xxl: {
			icon: {width: 30, height: 30},
			iconOnly: {width: 38, height: 38},
			button: `
	            h-[70px] rounded-12 gap-6
	            whitespace-nowrap text-button-xl
	        `,
			iconOnlyButton: `w-[70px] h-[70px] rounded-full gap-6`,
			paddingHorizontal: 32,
		}
	}

	// button 테마별 스타일
	const stylesByTheme = {
		primary: `
            text-dynamic-text-neutral-inverse
            bg-dynamic-bg-brand-primary transition-colors
            hover:bg-dynamic-bg-brand-primary-bold
        `,
		secondary: `
            text-dynamic-text-brand-primary-bold
            bg-dynamic-bg-brand-inverse transition-colors
            hover:bg-dynamic-bg-brand-inverse-bold
        `,
		tertiary: `
            text-dynamic-text-neutral-tertiary
            bg-dynamic-bg-neutral-secondary transition-colors
            hover:bg-dynamic-bg-neutral-tertiary
        `,
		textOnly: `
		    bg-transparent transition-colors
            text-dynamic-text-brand-primary
            hover:text-dynamic-text-brand-primary-bold
        `,
		iconOnly: `
		    bg-transparent transition-colors
		    text-dynamic-text-neutral-tertiary
		    hover:text-dynamic-text-neutral-primary
        `,
		disabled: `
            bg-dynamic-bg-neutral-disabled cursor-not-allowed
            text-dynamic-text-neutral-disabled
		`,
		disabledTextOnly: `
            text-dynamic-text-neutral-disabled cursor-not-allowed
            hover:text-dynamic-text-neutral-disabled
		`,
		delete: `
			text-dynamic-text-negative-primary
            bg-dynamic-bg-neutral-tertiary transition-colors
            hover:bg-dynamic-bg-neutral-secondary
		`,
		deleteIntl: `
			text-dynamic-text-negative-primary
            bg-dynamic-bg-neutral-secondary transition-colors
            hover:bg-dynamic-bg-neutral-disabled
		`,
	}
	
	// 아이콘 컬러
	const getIconColor = () => {
		if (disabled) {
			return 'text-dynamic-icon-neutral-disabled';
		}
		
		switch (theme) {
			case 'primary':
				return 'text-dynamic-icon-neutral-inverse';
			case 'secondary':
				return 'text-dynamic-icon-brand-primary-bold';
			case 'tertiary':
				return 'text-dynamic-icon-neutral-tertiary';
			case 'textOnly':
				return 'text-dynamic-icon-brand-primary hover:text-dynamic-icon-brand-primary-bold';
			default:
				return 'text-dynamic-icon-default-primary';
		}
	}
	
	return (
		<button
			type={'button'}
			aria-label={ariaLabel || text}
			className={`
                flex flex-row items-center justify-center transition-all
                font-medium whitespace-pre-wrap break-keep
                ${iconPosition === 'center' ? sizesBySize[size].iconOnlyButton : sizesBySize[size].button}
                ${disabled && theme !== 'textOnly' ? stylesByTheme['disabled'] : stylesByTheme[theme]}
                ${disabled && theme === 'textOnly' && stylesByTheme['disabledTextOnly']}
                ${customStyle}
                ${icon && React.isValidElement(icon) ? sizesBySize[size].paddingHorizontal : 0}
                ${theme === 'iconOnly' ? 'px-0' : 'px-16'}
            `}
			disabled={disabled}
			aria-disabled={disabled}
			onClick={onClick}
			onKeyDown={(e) => {
				if(e.key === 'Enter') onClick();
			}}
			{...props}
		>
			{icon && React.isValidElement(icon) && iconPosition === 'left' && (
				<div>
					{React.cloneElement(icon, {...sizesBySize[size]['icon'], color: 'stroke-current'})}
				</div>
			)}
			{icon && React.isValidElement(icon) && iconPosition === 'center' ? (
				React.cloneElement(icon, {...sizesBySize[size]['iconOnly'], color: getIconColor()})
			) : (
				<p className={'leading-none'}>{text}</p>
			)}
			{icon && React.isValidElement(icon) && iconPosition === 'right' && (
				<div>
					{React.cloneElement(icon, {...sizesBySize[size]['icon'], color: 'stroke-current'})}
				</div>
			)}
		</button>
	)
}
