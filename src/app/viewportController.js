'use client';

import {useEffect} from "react";
import {useScreenSizeContext} from "@modules/context/ScreenContext";

export default function ViewportController () {

    const {isMobile} = useScreenSizeContext();

    useEffect(() => {
        let meta = document.querySelector('meta[name="viewport"]');
        if(!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('name', 'viewport');
            document.head.appendChild(meta);
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

    }, [isMobile])

    return null;
}