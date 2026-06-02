'use client'

import React, {useEffect, useLayoutEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {usePathname, useRouter} from 'next/navigation';
import {useMutation} from "@tanstack/react-query";

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {useMoHeaderContext} from '@modules/context/MoHeaderContext';
import {RouteConfig} from '@modules/config/RouteConfig';
import {useLoadingContext} from '@modules/context/LoadingContext';
import {useApi} from "@modules/services/useApi";
import {apiViewDiscount} from "@/app/_actions/mypage.action";
import {useUserContext} from "@modules/context/UserContext";
import {usePopContext} from "@modules/context/PopContext";
import {CODE} from "@modules/consants/Objects";
import {useWebContext} from "@modules/context/WebviewContext";

// components
import Breadcrumb from '@components/layout/Breadcrumb';
import TemplateQueryDiscountStudent from "@components/composite/TemplateQueryDiscountStudent";


/**
 * @description: (회원) 청소년 연령 초과 학생 할인 조회 화면입니다.
 * @screenID:    UI-CRM-F245, UI-CRM-F478
 * @screenPath:  홈 > 마이페이지 > 할인등록 > 청소년 연령 초과 학생 할인 등록정보
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function MyDiscountStudent() {

	const router = useRouter();
	const pathname = usePathname();
	const {isMobile} = useScreenSizeContext();
	const {fncChangeMoHeader} = useMoHeaderContext();
	const {jsonApiAction} = useApi();
	const {isLogin} = useUserContext();
	const {fncRouteStart} = useLoadingContext();
	const {fncErrorPop} = usePopContext();
	const {isAccApp, backRNPath, reloadKey, fncFocusLayout, fncPostRN} = useWebContext();

	// 상세
	const [dscntDetail, setDscntDetail] = useState(null);

	// --Api
	// 조회
	const {mutate: mutQueryDiscountStudent} = useMutation({
		mutationKey: ['mutQueryNonDiscountStudent'],
		mutationFn: () => jsonApiAction(apiViewDiscount, {dscntAplySe: CODE.DC_STUDENT, memberYn: 'Y'}),
		onSuccess: (res) => {
			if(res?.length > 0){
				setDscntDetail(res[0]);
			} else {
				fncErrorPop();
			}
		}
	})

	useEffect(() => {
		isLogin && mutQueryDiscountStudent();
	}, [isLogin]);

	useLayoutEffect(() => {
		if(isAccApp) fncFocusLayout()
		if(isMobile) {
			fncChangeMoHeader({
				type: 'back',
				title: '청소년 연령초과 학생 할인'
			})
		}
	}, [isMobile, isAccApp, reloadKey])

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

	// 이동: 등록/수정
	const fncGoRegister = () => {
		const targetUri = `${RouteConfig.DISCOUNT_STUDENT_REGISTER.PATH}?no=${dscntDetail.cardNoEncpt}`;
		fncRouteStart(targetUri);
		router.push(targetUri);
	}

	const fncHandlers = {
		goBack: fncGoBack,
		goRegister: fncGoRegister,
	}

	const fncCallbackEvent = (fncName, variable, payload = {}) => {
		const fnc = fncHandlers[fncName];
		if (typeof fnc === 'function') return fnc(variable, payload);
	}

	if (isMobile) return (
		<MoMyDiscountStudent
			fncCallbackEvent={fncCallbackEvent}
			data={{
				result: dscntDetail
			}}
		/>
	);
	else return (
		<DtMyDiscountStudent
			fncCallbackEvent={fncCallbackEvent}
			data={{
				result: dscntDetail
			}}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F245
 */
DtMyDiscountStudent.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function DtMyDiscountStudent({data, fncCallbackEvent}) {
	return (
		<main id={'my'} className={'body-wrap-618 discount-wrap'} aria-labelledby={'page-name-dt'}>
			<Breadcrumb addPaths={[]} />
			<TemplateQueryDiscountStudent
				fncCallbackEvent={fncCallbackEvent}
				data={data.result}
			/>
		</main>
	)
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F478
 */
MoMyDiscountStudent.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function MoMyDiscountStudent({data, fncCallbackEvent}) {
	return (
		<main id={'my'} className={'body-wrap-mobile-screen-height discount-wrap'} aria-labelledby={'page-name-mo'}>
			<TemplateQueryDiscountStudent
				fncCallbackEvent={fncCallbackEvent}
				data={data.result}
			/>
		</main>
	)
}


