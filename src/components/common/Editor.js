'use client'

import {useThemeContext} from "@modules/context/ThemeContext";
import {Viewer} from '@toast-ui/react-editor'
import "@toast-ui/editor/dist/toastui-editor-viewer.css";
import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";


/**
 * @description: TUI 뷰어 컴포넌트입니다.
 * @screenID:    -
 * @screenPath:  -
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
const ToastViewer = ({
    initialValue = '',
}) => {

    const {theme} = useThemeContext();

    return (
        <div
            tabIndex={0}
            role={'region'}
            aria-label={'상세 내용'}
        >
            <Viewer
                key={initialValue}
                initialValue={initialValue}
                theme={theme ?? 'light'}
                height={'auto'}
            />
        </div>
    );
}

ToastViewer.displayName = 'ToastViewer';
export default ToastViewer;
