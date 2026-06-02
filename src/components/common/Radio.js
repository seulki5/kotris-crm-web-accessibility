import React from 'react'
import PropTypes from "prop-types";
import {CheckBold} from "@assets/icons/Svgs";

Radio.propTypes = {
    isChecked: PropTypes.bool,
    disabled: PropTypes.bool,
    label: PropTypes.string,
    value: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func,
};
export default function Radio({
    isChecked = false,
    disabled = false,
    label = null,
    value = null,
    name = null,
    onChange,
    ...props
}) {
    
    const handleChange = () => {
        if (!disabled) {
            onChange?.(value)
        }
    }

    const stylesByBase = {
        radio: 'w-[20px] h-[20px] flex items-center justify-center rounded-full transition-colors relative',
        label: 'ml-8 text-label-md'
    }
    
    const stylesByStatus = () => {
        if(disabled) {
            return {
                wrapper: 'cursor-not-allowed',
                radioColor: 'bg-dynamic-bg-neutral-disabled border-0',
                label: 'text-dynamic-text-neutral-disabled'
            }
        } else {
            return {
                wrapper: 'cursor-pointer',
                radioColor: `${isChecked ? 'border-dynamic-border-brand-primary bg-dynamic-bg-brand-primary' : 'hover:bg-dynamic-bg-neutral-secondary border-dynamic-border-neutral-primary'}`,
                label: 'text-dynamic-text-neutral-primary'
            }
        }
    }

    return (
        <label className={`inline-flex items-center relative ${stylesByStatus().wrapper}`}>
            <div className={"relative"}>
                <input
                    type={"radio"}
                    checked={isChecked}
                    name={name}
                    value={value}
                    disabled={disabled}
                    onChange={handleChange}
                    className={"sr-only"}
                    {...props}
                />
                <div className={`${stylesByBase.radio} ${stylesByStatus().radioColor} border-2`}>
                    {isChecked && (
                        <CheckBold
                            width={13} height={13}
                            color={disabled ? "text-dynamic-icon-neutral-disabled" : "text-dynamic-icon-neutral-inverse"}
                        />
                    )}
                </div>
            </div>
            {label && (
                <span className={`${stylesByBase.label} ${stylesByStatus().label}`}>
                    {label}
                </span>
            )}
        </label>
    )
}
