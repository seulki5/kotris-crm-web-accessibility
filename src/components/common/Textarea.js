import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// components
import FieldTitle from "@components/composite/FieldTitle";

// svg
import { AlertCircleFill, CheckCircleFill, AlertTriangleFill } from '@assets/icons/Svgs';

Textarea.propTypes = {
    size: PropTypes.string,
    placeholder: PropTypes.string,
    status: PropTypes.string,
    title: PropTypes.string,
    essential: PropTypes.bool,
    direction: PropTypes.string,
    disabled: PropTypes.bool,
    maxLength: PropTypes.number,
    message: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    dataOnly: PropTypes.bool,
    customStyle: PropTypes.string,
    ariaLabel: PropTypes.string,
    id: PropTypes.id,
};
export default function Textarea({
     size = 'md',
     placeholder = 'placeholder',
     status = 'default',
     title = null,
     essential = false,
     direction = 'vertical',
     disabled = false,
     maxLength = 1000,
     message = null,
     value = '',
     onChange = () => {},
     dataOnly = false,
     customStyle = '',
     ariaLabel = '',
     id= '',
     ...props
 }) {
    const [textValue, setTextValue] = useState('');

    useEffect(() => {
        setTextValue(value);
    }, [value]);

    const handleChange = (e) => {
        if (disabled) return

        const newValue = e.target.value;
        if (maxLength && newValue.length > maxLength) return;

        setTextValue(newValue);
        onChange(e);
    }

    const sizeStyles = {
        sm: {
            wrapper: 'min-h-[96px]',
            textSize: 'text-body-sm',
            padding: 'px-6 py-8',
        },
        md: {
            wrapper: 'min-h-[100px]',
            textSize: 'text-body-md',
            padding: 'px-10 py-12',
        },
        lg: {
            wrapper: 'min-h-[108px]',
            textSize: 'text-body-xl',
            padding: 'px-14 py-16',
        }
    }

    const stylesByStatus = {
        default: {
            input:  `
                border-dynamic-border-neutral-primary
                text-dynamic-text-neutral-primary
                bg-dynamic-bg-neutral-primary
                hover:border-dynamic-border-neutral-tertiary
                focus:border-dynamic-border-brand-primary-subtle
            `,
            icon: null,
            underMessage: 'text-dynamic-text-neutral-secondary',
        },
        warning: {
            input: 'border-dynamic-border-negative-primary',
            icon: <AlertCircleFill width={16} height={16} color='text-dynamic-icon-negative-primary' />,
            underMessage: 'text-dynamic-text-negative-primary-bold',
        },
        success: {
            input: 'border-dynamic-border-positive-primary',
            icon: <CheckCircleFill width={16} height={16} color='text-dynamic-icon-positive-primary-bold' />,
            underMessage: 'text-dynamic-text-positive-primary-bold',
        },
        caution: {
            input: 'border-dynamic-border-caution-secondary',
            icon: <AlertTriangleFill width={16} height={16} color='text-dynamic-icon-caution-primary-bold' />,
            underMessage: 'text-dynamic-text-caution-primary-bold',
        },
        disabled: {
            input: 'bg-dynamic-bg-neutral-disabled text-dynamic-text-neutral-disabled border-transparent cursor-not-allowed'
        }
    }

    return (
        <div className={`w-full flex gap-8 ${direction === 'vertical' ? 'flex-col' : 'items-center'}`}>
            {title && (
                <FieldTitle title={title} essential={essential} />
            )}
            <div className='flex flex-col flex-1 rounded-[12px]'>
                <div className={`
                    relative flex items-start rounded-[12px]
                    ${disabled ? 'cursor-not-allowed' : ''}
                    ${customStyle}
                `}>
                    {
                        dataOnly ? (
                            <div className={`
                                w-full h-full resize-none
                                ${sizeStyles[size].wrapper}
                                ${sizeStyles[size].textSize}
                                ${sizeStyles[size].padding}
                                border border-[1px] rounded-[12px]
                            `}>
                                {textValue}
                            </div>
                        ) : (
                            <textarea
                                id={id}
                                value={textValue}
                                placeholder={placeholder}
                                disabled={disabled}
                                className={`
                                    w-full resize-none
                                    border rounded-12
                                    transition-colors duration-300
                                    ${sizeStyles[size].wrapper}
                                    ${sizeStyles[size].textSize}
                                    ${sizeStyles[size].padding}
                                    ${disabled ? stylesByStatus['disabled'].input : stylesByStatus[status].input}
                                    placeholder:text-dynamic-text-neutral-disabled
                                    focus:outline-none
                                `}
                                aria-label={placeholder || title}
                                aria-disabled={disabled}
                                aria-describedby={[
                                    message ? `textarea-message-${id}` : null,
                                    maxLength > 0 ? `textarea-count-${id}` : null
                                ].filter(Boolean).join(' ') || undefined}
                                onChange={handleChange}
                                {...props}
                            />
                        )
                    }
                    {maxLength > 0 && (
                        <div
                            id={`textarea-count-${id}`}
                            className={'absolute bottom-2 right-3 text-label-2xs text-dynamic-text-neutral-disabled'}
                        >
                            <span className={'sr-only'}>
                                {`최대 ${maxLength || 1}자 중 ${textValue.length || 0}자를 입력했습니다.`}
                            </span>
                            <span aria-hidden={true}>
                                {textValue.length || 0}/{maxLength || 1}
                            </span>
                        </div>
                    )}
                </div>
                {message && (
                    <div id={`textarea-message-${id}`} className={'flex items-center gap-2 mt-4 px-5'}>
                        {!disabled && stylesByStatus[status].icon}
                        <p className={`text-label-2xs ${disabled ? 'text-dynamic-text-secondary' : stylesByStatus[status].underMessage}`}>{message}</p>
                    </div>
                )}
            </div>
        </div>
    )
}
