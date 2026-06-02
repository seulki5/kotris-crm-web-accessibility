'use client';

import React, {useState, useLayoutEffect} from 'react';
import PropTypes from "prop-types";
import clsx from "clsx";

// modules
import {CODE} from "@modules/consants/Objects";


/**
 * @description: 뱃지 컴포넌트 입니다.
 * @screenID:    -
 * @screenPath:  -
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
Badge.PropTypes = {
    id: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    paymentCode: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])])
}
export default function Badge({
    id = '',  // mbrTypeCd, crdUsrTpCd, issuCardPssrTypeCd, cardUserTypeCd
    code = '',
    paymentCode = null,
}) {

    const infoById = {
        mbrTypeCd: {
            [CODE.USER_ADULT]: {name: '일반',  bgColor: 'bg-dynamic-bg-other-blue-bold'},
            [CODE.USER_KID]  : {name: '어린이', bgColor: 'bg-dynamic-bg-other-orange-bold'},
            [CODE.USER_YOUTH]: {name: '청소년', bgColor: 'bg-dynamic-bg-other-violet-bold'},
            // USER_ADULT: '01',        // 일반
            // USER_YOUTH: '02',        // 청소년
            // USER_KID: '03',          // 어린이
        },
        crdUsrTpCd: {
            [CODE.CARD_USER_ADULT]: {name: '일반',  bgColor: 'bg-dynamic-bg-other-blue-bold'},
            [CODE.CARD_USER_KID]  : {name: '어린이', bgColor: 'bg-dynamic-bg-other-orange-bold'},
            [CODE.CARD_USER_YOUTH]: {name: '청소년', bgColor: 'bg-dynamic-bg-other-violet-bold'},
            // CARD_USER_ADULT: '11',        // 일반
            // CARD_USER_KID: '10',          // 어린이
            // CARD_USER_YOUTH: '01',        // 청소년
        },
        cardUserTypeCd: {
            '01': {name: '일반',  bgColor: 'bg-dynamic-bg-other-blue-bold'},
            '02': {name: '어린이', bgColor: 'bg-dynamic-bg-other-orange-bold'},
            '03': {name: '청소년', bgColor: 'bg-dynamic-bg-other-violet-bold'},
            '04': {name: '청소년', bgColor: 'bg-dynamic-bg-other-violet-bold'},
        },
    }
    
    // 뱃지 정보
    const [badgeInfo, setBadgeInfo] = useState({
        bgColor: '',
        name: '',
    })

    // 뱃지 정보
    useLayoutEffect(() => {
        if(!id || !code) return;

        let getInfo;
        if(id === 'issuCardPssrTypeCd') {
            if(code === '02') {
                getInfo = {name: '어린이', bgColor: 'bg-dynamic-bg-other-orange-bold'};
            } else if(code === '03') {
                getInfo = {name: '청소년', bgColor: 'bg-dynamic-bg-other-violet-bold'};
            } else {
                getInfo = {name: '일반',  bgColor: 'bg-dynamic-bg-other-blue-bold'};
            }
        } else {
            getInfo = infoById[id][code];
        }

        if(getInfo) setBadgeInfo(getInfo);

    }, [id, code]);

    // 선불/후불 구분
    const fncGetPaymentName = () => {
        if(!paymentCode) return;
        
        //01모바일선불,02모바일후불,03일반,04대중교통안심
        if(paymentCode === '01') return ' / 선불형';
        if(paymentCode === '02') return ' / 후불형';
    }

    return (
        <div className={clsx('w-fit h-fit min-h-[29px] rounded-6 px-8 py-4 flex-col-center-center', badgeInfo.bgColor)}>
            <p className={"text-body-md text-dynamic-text-neutral-inverse font-semibold leading-snug whitespace-nowrap mo:leading-none"}>
                {badgeInfo.name}{fncGetPaymentName()}
            </p>
        </div>
    )
}
