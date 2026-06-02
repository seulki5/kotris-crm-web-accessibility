import React, {useEffect, useState, forwardRef, useRef, useMemo} from 'react';
import PropTypes from 'prop-types';

// components
import FieldTitle from "@components/composite/FieldTitle";

// svg
import { CheckCircleFill, AlertCircleFill, AlertTriangleFill, XCircleFill } from '@assets/icons/Svgs';

// modules
import {useWebContext} from "@modules/context/WebviewContext";
import {removeOldestQuery} from "@tanstack/react-query-persist-client";

// const
const ALLOW_MAP = {
    num: '0-9',
    eng: 'A-Za-z',
    kor: '\\u3131-\\u318E\\uAC00-\\uD7A3',
    space: ' ',
    dash: '\\-',
    underscore: '_',
    dot: '\\.',
    at: '@',
    plus: '\\+',
    slash: '\\/',
    colon: ':',
    alnum: '0-9A-Za-z',
    emailLocal: "A-Za-z0-9@.",
    char: "\\.\\!\\#\\$\\%\\&\\'\\*\\+\\/\\=\\?\\^_`\\{\\|\\}\\~\\-\\<\\>",
    pwChar: "\\!\\@\\#\\$\\%\\^\\&\\*",
    lowAlnum: '0-9a-z',
}

export function buildAllowFilter(allows) {
    // RegExp가 오면 제거 패턴(deny)으로 사용: 해당 패턴에 매칭되는 문자/구간 제거
    if (allows instanceof RegExp) {
        const rx = allows
        return (s) => String(s).replace(rx, '')
    }
    // 배열 프리셋 → 허용 외 제거
    const arr = Array.isArray(allows) ? allows : []
    const chars = arr.map(k => ALLOW_MAP[k]).filter(Boolean).join('')
    if (!chars) return (s) => String(s) // 규칙 없으면 그대로 통과
    const rx = new RegExp(`[^${chars}]`, 'g')        // 허용 외 제거
    return (s) => String(s).replace(rx, '')
}


