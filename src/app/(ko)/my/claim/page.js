'use client'

import React, {useEffect, useState} from 'react';
import {useSearchParams} from 'next/navigation';

// modules
import {RefundAndLostOptions} from '@modules/consants/Options';

// assets
import LayoutRefund from "@/app/(ko)/my/claim/LayoutRefund";
import LayoutLost from "@/app/(ko)/my/claim/LayoutLost";
import LayoutClaim from "@/app/(ko)/my/claim/LayoutClaim";


/**
 * @description: 환불/분실신청 내역 화면 입니다.
 * @screenID:    UI-CRM-F236, UI-CRM-F470
 * @screenPath:  홈 > 마이페이지 > 환불/분실신청 내역
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function MyClaim() {

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
		case 'lost':
			return <LayoutLost onChangeTab={fncChangeTab} />
		case 'claim':
			return <LayoutClaim onChangeTab={fncChangeTab} />
		case 'refund':
		default:
			return <LayoutRefund onChangeTab={fncChangeTab} />
	}
}
