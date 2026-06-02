'use client'

import React, {useLayoutEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {useMutation} from '@tanstack/react-query';
import Cookies from "js-cookie";

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {useMoHeaderContext} from '@modules/context/MoHeaderContext';
import {useApi} from '@modules/services/useApi';
import {apiUpdateExternalSiren} from '@/app/_actions/mypage.action';
import {usePopContext} from '@modules/context/PopContext';

// components
import TaxDeductionPop, {mapResultMessage} from '@components/popup/TaxDeductionPop';
import {useUserContext} from "@modules/context/UserContext";


/**
 * @description: 외부 링크 소득공제 화면 입니다.
 * @screenID:    -
 * @screenPath:  -
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
ExtrnTaxClient.propTypes = {
	identityParams: PropTypes.object
};
export default function ExtrnTaxClient({ identityParams = {} }) {

	const pathname = usePathname();
	const router = useRouter();
	const {isMobile} = useScreenSizeContext();
	const {fncChangeMoHeader} = useMoHeaderContext();
	const {jsonApiAction} = useApi();
	const {fncShowPop, fncClosePop} = usePopContext();
	const {fncEncode} = useUserContext();

	const searchParams = useSearchParams();
	const returnUrl = searchParams.get('returnUrl');

	// 소득공제 결과
	const [moRealnameRes, setMoRealnameRes] = useState(null);

	// --Api
	// 등록
	const {mutate: mutRegNonMemberTaxDeduction} = useMutation({
		mutationKey: ['mutRegNonMemberTaxDeduction'],
		mutationFn: (payload) => jsonApiAction(apiUpdateExternalSiren, {...payload, __localHandle: true}),
		onSuccess: async (res) => {
			if(res?.resCd === '0000') {
				await fncReturnCallback("0000", res?.resMsg)
			} else {
				await fncReturnCallback(res?.resCd, res?.resMsg)
			}
		},
		onError: async (e) => {
			await fncReturnCallback("9999", e.message)
		}
	})

	useLayoutEffect(() => {
		if(isMobile) {
			fncChangeMoHeader({
				type: 'none',
				title: 'Rail+ 소득공제'
			})
		}
	}, [isMobile])

	// 반응형 실명인증
	useLayoutEffect(() => {
		const cookie = Cookies.get('crm-verify');

		if(
			isMobile &&
			(identityParams?.type === 'realname') &&
			identityParams?.result &&
			cookie
		) {
			const storedCookie = cookie ? JSON.parse(cookie) : {};
			if([1, "1"].includes(identityParams.result)) {
				setMoRealnameRes({
					type: identityParams.type,
					result: identityParams.result,
					redirectType: identityParams.redirectType,
					popParams: storedCookie?.popParams || {}
				});
			} else {
				Cookies.remove('crm-verify');
				fncShowPop({
					mainText: mapResultMessage(identityParams.result),
					primaryText: '확인',
					onClickPrimary: () => fncClosePop()
				})
			}
		}
	}, [isMobile, identityParams]);
	
	// 소득공제 취소
	const fncCancel = () => {
		fncShowPop({
			mainText: '소득공제 등록을 취소하시겠어요?',
			tertiaryText: '등록 취소',
			onClickTertiary: async () => {
				// fncClosePop();
				await fncReturnCallback("0001");
			},
			primaryText: '계속 등록하기',
			onClickPrimary: () => {
				fncClosePop();
			}
		})
	}

	// 소득공제 등록
	const fncDone = async (obj) => {
		mutRegNonMemberTaxDeduction({
			...obj,
			cardNoEncpt : await fncEncode(obj.cardNo),
		});
	}

	const fncReturnCallback = async (retCode, message) => {
		const retMsgOptions = {
			"0000": "성공",
			"0001": "사용자 취소",
			"0002": "실패",
			"9999": "시스템 에러"
		}

		if(!returnUrl) {
			return fncShowPop({
				mainText: "returnUrl이(가) 없습니다.",
				tertiaryText: '',
				primaryText: '확인',
				onClickPrimary: () => fncClosePop(),
			})
		}

		if(retCode === '0002' || retCode === '9999') {
			return fncShowPop({
				mainText: message,
				tertiaryText: '',
				primaryText: '확인',
				onClickPrimary: () => fncClosePop(),
			})
		}

		const callbackUrl = `${returnUrl}/callback?RET_CODE=${retCode}&RET_MSG=${retMsgOptions[retCode]}`;
		router.replace(callbackUrl);
	}

	return (
		<main id={'my'} className={'body-wrap-mobile-screen-height'} aria-labelledby={'page-name-mo'}>
			<h1 id={'page-name-mo'} className={'sr-only'}>소득공제 등록</h1>
			<TaxDeductionPop
				store={{
					moRealnameRes: moRealnameRes,
					returnUrl: returnUrl,
				}}
				onClose={fncCancel}
				onDone={(obj) => fncDone(obj)}
			/>
		</main>
	)
}