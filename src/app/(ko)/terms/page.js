'use client';

import React, {useLayoutEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import {useSearchParams} from 'next/navigation';
import {useMutation} from "@tanstack/react-query";
import dynamic from "next/dynamic";

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {useMoHeaderContext} from '@modules/context/MoHeaderContext';
import {useLoadingContext} from '@modules/context/LoadingContext';
import {apiTerms} from "@/app/_actions/common.action";
import {useApi} from "@modules/services/useApi";
import {usePopContext} from "@modules/context/PopContext";
import {policyOptions} from "@modules/consants/Options";

// components
import Breadcrumb from '@components/layout/Breadcrumb';
import Loading from "@/app/loading";

const ToastViewer = dynamic(() => import('@components/common/Editor'), {
	ssr: false,
	loading: () => <Loading />
})


/**
 * @description: 공통 약관 상세 화면 입니다.
 * @screenID:    UI-CRM-F210 ~ UI-CRM-F211, UI-CRM-F433 ~ UI-CRM-F434
 * @screenPath:  -
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function Terms() {
	
	const searchParams = useSearchParams();
	const type = searchParams.get('type');
	const {isMobile} = useScreenSizeContext();
	const {fncChangeMoHeader} = useMoHeaderContext();
	const {jsonApiAction} = useApi();
	const {fncShowPop, fncClosePop} = usePopContext();

	// Api
	// 약관 조회
	const {mutate: mutTerms, data: terms} = useMutation({
		mutationKey: ['mutTermService'],
		mutationFn: (payload) => jsonApiAction(apiTerms, payload),
		onError: () => {
			fncShowPop({
				mainText: '약관 정보 조회에 실패했습니다.',
				primaryText: '확인',
				onClickPrimary: () => fncClosePop(),
			})
		}
	})


	useLayoutEffect(() => {
		if(isMobile) {
			const termInfo = getTermInfo();
			fncChangeMoHeader({
				type: 'back',
				title: termInfo.koName ?? ''
			})
		}
	}, [isMobile])
	
	useLayoutEffect(() => {
		if(type) {
			const termInfo = getTermInfo();
			mutTerms({trmsTypeCd: termInfo?.id});
		}
	}, [type])
	
	// 약관 요약 정보
	const getTermInfo = () => {
		const termInfo = policyOptions.filter((el => el.type === type))?.[0] || {};
		return termInfo;
	}
	
	if (isMobile) return (
		<MoAbout
			data={{
				termContent: terms?.trmsDtlCn
			}}
		/>
	);
	else return (
		<DtAbout
			data={{
				termInfo: getTermInfo(),
				termContent: terms?.trmsDtlCn
			}}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F210 ~ UI-CRM-F211
 */
DtAbout.propTypes = {
	data: PropTypes.object,
};
export function DtAbout({data}) {
	return (
		<main className={'body-wrap-880'} aria-labelledby={'page-name-dt'}>
			<h1 id={'page-name-dt'} className={'sr-only'}>{data.termInfo?.koName || '약관'}</h1>
			<Breadcrumb addPaths={[data.termInfo?.koName]} />
			<div className={'w-full h-[90dvh] overflow-auto pr-5'}>
				<ToastViewer
					className={'text-dynamic-text-neutral-primary dark:text-dynamic-text-neutral-primary'}
					initialValue={data.termContent ?? ''}
				/>
			</div>
		</main>
	);
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F433 ~ UI-CRM-F434
 */
MoAbout.propTypes = {
	data: PropTypes.object,
};
export function MoAbout({data}) {
	return (
		<main className={'body-wrap-mobile'} aria-labelledby={'page-name-mo'}>
			<h1 id={'page-name-mo'} className={'sr-only'}>약관</h1>
			<div
				className={'overflow-y-auto prose max-w-none dark:text-dynamic-text-neutral-primary'}
				dangerouslySetInnerHTML={{__html: data.termContent ?? ''}}
			/>
		</main>
	);
}
