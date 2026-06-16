'use client'

import React, {useEffect, useState} from 'react';
import {useSearchParams} from 'next/navigation';

// modules
import {RefundAndLostOptions} from '@modules/consants/Options';

// assets
import LayoutHistory from "@/app/(ko)/my/childproof/LayoutHistory";
import LayoutList from "@/app/(ko)/my/childproof/LayoutList";


/**
 * @description: 어린이 안심서비스 내 자녀 등록 현황 화면 입니다.
 * @screenID:    UI-CRM-F247, UI-CRM-F458
 * @screenPath:  홈 > 마이페이지 > 어린이 안심서비스
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function MyChildproof() {

	const searchParams = useSearchParams();
	const tabId = searchParams.get('tab');

	const [layoutId, setLayoutId] = useState(RefundAndLostOptions[0].id)

	useEffect(() => {
		if(tabId) setLayoutId(tabId)
	}, [tabId])

	const fncChangeTab = (tabId) => {
		setLayoutId(tabId);
	}

	switch (layoutId) {
		case 'history':
			return <LayoutHistory onChangeTab={fncChangeTab} />
		case 'list':
		default:
			return <LayoutList onChangeTab={fncChangeTab} />
	}
}
