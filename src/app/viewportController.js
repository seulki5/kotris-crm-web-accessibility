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

        const setViewport = () => {
            if (isMobile) {
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
        }
        
        setViewport();
        
        const handleFocusOut = (e) => {
            if(!isMobile) return;
            const target = e.target;
            if(['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
                setTimeout(() => {
                    // 1. 현재 스크롤 위치를 미세하게 움직여 사파리의 레이아웃 리드로우(Redraw) 강제 유발
                    window.scrollTo(
                        document.documentElement.scrollLeft,
                        document.documentElement.scrollTop
                    );
                    
                    // 2. 만약 화면 전체가 위로 밀렸다면 최상단으로 복구
                    if (window.scrollY !== 0) {
                        window.scrollTo(0, 0);
                    }
                    
                    // 3. 메타 태그 재설정으로 확대된 스케일을 1.0으로 강제 초기화
                    setViewport();
                }, 100);
            }
        }
        
        if (isMobile) {
            // focusout은 버블링이 일어나므로 document 레벨에서 한 번만 잡아도 됩니다.
            document.addEventListener('focusout', handleFocusOut);
        }
        
        return () => {
            document.removeEventListener('focusout', handleFocusOut);
        };
       

    }, [isMobile])

    return null;
}
