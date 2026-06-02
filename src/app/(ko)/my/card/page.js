import React from 'react';
import PropTypes from "prop-types";

// components
import MyCardClient from "@/app/(ko)/my/card/pageClient";


/**
 * @description: 마이페이지 내 카드 화면 입니다.
 * @screenID:    UI-CRM-F225, UI-CRM-F447
 * @screenPath:  홈 > 마이페이지 > 내 카드
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
MyCard.propTypes = {
    searchParams: PropTypes.object
};
export default async function MyCard({ searchParams }) {

    const params = await searchParams;
    const redirectType = params.redirectType || '';

    return (
        <MyCardClient
            identityParams={redirectType === 'MY_CARD' ? params : {}}
        />
    )
}