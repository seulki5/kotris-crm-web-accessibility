'use client'

import React, {useLayoutEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {usePathname, useRouter} from 'next/navigation';
import {useMutation} from "@tanstack/react-query";

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {useMoHeaderContext} from '@modules/context/MoHeaderContext';
import {RouteConfig} from '@modules/config/RouteConfig';
import {useLoadingContext} from '@modules/context/LoadingContext';
import {usePopContext} from "@modules/context/PopContext";
import {useApi} from "@modules/services/useApi";
import {apiDelDiscountTeen, apiViewDiscount} from "@/app/_actions/mypage.action";
import {CODE} from "@modules/consants/Objects";
import {useUserContext} from "@modules/context/UserContext";
import {useWebContext} from "@modules/context/WebviewContext";

// components
import Breadcrumb from '@components/layout/Breadcrumb';
import TemplateQueryDiscountTeen from "@components/composite/TemplateQueryDiscountTeen";


/**
 * @description: (회원) 국가신분증 등록정보 입니다.
 * @screenID:    UI-CRM-F242, UI-CRM-F476
 * @screenPath:  홈 > 마이페이지 > 할인등록 > 국가신분증 등록정보
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function MyDiscountTeenager() {

	const router = useRouter();
	const pathname = usePathname();
	const {isMobile} = useScreenSizeContext();
	const {fncChangeMoHeader} = useMoHeaderContext();
	const {fncShowPop, fncClosePop, fncErrorPop} = usePopContext();
	const {jsonApiAction} = useApi();
	const {isLogin, fncEncode} = useUserContext();
	const {fncRouteStart} = useLoadingContext();
	const {isAccApp, backRNPath, reloadKey, fncFocusLayout, fncPostRN} = useWebContext();
	
	// 상세
	const [dscntDetail, setDscntDetail] = useState(null);

	// --Api
	// 조회
	const {mutate: mutQueryDiscountTeen} = useMutation({
		mutationKey: ['mutQueryDiscountTeen'],
		mutationFn: () => jsonApiAction(apiViewDiscount, {dscntAplySe: CODE.DC_TEEN, memberYn: 'Y'}),
		onSuccess: (res) => {
			if(res?.length > 0){
				setDscntDetail(res[0]);
			} else {
				fncErrorPop();
			}
		}
	})

	// 해지
	const {mutate: mutDelDiscountTeen} = useMutation({
		mutationKey: ['mutQueryDiscountTeen'],
		mutationFn: (payload) => jsonApiAction(apiDelDiscountTeen, {
			...payload,
			memberYn: 'Y',
			__localHandle: true
		}),
		onSuccess: (res) => {
			if(res > 0) {
				fncShowPop({
					mainText: '해지가 완료되었습니다.',
					primaryText: '해지',
					onClickPrimary: () => {
						fncClosePop();
						fncGoDiscount();
					},
				})
			} else {
				fncShowPop({
					mainText: '해지중 오류가 발생했습니다.',
					primaryText: '확인',
					onClickPrimary: () => fncClosePop()
				})
			}
		},
		onError: () => {
			fncShowPop({
				mainText: '해지중 오류가 발생했습니다.',
				primaryText: '확인',
				onClickPrimary: () => fncClosePop()
			})
		}
	})

	useLayoutEffect(() => {
		isLogin && mutQueryDiscountTeen();
	}, [isLogin]);

	useLayoutEffect(() => {
		if(isAccApp) fncFocusLayout();
		if(isMobile) {
			fncChangeMoHeader({
				type: 'back',
				title: '국가신분증'
			})
		}
	}, [isMobile, isAccApp, reloadKey])

	// 팝업 열기/닫기
	const fncShowDelCheckPop = () => {
		fncShowPop({
			mainText: '국가신분증 등록을 해지하시겠습니까?',
			description: '해지 시 할인 혜택이 사라집니다.',
			tertiaryText: '취소',
			onClickTertiary: () => fncClosePop(),
			warningText: '해지',
			onClickWarning: () => {
				fncClosePop();
				fncDeleteCard();
			},
		})
	}

	// 카드 해지
	const fncDeleteCard = async () => {
		if(!dscntDetail.cardNoEncpt || !dscntDetail.custBrdt) return;
		const encoded = await fncEncode(dscntDetail.cardNoEncpt);
		if(!encoded) return;
		mutDelDiscountTeen({
			cardNoEncpt: encoded,
			custBrdt: dscntDetail.custBrdt
		})
	}


	// 이동: 이전
	const fncGoBack = () => {
		if(isAccApp && pathname === backRNPath) {
			return fncPostRN({
				id: 'WEB_GO_BACK',
				payload: {},
			})
		}

		router.back();
	}

	// 이동: 할인등록
	const fncGoDiscount = () => {
		const targetUri = RouteConfig.DISCOUNT.PATH;
		fncRouteStart(targetUri);
		router.replace(targetUri);
	}

	const fncHandlers = {
		goBack: fncGoBack,
		goDiscount: fncGoDiscount,
		showDelCheckPop: fncShowDelCheckPop,
		deleteCard: fncDeleteCard
	}

	const fncCallbackEvent = (fncName, variable, payload = {}) => {
		const fnc = fncHandlers[fncName];
		if (typeof fnc === 'function') return fnc(variable, payload);
	}

	if (isMobile) return (
		<MoMyDiscountTeenager
			fncCallbackEvent={fncCallbackEvent}
			data={{
				result: dscntDetail
			}}
		/>
	);
	else return (
		<DtMyDiscountTeenager
			fncCallbackEvent={fncCallbackEvent}
			data={{
				result: dscntDetail
			}}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F242
 */
DtMyDiscountTeenager.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function DtMyDiscountTeenager({data, fncCallbackEvent}) {
	return (
		<main id={'my'} className={'body-wrap-618 discount-wrap'} aria-labelledby={'page-name-dt'}>
			<Breadcrumb addPaths={[]} />
			<TemplateQueryDiscountTeen
				fncCallbackEvent={fncCallbackEvent}
				data={data.result}
			/>
		</main>
	)
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F476
 */
MoMyDiscountTeenager.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function MoMyDiscountTeenager({data, fncCallbackEvent}) {
	return (
		<main id={'my'} className={'body-wrap-mobile-screen-height discount-wrap'} aria-labelledby={'page-name-mo'}>
			<TemplateQueryDiscountTeen
				fncCallbackEvent={fncCallbackEvent}
				data={data.result}
			/>
		</main>
	)
}


