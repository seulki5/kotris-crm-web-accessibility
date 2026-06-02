import {useCallback} from "react";
import Cookies from "js-cookie";

// modules
import {usePopContext} from "@modules/context/PopContext";

// API 헤더 정보를 담아 서버액션 호출 hook
export function useApi() {

	const {fncShowPop, fncClosePop} = usePopContext();

	const jsonApiAction = useCallback(async (action, payload) => {

		const cookieToken = Cookies.get('crm-si')?.value || '';
		const sessionToken = sessionStorage.getItem('crm-si')?.replace(`"`, '') || '';

		const token = (sessionToken || cookieToken) || '';
		const headers = {
			'Content-Type': 'application/json',
			...(token && { Authorization: `Bearer ${token}` }), // Conditionally add Authorization
		};

		let {__localHandle, ...rest} = payload;
		const result = await action(headers, rest);

		if(result?.isError) {

			let parsedError;
			if(!!result?.errData?.code) {
				parsedError =  result?.errData;
			} else {
				parsedError = JSON.parse(result.errData);
			}

			console.log('parsedError : ', parsedError)

			const errMsg = parsedError?.message.replace('ERROR: ', "")
			if(payload?.__localHandle) {
				throw {code: 400, message: errMsg};
			} else {
				return fncShowPop({
					mainText: errMsg,
					primaryText: '확인',
					onClickPrimary: () => fncClosePop(),
				});
			}
		}

		return result;
	}, []);

	const fileApiAction = useCallback(async (action, payload, __localHandle = false) => {
			const result = await action(payload);

			if(result?.isError) {

				let parsedError;
				if(!!result?.errData?.code) {
					parsedError =  result?.errData;
				} else {
					parsedError = JSON.parse(result.errData);
				}

				const errMsg = parsedError?.message.replace('ERROR: ', "")
				if(__localHandle) {
					throw {code: 400, message: errMsg};
				} else {
					return fncShowPop({
						mainText: errMsg,
						primaryText: '확인',
						onClickPrimary: () => fncClosePop(),
					});
				}
			}

			return result;
	}, []);

	return { jsonApiAction, fileApiAction };
}
