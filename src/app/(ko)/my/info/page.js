'use client'

import React, {useLayoutEffect, useState} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {useRouter} from 'next/navigation';
import {useMutation} from "@tanstack/react-query";

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {RouteConfig} from '@modules/config/RouteConfig';
import {useMoHeaderContext} from '@modules/context/MoHeaderContext';
import {useWebContext} from '@modules/context/WebviewContext';
import {useLoadingContext} from '@modules/context/LoadingContext';
import {useApi} from "@modules/services/useApi";
import {apiTelecomList, apiUpdateAdNoti, apiUpdateUser, apiUserMyDetail} from "@/app/_actions/user.action";
import {usePopContext} from "@modules/context/PopContext";
import {useUserContext} from "@modules/context/UserContext";
import {fncValiState, validate, VALIDATE_RULES} from "@modules/utils/ValidateUtils";
import {useScrollContext} from "@modules/context/ScrollContext";
import {apiTerms} from "@/app/_actions/common.action";

// components
import Breadcrumb from '@components/layout/Breadcrumb';
import InputText from '@components/common/InputText';
import Button from '@components/common/Button';
import Checkbox from '@components/common/Checkbox';
import Badge from "@components/composite/Badge";
import InputWithSelect from "@components/composite/InputWithSelect";
import SocialNetworkService from "@components/composite/SocialNetworkService";
import TermsPop from "@components/popup/TermsPop";

// const
const nameOptions = {
	M: {key: 'mktgMkusAgreYn', name: '마케팅 목적의 개인정보 수집 및 이용'},
	E: {key: 'emlSndngYn', name: '이메일'},
	S: {key: 'smsSndngYn', name: 'SMS'},
	P: {key: 'pushSndngYn', name: '푸시'}
}

//마케팅 목적의 개인정보 수집 및 이용 동의 ID
const AD_PERSONAL_INFO_TERMS_ID = process.env.NEXT_PUBLIC_MKT_PII_JOIN;

//광고성 정보 수신 동의 ID
const AD_PUSH_TERMS_ID = process.env.NEXT_PUBLIC_AD_OPTION;


