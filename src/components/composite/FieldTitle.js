import React from 'react';
import PropTypes from 'prop-types';

// modules
import {useScreenSizeContext} from "@modules/context/ScreenContext";


/**
 * @description: 영역 타이틀 컴포넌트 입니다.
 * @screenID:    -
 * @screenPath:  -
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
FieldTitle.propTypes = {
    title: PropTypes.string,
    essential: PropTypes.bool,
    htmlFor: PropTypes.string,
};
export default function FieldTitle({
    title = null,
    essential = false,
    htmlFor = ''
}) {

    const {isMobile} = useScreenSizeContext();

    return (
        <div className={'flex-row-center justify-start mb-8'}>
            <label
                htmlFor={htmlFor}
                className={`
                    text-dynamic-text-neutral-primary font-medium whitespace-nowrap ml-3
                    ${isMobile ? 'text-label-md' : 'text-label-2xl'}
                `}
                aria-label={`${title} ${essential ? "필수" : ''}`}
            >
                {title}
                {essential && <span className={'text-body-md text-dynamic-text-brand-primary-subtle ml-4'} aria-hidden={true}>*</span>}
            </label>
        </div>
    )
}
