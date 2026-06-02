import React from 'react';
import PropTypes from "prop-types";

// components
import MyCardRegisterClient from "@/app/(ko)/my/card/register/pageClient";


/**
 * @description: 카드 등록 화면 입니다.
 * @screenID:    UI-CRM-F226,UI-CRM-F227, UI-CRM-F229, UI-CRM-F454, UI-CRM-F455, UI-CRM-F457
 * @screenPath:  홈 > 마이페이지 > 내 카드 > 카드 등록
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
MyCardRegister.propTypes = {
    searchParams: PropTypes.object
};
export default async function MyCardRegister({ searchParams }) {

    const params = await searchParams;
    const redirectType = params.redirectType || '';

    return (
        <MyCardRegisterClient
            identityParams={redirectType === 'MY_CARD_REG' ? params : {}}
        />
    )
}