/**
 * @description: 내 정보 화면 입니다.
 * @screenID:    UI-CRM-F223, UI-CRM-F444
 * @screenPath:  홈 > 마이페이지 > 내 정보
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function MyInfo() {

	const router = useRouter();
	const {isAccApp, fncPostRN} = useWebContext();
	const {isMobile} = useScreenSizeContext();
	const {fncChangeMoHeader} = useMoHeaderContext();
	const {jsonApiAction} = useApi();
	const {fncShowPop, fncClosePop, fncErrorPop} = usePopContext();
	const {isLogin, fncEncode} = useUserContext();
	const {fncRouteStart} = useLoadingContext();
	const {fncScrollToTop} = useScrollContext();

	// 다음 단계 가능 여부
	const [blockNext, setBlockNext] = useState(true);

	// 마케팅 팝업 ID
	const [mktId, setMktId] = useState(null);

	// 유저 정보
	const [userInfo, setUserInfo] = useState({});

	// 이동통신사 목록
	const [telecomList, setTelecomList] = useState([]);

	// 파라미터
	const [valid, setValid] = useState({});
	const [params, setParams] = useState({
		webMbrPswdEncpt: '',   // 비밀번호
		newWebMbrPswdEncpt: '',// 새 비밀번호
		reWebMbrPswdEncpt: '', // 새 비밀번호 확인
		emlAddr: '',           // 이메일
		mvmnComCoSeCd: '',     // 이동통신사 구분 코드
		mblTelno: '',          // 휴대폰번호
		snsLoginList: [],      // SNS 로그인 코드(snsLgnTypeCd: NULL,NAVER,GOOGLE,KAKAO)
		smsSndngYn: 'N',       // SMS 발송여부
		emlSndngYn: 'N',       // 이메일 발송여부
		pushSndngYn:'N',       // 푸시 발송여부
		mktgMkusAgreYn: 'N',   // 마케팅 활용 동의 여부
	});

	//-- Api
	// 통신사 목록
	const {mutateAsync: mutQueryTelecom} = useMutation({
		mutationKey: ['mutQueryTelecom'],
		mutationFn: () => jsonApiAction(apiTelecomList, {}),
		onSuccess: (res) => {
			if(res) {
				const formatted = res.filter(el => Number(el.comnCdVlCn) > 0).map(i => ({
					...i,
					id: i.comnCdVlCn,
					name: i.comnCdVlCn === '04' ? '알뜰폰' : i.comnCdVlNm
				}))

				setTelecomList(formatted);
			}
		}
	})

	// 유저 정보 조회
	const {mutateAsync: mutQueryUserInfo} = useMutation({
		mutationKey: ['mutQueryUserInfo'],
		mutationFn: () => jsonApiAction(apiUserMyDetail, {}),
		onSuccess: (res) => {
			if(res) {
				setUserInfo(res);
				setParams({
					...params,
					webMbrPswdEncpt: '',
					newWebMbrPswdEncpt: '',
					reWebMbrPswdEncpt: '',
					emlAddr: res.emlAddr,
					mvmnComCoSeCd: res.mvmnComCoSeCd,
					mblTelno: res.mblTelno,
					smsSndngYn: res.smsSndngYn ?? 'N',
					emlSndngYn: res.emlSndngYn ?? 'N',
					pushSndngYn: res.pushSndngYn ?? 'N',
					mktgMkusAgreYn: res.mktgMkusAgreYn ?? 'N',
				})
			}
		}
	})

	// 업데이트(상세 정보)
	const {mutate: mutUpdateDetail} = useMutation({
		mutationKey: ['mutUpdateDetail'],
		mutationFn: (payload) => jsonApiAction(apiUpdateUser, {...payload, __localHandle: true}),
		onSuccess: (res) => {
			if(res > 0) {
				return fncShowPop({
					mainText: `내 정보가 수정되었습니다.`,
					tertiaryText: null,
					primaryText: '확인',
					onClickPrimary: () => {fncClosePop(); fncScrollToTop(); mutQueryUserInfo();}
				})
			} else {
				fncErrorPop();
			}
		},
		onError: (error) => {
			if(error?.message?.includes('패스워드')) {
				setValid({
					webMbrPswdEncpt: '비밀번호가 일치하지 않습니다. 다시 입력해주세요.',
				})
				fncScrollToTop();
			} else {
				fncErrorPop();
			}
		}
	})

	// 업데이트(알림)
	const {mutate: mutUpdateAdNoti} = useMutation({
		mutationKey: ['mutUpdateAdNoti'],
		mutationFn: (payload) => jsonApiAction(apiUpdateAdNoti, payload),
		onSuccess: (res) => {
			if(res > 0) {
				const k = mktId.slice(0,1).toUpperCase();
				const mktNm = k ? nameOptions[k]?.name : '-';
				switch (mktId) {
					case 'M001': {
						return fncShowPop({
							mainText: `마케팅 목적의 개인 정보 수집 및 이용\n동의가 완료되었습니다.`,
							tertiaryText: null,
							primaryText: '확인',
							onClickPrimary: () => {setMktId(null); fncClosePop(); mutQueryUserInfo();}
						})
					}
					case 'M002': {
						return fncShowPop({
							mainText: `마케팅 목적의 개인 정보 수집 및 이용\n동의 거부가 완료되었습니다.`,
							tertiaryText: null,
							primaryText: '확인',
							onClickPrimary: () => {setMktId(null); fncClosePop(); mutQueryUserInfo();}
						})
					}
					case 'E001':
					case 'E002':
					case 'S001':
					case 'S002':
					case 'P001':
					case 'P002':
						return fncShowPop({
							mainText: `${mktNm} 수신 동의가 완료되었습니다.`,
							tertiaryText: null,
							primaryText: '확인',
							onClickPrimary: () => {setMktId(null); fncClosePop(); mutQueryUserInfo();},
							bodyContents: (
								<p>
									{`동의 일시 : ${moment().format('YYYY년 MM월 DD일')}`}<br/>
									{`전송자 : 한국철도공사 (레일플러스)`}
								</p>
							)
						})
					case 'E003':
					case 'S003':
					case 'P003':
						return fncShowPop({
							mainText: `${mktNm} 수신 거부가 완료되었습니다.`,
							tertiaryText: null,
							primaryText: '확인',
							onClickPrimary: () =>{setMktId(null); fncClosePop(); mutQueryUserInfo();},
							bodyContents: (
								<p>
									{`동의 일시 : ${moment().format('YYYY년 MM월 DD일')}`}<br/>
									{`전송자 : 한국철도공사 (레일플러스)`}
								</p>
							)
						})
				}
			} else {
				fncErrorPop();
			}
		}
	})

	const [isTermPop,setIsTermPop] = useState({
		active: false,
		popData: null
	})

	// 조회(약관)
	const {mutate: mutQueryTerms} = useMutation({
		mutationKey: ['mutQueryTerms'],
		mutationFn: (payload) => jsonApiAction(apiTerms, payload),
		onSuccess: (res) => {
			setIsTermPop({
				active: true,
				popData: res,
			})
		}
	})

	useLayoutEffect(() => {
		async function initialize() {
			await mutQueryTelecom();
			await mutQueryUserInfo();
			fncScrollToTop();
		}

		if(isLogin) {
			initialize();
		}
	}, [isLogin]);

	useLayoutEffect(() => {
		if(isAccApp) {
			fncPostRN({
				id: 'GO_USER_INFO',
				payload: {},
			})
			return;
		}
		if(isMobile) {
			fncChangeMoHeader({
				type: 'back',
				title: '내 정보'
			})
		}
	}, [isAccApp, isMobile])

	// 유저정보 호출
	const fncRefreshUserInfo = () => {
		mutQueryUserInfo();
	}

	// 휴대폰 번호 변경
	const fncUpdateObj = (obj) => {
		setParams({
			...params,
			...obj
		})
	}

	// 값 체크 제거
	const fncDelValid = (key) => {
		if(!key) return;
		setValid(prev => {
			const base = prev ?? {}
			return Object.fromEntries(
				Object.entries(base).filter(([k]) => k !== key)
			)
		});
	}

	// 입력
	const fncChangeInput = (e) => {
		if(Object.keys(valid).length) fncDelValid(e.target.id);
		setParams(prev => ({
			...prev,
			[e.target.id]: e.target.value
		}));

		if(
			params.mblTelno &&
			params.emlAddr &&
			params.webMbrPswdEncpt
		) {
			setBlockNext(false);
		}
	}

	// 저장
	const fncSave = async () => {
		let rules = {
			mvmnComCoSeCd: [
				{type: VALIDATE_RULES.MIN_LENGTH, value: 2},
				{type: VALIDATE_RULES.MAX_LENGTH, value: 2},
			],
			mblTelno: [
				{type: VALIDATE_RULES.PHONE},
			],
			emlAddr: [
				{type: VALIDATE_RULES.EMAIL},
			],
			webMbrPswdEncpt: [
				{type: VALIDATE_RULES.PASSWORD},
				{type: VALIDATE_RULES.MIN_LENGTH, value: 9},
				{type: VALIDATE_RULES.MAX_LENGTH, value: 20},
			]
		}

		if(params.newWebMbrPswdEncpt || params.reWebMbrPswdEncpt) {
			rules = {
				...rules,
				newWebMbrPswdEncpt: [
					{type: VALIDATE_RULES.PASSWORD},
					{type: VALIDATE_RULES.MIN_LENGTH, value: 9},
					{type: VALIDATE_RULES.MAX_LENGTH, value: 20},
				],
				reWebMbrPswdEncpt: [
					{type: VALIDATE_RULES.PASSWORD},
					{type: VALIDATE_RULES.MIN_LENGTH, value: 9},
					{type: VALIDATE_RULES.MAX_LENGTH, value: 20},
				]
			}
		}

		let res = validate(params, rules);

		// 현재 비밀번호 없으면
		if(params.webMbrPswdEncpt.length < 1) {
			res = {
				...res,
				webMbrPswdEncpt: '현재 비밀번호를 입력해주세요.'
			}
		}

		// 비밀번호
		if(params.newWebMbrPswdEncpt || params.reWebMbrPswdEncpt) {

			// 새 비밀번호 불일치
			if(params.newWebMbrPswdEncpt !== params.reWebMbrPswdEncpt) {
				res = {
					...res,
					newWebMbrPswdEncpt: '새 비밀번호가 일치하지 않습니다.',
					reWebMbrPswdEncpt: '새 비밀번호가 일치하지 않습니다.',
				}
			}
			
			// 현재 비밀번호와 새 비밀번호 동일
			if(params.webMbrPswdEncpt === params.newWebMbrPswdEncpt) {
				res = {
					...res,
					newWebMbrPswdEncpt: '현재 비밀번호와 다르게 입력해주세요.',
					reWebMbrPswdEncpt: '현재 비밀번호와 다르게 입력해주세요.',
				}
			}
		}

		// 통신사 코드 확인
		if(res['mvmnComCoSeCd']) {
			return fncShowPop({
				mainText: '통신사를 선택해주세요.',
				primaryText: '확인',
				onClickPrimary: () => fncClosePop()
			})
		}

		if(Object.keys(res).length === 0) {
			const encodedPwd = await fncEncode(params.webMbrPswdEncpt);
			if(!encodedPwd) return;
			if(params.newWebMbrPswdEncpt?.length > 0) {
				const encodedNewPwd = await fncEncode(params.newWebMbrPswdEncpt);
				if(!encodedNewPwd) return;
				mutUpdateDetail({
					webMbrPswdEncpt: encodedPwd,
					newWebMbrPswdEncpt: encodedNewPwd,
					emlAddr: params.emlAddr,
					mvmnComCoSeCd: params.mvmnComCoSeCd,
					mblTelno: params.mblTelno,
				})
			} else {
				mutUpdateDetail({
					webMbrPswdEncpt: encodedPwd,
					emlAddr: params.emlAddr,
					mvmnComCoSeCd: params.mvmnComCoSeCd,
					mblTelno: params.mblTelno,
				})
			}
		} else {
			setValid(res);
			fncScrollToTop();
		}
	}

	// 팝업 보이기
	const fncShowMarketingPop = (key) => {
		const k = key.slice(0,1).toUpperCase();
		const mktNm = k ? nameOptions[k]?.name : '-';

		// 마케팅 동의관련
		if(k === 'M') {
			if(params[key] === 'N') {
				setMktId('M001');
				return fncShowPop({
					mainText: `마케팅 목적의 개인정보 수집 및 이용\n동의 하시겠습니까?`,
					tertiaryText: '다음에 하기',
					onClickTertiary: () => fncClosePop(),
					primaryText: '동의하기',
					onClickPrimary: () => fncAgreeMktTerms(),
					bodyContents: (
						<div className={'flex-row-center justify-between'}>
							<p>마케팅 목적의 개인정보 수집 및 이용 동의</p>
							<Button
								theme={'textOnly'}
								size={'xs'}
								text={'보기'}
								ariaLabel={'보기'}
								customStyle={'w-fit underline text-dynamic-text-neutral-secondary font-semibold -mr-10'}
								onClick={() => fncGoTerms(AD_PERSONAL_INFO_TERMS_ID)}
							/>
						</div>
					)
				})
			}

			if(params[key] === 'Y' && isAccApp && (params.smsSndngYn === 'Y' || params.emlSndngYn === 'Y' || params.pushSndngYn === 'Y')) {
				setMktId('M002');
				return fncShowPop({
					mainText: '마케팅 목적의 개인정보 수집 및 이용 동의를 철회할 경우, 광고성 정보 수신 동의도 함께 철회되며, 혜택 알림(푸시, SMS, 이메일)을 받을 수 없습니다.',
					tertiaryText: '모든 동의 유지하기',
					onClickTertiary: () => fncClosePop(),
					primaryText: '모든 동의 철회하기',
					onClickPrimary: () => fncRejectMktTerms(),
				})
			} else if(params[key] === 'Y' && !isAccApp && (params.smsSndngYn === 'Y' || params.emlSndngYn === 'Y')) {
				setMktId('M002');
				return fncShowPop({
					mainText: '마케팅 목적의 개인정보 수집 및 이용 동의를 철회할 경우, 광고성 정보 수신 동의도 함께 철회되며, 혜택 알림(SMS, 이메일)을 받을 수 없습니다.',
					tertiaryText: '모든 동의 유지하기',
					onClickTertiary: () => fncClosePop(),
					primaryText: '모든 동의 철회하기',
					onClickPrimary: () => fncRejectMktTerms(),
				})
			} else {
				setMktId('M002');
				fncRejectMktTerms();
				return;
			}
		}

		// 수신 방법관련
		// 마케팅 동의 O, 수신 방법 O
		if(params.mktgMkusAgreYn == 'Y' && params[key] == 'Y') {
			setMktId(`${k}003`);
			fncRejectMethod(nameOptions[k]?.key);
			return
		}

		// 마케팅 동의 O, 수신 방법 X
		if(params.mktgMkusAgreYn == 'Y' && params[key] == 'N') {
			setMktId(`${k}001`);
			return fncShowPop({
				mainText: `광고성 정보 수신(${mktNm})을 동의하시겠습니까?`,
				tertiaryText: '다음에 하기',
				onClickTertiary: () => fncClosePop(),
				primaryText: '동의하기',
				onClickPrimary: () => fncAgreeMethod(key)
			})
		}

		// 마케팅 동의 X, 수신 방법 X
		if(params.mktgMkusAgreYn == 'N' && params[key] == 'N') {
			setMktId(`${k}002`);
			return fncShowPop({
				mainText: `광고성 정보 ${mktNm} 수신 동의`,
				tertiaryText: '다음에 하기',
				onClickTertiary: () => fncClosePop(),
				primaryText: '모두 동의하기',
				onClickPrimary: () => fncAgreeMethod(key),
				bodyContents: (
					<div>
						<p className={'text-dynamic-text-neutral-primary'}>
							{`광고성 정보 알림을 받으시려면\n마케팅 목적의 개인정보 수집 및 이용동의가 필요해요.`}
						</p>
						<div className={'flex-row-center justify-between mt-8'}>
							<p>광고성 정보 수신 동의</p>
							<Button
								theme={'textOnly'}
								size={'xs'}
								text={'보기'}
								ariaLabel={'보기'}
								customStyle={'w-fit underline text-dynamic-text-neutral-secondary font-semibold -mr-10'}
								onClick={() => fncGoTerms(AD_PUSH_TERMS_ID)}
							/>
						</div>
						<div className={'flex-row-center justify-between'}>
							<p>마케팅 목적의 개인정보 수집 및 이용 동의</p>
							<Button
								theme={'textOnly'}
								size={'xs'}
								text={'보기'}
								ariaLabel={'보기'}
								customStyle={'w-fit underline text-dynamic-text-neutral-secondary font-semibold -mr-10'}
								onClick={() => fncGoTerms(AD_PERSONAL_INFO_TERMS_ID)}
							/>
						</div>
					</div>
				)
			})
		}
	}

	// 동의: 마케팅 수집 및 이용
	const fncAgreeMktTerms = () => {
		mutUpdateAdNoti({
			smsSndngYn: 'N',
			emlSndngYn: 'N',
			pushSndngYn: 'N',
			mktgMkusAgreYn: 'Y',
		})
	}

	// 동의: 이용약관 + 수신 방법
	const fncAgreeMethod = (key) => {
		mutUpdateAdNoti({
			smsSndngYn: params.smsSndngYn,
			emlSndngYn: params.emlSndngYn,
			pushSndngYn: params.pushSndngYn,
			mktgMkusAgreYn: 'Y',
			[key]: 'Y',
		})
	}

	// 철회: 마케팅 수집 및 이용(수신 방법 포함)
	const fncRejectMktTerms = () => {
		mutUpdateAdNoti({
			smsSndngYn: 'N',
			emlSndngYn: 'N',
			pushSndngYn: 'N',
			mktgMkusAgreYn: 'N',
		})
	}

	// 철회: 이메일/SMS
	const fncRejectMethod = (key) => {
		mutUpdateAdNoti({
			smsSndngYn: params.smsSndngYn,
			emlSndngYn: params.emlSndngYn,
			pushSndngYn: params.pushSndngYn,
			mktgMkusAgreYn: 'Y',
			[key]: 'N'
		})
	}

	// 이동: 홈
	const fncGoHome = () => {
		const targetUri = RouteConfig.HOME.PATH;
		fncRouteStart(targetUri);
		router.replace(targetUri);
	}

	// 이동: 약관
	const fncGoTerms = (termId) => {
		if(termId) {
			mutQueryTerms({trmsTypeCd: termId});
		}
	};

	// 이동: 탈퇴
	const fncGoWithdrawal = () => {
		const targetUri = RouteConfig.WITHDRAWAL.PATH;
		fncRouteStart(targetUri);
		router.push(targetUri);
	}

	// 이동: 국가신분증 조회
	const fncGoDiscountTeenager = () => {
		if(userInfo?.yuthPdocCardNoEncpt) {
			const targetUri = RouteConfig.DISCOUNT_TEENAGER.PATH;
			fncRouteStart(targetUri);
			router.push(targetUri);
		} else {
			fncErrorPop();
		}
	}

	// 이동: 청소년 연령 초과 학생 할인 조회
	const fncGoDiscountStudent = () => {
		if(userInfo?.yuthAgeExcsStdntCardNoEncpt) {
			const targetUri = RouteConfig.DISCOUNT_STUDENT.PATH;
			fncRouteStart(targetUri);
			router.push(targetUri);
		} else {
			fncErrorPop();
		}
	}

	// 팝업닫기
	const fncCloseTermPop = () => {
		setIsTermPop({
			active: false,
			popData: null
		})
	}

	const fncHandlers = {
		updateObj: fncUpdateObj,
		changeInput: fncChangeInput,
		save: fncSave,
		showMarketingPop: fncShowMarketingPop,
		goWithdrawal: fncGoWithdrawal,
		goDiscountTeenager: fncGoDiscountTeenager,
		goDiscountStudent: fncGoDiscountStudent,
		refreshUserInfo: fncRefreshUserInfo,
		closeTermPop: fncCloseTermPop
	}

	const fncCallbackEvent = (fncName, variable, payload = {}) => {
		const fnc = fncHandlers[fncName];
		if (typeof fnc === 'function') return fnc(variable, payload);
	}

	if (isMobile) return (
		<MoMyInfo
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...params,
				userInfo,
				valid,
				telecomList,
				blockNext,
				isTermPop
			}}
		/>
	);
	else return (
		<DtMyInfo
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...params,
				userInfo,
				valid,
				telecomList,
				blockNext,
				isTermPop
			}}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F201 ~ UI-CRM-F204
 */
