'use client'

import React, {useLayoutEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {useRouter, useSearchParams} from 'next/navigation';
import {useMutation} from '@tanstack/react-query';

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {useMoHeaderContext} from '@modules/context/MoHeaderContext';
import {RouteConfig} from '@modules/config/RouteConfig';
import {useScrollContext} from '@modules/context/ScrollContext';
import {useLoadingContext} from '@modules/context/LoadingContext';
import {useWebContext} from '@modules/context/WebviewContext';
import {usePopContext} from '@modules/context/PopContext';
import {useApi} from '@modules/services/useApi';
import {apiChildRegList, apiCreateChild, apiUpdateChild} from '@/app/_actions/mypage.action';
import {fncAllDefined, validate, VALIDATE_RULES} from '@modules/utils/ValidateUtils';
import {useUserContext} from "@modules/context/UserContext";
import {apiTerms} from "@/app/_actions/common.action";

// components
import Breadcrumb from '@components/layout/Breadcrumb';
import ChildproofRegisterStep1 from '@/app/(ko)/my/childproof/register/components/ChildproofRegisterStep1';
import ChildproofRegisterStep2 from '@/app/(ko)/my/childproof/register/components/ChildproofRegisterStep2';


/**
 * @description: 어린이 안심서비스 내 자녀 등록/수정 화면 입니다.
 * @screenID:    UI-CRM-F248 ~ UI-CRM-F249, UI-CRM-F479 ~ UI-CRM-F480
 * @screenPath:  홈 > 마이페이지 > 어린이 안심서비스 > 내 자녀 등록/수정
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function MyChildproofRegister() {

	const router = useRouter();
	const searchParams = useSearchParams();
	const id = searchParams.get('id');
	const {isMobile} = useScreenSizeContext();
	const {isAccApp, reloadKey, fncFocusLayout, fncCleanStoreRNPayload} = useWebContext();
	const {fncChangeMoHeader} = useMoHeaderContext();
	const {fncScrollToTop} = useScrollContext();
	const {fncShowPop, fncClosePop} = usePopContext();
	const {jsonApiAction} = useApi();
	const {isLogin} = useUserContext();
	const {fncRouteStart} = useLoadingContext();

	// 결과
	const [result, setResult] = useState(false);

	// 파라메타
	const [valid, setValid] = useState({});
	const [params, setParams] = useState({
		cdrnNm: '',
		cdrnWebMbrId: '',
		cdrnBrdt: '',
		atchFileList: [],
		agreChdpfPii: false,
	});

	// --Api
	// 자녀 상세
	const {mutate: mutQueryChildDetail} = useMutation({
		mutationKey: ['mutQueryChildDetail'],
		mutationFn: (payload) => jsonApiAction(apiChildRegList, payload),
		onSuccess: (res) => {
			if(res?.length) {
				const detail  = res[0];
				setParams({
					cdrnNm: detail.cdrnNm,
					cdrnWebMbrId: detail.cdrnWebMbrId,
					cdrnBrdt: detail.cdrnBrdt.trim(),
					atchFileList: detail.atchFileList
				});
			}
		}
	})

	// 등록
	const {mutate: mutCreateChildproof} = useMutation({
		mutationKey: ['mutCreateChildproof'],
		mutationFn: (payload) => jsonApiAction(apiCreateChild, {...payload, __localHandle: true}),
		onSuccess: (res) => {
			if(res > 0) {
				setResult(true);
				fncScrollToTop();
			} else {
				setResult(false);
			}
		},
		onError: (error) => {
			fncShowPop({
				mainText: error.message,
				primaryText: '확인',
				onClickPrimary: () => fncClosePop(),
			});
		}
	})

	// 수정
	const {mutate: mutUpdateChildproof} = useMutation({
		mutationKey: ['mutUpdateChildproof'],
		mutationFn: (payload) => jsonApiAction(apiUpdateChild, {...payload, dmndNo: id, __localHandle: true}),
		onSuccess: (res) => {
			if(res > 0) {
				setResult(true);
				fncScrollToTop();
			} else {
				setResult(false);
			}
		},
		onError: (error) => {
			fncShowPop({
				mainText: error.message,
				primaryText: '확인',
				onClickPrimary: () => fncClosePop(),
			});
		}
	})

	// 조회(개인정보 수집 및 이용)
	const {mutate: mutQueryChdpfPii, data: termChdpfPii} = useMutation({
		mutationKey: ['mutQueryChdpfPii'],
		mutationFn: (payload) => jsonApiAction(apiTerms, payload),
	})

	useLayoutEffect(() => {
		if (isAccApp) fncFocusLayout();
		if (isMobile) {
			fncChangeMoHeader({
				type: 'back',
				title: '내 자녀 등록 / 수정'
			})
		}

		return () => {
			if(isAccApp) fncCleanStoreRNPayload();
		}
	}, [isMobile, isAccApp, reloadKey])

	// 수정모드일때 상세 조회
	useLayoutEffect(() => {
		if(isLogin && id) {
			mutQueryChildDetail({dmndNo: id});
		}
	}, [id, isLogin]);

	useLayoutEffect(() => {
		if(process.env.NEXT_PUBLIC_PII_CHDPF) {
			mutQueryChdpfPii({trmsTypeCd: process.env.NEXT_PUBLIC_PII_CHDPF});
		}
	}, []);

	// 다음 단계 허용 체크
	const [blockNext, setBlockNext] = useState(true);
	useLayoutEffect(() => {
		let defined = fncAllDefined([
			params.cdrnNm,
			params.cdrnWebMbrId,
			params.cdrnBrdt,
			params.atchFileList?.length > 0,
			params.agreChdpfPii
		]);

		setBlockNext(!defined);

	}, [params]);

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
		setParams({
			...params,
			[e.target.id]: e.target.value
		})
	}

	// 파일 업로드
	const fncUpdateUploaded = (files) => {
		setParams({...params, atchFileList: files});
	}

	// 등록/수정
	const fncSave = () => {
		const rules = {
			cdrnNm: [
				{type: VALIDATE_RULES.ALPHA},
			],
			cdrnWebMbrId: [
				{type: VALIDATE_RULES.NUMERIC_AND_ALPHA},
			],
			cdrnBrdt: [
				{type: VALIDATE_RULES.NUMERIC},
				{type: VALIDATE_RULES.MIN_LENGTH, value: 8},
				{type: VALIDATE_RULES.MAX_LENGTH, value: 8},
				{type: VALIDATE_RULES.MIN_AGE, value: 6},
				{type: VALIDATE_RULES.MAX_AGE, value: 14},
			],
			atchFileList: [
				{type: VALIDATE_RULES.FILE_MIN_LENGTH, value: 1},
				{type: VALIDATE_RULES.FILE_MAX_LENGTH, value: 2},
			]
		}

		const res = validate(params, rules);
		if(Object.keys(res).length === 0) {
			if(id) mutUpdateChildproof(params);
			else mutCreateChildproof(params);
		} else {
			setValid(res);
			if(res['atchFileList']){
				fncShowPop({
					mainText: '첨부된 파일이 없습니다.',
					primaryText: '확인',
					onClickPrimary: () => fncClosePop(),
				});
			}
			fncScrollToTop();
		}
	}

	// 약관 동의 업데이트
	const fncUpdateObj = (obj) => {
		setParams({
			...params,
			...obj
		})
	}

	// 이동: 이전
	const fncGoBack = () => {
		router.back();
	}

	// 이동: 홈
	const fncGoHome = () => {
		const targetUri = RouteConfig.HOME.PATH;
		fncRouteStart(targetUri);
		router.replace(targetUri);
	}

	// 이동: 목록
	const fncGoList = () => {
		const targetUri = RouteConfig.CHILDPROOF.PATH;
		fncRouteStart(targetUri);
		router.replace(targetUri);
	}

	const fncHandlers = {
		goHome: fncGoHome,
		goBack: fncGoBack,
		goList: fncGoList,
		changeInput: fncChangeInput,
		updateUploaded: fncUpdateUploaded,
		save: fncSave,
		updateObj: fncUpdateObj,
	}

	const fncCallbackEvent = (fncName, variable, payload = {}) => {
		const fnc = fncHandlers[fncName];
		if (typeof fnc === 'function') return fnc(variable, payload);
	}

	if (isMobile) return (
		<MoMyChildproofRegister
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...params,
				valid,
				result,
				termChdpfPii,
				blockNext
			}}
		/>
	);
	else return (
		<DtMyChildproofRegister
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...params,
				valid,
				result,
				termChdpfPii,
				blockNext
			}}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F248 ~ UI-CRM-F249
 */
DtMyChildproofRegister.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function DtMyChildproofRegister({data, fncCallbackEvent}) {
	return (
		<main id={'my'} className={'body-wrap-618 childproof-wrap'} aria-labelledby={'page-name-dt'}>
			{
				!data.result && (
					<>
						<Breadcrumb addPaths={[]} />
						<h1 id={'page-name-dt'} className={'page-title'}>
							내 자녀 등록 / 수정
						</h1>
						<p className={'page-sub-title'} aria-live={'polite'}>
							등록할 자녀의 정보를 입력해 주세요
						</p>
					</>
				)
			}
			{
				data.result ? (
					<ChildproofRegisterStep2
						data={data}
						fncCallbackEvent={fncCallbackEvent}
					/>
				) : (
					<ChildproofRegisterStep1
						data={data}
						fncCallbackEvent={fncCallbackEvent}
					/>
				)
			}
		</main>
	)
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F479 ~ UI-CRM-F480
 */
MoMyChildproofRegister.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function MoMyChildproofRegister({data, fncCallbackEvent}) {
	return (
		<main id={'my'} className={'body-wrap-mobile-screen-height childproof-wrap'} aria-labelledby={'page-name-mo'}>
			<h1 id={'page-name-mo'} className={'sr-only'}>어린이 안심서비스 내 자녀 등록 / 수정</h1>
			<div className={'body-inner-wrap-mobile'}>
				{
					data.result ? (
						<ChildproofRegisterStep2
							data={data}
							fncCallbackEvent={fncCallbackEvent}
						/>
					) : (
						<ChildproofRegisterStep1
							data={data}
							fncCallbackEvent={fncCallbackEvent}
						/>
					)
				}
			</div>
		</main>
	)
}


