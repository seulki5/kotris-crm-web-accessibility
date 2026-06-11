'use client'

import React, {useLayoutEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {useRouter, useSearchParams} from 'next/navigation';
import moment from 'moment';
import {useMutation} from '@tanstack/react-query';

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {useMoHeaderContext} from '@modules/context/MoHeaderContext';
import {RouteConfig} from '@modules/config/RouteConfig';
import {useLoadingContext} from '@modules/context/LoadingContext';
import {useWebContext} from '@modules/context/WebviewContext';
import {usePopContext} from '@modules/context/PopContext';
import {useApi} from '@modules/services/useApi';
import {apiChildRegList, apiDelChild} from '@/app/_actions/mypage.action';
import {CODE, FindChildproofStatusBadge} from '@modules/consants/Objects';
import {toMomentFrom14} from '@modules/utils/DateUtils';
import {useUserContext} from "@modules/context/UserContext";

// components
import Breadcrumb from '@components/layout/Breadcrumb';
import Button from '@components/common/Button';
import FileDownload from '@components/composite/FileDownload';

// assets
import {ArrowLeft} from '@assets/icons/Svgs';

// const
const childApprovedCd = CODE.CHILDPROOF_APPROVED;


/**
 * @description: 어린이 안심서비스 내 자녀 등록 현황 상세 화면 입니다.
 * @screenID:    UI-CRM-F247-02, UI-CRM-F513
 * @screenPath:  홈 > 마이페이지 > 어린이 안심서비스 > 내 자녀 등록현황
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function MyChildproofDetail() {

	const router = useRouter();
	const searchParams = useSearchParams();
	const id = searchParams.get('id');
	const {isMobile} = useScreenSizeContext();
	const {isAccApp, reloadKey, fncFocusLayout} = useWebContext();
	const {fncChangeMoHeader} = useMoHeaderContext();
	const {fncShowPop, fncClosePop} = usePopContext();
	const {jsonApiAction} = useApi();
	const {isLogin} = useUserContext();
	const {fncRouteStart} = useLoadingContext();

	// 자녀 정보
	const [childInfo, setChildInfo] = useState({});

	// --Api
	// 자녀 상세
	const {mutate: mutQueryChildDetail} = useMutation({
		mutationKey: ['mutQueryChildDetail'],
		mutationFn: (payload) => jsonApiAction(apiChildRegList, payload),
		onSuccess: (res) => {
			if(res?.length) {
				setChildInfo(res[0]);
			}
		}
	})

	// 등록된 자녀 삭제
	const {mutate: mutDelChild} = useMutation({
		mutationKey: ['mutQueryDiscountTeen'],
		mutationFn: () => jsonApiAction(apiDelChild, {dmndNo: id, __localHandle: true}),
		onSuccess: (res) => {
			if(res > 0) {
				fncShowPop({
					mainText: '해지가 완료되었습니다.',
					primaryText: '완료',
					onClickPrimary: () => {
						fncClosePop();
						fncGoChildproof();
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
		if(id && isLogin) mutQueryChildDetail({dmndNo: id})
	}, [id, isLogin]);

	useLayoutEffect(() => {
		if (isAccApp) fncFocusLayout();
		if (isMobile) {
			fncChangeMoHeader({
				type: 'back',
				title: '내 자녀 등록현황'
			})
		}
	}, [isMobile, isAccApp, reloadKey])

	// 팝업
	const fncShowDelCheckPop = () => {
		fncShowPop({
			mainText: '어린이 안심서비스를 해지하시겠어요?',
			tertiaryText: '취소',
			onClickTertiary: () => fncClosePop(),
			warningText: '해지',
			onClickWarning: () => {
				fncClosePop();
				fncDelChildproof();
			},
		})
	}

	// 어린이 안심서비스 해지
	const fncDelChildproof = () => {
		mutDelChild();
	}

	// 이동: 이전
	const fncGoBack = () => {
		router.back();
	}

	// 이동: 등록/수정
	const fncGoRegister = () => {
		const targetUri = `${RouteConfig.CHILDPROOF_REGISTER.PATH}?id=${id}`;
		fncRouteStart(targetUri)
		router.push(targetUri);
	}

	// 이동: 어린이 안심서비스
	const fncGoChildproof = () => {
		const targetUri = RouteConfig.CHILDPROOF.PATH;
		fncRouteStart(targetUri)
		router.push(targetUri);
	}

	const fncHandlers = {
		goBack: fncGoBack,
		goRegister: fncGoRegister,
		goChildproof: fncGoChildproof,
		showDelCheckPop: fncShowDelCheckPop,
	}

	const fncCallbackEvent = (fncName, variable, payload = {}) => {
		const fnc = fncHandlers[fncName];
		if (typeof fnc === 'function') return fnc(variable, payload);
	}

	if (isMobile) return (
		<MoMyChildproofDetail
			fncCallbackEvent={fncCallbackEvent}
			data={{
				result: childInfo
			}}
		/>
	);
	else return (
		<DtMyChildproofDetail
			fncCallbackEvent={fncCallbackEvent}
			data={{
				result: childInfo
			}}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F247-02
 */
DtMyChildproofDetail.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function DtMyChildproofDetail({data, fncCallbackEvent}) {
	return (
		<main id={'my'} className={'body-wrap-618 childproof-wrap'} aria-labelledby={'page-name-dt'}>
			<h1 id={'page-name-dt'} className={'sr-only'}>
				{`자녀 ${data.result?.cdrnNm || '-'}의 등록 현황`}
			</h1>
			<Breadcrumb addPaths={[]} />
			<button
				className={'back-arrow-wrap'}
				aria-label={'이전페이지로 이동'}
				onClick={() => fncCallbackEvent('goBack')}
				onKeyDown={(e) => {
					if(e.key === 'Enter' || e.key === ' ') {
						fncCallbackEvent('goBack');
					}
				}}
			>
				<div className={'icon-wrap'}>
					<ArrowLeft
						width={16} height={16}
						color={'text-dynamic-icon-neutral-primary'}
					/>
				</div>
				<p>이전으로</p>
			</button>
			<div className={'child-name'}>
				<p>{data.result?.cdrnNm || '-'}</p>
				{data.result?.stlmSttsCd && FindChildproofStatusBadge[data.result.stlmSttsCd]}
			</div>
			<div className={'inquiry-table-wrap'}>
				<dl>
					<div>
						<dt>자녀 아이디</dt>
						<dd>{data.result?.cdrnWebMbrId || '-'}</dd>
					</div>
					<div>
						<dt>자녀 생년월일</dt>
						<dd>{moment(data.result?.cdrnBrdt, 'YYYYMMDD').format('YYYY-MM-DD')}</dd>
					</div>
					<div>
						<dt>첨부파일</dt>
						<dd className={'attachment attachment-wrap'}>
							{
								data.result?.atchFileList?.map((file) => (
									<FileDownload
										type={'text'}
										name={file.atchFileNm}
										fileId={file.atchFileId}
										key={file.atchFileId}
										fileName={file.atchFileNm}
									/>
								))
							}
						</dd>
					</div>
					<div>
						<dt>등록일자</dt>
						<dd>{moment(toMomentFrom14(data.result?.frstRegDt)).format('YYYY-MM-DD')}</dd>
					</div>
				</dl>
				{
					(data.result?.rjctRsnCn && data.result?.stlmSttsCd === CODE.CHILDPROOF_REJECTED) && (
						<>
							<div className={'divider'} role={'none'} />
							<div className={'reject-wrap'} aria-label={'반려 사유'}>
								<p>반려 사유</p>
								<p>{data.result.rjctRsnCn}</p>
							</div>
						</>
					)
				}
			</div>
			<div className={'page-bottom-button-wrap'}>
				{
					data.result?.stlmSttsCd === childApprovedCd ? (
						<Button
							theme={'delete'}
							size={'xl'}
							text={'해지'}
							ariaLabel={'해지'}
							customStyle={'w-[240px]'}
							onClick={() => fncCallbackEvent('showDelCheckPop')}
						/>
					) : (
						<Button
							theme={'primary'}
							size={'xl'}
							text={data.result?.stlmSttsCd === CODE.CHILDPROOF_REJECTED ? '재신청' : '수정'}
							ariaLabel={data.result?.stlmSttsCd === CODE.CHILDPROOF_REJECTED ? '재신청' : '수정'}
							customStyle={'w-[240px]'}
							onClick={() => fncCallbackEvent('goRegister')}
						/>
					)
				}
			</div>
		</main>
	)
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F513
 */
MoMyChildproofDetail.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function MoMyChildproofDetail({data, fncCallbackEvent}) {
	return (
		<main id={'my'} className={'body-wrap-mobile-screen-height childproof-wrap'} aria-labelledby={'page-name-mo'}>
			<h1 id={'page-name-mo'} className={'sr-only'}>
				{`자녀 ${data.result?.cdrnNm || '-'}의 등록 현황`}
			</h1>
			<div className={'inquiry-table-wrap page-bottom-space'}>
				<div className={'child-name'}>
					<p>{data.result?.cdrnNm || '-'}</p>
					{data.result?.stlmSttsCd && FindChildproofStatusBadge[data.result.stlmSttsCd]}
				</div>
				<dl>
					<div>
						<dt>자녀 아이디</dt>
						<dd>{data.result?.cdrnWebMbrId || '-'}</dd>
					</div>
					<div>
						<dt>자녀 생년월일</dt>
						<dd>{moment(data.result?.cdrnBrdt, 'YYYYMMDD').format('YYYY-MM-DD')}</dd>
					</div>
					<div>
						<dt>첨부파일</dt>
						<dd className={'attachment attachment-wrap'} style={{marginTop: 0}}>
							{
								data.result?.atchFileList?.map((file) => (
									<FileDownload
										type={'text'}
										name={file.atchFileNm}
										fileId={file.atchFileId}
										key={file.atchFileId}
										fileName={file.atchFileNm}
									/>
								))
							}
						</dd>
					</div>
					<div>
						<dt>등록일자</dt>
						<dd>{moment(toMomentFrom14(data.result?.frstRegDt)).format('YYYY-MM-DD')}</dd>
					</div>
				</dl>
				{
					(data.result?.rjctRsnCn && data.result?.stlmSttsCd === CODE.CHILDPROOF_REJECTED) && (
						<>
							<div className={'divider'} role={'none'} />
							<div className={'reject-wrap'} aria-label={'반려 사유'}>
								<p>반려 사유</p>
								<p>{data.result.rjctRsnCn}</p>
							</div>
						</>
					)
				}
			</div>
			<div className={'page-bottom-button-wrap'}>
				{
					data.result?.stlmSttsCd === childApprovedCd ? (
						<Button
							theme={'delete'}
							size={'lg'}
							text={'해지'}
							ariaLabel={'해지'}
							customStyle={'w-full'}
							onClick={() => fncCallbackEvent('showDelCheckPop')}
						/>
					) : (
						<Button
							theme={'primary'}
							size={'lg'}
							text={'수정'}
							ariaLabel={'수정'}
							customStyle={'w-full'}
							onClick={() => fncCallbackEvent('goRegister')}
						/>
					)
				}
			</div>
		</main>
	)
}


