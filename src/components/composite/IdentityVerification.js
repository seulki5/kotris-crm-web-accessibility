'use client';

import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {usePathname, useRouter} from 'next/navigation';
import Cookies from "js-cookie";
import {useMutation} from "@tanstack/react-query";

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {apiGetDSecurityReq, apiGetIpinReq, apiTerms} from "@/app/_actions/common.action";
import {useApi} from "@modules/services/useApi";
import {usePopContext} from "@modules/context/PopContext";
import {ageOptions} from "@modules/consants/Options";
import {useWebContext} from "@modules/context/WebviewContext";
import {useLoadingContext} from "@modules/context/LoadingContext";
import {fncGetBaseUrl} from "@modules/services/api.service";

// components
import FieldTitle from '@components/composite/FieldTitle';
import Button from '@components/common/Button';
import Checkbox from "@components/common/Checkbox";
import TermsPop from "@components/popup/TermsPop";

// const
export const REDIRECT_TYPE = {
	'/join': 'JOIN',
	'/find/id': 'FIND_ID',
	'/find/pw': 'FIND_PW',
	'/my/card': 'MY_CARD',
	'/my/card/register': 'MY_CARD_REG',
	'/cert': 'CERT',
	'/extrn/tax': 'EXTRN_TAX',
	'/mcert/pin': 'MCERT_PIN',
	'/mcert/zpy': 'MCERT_ZPY',
}
const ipinMoPopTargetName= 'ipinMoPop'


