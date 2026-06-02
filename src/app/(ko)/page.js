'use client'

import React, {useEffect, useLayoutEffect} from 'react';
import PropTypes from 'prop-types';
import {usePathname} from 'next/navigation';

// modules
import {useScrollContext} from '@modules/context/ScrollContext';

// components
import Home from '@/app/(ko)/home/page';
import {useScreenSizeContext} from "@modules/context/ScreenContext";


/**
 * @description: KoRootPage Client 영역입니다.
 * @screenID:    -
 * @screenPath:  -
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
KoRootPage.propTypes = {
    children: PropTypes.any,
};
export default function KoRootPage({ children }) {

    const pathname = usePathname();
    const {fncScrollToTop} = useScrollContext();
    const {isMobile} = useScreenSizeContext();

    // 페이지 진입시 위로
    useLayoutEffect(() => {
        pathname && fncScrollToTop();
    }, [pathname]);

    // 개발자도구 진입 방지
    // useEffect(() => {
    //     const onContextMenu = (e) => e.preventDefault();
    //     const onKeyDown = (e) => {
    //         const key = e.key.toLowerCase();
    //
    //         // F12
    //         if(e.key === 'F12') e.preventDefault();
    //
    //         // Ctrl+Shift+I / Ctrl+Shift+J
    //         if(e.ctrlKey && e.shiftKey && (key === 'i' || key === 'j')) e.preventDefault();
    //
    //         // Cmd+Opt+I / Cmd+Opt+J
    //         if(e.metaKey && e.altKey && (key === 'i' || key === 'j')) e.preventDefault();
    //
    //         // Ctrl+U
    //         if(e.ctrlKey && key === 'u') e.preventDefault();
    //     }
    //
    //     window.addEventListener('contextmenu', onContextMenu, {capture: true});
    //     window.addEventListener('keydown', onKeyDown, {capture: true});
    //
    //     return () => {
    //         window.removeEventListener('contextmenu', onContextMenu, {capture: true});
    //         window.removeEventListener('keydown', onKeyDown, {capture: true});
    //     }
    // }, []);
    
    useEffect(() => {
        let meta = document.querySelector('meta[name="viewport"]');
        if(!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('name', 'viewport');
            document.head.appendChild(meta)
        }
        
        if(isMobile) {
            meta.setAttribute(
            'content',
                'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=contain'
            )
        } else {
            meta.setAttribute(
                'content',
                'width=device-width, initial-scale=1.0, maximum-scale=2.0, user-scalable=yes, viewport-fit=contain'
            )
        }
    }, [isMobile]);

    return (
        <>
            {
                pathname === '/' ? (
                    <Home />
                ) : (
                    children
                )
            }
        </>
    )
}

