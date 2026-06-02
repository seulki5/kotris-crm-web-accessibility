"use server";

import {getApiSrvc, postApiSrvc} from '@modules/services/api.service';

// 공지사항 목록
export const apiNoticeList = async (headers, payload) => {
    debugger
    const endpoint = '/api/crm/racs/custCntr/ofcat/list';
    const res = await getApiSrvc(headers, endpoint, payload);
    return res;
}

// 공지사항 상세
export const apiNoticeDetail = async (headers, payload) => {
    const endpoint = '/api/crm/racs/custCntr/ofcat/detail';
    const res = await getApiSrvc(headers, endpoint, payload);
    return res;
}

// 이벤트 목록
export const apiEventList = async (headers, payload) => {
    const endpoint = '/api/crm/racs/custCntr/evnt/list';
    const res = await getApiSrvc(headers, endpoint, payload);
    return res;
}

// 이벤트 상세
export const apiEventDetail = async (headers, payload) => {
    const endpoint = '/api/crm/racs/custCntr/evnt/detail';
    const res = await getApiSrvc(headers, endpoint, payload);
    return res;
}

// FAQ 카테고리 목록
export const apiFaqCategoryList = async (headers, payload) => {
    const endpoint = '/api/crm/racs/custCntr/faq/type/list';
    const res = await getApiSrvc(headers, endpoint, payload);
    return res;
}

// FAQ 목록
export const apiFaqList = async (headers, payload) => {
    const endpoint = '/api/crm/racs/custCntr/faq/list';
    const res = await getApiSrvc(headers, endpoint, payload);
    return res;
}

// FAQ 조회
export const apiFaqDetail = async (headers, payload) => {
	const endpoint = '/api/crm/racs/home/faq/detail';
	const res = await getApiSrvc(headers, endpoint, payload);
	return res;
}

// 할인(국가신분증) 조회
export const apiViewNonDiscountTeen = async (headers, payload) => {
    const endpoint = '';
    const res = await getApiSrvc(headers, endpoint, payload);
    return res;
}

// 할인(국가신분증) 등록
export const apiAddNonDiscountTeen = async (headers, payload) => {
    const endpoint = '';
    const res = await postApiSrvc(headers, endpoint, payload);
    return res;
}

// 할인(청소년 연령초과 학생) 조회
export const apiViewNonDiscountStudent = async (headers, payload) => {
    const endpoint = '';
    const res = await getApiSrvc(headers, endpoint, payload);
    return res;
}

// 할인(청소년 연령초과 학생) 등록
export const apiAddNonDiscountStudent = async (headers, payload) => {
    const endpoint = '';
    const res = await postApiSrvc(headers, endpoint, payload);
    return res;
}

// 할인(어린이/청소년) 조회
export const apiViewNonDiscountYouth = async (headers, payload) => {
    const endpoint = '';
    const res = await getApiSrvc(headers, endpoint, payload);
    return res;
}

// 할인(청소년 연령초과 학생) 등록
export const apiAddNonDiscountYouth = async (headers, payload) => {
    const endpoint = '';
    const res = await postApiSrvc(headers, endpoint, payload);
    return res;
}
