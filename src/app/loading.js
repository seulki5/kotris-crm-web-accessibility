'use client'

import React from 'react';
import clsx from 'clsx';
import Lottie from 'lottie-react';


/**
 * @description: 로딩 화면 입니다.
 * @screenID:    -
 * @screenPath:  -
 * @author       $Author
 * @since        $Date
 * @version      $Revision
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function Loading() {
    return (
        <div className={clsx(
            'w-full h-full fixed top-0 left-0 z-[99999]',
            'flex items-center justify-center',
            'bg-transparent'
        )}>
            <h1 className={'sr-only'}>로딩 중 입니다.</h1>
            <div className={'w-1/5 max-w-[80px] h-auto max-h-[80px] mo:max-w-[65px] mo:max-h-[65px]'}>
                <Lottie
                    animationData={require('@assets/animations/loading.json')}
                    loop={true}
                    style={{width: '100%', height: '100%'}}
                />
            </div>
        </div>
    )
}
