import React from "react";

// 숫자 천단위 표시
export function fncMaskComma(num) {
	if (!num) return 0;
	return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// 숫자 천단위 표시 제거
export function removeComma(num) {
	return num.replace(',', '');
}