DtMyInfo.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function DtMyInfo({data, fncCallbackEvent}) {

	return (
		<main id={'my'} className={'body-wrap-618'} aria-labelledby={'page-name-dt'}>
			<Breadcrumb addPaths={[]}/>
			<h1 id={'page-name-dt'} className={'page-title'}>
				내 정보
			</h1>
			<div className={'flex-row-center gap-10 mb-10 mt-48'}>
				<h2 className={'info-sub-title'}>기본정보</h2>
				{
					data.userInfo?.mbrTypeCd && <Badge id={'mbrTypeCd'} code={data.userInfo.mbrTypeCd} />
				}
			</div>
			<div className={'grid gap-48'}>
				<fieldset role={'group'} className={'info-wrap'}>
					<legend className={'sr-only'}>
						사용자 기본 정보
					</legend>
					<dl>
						<div className={'flex-row-center'}>
							<dt>이름</dt>
							<dd>{data.userInfo?.custNm || '-'}</dd>
						</div>
						<div className={'flex-row-center'}>
							<dt>생년월일</dt>
							<dd>
								<span className={'sr-only'}>
									{data.userInfo?.custBrdt ? moment(data.userInfo?.custBrdt).format('YYYY년 MM월 DD일') : '-'}
								</span>
								<span aria-hidden={true}>
									{data.userInfo?.custBrdt ? moment(data.userInfo?.custBrdt).format('YYYY.MM.DD') : '-'}
								</span>
							</dd>
						</div>
						<div className={'flex-row-center'}>
							<dt>휴대폰 번호<span className={'essential'} aria-label={'필수'}>*</span></dt>
							<dd className={'flex-row-center justify-between'}>
								<InputWithSelect
									size={'sm'}
									emptyMsg={'통신사'}
									inputPlaceholder={`'-' 없이 숫자만 입력`}
									status={fncValiState('mblTelno', data.valid)}
									message={fncValiState('mblTelno', data.valid) === 'warning' && '휴대폰번호를 확인해주세요.'}
									maxLength={13}
									inputId={'mblTelno'}
									inputValue={data.mblTelno}
									onChangeInput={(e) => fncCallbackEvent('changeInput', e)}
									options={data.telecomList}
									selectPlaceholder={'통신사'}
									selectValue={data.mvmnComCoSeCd}
									onSelect={(option) => fncCallbackEvent('updateObj', {mvmnComCoSeCd: option.id})}
								/>
							</dd>
						</div>
						<div className={'flex-row-center'}>
							<dt>아이디</dt>
							<dd>{data.userInfo?.webMbrId || '-'}</dd>
						</div>
						<div className={'flex-col-center'}>
							<div className={'flex-row-center'}>
								<dt>현재 비밀번호<span className={'essential'} aria-label={'필수'}>*</span></dt>
								<dd>
									<InputText
										size={'sm'}
										fitWidth={true}
										placeholder={'영문+숫자+특수문자(!,@,#,$,%,^,&,*) 9~20자'}
										inputType={'password'}
										keypad={'password'}
										allows={['alnum', 'pwChar']}
										minLength={9}
										maxLength={20}
										status={fncValiState('webMbrPswdEncpt', data.valid)}
										message={fncValiState('webMbrPswdEncpt', data.valid) === 'warning' && data.valid['webMbrPswdEncpt']}
										id={'webMbrPswdEncpt'}
										value={data.webMbrPswdEncpt}
										onChange={(e) => fncCallbackEvent('changeInput', e)}
									/>
								</dd>
							</div>
							<div className={'flex-row-center'}>
								<dt>새 비밀번호</dt>
								<dd>
									<InputText
										size={'sm'}
										fitWidth={true}
										placeholder={'영문+숫자+특수문자(!,@,#,$,%,^,&,*) 9~20자'}
										inputType={'password'}
										keypad={'password'}
										allows={['alnum', 'pwChar']}
										minLength={9}
										maxLength={20}
										status={fncValiState('newWebMbrPswdEncpt', data.valid)}
										message={fncValiState('newWebMbrPswdEncpt', data.valid) === 'warning' && data.valid['newWebMbrPswdEncpt']}
										id={'newWebMbrPswdEncpt'}
										value={data.newWebMbrPswdEncpt}
										onChange={(e) => fncCallbackEvent('changeInput', e)}
									/>
								</dd>
							</div>
							<div className={'flex-row-center'}>
								<dt>새 비밀번호 확인</dt>
								<dd>
									<InputText
										size={'sm'}
										fitWidth={true}
										placeholder={'영문+숫자+특수문자(!,@,#,$,%,^,&,*) 9~20자'}
										inputType={'password'}
										keypad={'password'}
										allows={['alnum', 'pwChar']}
										minLength={9}
										maxLength={20}
										status={fncValiState('reWebMbrPswdEncpt', data.valid)}
										message={fncValiState('reWebMbrPswdEncpt', data.valid) === 'warning' && data.valid['reWebMbrPswdEncpt']}
										id={'reWebMbrPswdEncpt'}
										value={data.reWebMbrPswdEncpt}
										onChange={(e) => fncCallbackEvent('changeInput', e)}
									/>
								</dd>
							</div>
						</div>
						<div className={'flex-row-center'}>
							<dt>이메일<span className={'essential'}>*</span></dt>
							<dd>
								<InputText
									size={'sm'}
									fitWidth={true}
									placeholder={'이메일 입력'}
									allows={['emailLocal']}
									maxLength={100}
									status={fncValiState('emlAddr', data.valid)}
									message={fncValiState('emlAddr', data.valid) === 'warning' && '이메일을 확인해주세요.'}
									id={'emlAddr'}
									value={data.emlAddr}
									onChange={(e) => fncCallbackEvent('changeInput', e)}
								/>
							</dd>
						</div>
					</dl>
					<div className={'page-bottom-button-wrap'}>
						<Button
							theme={'primary'}
							size={'xl'}
							text={'저장하기'}
							customStyle={'w-[240px]'}
							disabled={data.blockNext}
							onClick={() => fncCallbackEvent('save')}
						/>
					</div>
				</fieldset>
				<fieldset role={'group'} className={'marketing-wrap mt-40'}>
					<legend className={'sr-only'}>
						마케팅 및 광고 알림 설정
					</legend>
					<div className={'group-header'}>
						<h2>마케팅 및 광고 알림 설정</h2>
						<div className={'divider'}/>
					</div>
					<div className={'group-body flex-row'}>
						<p
							className={'text-body-xl'}
							aria-label={`[선택] 광고성 정보 수신 동의: ${(data.smsSndngYn === 'Y' || data.emlSndngYn === 'Y') ? '동의함' : '동의 안 함'}`}
						>
							[선택] 광고성 정보 수신 동의
						</p>
						<div className={'flex-row-center gap-8 status'} role={'none'} aria-hidden={true}>
							<p className={(data.smsSndngYn === 'Y' || data.emlSndngYn === 'Y') ? 'text-dynamic-text-brand-primary-subtle' : ''}>
								동의함
							</p>
							<p className={(data.smsSndngYn === 'N' && data.emlSndngYn === 'N') ? 'text-dynamic-text-brand-primary-subtle' : ''}>
								동의안함
							</p>
						</div>
					</div>
					<div className={'group-body flex-col px-4'}>
						<div className={'flex-row-center gap-28'}>
							<Checkbox
								type={'square'}
								label={'SMS 수신'}
								ariaLabel={'SMS 수신'}
								isChecked={data.smsSndngYn === 'Y'}
								onChange={() => fncCallbackEvent('showMarketingPop', 'smsSndngYn')}
							/>
							<Checkbox
								type={'square'}
								label={'이메일 수신'}
								ariaLabel={'이메일 수신'}
								isChecked={data.emlSndngYn === 'Y'}
								onChange={() => fncCallbackEvent('showMarketingPop', 'emlSndngYn')}
							/>
						</div>
						<p className={'text-label-sm'}>
							필수 안내에 대한 고지 내용은 선택 여부와 상관없이 발송됩니다.
						</p>
						<Checkbox
							type={'square'}
							label={'마케팅 목적의 개인정보 수집 및 이용동의'}
							ariaLabel={'마케팅 목적의 개인정보 수집 및 이용동의'}
							essentialLabel={'선택'}
							isChecked={data.mktgMkusAgreYn === 'Y'}
							onChange={() => fncCallbackEvent('showMarketingPop', 'mktgMkusAgreYn')}
						/>
					</div>
				</fieldset>
				<fieldset role={'group'} className={'discount-wrap grid gap-12'}>
					<legend className={'sr-only'}>
						할인 정보
					</legend>
					<div className={'group-header'}>
						<h2>할인 정보</h2>
						<div className={'divider'} />
					</div>
					{
						data.userInfo?.yuthPdocYn === 'Y' && (
							<div className={'flex-row-center justify-between'}>
								<p className={'discount-name'}>국가신분증<span>적용중</span></p>
								<Button
									theme={'tertiary'}
									size={'xs'}
									text={'조회하기'}
									ariaLabel={'조회'}
									customStyle={'w-fit'}
									onClick={() => fncCallbackEvent('goDiscountTeenager')}
								/>
							</div>
						)
					}
					{
						data.userInfo?.yuthAgeExcsStdntYn === 'Y' && (
							<div className={'flex-row-center justify-between'}>
								<p className={'discount-name'}>청소년연령초과학생할인<span>적용중</span></p>
								<Button
									theme={'tertiary'}
									size={'xs'}
									text={'조회하기'}
									ariaLabel={'조회'}
									customStyle={'w-fit'}
									onClick={() => fncCallbackEvent('goDiscountStudent')}
								/>
							</div>
						)
					}
				</fieldset>
				<SocialNetworkService
				    pageName={'MYPAGE'}
				    snsLoginList={data?.userInfo?.snsLoginList}
					onRefresh={() => fncCallbackEvent('refreshUserInfo')}
                />
			</div>
			<div className={'withdrawal-wrap'}>
				<p>
					레일플러스 회원정보를 삭제하시겠어요?
				</p>
				<Button
					theme={'delete'}
					size={'sm'}
					text={'회원 탈퇴하기'}
					ariaLabel={'회원 탈퇴하기'}
					customStyle={'w-fit bg-transparent font-semibold'}
					onClick={() => fncCallbackEvent('goWithdrawal')}
				/>
			</div>

			{
				data.isTermPop?.active && (
					<TermsPop
						data={{terms: data.isTermPop?.popData}}
						id={'terms'}
						buttonLabel={'확인'}
						onClose={() => fncCallbackEvent('closeTermPop')}
						onDone={() => fncCallbackEvent('closeTermPop')}
					/>
				)
			}
		</main>
	)
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F408 ~ UI-CRM-F413
 */
MoMyInfo.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};

