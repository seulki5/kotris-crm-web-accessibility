"use server";

import {getApiSrvc, postApiSrvc} from '@modules/services/api.service';

// 유저 중복 체크
export const apiDuplicateUser = async (headers, payload) => {
    const endpoint = '/api/crm/racs/mbr/dpcn/chk';
    const res = await getApiSrvc(headers, endpoint, payload);
    return res;
}

// 이동통신사 목록
export const apiTelecomList = async (headers, payload) => {
    const endpoint = '/api/crm/racs/mbr/mvmn/list';
    const res = await getApiSrvc(headers, endpoint, payload);
    return res;
}

// 회원가입
export const apiJoinUser = async (headers, payload) => {
    const endpoint = '/api/crm/racs/mbr/join';
    const res = await postApiSrvc(headers, endpoint, payload);
    return res;
}

// 본인인증
export const apiUpdateCert = async (headers, payload) => {
    const endpoint = '/api/crm/racs/mbr/cert/update';
    const res = await postApiSrvc(headers, endpoint, payload);
    return res;
}

// 앱 본인인증
export const apiMobileCert = async (headers, payload) => {
    const endpoint = '/api/crm/racs/login/riduser/check';
    const res = await postApiSrvc(headers, endpoint, payload);
    return res;
}

// 아이디 로그인
export const apiLogin = async (headers, payload) => {
    const endpoint = '/api/crm/racs/login';
    const res = await postApiSrvc(headers, endpoint, payload);
    return res;
}

// 비밀번호 변경
export const apiDelayPwChange = async (headers, payload) => {
    const endpoint = '/api/crm/racs/login/extnsn';
    const res = await postApiSrvc(headers, endpoint, payload);
    return res;
}

// 유저 정보
export const apiUserDetail = async (headers, payload) => {
    const endpoint = '/api/crm/racs/login/detail';
    const res = await getApiSrvc(headers, endpoint, payload);
    return res;
}

// 유저 정보(마이페이지)
export const apiUserMyDetail = async (headers, payload) => {
    const endpoint = '/api/crm/racs/mypg/user/detail';
    const res = await getApiSrvc(headers, endpoint, payload);
    return res;
}

// 유저 수정(정보)
export const apiUpdateUser = async (headers, payload) => {
    const endpoint = '/api/crm/racs/mypg/user/update';
    const res = await postApiSrvc(headers, endpoint, payload);
    return res;
}

// 유저 수정(알림)
export const apiUpdateAdNoti = async (headers, payload) => {
    const endpoint = '/api/crm/racs/mypg/user/rcptn/update';
    const res = await postApiSrvc(headers, endpoint, payload);
    return res;
}

// 유저 수정(SNS)
export const apiUpdateSNS = async (headers, payload) => {
    const endpoint = '/api/crm/racs/mypg/user/sns/update';
    const res = await postApiSrvc(headers, endpoint, payload);
    return res;
}

// 유저 비밀번호 체크
export const apiCheckPswd = async (headers, payload) => {
    const endpoint = '/api/crm/racs/mbr/pswd/check';
    const res = await postApiSrvc(headers, endpoint, payload);
    return res;
}

// 유저 탈퇴
export const apiDelUser = async (headers, payload) => {
    const endpoint = '/api/crm/racs/mbr/whdwl';
    const res = await postApiSrvc(headers, endpoint, payload);
    return res;
}

// 아이디 찾기
export const apiFindUserID = async (headers, payload) => {
    const endpoint = '/api/crm/racs/mbr/idnty/id';
    const res = await postApiSrvc(headers, endpoint, payload);
    return res;
}

// 비밀번호 찾기
export const apiFindUserPW = async (headers, payload) => {
    const endpoint = '/api/crm/racs/mbr/idnty/pw';
    const res = await postApiSrvc(headers, endpoint, payload);
    return res;
}

// 알림 목록
export const apiNotiList = async (headers, payload) => {
    const endpoint = '/api/crm/racs/noti/list';
    const res = await getApiSrvc(headers, endpoint, payload);
    return res;
}

// 알림 확인
export const apiUpdateNoti = async (headers, payload) => {
    const endpoint = '/api/crm/racs/noti/update/check/all';
    const res = await postApiSrvc(headers, endpoint, payload);
    return res;
}

// 알림(미독) 확인
export const apiUncheckedNoti = async (headers, payload) => {
    const endpoint = '/api/crm/racs/noti/check';
    const res = await getApiSrvc(headers, endpoint, payload);
    return res;
}
