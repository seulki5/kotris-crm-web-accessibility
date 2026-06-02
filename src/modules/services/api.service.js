'use server';

import moment from "moment";
import {fncStringifyQuery} from "@modules/utils/StringUtils";

export async function fncGetBaseUrl() {
    return process.env.API_URL;
}

export async function fncGetMobileOkBaseUrl() {
    return process.env.MOBILE_OK_URL;
}

const isJson = (res) => {
    if(!res || !res.headers) return false;
    const ct = res.headers?.get('content-type') || '';
    return ct.includes('application/json')
}

const MSG_API_FAIL = { code: 400, message: "API 호출에 실패했습니다" };
const MSG_SERVER_DOWN = { code: 400, message: "Server Down" };

// GET 요청
export async function getApiSrvc(headers, endpoint, payload) {
    try {
        const apiUri = await fncGetBaseUrl();
        const response = await fetch(`${apiUri}${endpoint}${fncStringifyQuery(payload)}`, {
            method: 'GET',
            headers: {
                ...headers,
                Accept: 'application/json',
            },
            cache: 'no-cache',
            next: { revalidate: 3600 }
        })

        if (!response.ok) {
            const errorText = await response.text();
            return {isError: true, errData: errorText};
        }

        if(isJson(response)) {
            const result = await response.json();
            return result;
        }

    } catch (error) {
        console.log('---- error : ', error)
        if(error?.message?.includes('fetch failed')) {
            return {isError: true, errData: MSG_SERVER_DOWN};
        } else {
            return {isError: true, errData: MSG_API_FAIL};
        }
    }
}

// POST 요청
export async function postApiSrvc(headers, endpoint, payload) {
    if(!payload) {
        throw new Error({ code: 400, message: "파라미터 정보를 확인해주세요." });
    }
    if(!headers) {
        throw new Error({ code: 400, message: "헤더 정보를 확인해주세요." });
    }
    try {
        const apiUri = await fncGetBaseUrl();
        const response = await fetch(`${apiUri}${endpoint}`, {
            method: 'POST',
            headers: {
                ...headers,
                Accept: 'application/json',
            },
            body: JSON.stringify(payload),
            cache: 'no-store',
            next: { revalidate: 3600 }
        })

        if (!response.ok) {
            const errorText = await response.text();
            return {isError: true, errData: errorText};
        }

        if(isJson(response)) {
            const result = await response.json();
            return result;
        } else {
            const blob = await response.blob();
            return blob;
        }

    } catch (error) {
        if(error?.message?.includes('fetch failed')) {
            return {isError: true, errData: MSG_SERVER_DOWN};
        } else {
            return {isError: true, errData: MSG_API_FAIL};
        }
    }
}

// DELETE 요청
export async function deleteApiSrvc(headers, endpoint, payload) {
    if(!payload) {
        throw new Error({ code: 400, message: "파라미터 정보를 확인해주세요." });
    }
    if(!headers) {
        throw new Error({ code: 400, message: "헤더 정보를 확인해주세요." });
    }
    try {
        const apiUri = await fncGetBaseUrl();
        const response = await fetch(`${apiUri}${endpoint}`, {
            method: 'DELETE',
            headers: {
                ...headers,
                Accept: 'application/json',
            },
            body: JSON.stringify(payload),
            cache: 'no-store',
            next: { revalidate: 3600 }
        })

        if (!response.ok) {
            const errorText = await response.text();
            return {isError: true, errData: errorText};
        }

        const result = await response.json();
        return result;

    } catch (error) {
        if(error?.message?.includes('fetch failed')) {
            return {isError: true, errData: MSG_SERVER_DOWN};
        } else {
            return {isError: true, errData: MSG_API_FAIL};
        }
    }
}

// GET 파일 다운로드 요청
export async function downloadApiSrvc(endpoint, fileId) {
    try {
        const apiUri = await fncGetBaseUrl();
        const response = await fetch(`${apiUri}${endpoint}/${fileId}`, {
            method: 'GET',
            headers: {
                Accept: "*/*"
            },
            cache: 'no-cache',
            next: { revalidate: 3600 }
        })

        if (!response.ok) {
            const errorText = await response.text();
            return {isError: true, errData: errorText};
        }

        const blob = await response.blob();

        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = 'railplus';
        if (contentDisposition) {
            const parts = contentDisposition.split("filename=");
            if (parts.length > 1) {
                filename = parts[1].trim().replace(/['"]/g, '');
            }

            filename = decodeURIComponent(filename);
        }
        return {
            blob,
            filename: `${moment().format('YYMMDD')}_${filename}`,
            fileId
        };

    } catch (error) {
        if(error?.message?.includes('fetch failed')) {
            return {isError: true, errData: MSG_SERVER_DOWN};
        } else {
            return {isError: true, errData: MSG_API_FAIL};
        }
    }
}

// POST 파일 업로드 요청
export async function uploadApiSrvc(endpoint, formData) {
    try {
        const apiUri = await fncGetBaseUrl();
        const response = await fetch(`${apiUri}${endpoint}`, {
            method: 'POST',
            headers: {
                Accept: "*/*"
            },
            body: formData,
            cache: 'no-cache',
        })

        if (!response.ok) {
            const errorText = await response.text();
            return {isError: true, errData: errorText};
        }

        const result = await response.json();
        return result;

    } catch (error) {
        if(error?.message?.includes('fetch failed')) {
            return {isError: true, errData: MSG_SERVER_DOWN};
        } else {
            return {isError: true, errData: MSG_API_FAIL};
        }
    }
}