export function MoMyInfo({data, fncCallbackEvent}) {

	const {isAccApp, reloadKey, fncFocusLayout} = useWebContext();

	return (
		<main id={'my'} className={'body-wrap-mobile-screen-height'} aria-labelledby={'page-name-mo'}>
			<h1 id={'page-name-mo'} className={'sr-only'}>
				내 정보
			</h1>
			<div className={'page-bottom-space grid gap-32'}>
				<fieldset role={'group'} className={'info-wrap'}>
					<legend className={'sr-only'}>
						사용자 기본 정보
					</legend>
					<div className={'flex-row-center gap-20'} style={{display: 'flex'}}>
						<p className={'info-sub-title'}>
							기본정보
						</p>
						{
							data.userInfo?.mbrTypeCd && <Badge id={'mbrTypeCd'} code={data.userInfo.mbrTypeCd}/>
						}
					</div>
					<dl>
						<div className={'flex-col-start'}>
							<dt>이름</dt>
							<dd>{data.userInfo?.custNm || '-'}</dd>
						</div>
						<div className={'flex-col-start'}>
							<dt>생년월일</dt>
							<dd>
								<span className={'sr-only'}>
									{data.userInfo?.custBrdt ? moment(data.userInfo?.custBrdt).format('YYYY년 MM월 DD일') : '-'}
								</span>
								<span aria-hidden={true}>
									{data.userInfo?.custBrdt ? moment(data.userInfo?.custBrdt).format('YYYY.MM.DD') : '-'}
								</span>
							</dd>
						</div>
						<div className={'flex-col-start'}>
							<dt>휴대폰 번호<span className={'essential'} aria-label={'필수'}>*</span></dt>
							<dd className={'flex-row-center justify-between'}>
								<InputWithSelect
									size={'sm'}
									emptyMsg={'통신사'}
									inputPlaceholder={`'-' 없이 숫자만 입력`}
									status={fncValiState('mblTelno', data.valid)}
									message={fncValiState('mblTelno', data.valid) === 'warning' && '휴대폰번호를 확인해주세요.'}
									maxLength={13}
									inputId={'mblTelno'}
									inputValue={data.mblTelno}
									onChangeInput={(e) => fncCallbackEvent('changeInput', e)}
									options={data.telecomList}
									selectPlaceholder={'통신사'}
									selectValue={data.mvmnComCoSeCd}
									onSelect={(option) => fncCallbackEvent('updateObj', {mvmnComCoSeCd: option.id})}
								/>
							</dd>
						</div>
						<div className={'flex-col-start'}>
							<dt>아이디</dt>
							<dd>{data.userInfo?.webMbrId || '-'}</dd>
						</div>
						<div className={'flex-col-start'}>
							<div className={'flex-col-start w-full'}>
								<dt>현재 비밀번호<span className={'essential'} aria-label={'필수'}>*</span></dt>
								<dd>
									<InputText
										size={'sm'}
										fitWidth={true}
										placeholder={'영문+숫자+특수문자(!,@,#,$,%,^,&,*) 9~20자'}
										inputType={'password'}
										keypad={'password'}
										allows={['alnum', 'pwChar']}
										minLength={9}
										maxLength={20}
										status={fncValiState('webMbrPswdEncpt', data.valid)}
										message={fncValiState('webMbrPswdEncpt', data.valid) === 'warning' && '비밀번호가 일치하지 않습니다. 다시 입력해주세요.'}
										id={'webMbrPswdEncpt'}
										value={data.webMbrPswdEncpt}
										onChange={(e) => fncCallbackEvent('changeInput', e)}
									/>
								</dd>
							</div>
							<div className={'flex-col-start w-full'}>
								<dt>새 비밀번호</dt>
								<dd>
									<InputText
										size={'sm'}
										fitWidth={true}
										placeholder={'영문+숫자+특수문자(!,@,#,$,%,^,&,*) 9~20자'}
										inputType={'password'}
										keypad={'password'}
										allows={['alnum', 'pwChar']}
										minLength={9}
										maxLength={20}
										status={fncValiState('newWebMbrPswdEncpt', data.valid)}
										message={fncValiState('newWebMbrPswdEncpt', data.valid) === 'warning' && data.valid['newWebMbrPswdEncpt']}
										id={'newWebMbrPswdEncpt'}
										value={data.newWebMbrPswdEncpt}
										onChange={(e) => fncCallbackEvent('changeInput', e)}
									/>
								</dd>
							</div>
							<div className={'flex-col-start w-full'}>
								<dt>새 비밀번호 확인</dt>
								<dd>
									<InputText
										size={'sm'}
										fitWidth={true}
										placeholder={'영문+숫자+특수문자(!,@,#,$,%,^,&,*) 9~20자'}
										inputType={'password'}
										keypad={'password'}
										allows={['alnum', 'pwChar']}
										minLength={9}
										maxLength={20}
										status={fncValiState('reWebMbrPswdEncpt', data.valid)}
										message={fncValiState('reWebMbrPswdEncpt', data.valid) === 'warning' && '비밀번호가 일치하지 않습니다. 다시 입력해주세요.'}
										id={'reWebMbrPswdEncpt'}
										value={data.reWebMbrPswdEncpt}
										onChange={(e) => fncCallbackEvent('changeInput', e)}
									/>
								</dd>
							</div>
						</div>
						<div className={'flex-col-start'}>
							<dt>이메일<span className={'essential'}>*</span></dt>
							<dd>
								<InputText
									size={'sm'}
									fitWidth={true}
									placeholder={'이메일 입력'}
									allows={['emailLocal']}
									maxLength={100}
									status={fncValiState('emlAddr', data.valid)}
									message={fncValiState('emlAddr', data.valid) === 'warning' && '이메일을 확인해 주세요.'}
									id={'emlAddr'}
									value={data.emlAddr}
									onChange={(e) => fncCallbackEvent('changeInput', e)}
								/>
							</dd>
						</div>
					</dl>
					<div className={'page-bottom-button-wrap'} style={{marginTop: 20}}>
						<Button
							theme={'primary'}
							size={'lg'}
							text={'저장하기'}
							customStyle={'w-full'}
							disabled={data.blockNext}
							onClick={() => fncCallbackEvent('findId')}
						/>
					</div>
				</fieldset>
				<fieldset role={'group'} className={'marketing-wrap mt-40'}>
					<legend className={'sr-only'}>
						마케팅 및 광고 알림 설정
					</legend>
					<div className={'group-header'}>
						<h2>마케팅 및 광고 알림 설정</h2>
						<div className={'divider'}/>
					</div>
					<div className={'group-body flex-row'}>
						<p
							className={'text-body-xl'}
							aria-label={`[선택] 광고성 정보 수신 동의: ${(data.smsSndngYn === 'Y' || data.emlSndngYn === 'Y') ? '동의함' : '동의 안 함'}`}
						>
							[선택] 광고성 정보 수신 동의
						</p>
						<div className={'flex-row-center gap-8 status'} role={'none'} aria-hidden={true}>
							<p className={(data.smsSndngYn === 'Y' || data.emlSndngYn === 'Y') ? 'text-dynamic-text-brand-primary-subtle' : ''}>
								동의함
							</p>
							<p className={(data.smsSndngYn === 'N' && data.emlSndngYn === 'N') ? 'text-dynamic-text-brand-primary-subtle' : ''}>
								동의안함
							</p>
						</div>
					</div>
					<div className={'group-body flex-col px-4'}>
						<div className={'flex-row-center gap-20'}>
							<Checkbox
								type={'square'}
								label={'SMS 수신'}
								ariaLabel={'SMS 수신'}
								isChecked={data.smsSndngYn === 'Y'}
								onChange={() => fncCallbackEvent('showMarketingPop', 'smsSndngYn')}
							/>
							<Checkbox
								type={'square'}
								label={'이메일 수신'}
								ariaLabel={'이메일 수신'}
								isChecked={data.emlSndngYn === 'Y'}
								onChange={() => fncCallbackEvent('showMarketingPop', 'emlSndngYn')}
							/>
						</div>
						<p className={'text-label-sm'}>
							필수 안내에 대한 고지 내용은 선택 여부와 상관없이 발송됩니다.
						</p>
						<Checkbox
							type={'square'}
							label={'마케팅 목적의 개인정보 수집 및 이용동의'}
							ariaLabel={'마케팅 목적의 개인정보 수집 및 이용동의'}
							essentialLabel={'선택'}
							isChecked={data.mktgMkusAgreYn === 'Y'}
							onChange={() => fncCallbackEvent('showMarketingPop', 'mktgMkusAgreYn')}
						/>
					</div>
				</fieldset>
				<fieldset role={'group'} className={'discount-wrap grid gap-12'}>
					<legend className={'sr-only'}>
						할인 정보
					</legend>
					<div className={'group-header'}>
						<h2>할인 정보</h2>
						<div className={'divider'} />
					</div>
					{
						data.userInfo?.yuthPdocYn === 'Y' && (
							<div className={'flex-row-center justify-between'}>
								<p>국가신분증<span className={'applied'}>적용중</span></p>
								<Button
									theme={'tertiary'}
									size={'xs'}
									text={'조회하기'}
									ariaLabel={'조회'}
									customStyle={'w-fit'}
									onClick={() => fncCallbackEvent('goDiscountTeenager')}
								/>
							</div>
						)
					}
					{
						data.userInfo?.yuthAgeExcsStdntYn === 'Y' && (
							<div className={'flex-row-center justify-between'}>
								<p>청소년연령초과학생할인<span className={'applied'}>적용중</span></p>
								<Button
									theme={'tertiary'}
									size={'xs'}
									text={'조회하기'}
									ariaLabel={'조회'}
									customStyle={'w-fit'}
									onClick={() => fncCallbackEvent('goDiscountStudent')}
								/>
							</div>
						)
					}
				</fieldset>
				<SocialNetworkService
				    pageName={'MYPAGE'}
				    snsLoginList={data?.userInfo?.snsLoginList}
					onRefresh={() => fncCallbackEvent('refreshUserInfo')}
                />
			</div>
			<div className={'withdrawal-wrap'}>
				<p>
					레일플러스 회원정보를 삭제하시겠어요?
				</p>
				<button
					type={'button'}
					aria-label={'회원 탈퇴하기'}
					className={'text-button-xs text-dynamic-text-neutral-secondary font-semibold underline'}
					onClick={() => fncCallbackEvent('goWithdrawal')}
					onKeyDown={(e) => {
						if(e.key === 'Enter') fncCallbackEvent('goWithdrawal');
					}}
		        >
					회원 탈퇴하기
				</button>
			</div>

			{
				data.isTermPop?.active && (
					<TermsPop
						data={{terms: data.isTermPop?.popData}}
						id={'terms'}
						buttonLabel={'확인'}
						onClose={() => fncCallbackEvent('closeTermPop')}
						onDone={() => fncCallbackEvent('closeTermPop')}
					/>
				)
			}
		</main>
	)
}
