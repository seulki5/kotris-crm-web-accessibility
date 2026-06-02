'use client';

import React, {useLayoutEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {usePathname, useRouter} from 'next/navigation';
import {useMutation} from '@tanstack/react-query';

// modules
import {useMoHeaderContext} from '@modules/context/MoHeaderContext';
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {WithdrawalOptions} from '@modules/consants/Options';
import {RouteConfig} from '@modules/config/RouteConfig';
import {useLoadingContext} from '@modules/context/LoadingContext';
import {useUserContext} from '@modules/context/UserContext';
import {fncAllDefined, fncValiState, validate, VALIDATE_RULES} from '@modules/utils/ValidateUtils';
import {usePopContext} from '@modules/context/PopContext';
import {useApi} from '@modules/services/useApi';
import {apiCheckPswd, apiDelUser} from '@/app/_actions/user.action';
import {apiCardList} from '@/app/_actions/mypage.action';
import {useScrollContext} from '@modules/context/ScrollContext';
import {useWebContext} from "@modules/context/WebviewContext";
import {CODE} from "@modules/consants/Objects";

// components
import Breadcrumb from '@components/layout/Breadcrumb';
import CommentWarning from '@components/composite/CommentWarning';
import InputText from '@components/common/InputText';
import Select from '@components/common/Select';
import Textarea from '@components/common/Textarea';
import Button from '@components/common/Button';

// assets
import {Eye, EyeOff} from '@assets/icons/Svgs';


/**
 * @description: 회원 탈퇴 화면 입니다.
 * @screenID:    UI-CRM-F224, UI-CRM-F446
 * @screenPath:  홈 > 내 정보 > 회원 탈퇴
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function Withdrawal() {

	const router = useRouter();
	const pathname = usePathname();
	const {isMobile} = useScreenSizeContext();
	const {fncChangeMoHeader} = useMoHeaderContext();
	const {fncScrollToTop} = useScrollContext();
	const {fncLogout} = useUserContext();
	const {fncShowPop, fncClosePop} = usePopContext();
	const {jsonApiAction} = useApi();
	const {isLogin} = useUserContext();
	const {fncRouteStart} = useLoadingContext();
	const {fncEncode} = useUserContext();
	const {isAccApp, reloadKey, fncFocusLayout, backRNPath, fncPostRN} = useWebContext();

	// 비밀번호 보이기/숨기기
	const [showPassword, setShowPassword] = useState(false);

	// 다음 단계 가능 여부
	const [blockNext, setBlockNext] = useState(true);

	// 잔액
	const [totalBalance, setTotalBalance] = useState(0);

	// 파라미터
	const [valid, setValid] = useState({});
	const [params, setParams] = useState({
		webMbrPswdEncpt: '',        // 비밀번호
		whdwlRsnCd: '',             // 탈퇴 사유 코드
		whdwlRmrkCn: ''             // 기타 의견
	})

	// --Api
	// 카드 목록
	const {mutate: mutQueryCardList} = useMutation({
		mutationKey: ['mutQueryCardList'],
		mutationFn: () => jsonApiAction(apiCardList, {}),
		onSuccess: (res) => {
			if(res?.length) {
				let sum = res.reduce((sum, item) => {
					return [CODE.CARD_SEG_MO_PRE, CODE.CARD_SEG_MO_POST].includes(item.mypgCardSeCd) ? sum + item.blncSum : sum;
				}, 0);
				setTotalBalance(sum);
			}
		}
	})

	// 비밀번호 체크
	const {mutate: mutCheckPswd} = useMutation({
		mutationKey: ['mutDelUser'],
		mutationFn: (payload) => jsonApiAction(apiCheckPswd, {...payload, __localHandle: true}),
		onSuccess: async (res) => {
			if(res?.resYn === 'Y') {
				const encodedPwd = await fncEncode(params.webMbrPswdEncpt);
				if(!encodedPwd) return;
				mutDelUser({
					webMbrPswdEncpt: encodedPwd,
					whdwlRsnCd: params.whdwlRsnCd,
					whdwlRmrkCn: params.whdwlRmrkCn
				});
			} else {
				fncClosePop();
				setValid({
					webMbrPswdEncpt: '비밀번호가 일치하지 않습니다.  다시 입력해주세요.'
				})
			}
		},
		onError: (err) => {
			fncClosePop();
			setValid({
				webMbrPswdEncpt: '비밀번호가 일치하지 않습니다.  다시 입력해주세요.'
			})
		}
	})

	// 회원 탈퇴
	const {mutate: mutDelUser} = useMutation({
		mutationKey: ['mutDelUser'],
		mutationFn: (payload) => jsonApiAction(apiDelUser, payload),
		onSuccess: (res) => {
			if(res > 0) {
				fncShowPop({
					mainText: '탈퇴가 완료되었습니다.',
					tertiaryText: '',
					warningText: '',
					primaryText: '확인',
					onClickPrimary: () => {
						fncClosePop();

						if(isAccApp) {
							fncPostRN({
								id: 'WEB_LOGOUT',
								payload: {},
							})
						} else {
							fncLogout();
						}
					}
				})
			} else {
				fncClosePop();
			}
		}
	})

	useLayoutEffect(() => {
		isLogin && mutQueryCardList();
	}, [isLogin]);

	useLayoutEffect(() => {
		if (isAccApp) fncFocusLayout();
		if(isMobile) {
			fncChangeMoHeader({
				type: 'back',
				title: '회원 탈퇴'
			})
		}
	}, [isMobile, isAccApp, reloadKey])

	useLayoutEffect(() => {
		let defined = fncAllDefined([
			params.webMbrPswdEncpt,
			params.whdwlRsnCd,
		]);
		setBlockNext (!defined);
	}, [params]);

	// 비밀번호 보이기/숨기기
	const fncShowPassword = () => {
		setShowPassword(!showPassword);
	}

	// 탈퇴 사유 선택
	const fncSelectReason = (option) => {
		setParams({...params, whdwlRsnCd: option.id});
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
		if(Object.keys(valid).length > 0) fncDelValid(e.target.id);
		setParams({
			...params,
			[e.target.id]: e.target.value
		});
	}

	// 회원 탈퇴 버튼 클릭
	const fncHandleDel = () => {
		let rules = {
			webMbrPswdEncpt: [
				{type: VALIDATE_RULES.PASSWORD},
				{type: VALIDATE_RULES.MIN_LENGTH, value: 6},
				{type: VALIDATE_RULES.MAX_LENGTH, value: 20},
			],
			whdwlRsnCd: [
				{type: VALIDATE_RULES.MIN_LENGTH, value: 2},
				{type: VALIDATE_RULES.MAX_LENGTH, value: 2},
			]
		};

		const res = validate(params, rules);
		if(Object.keys(res).length === 0) {
			fncCheckRemains();
		} else {
			setValid(res);
			fncScrollToTop();
		}
	}

	const fncCheckRemains = () => {
		if(totalBalance < 1) {
			fncShowPop({
				mainText: '정말 탈퇴하시겠어요?',
				description: '탈퇴가 진행되면 24시간동안 재가입이 어려워요.',
				tertiaryText: '취소',
				onClickTertiary: () => fncClosePop(),
				warningText: '탈퇴하기',
				onClickWarning: () => fncDelUser()
			})
		} else {
			fncShowPop({
				mainText: '잔액이 남아있습니다.\n잔액 환불 후 탈퇴를 진행해주세요.',
				primaryText: '확인',
				onClickPrimary: () => fncClosePop()
			})
		}
	}

	// 회원탈퇴
	const fncDelUser = async () => {
		const encodedPwd = await fncEncode(params.webMbrPswdEncpt);
		if(!encodedPwd) return;
		mutCheckPswd({
			webMbrPswdEncpt: encodedPwd
		})
	}

	// 이동: 이전
	const fncGoBack = () => {
		if(![
				RouteConfig.HOME.PATH,
				RouteConfig.INFO.PATH,
				RouteConfig.CARD.PATH,
				RouteConfig.COUPON.PATH,
			].includes(pathname) &&
			pathname === backRNPath &&
			isAccApp
		) {
			return fncPostRN({
				id: 'WEB_GO_BACK',
				payload: {},
			})
		} else {
			router.back();
		}
	}

	// 이동: 홈
	const fndGoHome = () => {
		const targetUri = RouteConfig.HOME.PATH;
		fncRouteStart(targetUri);
		router.replace(targetUri);
	}

	const fncHandlers = {
		showPassword: fncShowPassword,
		selectReason: fncSelectReason,
		changeInput: fncChangeInput,
		handleDel: fncHandleDel,
		goBack: fncGoBack,
		goHome: fndGoHome,
	}

	const fncCallbackEvent = (fncName, variable, payload = {}) => {
		const fnc = fncHandlers[fncName];
		if (typeof fnc === 'function') return fnc(variable, payload);
	}

	if (isMobile) return (
		<MoWithdrawal
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...params,
				valid,
				blockNext,
				showPassword,
			}}
		/>
	);
	else return (
		<DtWithdrawal
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...params,
				valid,
				blockNext,
				showPassword,
			}}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F224
 */
DtWithdrawal.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function DtWithdrawal({data, fncCallbackEvent}) {

	const {userInfo} = useUserContext();

	return (
		<main id={'my'} className={'body-wrap-618'} aria-labelledby={'page-name-dt'}>
			<Breadcrumb addPaths={[]} />
			<div className={'mb-72'}>
				<div>
					<h1 id={'page-name-dt'} className={'page-title'}>
						회원 탈퇴
					</h1>
					<p className={'page-sub-title'}>
						탈퇴 진행을 위한 정보를 입력해 주세요
					</p>
				</div>
				<div className={'flex-col-center gap-36'}>
					<InputText
						size={'lg'}
						fitWidth={true}
						title={'아이디'}
						status={'default'}
						id={'webMbrId'}
						value={userInfo?.webMbrId}
						disabled={true}
					/>
					<InputText
						size={'lg'}
						fitWidth={true}
						title={'비밀번호'}
						essential={true}
						placeholder={'영문+숫자+특수문자 9~20자리'}
						inputType={data.showPassword ? 'text' : 'password'}
						allows={['alnum', 'pwChar']}
						maxLength={20}
						status={fncValiState('webMbrPswdEncpt', data.valid)}
						message={fncValiState('webMbrPswdEncpt', data.valid) === 'warning' && data.valid['webMbrPswdEncpt']}
						id={'webMbrPswdEncpt'}
						value={data.webMbrPswdEncpt}
						onChange={(e) => fncCallbackEvent('changeInput', e)}
						icon={data.showPassword ? <Eye /> : <EyeOff />}
						onClickIcon={() => fncCallbackEvent('showPassword')}
					/>
					<Select
						size={'lg'}
						options={WithdrawalOptions}
						title={'탈퇴사유'}
						essential={true}
						placeholder={'탈퇴 사유를 선택해 주세요'}
						status={fncValiState('whdwlRsnCd', data.valid)}
						value={data.whdwlRsnCd}
						onSelect={(option) => fncCallbackEvent('selectReason', option)}
					/>
					<Textarea
						size={'lg'}
						title={'기타 의견'}
						maxLength={200}
						placeholder={'서비스 개선 의견을 위한 귀중한 의견을 적어주세요!\n(200자 내외)'}
						status={fncValiState('whdwlRmrkCn', data.valid)}
						message={fncValiState('whdwlRmrkCn', data.valid) === 'warning' && data.valid['whdwlRmrkCn']}
						id={'whdwlRmrkCn'}
						value={data.whdwlRmrkCn}
						onChange={(e) => fncCallbackEvent('changeInput', e)}
					/>
					<CommentWarning
						title={'반드시 확인해주세요'}
						list={[
							{id: 'l1', textColor: 'text-dynamic-text-neutral-secondary', message: '회원탈퇴 신청을 하시면 서비스 이용이 중지되며, 24시간안에 재가입이 불가능합니다.'},
							{id: 'l2', textColor: 'text-dynamic-text-neutral-secondary', message: '회원탈퇴 신청일까지 사용하지 않은 Rail+ 포인트는 자동으로 소멸됩니다.'},
							{id: 'l3', textColor: 'text-dynamic-text-neutral-secondary', message: '회원 탈퇴 시, 할인카드 적용을 받던 카드는 일반요금으로 적용됩니다.'}
						]}
					/>
				</div>
			</div>
			<div className={'flex justify-center gap-12'}>
				<Button
					theme={'secondary'}
					size={'xl'}
					text={'취소'}
					customStyle={'w-[240px]'}
					onClick={() => fncCallbackEvent('goBack')}
				/>
				<Button
					theme={'delete'}
					size={'xl'}
					text={'회원 탈퇴'}
					customStyle={'w-[240px]'}
					disabled={data.blockNext}
					onClick={() => fncCallbackEvent('handleDel')}
				/>
			</div>
		</main>
	);
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F446
 */
MoWithdrawal.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function MoWithdrawal({data, fncCallbackEvent}) {

	const {userInfo} = useUserContext();

	return (
		<main id={'my'} className={'body-wrap-mobile-screen-height'} aria-labelledby={'page-name-mo'}>
			<h1 id={'page-name-mo'} className={'sr-only'}>회원 탈퇴</h1>
			<div className={'flex flex-col gap-40 mb-72'}>
				<p className={'page-title'} aria-hidden={true}>
					탈퇴 진행을 위한<br/>정보를 입력해 주세요
				</p>
				<div className={'flex-col-center gap-28'}>
					<InputText
						size={'md'}
						fitWidth={true}
						title={'아이디'}
						status={'default'}
						id={'webMbrId'}
						value={userInfo?.webMbrId}
						disabled={true}
					/>
					<InputText
						size={'md'}
						fitWidth={true}
						title={'비밀번호'}
						essential={true}
						placeholder={'영문+숫자+특수문자 9~20자리'}
						inputType={data.showPassword ? 'text' : 'password'}
						allows={['alnum', 'pwChar']}
						maxLength={20}
						status={fncValiState('webMbrPswdEncpt', data.valid)}
						message={fncValiState('webMbrPswdEncpt', data.valid) === 'warning' && data.valid['webMbrPswdEncpt']}
						id={'webMbrPswdEncpt'}
						value={data.webMbrPswdEncpt}
						onChange={(e) => fncCallbackEvent('changeInput', e)}
						icon={data.showPassword ? <Eye /> : <EyeOff />}
						onClickIcon={() => fncCallbackEvent('showPassword')}
					/>
					<Select
						size={'md'}
						options={WithdrawalOptions}
						title={'탈퇴사유'}
						essential={true}
						placeholder={'탈퇴 사유를 선택해 주세요'}
						status={fncValiState('whdwlRsnCd', data.valid)}
						value={data.whdwlRsnCd}
						onSelect={(option) => fncCallbackEvent('selectReason', option)}
					/>
					<Textarea
						size={'md'}
						title={'기타 의견'}
						maxLength={200}
						placeholder={'서비스 개선 의견을 위한 귀중한 의견을 적어주세요!\n(200자 내외)'}
						status={fncValiState('whdwlRmrkCn', data.valid)}
						message={fncValiState('whdwlRmrkCn', data.valid) === 'warning' && data.valid['whdwlRmrkCn']}
						id={'whdwlRmrkCn'}
						value={data.whdwlRmrkCn}
						onChange={(e) => fncCallbackEvent('changeInput', e)}
					/>
					<CommentWarning
						title={'반드시 확인해주세요'}
						list={[
							{id: 'l1', textColor: 'text-dynamic-text-neutral-secondary', message: '회원탈퇴 신청을 하시면 서비스 이용이 중지되며, 24시간안에 재가입이 불가능합니다.'},
							{id: 'l2', textColor: 'text-dynamic-text-neutral-secondary', message: '회원탈퇴 신청일까지 사용하지 않은 Rail+ 포인트는 자동으로 소멸됩니다.'},
							{id: 'l3', textColor: 'text-dynamic-text-neutral-secondary', message: '회원 탈퇴 시, 할인카드 적용을 받던 카드는 일반요금으로 적용됩니다.'}
						]}
					/>
				</div>
			</div>
			<div className={'flex justify-center gap-12'}>
				<Button
					theme={'secondary'}
					size={'lg'}
					text={'취소'}
					customStyle={'w-full'}
					onClick={() => fncCallbackEvent('goBack')}
				/>
				<Button
					theme={'delete'}
					size={'lg'}
					text={'회원 탈퇴'}
					customStyle={'w-full'}
					disabled={data.blockNext}
					onClick={() => fncCallbackEvent('handleDel')}
				/>
			</div>
		</main>
	)
}