/**
 * @description: 공통 본인인증 컴포넌트 입니다.
 * @screenID:    -
 * @screenPath:  -
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
IdentityVerification.propTypes = {
	type: PropTypes.string,
	disabled: PropTypes.bool,
	completed: PropTypes.bool,
	store: PropTypes.object,
	hiddenTerm: PropTypes.bool,
	essentialValues: PropTypes.array,
	onUpdate: PropTypes.func.isRequired
};
export default function IdentityVerification({
	type = '',
	disabled = false,
	completed = false,
	store = {},
	hiddenTerm = false,
	essentialValues = [],
	onUpdate = () => {}
}) {

	const router = useRouter();
	const pathname = usePathname();
	const {isMobile} = useScreenSizeContext();
	const {jsonApiAction} = useApi();
	const {fncShowPop, fncClosePop, fncErrorPop} = usePopContext();
	const {isAccApp} = useWebContext();
	const {fncSetLoading} = useLoadingContext();

	// IOS 모바일 Safari => link
	const ua = navigator.userAgent.toLowerCase();
	const isSafari = ua.indexOf('safari') !== -1 && ua.indexOf('chrome') === -1;

	// ApiUrl
	const [apiUri, setApiUrl] = useState(null);

	// 모바일 약관 팝업
	const [isMoTermPop, setIsMoTermPop] = useState(false);

	//-- Api
	// 조회(개인정보 수집 및 이용)
	const {mutate: mutQueryOptnlPii, data: termOptnlPii} = useMutation({
		mutationKey: ['mutQueryOptnlPii'],
		mutationFn: (payload) => jsonApiAction(apiTerms, payload),
	})

	// 아이핀
	const {mutateAsync: mutQueryIpinReq} = useMutation({
		mutationKey: ['mutQueryIpinReq'],
		mutationFn: (payload) => jsonApiAction(apiGetIpinReq, payload),
	})

	// 드림시큐리티
	const {mutateAsync: mutQueryDSecurityReq} = useMutation({
		mutationKey: ['mutQueryDSecurityReq'],
		mutationFn: (payload) => jsonApiAction(apiGetDSecurityReq, payload),
	})

    useLayoutEffect(() => {
		async function initApiUrl() {
			const apiUrl = await fncGetBaseUrl();
			setApiUrl(apiUrl);
		}
		initApiUrl();

		if(!hiddenTerm && process.env.NEXT_PUBLIC_OPTNL_PII_IPIN) {
			mutQueryOptnlPii({trmsTypeCd: process.env.NEXT_PUBLIC_OPTNL_PII_IPIN});
		}
    }, []);

	useLayoutEffect(() => {
		const onVerifyMsg = (e) => {
			if(!apiUri || !pathname) return;

			// 개발환경 허용 오리진(여러 개면 배열/Set)
			const ALLOW = new Set([apiUri]);   // API 오리진
			if (!ALLOW.has(e.origin)) return;                  // 보안 체크

			const { type, status, message, ...rest } = e.data || {};

			if(type && status) {
				try {
					const childWindow = window.open('', ipinMoPopTargetName);
					if(childWindow) childWindow.close();
				} catch (err) {
					// alert(`자식 창 닫기 실패: ${err}`)
				}
			}

			if(status === 'success') {
				if (type === 'pass' && rest?.data?.rid) {
					onUpdate({method: ageOptions[0].id, status, type, ...rest?.data});
				}

				if (type === 'ipin' && rest?.data?.custIpnNo) {
					onUpdate({method: ageOptions[1].id, status, type, ...rest?.data});
				}
			} else {
				fncShowPop({
					mainText: message || '본인인증에 실패했습니다.',
					primaryText: '확인',
					onClickPrimary: () => fncClosePop()
				})
			}
		}

		window.addEventListener('message', onVerifyMsg);

		return () => window.removeEventListener('message', onVerifyMsg);
	}, [router, apiUri]);

	useEffect(() => {
		window.mokResult = function (result) {
			try {
				const parsed = typeof result === "string" ? JSON.parse(result) : result;
				if (parsed?.type === 'pass' && parsed?.rid) {
					onUpdate({method: ageOptions[0].id, ...parsed});
				}
			} catch (e) {
				fncErrorPop()
			}
		};

		// 언마운트 시 정리
		return () => {
			try {
				delete window.mokResult;
			} catch (e) {
				window.mokResult = undefined;
			}
		};
	}, []);

	// 드림시큐리티 인증
	const fncVerifyDSecurity = async () => {
		if(essentialValues?.length > 0) {
			for (const item of essentialValues) {
				if(!store[item.key]) {
					return fncShowPop({
						mainText: `${item.label}을(를) 입력해주세요.`,
						primaryText: '확인',
						onClickPrimary: () => fncClosePop()
					})
				}
			}

		}

		if (!window.MOBILEOK || typeof window.MOBILEOK.process !== "function") {
			return;
		}

		const redirectType = REDIRECT_TYPE[pathname] || '/';
		const dSecurityInfo = await mutQueryDSecurityReq({
			mstr: isMobile ? 'link' : 'popup',
			redirectType: redirectType
		});

		// 이전 단계 파라미터 저장
		if(isMobile ) {
			const expireMM = new Date(Date.now() + 10 * 60 * 1000);
			Cookies.set('crm-verify', JSON.stringify({...store, method: ageOptions[0].id, selectedMethod: type}), { expires: expireMM });
		}

		const redirectLink = isAccApp || isMobile;
		window.MOBILEOK.process(dSecurityInfo.requestUrl, redirectLink ? "MWV" : "WB", redirectLink ? "" : "mokResult");
	}


	const [ipinInfo, setIpinInfo] = useState(null);

	// i-pin 인증
	const fncShowIpin = async () => {
		if(essentialValues?.length > 0) {
			for (const item of essentialValues) {
				if(!store[item.key]) {
					return fncShowPop({
						mainText: `${item.label}을(를) 입력해주세요.`,
						primaryText: '확인',
						onClickPrimary: () => fncClosePop()
					})
				}
			}
		}

		fncVerifySiren(ipinInfo);
	};

	// 팝업
	const fncVerifySiren = (ipinData) => {
		if(typeof window === 'undefined' && !isAccApp) return;
		if(!apiUri || !pathname || !ipinData?.action) return;

		const action = ipinData.action;
		const reqInfo = ipinData.reqInfo;
		const retUrl = ipinData.retUrl;

		// Mobile: Link
		if(isAccApp || (isMobile && isSafari)) {
			// 이전 단계 파라미터 저장
			const expireMM = new Date(Date.now() + 10 * 60 * 1000);
			Cookies.set('crm-verify', JSON.stringify({...store, method: ageOptions[1].id, selectedMethod: type}), { expires: expireMM });

			const form = document.createElement('form');
			form.method = 'post';
			form.action = action;
			form.acceptCharset = 'UTF-8';

			const m1 = document.createElement('input');
			m1.type = 'hidden';
			m1.name = 'reqInfo';
			m1.value = reqInfo;

			const m2 = document.createElement('input');
			m2.type = 'hidden';
			m2.name = 'retUrl';
			m2.value = retUrl;

			form.appendChild(m1);
			form.appendChild(m2);
			document.body.appendChild(form);
			form.submit();

			return;
		}

		// Mobile: Popup
		if(isMobile) {
			let popupWin =  window.open('', ipinMoPopTargetName, 'width=480,height=720');
			if(!popupWin) {
				alert(`모바일 팝업이 차단되었습니다. 팝업 허용 후 다시 시도해주세요.`)
				return;
			}

			const form = document.createElement('form');
			form.setAttribute('method', 'POST');
			form.setAttribute('action', action);
			form.setAttribute('target', ipinMoPopTargetName)

			const inputs = {reqInfo, retUrl, MSTR: 'popup'};
			Object.entries(inputs).forEach(([key, value]) => {
				const input = document.createElement('input');
				input.type = 'hidden';
				input.name = key;
				input.value = value;
				form.appendChild(input);
			});

			document.body.appendChild(form);
			form.submit();

			setTimeout(() => {
				if(document.body.contains(form)) document.body.removeChild(form);
			}, 1000)

			return;
		}

		// PC: 팝업 창
		const popup = window.open(
			'about:blank',
			'ipinPopup',
			'width=480,height=720,menubar=no,toolbar=no,location=no,status=no'
		);
		if (!popup) {
			alert('팝업이 차단되었습니다. 팝업 허용 후 다시 시도하세요.');
			return;
		}

		const d = popup.document;
		d.open();
		d.write(`
            <!doctype html><html><head><meta charset='UTF-8'><title>본인인증 시작</title></head>
            <body onload='document.f.submit()'>
                <form name='f' method='post' action='${action}' accept-charset='UTF-8' target='_self'>
                    <input type='hidden' name='MSTR' value='popup'>
                    <input type="hidden" name="reqInfo" value="${reqInfo}"/>
                	<input type="hidden" name="retUrl" value="${retUrl}"/>
                </form>
            </body></html>
        `);
		d.close();
	}

	// 약관 동의
	const fncAgreeTerm = async () => {
		onUpdate({prvcMkusAgreYn: !store.prvcMkusAgreYn});
	}

	// 마케팅 동의시 아이핀 정보 호출하기
	useEffect(() => {
		async function queryIpinInfo() {
			const redirectType = REDIRECT_TYPE[pathname] || '/';
			const ipinDetails = await mutQueryIpinReq({
				mstr: (isAccApp || (isMobile && isSafari)) ? 'link' : 'popup',
				redirectType: redirectType
			});

			setIpinInfo(ipinDetails)
		}

		if(store.prvcMkusAgreYn === true) queryIpinInfo();

	}, [store.prvcMkusAgreYn])

	// 약관 팝업
	const fncToggleTermPop = () => {
		setIsMoTermPop(!isMoTermPop)
	}

	return (
		<>
			<div className={'w-full'}>
				{
					// ipin
					(type === ageOptions[1].id && !hiddenTerm) && (
						<div className={'checkbox-wrap mb-48 mo:mb-40'}>
							<Checkbox
								type={'square'}
								label={'IPIN(아이핀) 개인정보 수집 및 이용에 관한 동의'}
								essentialLabel={'선택'}
								isChecked={store.prvcMkusAgreYn}
								disabled={disabled}
								onChange={fncAgreeTerm}
							/>
							{
								isMobile ? (
									<button
										className={'terms'}
										onClick={fncToggleTermPop}
										onKeyDown={(e) => {
											if (e.key === 'Enter') fncToggleTermPop();
										}}>
										보기
									</button>
								) : (
									<div className={'term-wrap'}>
										<div className={'prose max-w-none'}>
											<div
												className={'prose max-w-none dark:text-dynamic-text-neutral-primary'}
												dangerouslySetInnerHTML={{__html: termOptnlPii?.trmsDtlCn}}
											/>
										</div>
									</div>
								)
							}
						</div>
					)
				}
				<FieldTitle
					title={'본인인증'}
					essential={true}
				/>
				<div className={`flex gap-12 ${isMobile ? 'flex-col' : 'flex-row'}`}>
					<Button
						theme={'secondary'}
						size={isMobile ? 'md' : 'lg'}
						text={'휴대폰 인증하기'}
						customStyle={'w-full'}
						disabled={disabled}
						onClick={fncVerifyDSecurity}
					/>
					{
						// ipin
						!(type === ageOptions[0].id && !completed) && (
							<Button
								theme={'secondary'}
								size={isMobile ? 'md' : 'lg'}
								text={'아이핀(i-pin) 인증하기'}
								customStyle={'w-full'}
								disabled={disabled || !store.prvcMkusAgreYn}
								onClick={fncShowIpin}
							/>
						)
					}
					{
						completed && (
							<Button
								theme={'secondary'}
								size={isMobile ? 'md' : 'lg'}
								text={'인증 완료'}
								customStyle={'w-full cursor-default'}
								onClick={() => {}}
							/>
						)
					}
				</div>
			</div>

			{
				isMoTermPop && (
					<TermsPop
						data={{
							termOptnlPii: {
								trmsNm: 'IPIN(아이핀) 개인정보 수집 및 이용에 관한 동의(선택)',
								trmsDtlCn: termOptnlPii?.trmsDtlCn
							}
						}}
						id={'termOptnlPii'}
						onClose={fncToggleTermPop}
						onDone={fncToggleTermPop}
					/>
				)
			}
		</>
	)
}
