"use server";

import {downloadApiSrvc, uploadApiSrvc, getApiSrvc, postApiSrvc} from '@modules/services/api.service';

// 파일 다운로드
export const apiDownloadFile = async (fileId) => {
    const endpoint = '/api/crm/racs/file/download';
    const res = await downloadApiSrvc(endpoint, fileId);
    return res;
}

// 파일 업로드
export const apiUploadFile = async (payload) => {
    const endpoint = '/api/crm/racs/file/upload';
    const res = await uploadApiSrvc(endpoint, payload);
    return res;
}

// 약관 조회
export const apiTerms = async (headers, payload) => {
    const endpoint = '/api/crm/racs/mbr/trms';
    const res = await getApiSrvc(headers, endpoint, payload);
    return res;
}

// 공개키
export const apiGetPublicKey = async (headers, payload) => {
    const endpoint = '/api/crm/racs/login/publickey';
    const res = await getApiSrvc(headers, endpoint, payload);
    return res;
}

// ipin
export const apiGetIpinReq = async (headers, payload) => {
    const endpoint = '/api/crm/racs/mbr/ipin/auth/start';
    const res = await postApiSrvc(headers, endpoint, payload);
    return res;
}

// 드림시큐리티
export const apiGetDSecurityReq = async (headers, payload) => {
    const endpoint = '/api/crm/racs/mbr/phone/auth/start';
    const res = await postApiSrvc(headers, endpoint, payload);
    return res;
}

// pin 비밀번호 유효성
export const apiPinValid = async (headers, payload) => {
    const endpoint = '/api/crm/racs/login/smpctpw/check';
    const res = await postApiSrvc(headers, endpoint, payload);
    return res;
}
