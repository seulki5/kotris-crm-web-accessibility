'use client'

import React, {useState, useContext, useMemo, useEffect, useLayoutEffect, useCallback} from 'react';
import Cookies from "js-cookie";
import {useRouter} from "next/navigation";

// modules
import {checkDataLength, isJson} from "@modules/utils/StringUtils";
import {RouteConfig} from "@modules/config/RouteConfig";
import {useLoadingContext} from "@modules/context/LoadingContext";
import {useUserContext} from "@modules/context/UserContext";


const WebviewContext = React.createContext();
export const WebviewProvider = ({ children }) => {

	const router = useRouter();
	const {fncLogin} = useUserContext();
	const {fncRouteStart} = useLoadingContext();
	const cookieViewport = Cookies.get('crm-viewport')?.value || null;

	const [isAccApp, setIsAccApp] = useState(false);
	const [storeRNPayload, setStoreRNPayload] = useState(null);
	const [backRNPath, setBackRNPath] = useState(null);
	const [reloadKey, setReloadKey] = useState(0);

	useLayoutEffect(() => {
		//앱 접속 여부
		//const storedToken = sessionStorage.getItem("crm-si");
		//if(!storedToken) {
			fncPostRN({
				id: "WEB_ACCESS_APP",
				payload: {}
			});
		//}
	}, []);

	useLayoutEffect(() => {
		const ua = navigator.userAgent;
		const osIOS = /iPhone|iPad|iPod/i.test(ua);
		if(osIOS) {
			//ios
			window.removeEventListener('message', fncOnListenRN);
			window.addEventListener("message", fncOnListenRN);
		} else {
			//android
			document.removeEventListener("message", fncOnListenRN);
			document.addEventListener("message", fncOnListenRN);
		}

		return () => {
			if(osIOS) {
				window.removeEventListener("message", fncOnListenRN);
			} else {
				document.removeEventListener("message", fncOnListenRN);
			}
		}
	}, [])

	const fncPostRN = useCallback((postMessage) => {
		if(checkDataLength(postMessage) && typeof window !== "undefined" && window.ReactNativeWebView) {
			window.ReactNativeWebView.postMessage(JSON.stringify(postMessage));
		}
	}, [])

	const fncOnListenRN = useCallback(async (e) => {
		if (checkDataLength(e.data)) {
			let nativeData = isJson(e.data);
			const storedToken = sessionStorage.getItem("crm-si")
			// alert(`from rn: ${JSON.stringify(nativeData)} // stored=${storedToken}`)
			if (checkDataLength(nativeData)) {
				switch (nativeData.id) {
					//앱 접속
					case 'RN_ACCESS_APP_CALLBACK' :
						// 앱 접속 여부 저장
						let isAccApp = false;
						if(nativeData.payload.appAccToken === process.env.NEXT_PUBLIC_APP_ACCESS_TOKEN) {
							isAccApp = true;
							sessionStorage.setItem("crm-si", nativeData.payload.userToken);
						}
						
						setIsAccApp(isAccApp);
						if(storedToken) fncFocusLayout();

						return;

					// 로그아웃
					case 'RN_LOGOUT':
						fncRouteStart(RouteConfig.LOGIN.PATH);
						router.replace(RouteConfig.LOGIN.PATH);
						return;

					// 뒤로가기
					case 'RN_STORE_BACK_SCREEN':
						let uri = new URL(nativeData.uri);
						let path = uri.pathname;
						if(path) {
							setStoreRNPayload(nativeData.payload);
							setBackRNPath(path);
							setReloadKey(prev => prev + 1);
						}
						return;

					case 'RN_FILE_UPLOAD_CALLBACK':
						setStoreRNPayload(nativeData.payload);
						setReloadKey(prev => prev + 1);
						return;
				}
			}
		}
	}, []);

	const fncFocusLayout = useCallback(() => {
		// const timer = setTimeout(() => {
		// 	alert('화면 포커스 2')
		// 	fncPostRN({
		// 		id: 'WEB_GO_SCREEN_CALLBACK',
		// 		payload: {}
		// 	})
		// }, 500)

		fncPostRN({
			id: 'WEB_GO_SCREEN_CALLBACK',
			payload: {}
		})

		// return () => clearTimeout(timer);
	}, []);

	const fncCleanStoreRNPayload = useCallback(() => {
		setStoreRNPayload(null)
	}, []);

	// provider props
	const obj = useMemo(() => (
		{
			isAccApp: isAccApp || cookieViewport === 'mobile',
			storeRNPayload, backRNPath, reloadKey, fncPostRN, fncFocusLayout, fncCleanStoreRNPayload
		}
	), [isAccApp, storeRNPayload, backRNPath, reloadKey, fncPostRN, fncFocusLayout, fncCleanStoreRNPayload]);

	return (
		<WebviewContext.Provider value={obj}>
			{children}
		</WebviewContext.Provider>
	);
};

export const useWebContext = () => useContext(WebviewContext);
