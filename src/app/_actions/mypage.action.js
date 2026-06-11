"use server";

import {deleteApiSrvc, getApiSrvc, postApiSrvc} from '@modules/services/api.service';

// 내 카드 목록
export const apiCardList = async (headers, payload) => {
    const endpoint = '/api/crm/racs/mypg/card/list';
    const res = await getApiSrvc(headers, endpoint, payload);
    return res;
}

// 카드 검증(일반)
export const apiCheckCard = async (headers, payload) => {
    const endpoint = '/api/crm/racs/mypg/card/check';
    const res = await getApiSrvc(headers, endpoint, payload);
    return res;
}

// 카드 검증(대중교통안심)
export const apiCheckRelaxCard = async (headers, payload) => {
    const endpoint = '/api/crm/racs/mypg/card/relax/check';
    const res = await getApiSrvc(headers, endpoint, payload);
    return res;
}

// 소득공제(Siren)
export const apiCreateSiren = async (headers, payload) => {
    const endpoint = '/api/crm/racs/mbr/realname/auth/start';
    const res = await postApiSrvc(headers, endpoint, payload);
    return res;
}

// 내 카드 등록(일반)
export const apiCreateDefaultCard = async (headers, payload) => {
    const endpoint = '/api/crm/racs/mypg/card/create';
    const res = await postApiSrvc(headers, endpoint, payload);
    return res;
}

// 내 카드 등록(대중교통안심)
export const apiCreateSafeCard = async (headers, payload) => {
    const endpoint = '/api/crm/racs/mypg/card/relax/create';
    const res = await postApiSrvc(headers, endpoint, payload);
    return res;
}

// 내 카드 수정
export const apiUpdateCard = async (headers, payload) => {
    const endpoint = '/api/crm/racs/mypg/card/update';
    const res = await postApiSrvc(headers, endpoint, payload);
    return res;
}

// 내 카드 해지(일반)
export const apiDeleteDefaultCard = async (headers, payload) => {
    const endpoint = '/api/crm/racs/mypg/card/delete';
    const res = await deleteApiSrvc(headers, endpoint, payload);
    return res;
}

// 내 카드 해지(대중교통안심)
export const apiDeleteSafeCard = async (headers, payload) => {
    const endpoint = '/api/crm/racs/mypg/card/relax/delete';
    const res = await deleteApiSrvc(headers, endpoint, payload);
    return res;
}

// 이용내역 목록
export const apiUsageList = async (headers, payload) => {
    const endpoint = '/api/crm/racs/mypg/utztn/list';
    const res = await postApiSrvc(headers, endpoint, payload);
    return res;
}

// 이용내역 목록 다운로드
export const apiDownloadUsageExcel = async (headers, payload) => {
    const endpoint = '/api/crm/racs/mypg/utztn/list/excel';
    const res = await postApiSrvc(headers, endpoint, payload);
    return res;
}

// 이용내역 통계
export const apiUsageStatistics = async (headers, payload) => {
    const endpoint = '/api/crm/racs/mypg/utztn/stats';
    const res = await getApiSrvc(headers, endpoint, payload);
    return res;
}

// 환불/분실 은행 목록
export const apiBankList = async (headers, payload) => {
    const endpoint = '/api/crm/racs/mypg/rfndLs/bank/list';
    const res = await getApiSrvc(headers, endpoint, payload);
    return res;
}

// 환불/분실 카드 목록
export const apiClaimCardList = async (headers, payload) => {
    const endpoint = '/api/crm/racs/mypg/rfndLs/card/list';
    const res = await getApiSrvc(headers, endpoint, payload);
    return res;
}

// 환불 신청
export const apiApplyRefund = async (headers, payload) => {
    const endpoint = '/api/crm/racs/mypg/rfndLs/rfnd/aply';
    const res = await postApiSrvc(headers, endpoint, payload);
    return res;
}

// 환불 신청 취소
export const apiCancelRefund = async (headers, payload) => {
    const endpoint = '/api/crm/racs/mypg/rfndLs/rfnd/rtrcn';
    const res = await postApiSrvc(headers, endpoint, payload);
    return res;
}

// 분실 신청
export const apiApplyLost = async (headers, payload) => {
    const endpoint = '/api/crm/racs/mypg/rfndLs/ls/aply';
    const res = await postApiSrvc(headers, endpoint, payload);
    return res;
}

