// 길이체크
export function checkDataLength(value) {
	const isNullOrUndefined = value == null;
	const isEmptyString = String(value).trim() === '';
	const isEmptyObject = typeof value === 'object' && !Array.isArray(value) && !Object.keys(value).length;

	return !(isNullOrUndefined || isEmptyString || isEmptyObject);
}

// JSON 여부
export function isJson(string) {
	try {
		var json = JSON.parse(string);
		if(typeof json === 'object') return json;
		else return {};
	} catch (e) {
		return {};
	}
}

// 클립보드 복사
export function fncClipboardCopy(string) {
	window.navigator.clipboard.writeText(string);
}


// 새 탭 열기
export function fncOpenUri(uri) {
	return window.open(uri, '_blank');
}

// object -> queryString
export function fncStringifyQuery(obj = {}){
	const queryString = new URLSearchParams(obj).toString();
	return Object.keys(obj).length > 0 ? `?${queryString}` : "";
}

// queryString -> object
export function fncParseQueryString(queryString = '') {
	if(!queryString) return {};
	return  Object.fromEntries(new URLSearchParams(queryString).entries());
}

// 1234567812345678 -> 1234-5678-1234-5678
export function fncMaskCardNo(string) {
	if(typeof string !== "string") return '';
	return string.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1-');
}

// 1234-5678-1234-5678 -> 1234567812345678
export function fncUnmaskCardNo(string) {
	return string.replace(/-/g, '');
}

// 연락처 포맷
export const fncMaskContactNo = (num) => {
	if (!num) return "-";

	let strNum = num;
	if(typeof num === "number") strNum = num.toString();

	const cleaned = strNum.replace(/\D/g, '');
	const length = cleaned.length;
	const regex = length === 10 ? /(\d{2})(\d{4})(\d{4})/ : /(\d{3})(\d{4})(\d{4})/;
	const formatted = cleaned.replace(regex, (match, p1, p2, p3) => {
		if (length === 10) {
			return `${p1}-${p2}-${p3}`;
		} else {
			return `${p1}-${p2}-${p3}`;
		}
	});

	return formatted;
}