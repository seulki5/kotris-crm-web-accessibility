import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types';

// svg
import {CheckBold} from '@assets/icons/Svgs';

Checkbox.propTypes = {
    ariaLabel: PropTypes.string,
    type: PropTypes.string,
    isChecked: PropTypes.bool,
    disabled: PropTypes.bool,
    label: PropTypes.string,
    essentialLabel: PropTypes.string,
    onChange: PropTypes.func,
};
export default function Checkbox({
    ariaLabel = '',
    type = 'square',
    isChecked = false,
    disabled = false,
    label = '',
    essentialLabel = null,
    onChange = () => { }
}) {

    const [checked, setChecked] = useState(isChecked);

    useEffect(() => {
        setChecked(isChecked)
    }, [isChecked])

    const handleChange = () => {
        if (disabled) return;
        onChange?.(!checked);
    }

    const stylesByTheme = {
        square: {
            border: 'border-2',
            wrapper: 'cursor-pointer',
            checkbox: `${checked ? 'bg-dynamic-bg-brand-primary border-dynamic-border-brand-primary' : 'bg-dynamic-bg-neutral-primary border-dynamic-border-neutral-primary hover:bg-dynamic-bg-neutral-secondary'} `,
            label: `${checked ? 'text-dynamic-text-neutral-primary' : 'text-dynamic-text-neutral-secondary'}`,
            checkedIcon: ''
        },
        brand: {
            border: 'border-0',
            wrapper: 'cursor-pointer',
            checkbox: null,
            label: '',
            checkedIcon: 'text-dynamic-icon-brand-primary'
        },
        neutral: {
            border: 'border-0',
            wrapper: 'cursor-pointer',
            checkbox: null,
            label: '',
            checkedIcon: 'text-dynamic-icon-neutral-primary'
        },
        disabled: {
            border: 'border-0',
            wrapper: 'cursor-not-allowed',
            checkbox: `${type === 'square' && 'bg-dynamic-bg-neutral-disabled'} border-0 cursor-not-allowed`,
            label: 'text-dynamic-text-neutral-disabled cursor-not-allowed',
            checkedIcon: ''
        }
    }

    const stylesByChecked = (sort) => {
        if(sort === 'label') {
            if(disabled) return stylesByTheme['disabled'].label;
            if(type === 'square') return stylesByTheme[type].label;

            return checked ? 'text-dynamic-text-neutral-primary' :'text-dynamic-text-neutral-secondary';
        }

        if(sort === 'icon') {
            if(disabled) return 'text-dynamic-icon-neutral-disabled';
            if(checked) return stylesByTheme[type].checkedIcon;

            return 'text-dynamic-icon-neutral-secondary';
        }
    }

    return (
        <div
             role={'checkbox'}
             aria-checked={checked}
             aria-disabled={disabled}
             aria-label={ariaLabel}
             tabIndex={disabled ? -1: 0}
             className={`w-fit flex flex-row items-center justify-center ${stylesByTheme[type].wrapper} focus-visible:outline`}
             onClick={handleChange}
             onKeyDown={(e) => {
                 if(e.key === 'Enter' || e.key === ' ') {
                     e.preventDefault()
                     handleChange();
                 }
             }}
        >
            <div
                className={`
                    w-[20px] h-[20px] rounded-6
                    flex items-center justify-center
                    transition-colors
                    ${disabled? stylesByTheme['disabled'].border : stylesByTheme[type].border}
                    ${disabled? stylesByTheme['disabled'].checkbox : stylesByTheme[type].checkbox}
                `}
            >
                {checked && type === 'square' && (
                    <CheckBold
                        width={14} height={14}
                        color={disabled ? 'text-dynamic-icon-neutral-disabled' : 'text-dynamic-icon-neutral-inverse'}
                    />
                )}
                {type !== 'square' && (
                    <CheckBold
                        width={20} height={20}
                        color={stylesByChecked('icon')}
                    />
                )}
            </div>
            <div className={'flex-row-center'}>
                <p className={`ml-[10px] text-label-xl font-medium ${stylesByChecked('label')} mo:text-label-lg mo:break-keep`}>
                    {label}
                    {
                        essentialLabel && (
                            <span className={'text-label-lg text-dynamic-text-brand-primary font-medium ml-5'}>({essentialLabel})</span>
                        )
                    }
                </p>
            </div>
        </div>
    )
}
