import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// svg
import { Check, X } from '@assets/icons/Svgs';

ToggleSwitch.propTypes = {
    id: PropTypes.string,
    size: PropTypes.string,
    isChecked: PropTypes.bool,
    disabled: PropTypes.bool,
    label: PropTypes.string,
    onChange: PropTypes.func,
};
export default function ToggleSwitch({
    id = '',
    size = 'md',
    isChecked = false,
    disabled = false,
    label = '',
    onChange,
    ...props
}) {
    const [checked, setChecked] = useState(isChecked);

    useEffect(() => {
        setChecked(isChecked);
    }, [isChecked])

    const handleChange = () => {
        if (!disabled) {
            const newChecked = !checked;
            // setChecked(newChecked);
            onChange?.(newChecked);
        }
    }

    const stylesBySize = {
        sm: {
            wrapper: 'w-[40px] h-[24px]',
            iconSize: 12,
            circleSize: 'w-[20px] h-[20px] translate-y-[-2px]',
            label: 'text-label-md',
            topPosition: 'top-[2px]',
            translate: 'translate-x-[16px]',
        },
        md: {
            wrapper: 'w-[52px] h-[32px]',
            iconSize: 16,
            circleSize: 'w-[28px] h-[28px] translate-y-[-6px]',
            label: 'text-label-lg',
            topPosition: 'top-[6px]',
            translate: 'translate-x-[20px]'
        },
    }

    const stylesByStatus = {
        disabled: {
            wrapper: 'bg-dynamic-bg-default-disabled border-dynamic-border-neutral-secondary cursor-not-allowed',
            circleColor: 'bg-dynamic-bg-neutral-primary',
            label: 'text-dynamic-text-neutral-disabled'
        },
        active: {
            wrapper: `
                ${checked
                    ? 'bg-dynamic-bg-brand-primary hover:border-dynamic-border-brand-primary-bold'
                    : 'bg-dynamic-bg-neutral-tertiary hover:border-dynamic-border-neutral-secondary'}}
                cursor-pointer
            `,
            circleColor: 'bg-dynamic-bg-neutral-primary',
            label: 'text-dynamic-text-neutral-primary'
        }
    }

    return (
        <label className='inline-flex items-center'>
            <button
                type={'button'}
                role={'switch'}
                aria-checked={checked}
                aria-labelledby={`switch-label-${id}`}
                disabled={disabled}
                onClick={handleChange}
                className={`
                    relative inline-flex items-center rounded-full transition-colors
                    border-1 border-solid border-transparent
                    ${stylesBySize[size].wrapper}
                    ${disabled ? stylesByStatus['disabled'].wrapper : stylesByStatus['active'].wrapper}
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary
                `}
                {...props}
            >
                <span
                    className={`
                        absolute left-[2px] ${stylesBySize[size].topPosition}
                        transform rounded-full transition-transform
                        relative flex items-center justify-center
                        ${stylesBySize[size].circleSize}
                        ${disabled ? stylesByStatus['disabled'].circleColor : stylesByStatus['active'].circleColor}
                        ${checked ? stylesBySize[size].translate : 'translate-x-0'}
                    `}
                >
                    {checked ? (
                        <Check
                            width={stylesBySize[size].iconSize}
                            height={stylesBySize[size].iconSize}
                            color={disabled ? 'text-dynamic-icon-neutral-disabled' : 'text-dynamic-icon-brand-primary'}
                        />
                    ) : (
                        <X
                            width={stylesBySize[size].iconSize}
                            height={stylesBySize[size].iconSize}
                            color={disabled ? 'text-dynamic-icon-neutral-disabled' : 'text-dynamic-icon-neutral-tertiary'}
                        />
                    )}
                </span>
            </button>
            <span id={`switch-label-${id}`} className={'sr-only'}>{label}</span>
            {label && (
                <span
                    aria-hidden={true}
                    className={`ml-8 ${stylesBySize[size].label} ${disabled ? stylesByStatus['disabled'].label : stylesByStatus['active'].label}`}
                >
                    {label}
                </span>
            )}
        </label>
    )
}

