'use client';

import React from 'react';

// modules
import {useWebContext} from "@modules/context/WebviewContext";

// components
import NotFound from "@/app/not-found";


/**
 * @description: 앱 웹뷰 대기 화면입니다. (App Only)
 * @screenID:    -
 * @screenPath:  -
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function blank() {
	
	const {isAccApp} = useWebContext();
	
	return (
		<>{!isAccApp && <NotFound />}</>
	)
}