// 분실 신청 취소
export const apiCancelLost = async (headers, payload) => {
    const endpoint = '/api/crm/racs/mypg/rfndLs/ls/rtrcn';
    const res = await postApiSrvc(headers, endpoint, payload);
    return res;
}

// 환불/분실 신청내역
export const apiClaimList = async (headers, payload) => {
    const endpoint = '/api/crm/racs/mypg/rfndLs/list';
    const res = await getApiSrvc(headers, endpoint, payload);
    return res;
}

// 할인신청 조회
export const apiViewDiscount = async (headers, payload) => {
    const endpoint = '/api/crm/racs/mypg/dscnt/list';
    const res = await getApiSrvc(headers, endpoint, payload);
    return res;
}

// 할인(국가신분증) 등록
export const apiCreateDiscountTeen = async (headers, payload) => {
    const endpoint = '/api/crm/racs/mypg/dscnt/teencard/create';
    const res = await postApiSrvc(headers, endpoint, payload);
    return res;
}

// 할인(국가신분증) 해지
export const apiDelDiscountTeen = async (headers, payload) => {
    const endpoint = '/api/crm/racs/mypg/dscnt/teencard/cncltn';
    const res = await deleteApiSrvc(headers, endpoint, payload);
    return res;
}

// 할인(청소년 연령초과 학생) 등록
export const apiCreateDiscountStudent = async (headers, payload) => {
    const endpoint = '/api/crm/racs/mypg/dscnt/yuthexcs/create';
    const res = await postApiSrvc(headers, endpoint, payload);
    return res;
}

// 할인(어린이/청소년) 등록
export const apiCreateDiscountMinor = async (headers, payload) => {
    const endpoint = '/api/crm/racs/mypg/dscnt/yuthdscnt/create';
    const res = await postApiSrvc(headers, endpoint, payload);
    return res;
}

// 할인(어린이/청소년) 해지
export const apiDelDiscountMinor = async (headers, payload) => {
    const endpoint = '/api/crm/racs/mypg/dscnt/yuthdscnt/cncltn';
    const res = await deleteApiSrvc(headers, endpoint, payload);
    return res;
}

// 어린이 안심서비스 등록
export const apiCreateChild = async (headers, payload) => {
    const endpoint = '/api/crm/racs/mypg/kidrelax/create';
    const res = await postApiSrvc(headers, endpoint, payload);
    return res;
}

// 어린이 안심서비스 수정
export const apiUpdateChild = async (headers, payload) => {
    const endpoint = '/api/crm/racs/mypg/kidrelax/update';
    const res = await postApiSrvc(headers, endpoint, payload);
    return res;
}

// 어린이 안심서비스 해지
export const apiDelChild = async (headers, payload) => {
    const endpoint = '/api/crm/racs/mypg/kidrelax/delete';
    const res = await deleteApiSrvc(headers, endpoint, payload);
    return res;
}

// 어린이 안심서비스 등록 목록
export const apiChildRegList = async (headers, payload) => {
    const endpoint = '/api/crm/racs/mypg/kidrelax/list';
    const res = await getApiSrvc(headers, endpoint, payload);
    return res;
}

// 어린이 안심서비스 이용내역 목록
export const apiChildHistoryList = async (headers, payload) => {
    const endpoint = '/api/crm/racs/mypg/kidrelax/utztn/list';
    const res = await postApiSrvc(headers, endpoint, payload);
    return res;
}

// 어린이 안심서비스 이용내역 목록 다운로드
export const apiDownloadChildHistoryExcel = async (headers, payload) => {
    const endpoint = '/api/crm/racs/mypg/kidrelax/utztn/list/excel';
    const res = await postApiSrvc(headers, endpoint, payload);
    return res;
}

// 쿠폰 목록
export const apiCouponList = async (headers, payload) => {
    const endpoint = '/api/crm/racs/mypg/coup/list';
    const res = await getApiSrvc(headers, endpoint, payload);
    return res;
}

// 외부링크 소득공제
export const apiUpdateExternalSiren = async (headers, payload) => {
    const endpoint = '/api/crm/racs/crd/earnddc';
    const res = await postApiSrvc(headers, endpoint, payload);
    return res;
}
