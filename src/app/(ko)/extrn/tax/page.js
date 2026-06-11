import React from 'react';
import PropTypes from "prop-types";

// components
import ExtrnTaxClient from "@/app/(ko)/extrn/tax/pageClient";


/**
 * @description: 외부 링크 소득공제 화면 입니다.
 * @screenID:    -
 * @screenPath:  -
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
ExtrnTax.propTypes = {
    searchParams: PropTypes.object
};
export default async function ExtrnTax({ searchParams }) {

    const params = await searchParams;
    const redirectType = params.redirectType || '';

    return (
        <ExtrnTaxClient
            identityParams={redirectType === 'EXTRN_TAX' ? params : {}}
        />
    )
}