const InputText = forwardRef(({
    status = 'default',
    size = 'md',
    value = '',
    message = null,
    title = null,
    direction = 'vertical',
    essential = false,
    placeholder = '',
    icon = null,
    dataOnly = false,
    onClickIcon = undefined,
    onChange = () => { },
    disabled = false,
    fitWidth = false,
    inputType = 'text',
    id = '',
    iconAriaLabel = '',
    allows = ['kor', 'alnum'],
    maxLength,
    ...props
}, ref) => {

    const clearRef = useRef(null);
    const [innerValue, setInnerValue] = useState(value || '');
    const [isFocused, setIsFocused] = useState(false);
    const [isComposing, setIsComposing] = React.useState(false);
    const {isAccApp, fncPostRN} = useWebContext();

    const applyFilter = React.useMemo(() => buildAllowFilter(allows), [allows])

    useEffect(() => {
        if (!isComposing && value !== innerValue) setInnerValue(value ?? '')
    }, [value, isComposing])

    const emitChange = (next) => {
        onChange({
            target: { id, value: next },
            currentTarget: { id, value: next },
            type: 'change',
        })
    }

    const cutMax = (s) => {
        if(!maxLength || maxLength <= 0) return s;
        return s.slice(0, maxLength)
    }

    const handleChange = (e) => {
        if (disabled) return;
        const raw = e.target.value;
        const next = cutMax(applyFilter(raw));
        if (e.nativeEvent?.isComposing || isComposing) {
            setInnerValue(next)
            emitChange(next)
            return;
        }

        setInnerValue(next)
        emitChange(next)
    }

    const handleCompositionEnd = (e) => {
        setIsComposing(false);
        const raw = e.target.value;
        const next = cutMax(applyFilter(raw))
        setInnerValue(next)
        emitChange(next)
    }

    const handleClear = (e) => {
        e?.stopPropagation?.()
        const next = ''
        setInnerValue(next)
        emitChange(next)
        ref?.current?.focus();
    }

    const fncClickIcon = (e) => {
        e.stopPropagation();
        if (onClickIcon) {
            clearRef.current = false;
            ref?.current?.blur();
            onClickIcon();
            // if(isAccApp) {
            //     fncPostRN({
            //         id: 'WEB_KEYBOARD_DISMISS',
            //         payload: {},
            //     })
            // }
        }
    }

    const inputAttributes = useMemo(() => {
        if(!Array.isArray(allows)) return {};

        const hasNum = allows.includes('num');
        const hasLowAlnum = allows.includes('lowAlnum');
        const hasEmailLocal = allows.includes('emailLocal');

        if(hasLowAlnum || hasEmailLocal) {
            return  {
                inputMode: 'email',
                autoCapitalize: 'none',
                autoComplete: 'off',
                autoCorrect: 'off',
                spellCheck: 'false'
            }
        }

        if(hasNum) {
            return {
                inputMode: 'numeric',
                pattern: '[0-9]*'
            }
        }

        return {};
    }, [allows])

    const stylesBySize = {
        sm: {
            wrapper: 'h-[40px]',
            textSize: 'text-body-sm',
            paddingWithIcon: 'pl-12 pr-55',
            paddingWithoutIcon: 'pl-12 pr-34',
            iconSize: 16,
        },
        md: {
            wrapper: 'h-[48px]',
            textSize: 'text-body-md',
            paddingWithIcon: 'pl-16 pr-68',
            paddingWithoutIcon: 'pl-16 pr-41',
            iconSize: 20,
        },
        lg: {
            wrapper: 'h-[56px]',
            textSize: 'text-body-xl',
            paddingWithIcon: 'pl-20 pr-80',
            paddingWithoutIcon: 'pl-20 pr-50',
            iconSize: 24,
        },
    };

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
        <div className={`${fitWidth && "w-full"} flex gap-8 mo:gap-4 flex-col`}>
            {title && (
                <FieldTitle title={title} essential={essential} htmlFor={id} />
            )}
            <div className={'flex flex-col'}>
                <div
                    className={`relative flex items-center rounded-12 ${stylesBySize[size].wrapper}`}
                    onFocusCapture={() => {
                        clearRef.current = true;
                    }}
                >
                    {
                        dataOnly ? (
                            <p className={'text-body-xl text-dynamic-text-neutral-primary'}>
                                {innerValue}
                            </p>
                        ) : (
                            <input
                                ref={ref}
                                id={id}
                                aria-describedby={message ? `${id}-detail` : undefined}
                                type={inputType}
                                value={innerValue || ''}
                                placeholder={placeholder}
                                maxLength={maxLength}
                                className={`
                                    w-full h-full overflow-hidden
                                    ${stylesBySize[size].textSize}
                                    ${icon ? stylesBySize[size].paddingWithIcon : stylesBySize[size].paddingWithoutIcon}
                                    ${disabled ? stylesByStatus['disabled'].input : stylesByStatus[status].input}
                                    border rounded-12
                                    text-ellipsis  whitespace-nowrap
                                    transition-colors duration-300
                                    focus:outline-none
                                `}
                                onChange={handleChange}
                                onCompositionStart={() => setIsComposing(true)}
                                onCompositionEnd={handleCompositionEnd}
                                {...props}
                                {...inputAttributes}
                            />
                        )
                    }
                    <div className='absolute right-3 top-1/2 transform -translate-y-1/2 flex flex-row items-center gap-2'>
                        {/*Button: Clear*/}
                        {innerValue && clearRef.current === true && !disabled && (
                            <button
                                className={'mr-3 focus:outline-none'}
                                aria-label={'입력 내용 지우기'}
                                tabIndex={innerValue && clearRef.current === true && !disabled ? 0 : -1}
                                onMouseDown={(e) => {
                                    e.preventDefault()
                                }}
                                onClick={handleClear}
                                onKeyDown={(e) => {
                                    if(e.key === 'Enter' || e.key === ' ') {
                                        handleClear(e);
                                    }
                                }}
                                onBlurCapture={() => clearRef.current = false}
                            >
                                <XCircleFill
                                    width={stylesBySize[size].iconSize}
                                    height={stylesBySize[size].iconSize}
                                    color='text-dynamic-icon-neutral-secondary'
                                />
                            </button>
                        )}

                        {icon && React.isValidElement(icon) && (
                            <button
                                className={`${onClickIcon ? 'cursor-pointer' : 'cursor-default'} focus:outline-none`}
                                aria-label={iconAriaLabel || '아이콘 버튼'}
                                disabled={!onClickIcon}
                                tabIndex={icon && React.isValidElement(icon) ? 0 : -1}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={fncClickIcon}
                                onKeyDown={(e) => {
                                    if(e.key === 'Enter' || e.key === ' ') {
                                        fncClickIcon(e)
                                    }
                                }}
                            >
                                {
                                    React.cloneElement(icon, {
                                        width: stylesBySize[size].iconSize,
                                        height: stylesBySize[size].iconSize,
                                        color: disabled ? 'text-dynamic-icon-neutral-disabled' : 'text-dynamic-icon-neutral-primary',
                                    })
                                }
                            </button>
                        )}
                    </div>
                </div>
                {message && (
                    <div
                        id={message ? `${id}Message` : undefined}
                        tabIndex={message ? 0 : -1}
                        className={'flex items-center gap-2 mt-4 px-5'}
                    >
                        {!disabled && stylesByStatus[status].icon}
                        <p className={`text-label-2xs ${disabled ? 'text-dynamic-text-secondary' : stylesByStatus[status].underMessage}`}>{message}</p>
                    </div>
                )}
            </div>
        </div>
    )
})
InputText.propTypes = {
    status: PropTypes.string,
    size: PropTypes.string,
    value: PropTypes.string.isRequired,
    message: PropTypes.string,
    title: PropTypes.string,
    direction: PropTypes.string,
    essential: PropTypes.bool,
    placeholder: PropTypes.string,
    icon: PropTypes.any,
    dataOnly: PropTypes.bool,
    onClickIcon: PropTypes.func,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    fitWidth: PropTypes.bool,
    inputType: PropTypes.string,
    id: PropTypes.string,
    iconAriaLabel: PropTypes.string,
    allows: PropTypes.oneOfType([
        PropTypes.instanceOf(RegExp),
        PropTypes.arrayOf(PropTypes.string),
    ]),
};
InputText.displayName = "InputText"
export default InputText;
