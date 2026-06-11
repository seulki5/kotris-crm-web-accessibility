"use client"

import React, {useState, useContext, useMemo, useEffect} from "react";
import {useMutation} from "@tanstack/react-query";
import {usePathname, useRouter} from "next/navigation";
import moment from 'moment';
import Cookies from "js-cookie";
import forge from 'node-forge';

// modules
import {useLoadingContext} from "@modules/context/LoadingContext";
import {useApi} from "@modules/services/useApi";
import {apiUncheckedNoti, apiUserDetail} from "@/app/_actions/user.action";
import {RouteConfig} from "@modules/config/RouteConfig";
import {apiGetPublicKey} from '@/app/_actions/common.action';
import {usePopContext} from "@modules/context/PopContext";
import {toMomentFrom14} from "@modules/utils/DateUtils";

// const
const UserContext = React.createContext();
const initUserInfo = {
	webMbrId: '',              // 웹회원아이디
	custId: '',                // 고객아이디
	rlpsMbrSeCd: '',           // 회원 구분(02내국인, 03외국인)
	mbrTypeCd: '',             // 회원 유형(01일반, 02청소년, 03어린이, 00기타)
	custNm: '',                // 유저명
	custBrdt: '',              // 생년월일(14자리)
	genTelno: '',              // 전화번호(일반)
	mblTelno: '',              // 전화번호(휴대폰)
	mvmnComCoSeCd: '',         // 이동통신사
	emlAddr: '',               // 이메일
	smsSndngYn: 'N',           // SMS 발송여부
	emlSndngYn: '',            // 이메일 발송여부
	pushSndngYn: '',           // 푸시 발송여부
	yuthPdocYn: 'N',           // 국가신분증여부
	yuthAgeExcsStdntYn: 'N',   // 청소년연령초과학생할인여부
	snsLgnTypeCd: ''           // SNS로그인유형코드(null, NAVER, GOOGLE, KAKAO)
}

