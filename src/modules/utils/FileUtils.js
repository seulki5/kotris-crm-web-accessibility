'use client';

import moment from "moment/moment";

// 파일 다운로드
export function downloadFile(blob, fileNm) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileNm +`_${moment().format('YYMMDD')}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}