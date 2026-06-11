"use server";

import {getApiSrvc} from '@modules/services/api.service';

// 배너 목록
export const apiBannerList = async (headers, payload) => {
	const endpoint = '/api/crm/racs/home/bnr/list';
	const res = await getApiSrvc(headers, endpoint, payload);
	return res;
}

// 자주 묻는 질문 유형 목록
export const apiFaqTypeList = async (headers, payload) => {
	debugger
	const endpoint = '/api/crm/racs/home/faq/type/list';
	const res = await getApiSrvc(headers, endpoint, payload);
	return res;
}

// 자주 묻는 질문 목록
export const apiFaqList = async (headers, payload) => {
	const endpoint = '/api/crm/racs/home/faq/list';
	const res = await getApiSrvc(headers, endpoint, payload);
	return res;
}


// 자주 묻는 질문 조회
export const apiFaqDetail = async (headers, payload) => {
	const endpoint = '/api/crm/racs/home/faq/detail';
	const res = await getApiSrvc(headers, endpoint, payload);
	return res;
}

// 팝업 목록
export const apiPopList = async (headers, payload) => {
	const endpoint = '/api/crm/racs/home/popup/list';
	const res = await getApiSrvc(headers, endpoint, payload);
	return res;
}