export const UserProvider = ({ children }) => {

	const router = useRouter();
	const pathname = usePathname();
	const {jsonApiAction} = useApi();
	const {fncShowPop, fncClosePop} = usePopContext();
	const {fncRouteStart} = useLoadingContext();

	// 토큰
	const [token, setToken] = useState(null);

	// 유저 정보
	const [userInfo, setUserInfo] = useState(initUserInfo);

	// --Api
	// 유저 정보
	const {mutate: mutQueryUserDetail} = useMutation({
		mutationKey: ['mutQueryUserDetail'],
		mutationFn: () => jsonApiAction(apiUserDetail, {}),
		onSuccess: (res, variables) => {
			// alert(`variables : , ${JSON.stringify(variables)}`)
			// 90일 비밀번호 팝업 강제 종료 막기
			const pwDiff = Cookies.get('crm-diff');
			if(pwDiff <= 90) {
				fncClosePop();
			}

			if(res?.custId) {
				setUserInfo(res);
				fncUpdateUnchecked();

				// 비밀번호 변경 체크
				const pwDt = moment(toMomentFrom14(res?.pswdChgDt));
				const diff = moment().diff(pwDt, 'days');
				Cookies.set('crm-diff', diff);

				// 첫 이용자 카드등록 유도
				if(res?.crdRegYn === 'N' && variables.checkCardReg) {
					return fncShowPop({
						mainText: '등록된 카드가 없습니다.\n카드를 등록해주세요.',
						tertiaryText: '다음에 하기',
						onClickTertiary: () => {
							fncClosePop();

							const targetUri = '/';
							fncRouteStart(targetUri);
							router.replace(targetUri);
						},
						primaryText: '카드 등록하기',
						onClickPrimary: () => {
							fncClosePop();

							const targetUri = RouteConfig.CARD_REGISTER.PATH;
							fncRouteStart(targetUri);
							router.push(targetUri);
						},
					})
				}

			} else {
				setUserInfo(initUserInfo);
			}
		}
	})

	// 미확인 알림
	const {mutate: mutQueryUncheckedNoti, data: uncheckedNoti} = useMutation({
		mutationKey: ['mutQueryUncheckedNoti'],
		mutationFn: () => jsonApiAction(apiUncheckedNoti, {}),
		onSuccess: (res) => {
		}
	})

	// 공개키
	const {mutateAsync: mutGetPublicKey} = useMutation({
		mutationKey: ['mutGetPublicKey'],
		mutationFn: () => jsonApiAction(apiGetPublicKey, {}),
	})

	useEffect(() => {
		const token = sessionStorage.getItem("crm-si") || null;
		if(![null, undefined].includes(token)) fncQueryUserDetail(token, {});
	}, [])

	useEffect(() => {
		const token = sessionStorage.getItem("crm-si");
		if([
			RouteConfig.MY.PATH,
			RouteConfig.INFO.PATH,
			RouteConfig.WITHDRAWAL.PATH,
			RouteConfig.CARD.PATH,
			RouteConfig.CARD_REGISTER.PATH,
			RouteConfig.USAGE.PATH,
			RouteConfig.USAGE_STATISTICS.PATH,
			RouteConfig.REFUND.PATH,
			RouteConfig.LOST.PATH,
			RouteConfig.CLAIM.PATH,
			RouteConfig.DISCOUNT.PATH,
			RouteConfig.DISCOUNT_TEENAGER.PATH,
			RouteConfig.DISCOUNT_TEENAGER_REGISTER.PATH,
			RouteConfig.DISCOUNT_STUDENT.PATH,
			RouteConfig.DISCOUNT_STUDENT_REGISTER.PATH,
			RouteConfig.CHILDPROOF.PATH,
			RouteConfig.CHILDPROOF_HISTORY.PATH,
			RouteConfig.CHILDPROOF_REGISTER.PATH,
			RouteConfig.CHILDPROOF_DETAIL.PATH,
			RouteConfig.COUPON.PATH,
			RouteConfig.ALARM.PATH,
			RouteConfig.CERT.PATH
		].includes(pathname) && !userInfo?.custId && !token) {
			fncShowPop({
				mainText: '로그인 후 이용해주세요.',
				primaryText: '확인',
				onClickPrimary: () => {
					fncClosePop();

					const targetUri = RouteConfig.LOGIN.PATH;
					fncRouteStart(targetUri);
					router.replace(targetUri);
				}
			})
		}
	}, [pathname]);

	// 유저 정보 조회
	const fncQueryUserDetail = (token = null, variables = {}) => {
		if(!token) return;
		setToken(token);
		mutQueryUserDetail(variables);
	}

	// 로그인
	const fncLogin = async ({jwt = null, pswdChgDt = null, isAccApp = false, certYn = 'Y'}) => {
		if([null, undefined, ''].includes(jwt)) return;

		sessionStorage.setItem("crm-si", jwt);
		fncQueryUserDetail(jwt, {checkCardReg: true});

		// CI 없는 유저
		if(certYn !== 'Y') {
			const targetUri = RouteConfig.CERT.PATH;
			fncRouteStart(targetUri);
			router.push(targetUri);
			return;
		}

		if(isAccApp) return;

		setTimeout(() => {
			fncClosePop();

			const targetUri = '/';
			fncRouteStart(targetUri);
			router.replace(targetUri);

		}, 500)
	}

	// 로그아웃
	const fncLogout = (routeAval = true) => {
		setUserInfo(initUserInfo);
		sessionStorage.removeItem("crm-si");

		if(routeAval) {
			setTimeout(() => {
				// 이동: 홈
				const targetUri = RouteConfig.HOME.PATH;
				fncRouteStart(targetUri);
				router.replace(targetUri);
			}, 300)
		}
	}

	// 미독 알림 확인
	const fncUpdateUnchecked = () => {
		mutQueryUncheckedNoti();
	}

	// 암호화
	const fncEncode = async (plainText) => {
		if(!plainText) return '';

		// 서버 환경 방어
		if(typeof window === 'undefined') {
			return fncShowPop({
				mainText: '서버환경에선 불가합니다.',
				primaryText: '확인',
				onClickPrimary: () => fncClosePop(),
			})
		}

		const pk = await mutGetPublicKey();
		if(!pk || !pk.publicKey) return '';

		return await rsaEncode(plainText, pk.publicKey);
	}


	// provider props
	const obj = useMemo(() => (
		{
			userInfo,
			isLogin: ![null, "null"].includes(token) && userInfo?.custId,
			uncheckedNoti: uncheckedNoti || 'N',
			fncLogin,
			fncLogout,
			fncUpdateUnchecked,
			fncEncode
		}
	), [userInfo, uncheckedNoti, fncLogin, fncLogout, fncUpdateUnchecked, fncEncode]);

	return (
		<UserContext.Provider value={obj}>
			{children}
		</UserContext.Provider>
	);
};

export const useUserContext = () => useContext(UserContext);

export const rsaEncode = async (plainText, publicKeyPem) => {
	if(!plainText) return '';
	if(!publicKeyPem) return '';

	try {

		const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
		const encrypted = publicKey.encrypt(plainText.trim(), 'RSA-OAEP', {
			md: forge.md.sha256.create(),
			mgf1: {
				md: forge.md.sha256.create()
			}
		});

		return forge.util.encode64(encrypted);

	} catch(e) {
		return '';
	}
}
