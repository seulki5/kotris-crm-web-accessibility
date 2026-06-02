'use client';

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import clsx from "clsx";

// modules
import {useScreenSizeContext} from "@modules/context/ScreenContext";

// components
import FieldTitle from "@components/composite/FieldTitle";

// svg
import {ChevronDown, CheckBold, AlertCircleFill} from '@assets/icons/Svgs';

Select.propTypes = {
    size: PropTypes.string,
    placeholder: PropTypes.string,
    emptyMsg: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
    disabled: PropTypes.bool,
    options: PropTypes.array,
    title: PropTypes.string,
    direction: PropTypes.string,
    transYDirection: PropTypes.string,
    essential: PropTypes.bool,
    value: PropTypes.string,
    status: PropTypes.string,
    message: PropTypes.string,
    id: PropTypes.string,
    onSelect: PropTypes.func.isRequired,
};
export default function Select({
   size = 'md',
   placeholder = '리스트명',
   emptyMsg = null,
   disabled = false,
   options = [],
   title = null,
   direction = 'vertical',
   transYDirection = 'down',
   essential = false,
   status = 'default',
   message = null,
   value = null,
   id = '',
   onSelect = () => {},
   ...props
}) {
    const wrapperRef = useRef(null);
    const {isMobile} = useScreenSizeContext();

    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState({});
    const [allowScroll, setAllowScroll] = useState(false);

    useEffect(() => {
        if(Object.keys(selectedOption).length < 1 && value && options) {
            let findOption = options.filter((el) => el.id === value);
            if(findOption && findOption.length > 0){
                setSelectedOption(findOption[0]);
            }
        }
    }, [value, options]);

    useEffect(() => {
        const onClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('click', onClickOutside);
        return () => document.removeEventListener('click', onClickOutside);
    }, []);

    useEffect(() => {
        if (!isOpen) {
            setAllowScroll(false);
        }
    }, [isOpen]);

    const toggleDropdown = () => {
        if (disabled) return
        setIsOpen((prev) => !prev);
    };

    const handleSelect = (option) => {
        setSelectedOption(option);
        setIsOpen(false);
        onSelect(option);
    };

    const handleTransitionEnd = (e) => {
        if (e.propertyName === 'max-height' && isOpen) {
            setAllowScroll(true);
        }
    };

    const stylesBySize = {
        sm: {
            selectWrapper: 'h-[40px] px-12',
            dropdownHeight: 'h-[32px]',
            dropdownPadding: 'px-12',
            textSize: 'text-body-sm',
            iconSize: 16,
            height: 40
        },
        md: {
            selectWrapper: 'h-[48px] px-16',
            dropdownHeight: 'h-[40px]',
            dropdownPadding: 'px-16',
            textSize: 'text-body-md',
            iconSize: 20,
            height: 48
        },
        lg: {
            selectWrapper: 'h-[56px] px-20',
            dropdownHeight: 'h-[48px]',
            dropdownPadding: 'px-20',
            textSize: 'text-body-xl',
            iconSize: 24,
            height: 56
        }
    }

    return (
        <div ref={wrapperRef} className={`w-full flex gap-8 mo:gap-4 ${direction==='vertical'? 'flex-col':'items-center'}`}>
            {title && (
                <FieldTitle title={title} essential={essential} />
            )}
            <div className='relative flex-1'>
                <label htmlFor={id} className={"sr-only"}>{placeholder}</label>
                <button
                    id={id}
                    className={`
                        relative rounded-12 transition-colors
                        border
                        w-full flex items-center justify-between
                        ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                        ${stylesBySize[size].selectWrapper}
                        ${disabled ? 'bg-dynamic-bg-neutral-disabled cursor-not-allowed border-transparent' : 'bg-dynamic-bg-neutral-primary'}
                        ${isOpen
                            ? 'border-dynamic-border-brand-primary-subtle'
                            : status === 'warning'
                                ? 'border-dynamic-border-negative-primary'
                                : 'border-dynamic-border-neutral-primary hover:border-dynamic-border-neutral-tertiary'
                        }
                        border border-solid
                    `}
                    {...props}
                    onClick={toggleDropdown}
                    onKeyDown={(e) => {
                        if(e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            toggleDropdown(e);
                        }
                    }}
                >
                    <span className={`
                        overflow-hidden
                        ${stylesBySize[size].textSize} font-medium text-ellipsis whitespace-nowrap
                        ${disabled ? 'text-dynamic-text-neutral-disabled' : 'text-dynamic-text-neutral-primary'}
                    `}>
                        {selectedOption?.name || placeholder}
                    </span>
                    <div className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                        <ChevronDown
                            width={stylesBySize[size].iconSize}
                            height={stylesBySize[size].iconSize}
                            color={disabled ? 'text-dynamic-icon-neutral-disabled' : 'text-dynamic-icon-neutral-primary'}
                        />
                    </div>
                </button>

                {status === 'warning' && (
                    <div className={'flex items-center gap-2 mt-4 px-5 absolute'} style={{top: stylesBySize[size].height + 2}}>
                        {!disabled && <AlertCircleFill width={16} height={16} color='text-dynamic-icon-negative-primary' />}
                        <p className={`text-label-2xs ${disabled ? 'text-dynamic-text-secondary' : 'text-dynamic-text-negative-primary-bold'}`}>
                            {`${emptyMsg ? emptyMsg : title}을(를) 선택해주세요.`}
                        </p>
                    </div>
                )}

                {/* 드롭다운: Desktop */}
                {!disabled && !isMobile && (
                    <div
                        onTransitionEnd={handleTransitionEnd}
                        className={`
                            w-full shadow-lg
                            absolute z-5 rounded-12 border border-solid
                            scrollbar-thin scrollbar-thumb-dynamic-border-neutral-secondary scrollbar-thumb-rounded-full scrollbar-track-transparent
                            transition-all duration-200 ease-in-out
                            ${isOpen ? 'max-h-60 py-8 border-dynamic-border-brand-primary-subtle bg-dynamic-bg-neutral-primary' : 'max-h-0 py-0 border-transparent bg-transparent'}
                            ${allowScroll ? 'overflow-y-auto' : 'overflow-hidden'}
                            ${transYDirection === 'up' ? 'bottom-full mb-4' : 'top-full mt-4'}
                        `}
                    >
                        {
                            options.length ? (
                                options.map((option) => (
                                    <button
                                        onClick={() => handleSelect(option)}
                                        onKeyDown={(e) => {
                                            if(e.key === 'Enter' || e.key === ' ') handleSelect(option)
                                        }}
                                        key={option.id}
                                        className={`
                                            w-full flex-row-center justify-between
                                            ${stylesBySize[size].dropdownHeight}
                                            ${stylesBySize[size].dropdownPadding}
                                            ${stylesBySize[size].textSize} font-medium
                                            flex items-center justify-between
                                            ${selectedOption?.id === option.id ? 'text-dynamic-text-brand-primary-bold' : 'text-dynamic-text-neutral-secondary'}
                                            transition-colors
                                            hover:bg-dynamic-bg-neutral-secondary
                                        `}
                                    >
                                        <span>{option.name}</span>
                                        {
                                            selectedOption?.id === option.id && (
                                                <CheckBold
                                                    width={stylesBySize[size].iconSize}
                                                    height={stylesBySize[size].iconSize}
                                                    color={'text-dynamic-icon-brand-primary-bold'}
                                                />
                                            )
                                        }
                                    </button>
                            ))) : (
                                <div className={'flex-col-center-center my-20'}>
                                    <p>{`${emptyMsg ? emptyMsg : title}이(가) 없습니다.`}</p>
                                </div>
                            )
                        }
                    </div>
                )}

                {/* 드롭다운: Mobile */}
                {!disabled && isMobile && (
                    <>
                        <div onTransitionEnd={handleTransitionEnd}
                             className={clsx(
                                 'fixed inset-x-0 bottom-0 z-50 w-full rounded-t-[32px] shadow-lg',
                                 'bg-dynamic-bg-neutral-primary',
                                 'transition-all duration-300 ease-out',
                                 isOpen ? 'translate-y-0 h-fit pt-40 px-20 pb-20' : 'translate-y-full h-0',
                                 'overflow-hidden',
                                 'scrollbar-thin scrollbar-thumb-dynamic-border-neutral-secondary scrollbar-thumb-rounded-full scrollbar-track-transparent',
                             )}
                        >
                            {
                                isOpen && (
                                    <div>
                                        <div className={'absolute top-3 left-0 w-full flex items-center justify-center'}>
                                            <div className={'w-[54px] h-[4px] rounded-full bg-dynamic-icon-neutral-quarternary'} />
                                        </div>
                                        <p className={'text-heading-xs text-dynamic-text-neutral-primary font-bold mb-20'}>
                                            {placeholder}
                                        </p>
                                        <div className="w-full h-full max-h-[75dvh] overflow-y-auto scrollbar-thin scrollbar-thumb-dynamic-border-neutral-secondary scrollbar-thumb-rounded-full scrollbar-track-transparent">
                                            {
                                                options.length > 0 ? (
                                                    options.map((option, index) => (
                                                        <button onClick={() => handleSelect(option)}
                                                                key={option.id}
                                                                className={`
                                                                    w-full min-h-[56px]
                                                                    text-button-lg text-dynamic-text-neutral-primary font-semibold text-start
                                                                    flex items-center
                                                                    ${index > 0 && 'border-t border-solid border-t-dynamic-border-neutral-primary'}
                                                                `}>
                                                            {option.name}
                                                        </button>
                                                    ))
                                                ) : (
                                                    <div className={'flex-col-center-center my-20'}>
                                                        <p>{`${emptyMsg ? emptyMsg : title}이(가) 없습니다.`}</p>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            onKeyDown={(e) => {
                                if(e.key === 'Enter' || e.key === ' ') setIsOpen(!isOpen)
                            }}
                            className={clsx(
                                'fixed top-0 left-0 w-full h-full z-10 bg-neutral-10 transition-opacity duration-300',
                                isOpen ? 'opacity-80 pointer-events-auto' : 'opacity-0 pointer-events-none'
                            )}
                            aria-label={"선택지 드롭다운 닫기"}
                        />
                    </>
                )}
            </div>
        </div>
    )
}
