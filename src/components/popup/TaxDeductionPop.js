import React, {useCallback, useLayoutEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {FocusTrap} from 'focus-trap-react';
import {usePathname, useRouter} from "next/navigation";
import {useMutation} from "@tanstack/react-query";
import clsx from "clsx";
import Cookies from "js-cookie";
import moment from "moment";
import dynamic from "next/dynamic";

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {fncAllDefined, fncValiState, validate, VALIDATE_RULES} from "@modules/utils/ValidateUtils";
import {apiCreateSiren} from "@/app/_actions/mypage.action";
import {useApi} from "@modules/services/useApi";
import {usePopContext} from "@modules/context/PopContext";
import {useUserContext} from "@modules/context/UserContext";
import {apiTerms} from "@/app/_actions/common.action";
import {useWebContext} from "@modules/context/WebviewContext";
import {fncGetBaseUrl} from "@modules/services/api.service";

// components
import InputText from '@components/common/InputText';
import Button from '@components/common/Button';
import CommentInfo from '@components/composite/CommentInfo';
import {REDIRECT_TYPE} from "@components/composite/IdentityVerification";
import FieldTitle from "@components/composite/FieldTitle";
import Checkbox from "@components/common/Checkbox";
import TermsPop from "@components/popup/TermsPop";
import Loading from "@/app/loading";
const ToastViewer = dynamic(() => import('@components/common/Editor'), {
	ssr: false,
	loading: () => <Loading />
})

// assets
import {ArrowLeft, Check, X} from '@assets/icons/Svgs';
import {fncMaskCardNo} from "@modules/utils/StringUtils";

export const mapResultMessage = (code) => {
	switch (code) {
		case "1": return "성공";
		case "2":
		case "3": return "본인인증에 실패했습니다.";
		case "4": return "주민등록번호가 유효하지 않습니다.";
		case "5": return "시스템 장애가 발생했습니다.";
		case "7": return "명의도용 방지가 설정되어 있습니다.";
		default:  return "알 수 없는 오류가 발생했습니다.";
	}
}


/**
 * @description: 소득공제 등록 팝업 입니다.
 * @screenID:    UI-CRM-F228, UI-CRM-F456
 * @screenPath:  -
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
TaxDeductionPop.propTypes = {
	store: PropTypes.object,
	onClose: PropTypes.func,
	onDone: PropTypes.func,
};
export default function TaxDeductionPop({store, onClose, onDone}){

	const viewRef = useRef(null);
	const router = useRouter();
	const pathname = usePathname();
	const {isMobile} = useScreenSizeContext();
	const {jsonApiAction} = useApi();
	const {fncShowPop, fncClosePop, fncErrorPop} = usePopContext();
	const {fncEncode, userInfo} = useUserContext();
	const {isAccApp} = useWebContext();

	const isExtrn = REDIRECT_TYPE[pathname] === 'EXTRN_TAX';

	const [step, setStep] = useState(0);

	// 약관 전체 동의
	const [isAll, setIsAll] = useState(false);
	const [terms, setTerms] = useState({
		taxTerm01: false,
		taxTerm02: false,
		taxTerm03: false,
		taxTerm04: false,
	})

	// hash
	const [isSuccess, setIsSuccess] = useState(false);

	// 파라미터
	const [valid, setValid] = useState({});
	const [params, setParams] = useState({
		cardNo: '',
		name: '',
		ssnFront: '',
		ssnLast: '',
	})
	const [moRealnameParams, setMoRealnameParams] = useState({
		ssnFront: '',
		ssnLast: '',
	})

	// --Api
	// 조회(약관)
	const {mutate: mutQueryTermsTax01, data: taxTerm01} = useMutation({
		mutationKey: ['mutQueryTermsTax01'],
		mutationFn: (payload) => jsonApiAction(apiTerms, payload),
	})

	// 조회(약관)
	const {mutate: mutQueryTermsTax02, data: taxTerm02} = useMutation({
		mutationKey: ['mutQueryTermsTax02'],
		mutationFn: (payload) => jsonApiAction(apiTerms, payload),
	})

	// 조회(약관)
	const {mutate: mutQueryTermsTax03, data: taxTerm03} = useMutation({
		mutationKey: ['mutQueryTermsTax03'],
		mutationFn: (payload) => jsonApiAction(apiTerms, payload),
	})

	// 조회(약관)
	const {mutate: mutQueryTermsTax04, data: taxTerm04} = useMutation({
		mutationKey: ['mutQueryTermsTax04'],
		mutationFn: (payload) => jsonApiAction(apiTerms, payload),
	})

	// Siren 실명인증
	const {mutate: mutAuthSiren} = useMutation({
		mutationKey: ['mutAuthSiren'],
		mutationFn: (payload) => jsonApiAction(apiCreateSiren, {...payload, __localHandle: true}),
		onSuccess: (res) => {
			if(res?.actionUrl && res?.reqInfo && res?.okUrl){
				fncSubmitToSiren(res.actionUrl, res.reqInfo, res.okUrl);
			}
		},
		onError: () => {
			fncErrorPop();
		}
	})

	useLayoutEffect(() => {
		if(
			process.env.NEXT_PUBLIC_REQRD_PII_TAX &&
			process.env.NEXT_PUBLIC_UII_TAX &&
			process.env.NEXT_PUBLIC_TP_INFO_TAX &&
			process.env.NEXT_PUBLIC_TP_PII_TAX
		) {
			mutQueryTermsTax01({trmsTypeCd: process.env.NEXT_PUBLIC_REQRD_PII_TAX});
			mutQueryTermsTax02({trmsTypeCd: process.env.NEXT_PUBLIC_UII_TAX});
			mutQueryTermsTax03({trmsTypeCd: process.env.NEXT_PUBLIC_TP_INFO_TAX});
			mutQueryTermsTax04({trmsTypeCd: process.env.NEXT_PUBLIC_TP_PII_TAX});
		}
	}, []);

	// 유저 정보 업데이트
	useLayoutEffect(() => {
		if(userInfo?.custNm && userInfo?.custBrdt && !isExtrn) {
			setParams(prev => ({
				...prev,
				name: userInfo?.custNm,
				ssnFront: moment(userInfo?.custBrdt).format('YYMMDD'),
			}))
		}
	}, [userInfo, isExtrn]);

	// RES(PC)
	useLayoutEffect(() => {


		const onVerifyMsg = async (e) => {

			const apiUri = await fncGetBaseUrl();

			// 개발환경 허용 오리진(여러 개면 배열/Set)
			const ALLOW = new Set([apiUri]);
			if (!ALLOW.has(e.origin)) return;

			// 실제 서비스에서는 e.origin 화이트리스트 검증 필수
			if (!e?.data || e.data.type !== "realname") return;

			const { result } = e.data.payload || {};
			if (result === "1") {
				setIsSuccess(true);
			} else {
				setIsSuccess(false);
				fncShowPop({
					mainText: mapResultMessage(result),
					primaryText: '확인',
					onClickPrimary: () => fncClosePop()
				})
			}
		};

		window.addEventListener('message', onVerifyMsg);

		return () => window.removeEventListener('message', onVerifyMsg);
	}, [router]);

	useLayoutEffect(() => {
		if(isMobile && store?.moRealnameRes) {
			setStep(1);

			if([1, "1"].includes(store.moRealnameRes?.result)) {
				const popParams = store.moRealnameRes?.popParams;
				setParams({
					cardNo: popParams.cardNo,
					name: popParams.name,
					ssnFront: popParams.tempFront,
					ssnLast: '1234567'
				})
				setMoRealnameParams(popParams);
				setIsSuccess(true);
				Cookies.remove('crm-verify');
			}
		}
	}, [isMobile, store]);

	// AOS Back Handler
	useLayoutEffect(() => {
		const fncHandleBackHandler = (e) => {
			fncClose();
		}

		if(isMobile) {
			window.history.pushState({ modal: 'open' }, '');
			window.addEventListener('popstate', fncHandleBackHandler);
		}

		return () => {
			if(isMobile) {
				window.removeEventListener('popstate', fncHandleBackHandler);
				if(window.history.state?.modal === 'open') {
					window.history.back();
				}
			}

			window.scrollTo(window.scrollX, window.scrollY);
		}

	}, [isAccApp, isMobile]);

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
		})
	}

	// 실명인증
	const fncCallSiren = async () => {
		const rules = {
			name: [
				{type: VALIDATE_RULES.ALPHA},
				{type: VALIDATE_RULES.MIN_LENGTH, value: 2},
			],
			ssnFront: [
				{type: VALIDATE_RULES.NUMERIC},
				{type: VALIDATE_RULES.MIN_LENGTH, value: 6},
				{type: VALIDATE_RULES.MAX_LENGTH, value: 6},
			],
			ssnLast: [
				{type: VALIDATE_RULES.NUMERIC},
				{type: VALIDATE_RULES.MIN_LENGTH, value: 7},
				{type: VALIDATE_RULES.MAX_LENGTH, value: 7},
			],
			// cardNo: [
			// 	{type: VALIDATE_RULES.NUMERIC},
			// 	{type: VALIDATE_RULES.MIN_LENGTH, value: 16},
			// 	{type: VALIDATE_RULES.MAX_LENGTH, value: 16},
			// ]
		};

		const redirectType = REDIRECT_TYPE[pathname] || '/';
		const res = validate(params, rules);
		if(Object.keys(res).length === 0) {
			const encodedFront = await fncEncode(params.ssnFront);
			const encodedLast = await fncEncode(params.ssnLast);
			if(!encodedFront || !encodedLast) return;
			mutAuthSiren({
				name: params.name,
				ssnFront: encodedFront,
				ssnLast: encodedLast,
				redirectType: redirectType,
				mstr: isMobile ? 'link' : 'popup',
				returnUrl: store?.returnUrl ? store?.returnUrl : "",
			})
		} else {
			setValid(res);
		}
	}

	const fncSubmitToSiren = async (actionUrl, reqInfo, okUrl) => {
		if(typeof window === 'undefined') return;
		if(!actionUrl || !reqInfo || !okUrl) return;

		// Mobile: 현재 창에서 페이지 이동
		if(isMobile) {

			// 이전 단계 파라미터 저장
			const expireMM = new Date(Date.now() + 10 * 60 * 1000);
			const encodedFront = await fncEncode(params.ssnFront);
			const encodedLast = await fncEncode(params.ssnLast);
			if(!encodedFront || !encodedLast) return;
			const storeData = {
				...store,
				popParams: {
					...params,
					tempFront: params.ssnFront,
					ssnFront: encodedFront,
					ssnLast: encodedLast,
				}
			};
			Cookies.set('crm-verify', JSON.stringify(storeData), { expires: expireMM });

			const form = document.createElement('form');
			form.method = 'post';
			form.action = actionUrl;
			form.acceptCharset = 'UTF-8';

			const m1 = document.createElement('input');
			m1.type = 'hidden';
			m1.name = 'reqInfo';
			m1.value = safeHtml(reqInfo);

			const m2 = document.createElement('input');
			m2.type = 'hidden';
			m2.name = 'ok_url';
			m2.value = safeHtml(okUrl);

			form.appendChild(m1);
			form.appendChild(m2);
			document.body.appendChild(form);
			form.submit();

			return;
		}

		// PC: 팝업 창
		const w = 480, h = 720;
		const popup = window.open(
			"about:blank",
			"nmChkWindow",
			`width=${w},height=${h},left=0,top=0,menubar=no,toolbar=no,location=no,status=no,resizable=no,scrollbars=no`
		);
		if (!popup) {
			alert('팝업이 차단되었습니다. 팝업 허용 후 다시 시도하세요.');
			return;
		}

		function safeHtml(s){
			return String(s||'')
				.replaceAll('&','&amp;')
				.replaceAll('<','&lt;')
				.replaceAll('>','&gt;')
				.replaceAll('"','&quot;')
				.replaceAll("'","&#39;");
		}

		const d = popup.document;
		d.open();
		d.write(`
            <!doctype html><html><head><meta charset='UTF-8'><title>이동 중...</title></head>
            <body onload='document.f.submit()' style="font-family:sans-serif;">
           	 	<p>실명인증 페이지로 이동중...</p>
                <form name='f' method='post' action='${actionUrl}' accept-charset='UTF-8' target='_self'>
                    <input type='hidden' name='MSTR' value='popup'>
                    <input type='hidden' name='reqInfo' value='${safeHtml(reqInfo)}'>
                    <input type='hidden' name='ok_url' value='${safeHtml(okUrl)}'>
                </form>
            </body></html>
        `);
		d.close();
	}

	// 닫기
	const fncClose = () => {
		if(isMobile && step > 0) { // 초기화
			setStep(0);
			setTerms({
				taxTerm01: false,
				taxTerm02: false,
				taxTerm03: false,
				taxTerm04: false,
			})
			setParams(prev => ({
				...prev,
				name: '',
				ssnFront: '',
				ssnLast: '',
			}))
			setMoRealnameParams({
				ssnFront: '',
				ssnLast: '',
			})
		} else {
			onClose();
		}
	}

	// 완료
	const fncDone = async () => {
		let encodedFront;
		let encodedLast;

		if(isMobile) {
			encodedFront = moRealnameParams.ssnFront;
			encodedLast = moRealnameParams.ssnLast;
		} else {
			encodedFront = await fncEncode(params.ssnFront);
			encodedLast = await fncEncode(params.ssnLast);
		}

		if(!encodedFront || !encodedLast) return;

		if(isExtrn) {
			onDone({
				cardNo: params.cardNo,
				name: params.name,
				ssnFront: encodedFront,
				ssnLast: encodedLast,
			});
		} else {
			onDone({
				earnDdcYn: 'Y',
				ssnFront: encodedFront,
				ssnLast: encodedLast,
			});
		}

		Cookies.remove('crm-verify');
	}

	// 약관 동의 업데이트
	const fncUpdateObj = (obj) => {
		setTerms({
			...terms,
			...obj
		})
	}

	// 다음 단계
	const fncChangeStep = () => {
		setStep(step+1);
		viewRef.current && viewRef.current.scrollTo({top: 0, behavior: 'smooth'});
	}

	const fncHandlers = {
		changeInput: fncChangeInput,
		callSiren: fncCallSiren,
		close: fncClose,
		done: fncDone,
		changeStep: fncChangeStep,
		updateObj: fncUpdateObj
	}

	const fncCallbackEvent = (fncName, variable, payload = {}) => {
		const fnc = fncHandlers[fncName];
		if (typeof fnc === 'function') return fnc(variable, payload);
	}

	if (isMobile) return (
		<MoTaxDeductionPop
			fncCallbackEvent={fncCallbackEvent}
			fncSetIsAll={(bool) => setIsAll(bool)}
			data={{
				...params,
				valid,
				blockNext: !isSuccess,
				step,
				terms,
				taxTerm01,
				taxTerm02,
				taxTerm03,
				taxTerm04,
				isAll,
				isExtrn
			}}
			ref={viewRef}
		/>
	);
	else return (
		<DtTaxDeductionPop
			fncCallbackEvent={fncCallbackEvent}
			fncSetIsAll={(bool) => setIsAll(bool)}
			data={{
				...params,
				valid,
				blockNext: !isSuccess,
				step,
				terms,
				taxTerm01,
				taxTerm02,
				taxTerm03,
				taxTerm04,
				isAll
			}}
			ref={viewRef}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F228
 */
DtTaxDeductionPop.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func,
	fncSetIsAll: PropTypes.func,
	ref: PropTypes.any
};
export function DtTaxDeductionPop({data, fncCallbackEvent, fncSetIsAll, ref}){

	useLayoutEffect(() => {
		let defineTerms = fncAllDefined([
			data.terms.taxTerm01,
			data.terms.taxTerm02,
			data.terms.taxTerm03,
			data.terms.taxTerm04,
		])

		if(defineTerms) fncSetIsAll(true);
		else fncSetIsAll(false);

	}, [
		data.terms.taxTerm01,
		data.terms.taxTerm02,
		data.terms.taxTerm03,
		data.terms.taxTerm04
	])

	// 약관 동의
	const fncCheckTerm = (id) => {
		if(id === 'all') {
			let defineTerms = fncAllDefined([
				data.terms.taxTerm01,
				data.terms.taxTerm02,
				data.terms.taxTerm03,
				data.terms.taxTerm04,
			])
			fncCallbackEvent('updateObj', {
				taxTerm01: !defineTerms,
				taxTerm02: !defineTerms,
				taxTerm03: !defineTerms,
				taxTerm04: !defineTerms,
			});
		} else {
			fncCallbackEvent('updateObj', { [id]: !data.terms[id] });
		}
	}

	return (
		<div
			className={'popup-bg-opacity'}
			role={'dialog'} aria-modal={true} aria-labelledby={'popup-tax-title-dt'}
		>
			<div className={'popup-float-wrap w-[500px] px-10 py-20 flex flex-col gap-36'}>
				<div className={'flex-col-start gap-50 overflow-y-auto px-34 py-20'} ref={ref}>
					<button
						aria-label={'소득공제 등록 팝업 닫기'}
						className={'absolute top-4 right-4'}
						onClick={() => fncCallbackEvent('close')}
						onKeyDown={(e) => {
							if(e.key === 'Enter' || e.key === ' ') fncCallbackEvent('close')
						}}
					>
						<X
							width={32} height={32}
							color={'text-dynamic-icon-neutral-primary'}
						/>
					</button>
					<p id={'popup-tax-title-dt'}
					   className={'text-heading-md text-dynamic-text-neutral-primary font-semibold whitespace-pre-wrap'}>
						{`소득공제를 받기위한\n본인인증을 진행해 주세요`}
					</p>
					{
						data.step > 0 ? (
							<>
								<div className={'w-full flex flex-col gap-28'}>
									<InputText
										size={'lg'}
										title={'이름'}
										essential={true}
										placeholder={'이름 입력'}
										status={fncValiState('name', data.valid)}
										message={fncValiState('name', data.valid) === 'warning' && '이름을 확인해주세요.'}
										id={'name'}
										value={data.name}
										disabled={true}
									/>
									<InputText
										size={'lg'}
										title={'주민등록번호 앞자리'}
										essential={true}
										placeholder={'주민등록번호 앞자리 6자리'}
										allows={['num']}
										maxLength={6}
										status={fncValiState('ssnFront', data.valid)}
										message={fncValiState('ssnFront', data.valid) === 'warning' && '주민등록번호 앞자리를 확인해주세요.'}
										id={'ssnFront'}
										value={data.ssnFront}
										disabled={true}
									/>
									<InputText
										size={'lg'}
										title={'주민등록번호 뒷자리'}
										essential={true}
										placeholder={'주민등록번호 뒷자리 7자리'}
										allows={['num']}
										inputType={'password'}
										maxLength={7}
										status={fncValiState('ssnLast', data.valid)}
										message={fncValiState('ssnLast', data.valid) === 'warning' && '주민등록번호 뒷자리를 확인해주세요.'}
										id={'ssnLast'}
										value={data.ssnLast}
										disabled={!data.blockNext}
										onChange={(e) => fncCallbackEvent('changeInput', e)}
									/>
									<div>
										<FieldTitle
											title={'본인인증'}
											essential={true}
										/>
										<Button
											theme={'secondary'}
											size={'lg'}
											text={'실명인증하기'}
											customStyle={'w-full'}
											disabled={!data.blockNext}
											onClick={() => fncCallbackEvent('callSiren')}
										/>
									</div>
								</div>
								<CommentInfo
									title={'소득공제 유의사항'}
									list={[
										{
											id: 'd-0', textColor: 'text-dynamic-text-neutral-secondary',
											message: `소득공제 등록 이후 결제분만 해당 년도 소득공제로 처리되며, 소득공제 등록 이전 결제분은 소득공제에 포함되지 않습니다.\n(조례특례제한법 시행령)`,
										},
										{
											id: 'd-1', textColor: 'text-dynamic-text-neutral-secondary',
											message: `본인인증은 소득공제 등록 용도로만 이용됩니다.`,
										},
									]}
								/>
								<div className={'w-full flex-col-center'}>
									<Button
										size={'xl'}
										text={'등록 완료하기'}
										ariaLabel={'소득공제 등록'}
										customStyle={' w-[160px]'}
										disabled={data.blockNext}
										onClick={() => fncCallbackEvent('done')}
									/>
								</div>
							</>
						) : (
							// 약관
							<>
								<div className={'w-full flex-col-center gap-30'}>
									<button
										className={`agree-all ${data.isAll && 'active'}`}
										onClick={() => fncCheckTerm('all')}
										onKeyDown={(e) => {
											if (e.key === 'Enter') fncCheckTerm('all');
										}}
									>
										<Check
											width={24} height={24}
											color={data.isAll ? 'text-dynamic-icon-brand-primary' : 'text-dynamic-icon-neutral-secondary'}
										/>
										<span>전체 동의하기</span>
									</button>
									<div className={'checkbox-wrap'}>
										<Checkbox
											type={'square'}
											label={'소득공제를 위한 개인정보 수집 및 이용에 대한 동의'}
											essentialLabel={'필수'}
											isChecked={data.terms.taxTerm01}
											onChange={() => fncCheckTerm('taxTerm01')}
										/>
										<div className={'term-wrap'}>
											<ToastViewer
												className={'text-dynamic-text-neutral-primary dark:text-dynamic-text-neutral-primary'}
												initialValue={data?.taxTerm01?.trmsDtlCn ?? ''}
											/>
										</div>
									</div>
									<div className={'checkbox-wrap'}>
										<Checkbox
											type={'square'}
											label={'고유식별정보 수집 및 이용에 대한 안내'}
											essentialLabel={'필수'}
											isChecked={data.terms.taxTerm02}
											onChange={() => fncCheckTerm('taxTerm02')}
										/>
										<div className={'term-wrap'}>
											<ToastViewer
												className={'text-dynamic-text-neutral-primary dark:text-dynamic-text-neutral-primary'}
												initialValue={data?.taxTerm02?.trmsDtlCn ?? ''}
											/>
										</div>
									</div>
									<div className={'checkbox-wrap'}>
										<Checkbox
											type={'square'}
											label={'제3자 정보 제공 동의'}
											essentialLabel={'필수'}
											isChecked={data.terms.taxTerm03}
											onChange={() => fncCheckTerm('taxTerm03')}
										/>
										<div className={'term-wrap'}>
											<ToastViewer
												className={'text-dynamic-text-neutral-primary dark:text-dynamic-text-neutral-primary'}
												initialValue={data?.taxTerm03?.trmsDtlCn ?? ''}
											/>
										</div>
									</div>
									<div className={'checkbox-wrap'}>
										<Checkbox
											type={'square'}
											label={'개인정보의 제3자 제공에 대한 안내'}
											essentialLabel={'필수'}
											isChecked={data.terms.taxTerm04}
											onChange={() => fncCheckTerm('taxTerm04')}
										/>
										<div className={'term-wrap'}>
											<ToastViewer
												className={'text-dynamic-text-neutral-primary dark:text-dynamic-text-neutral-primary'}
												initialValue={data?.taxTerm04?.trmsDtlCn ?? ''}
											/>
										</div>
									</div>
								</div>
								<div className={'w-full flex-col-center'}>
									<Button
										size={'xl'}
										text={'다음'}
										ariaLabel={'다음'}
										customStyle={'w-[160px]'}
										disabled={!(data.terms.taxTerm01 && data.terms.taxTerm02 && data.terms.taxTerm03 && data.terms.taxTerm04)}
										onClick={() => fncCallbackEvent('changeStep')}
									/>
								</div>
							</>
						)
					}
				</div>
			</div>
		</div>
	)
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F456
 */
MoTaxDeductionPop.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func,
	fncSetIsAll: PropTypes.func,
	ref: PropTypes.any
};

export function MoTaxDeductionPop({data, fncCallbackEvent, fncSetIsAll, ref}) {

	// 팝업: 약관
	const [termId, setTermId] = useState(null);

	// 약관 팝업 열기
	const fncShowTermsPop = (id) => {
		if(!id) return;
		setTermId(id);
	}

	// 약관 팝업 닫기
	const fncCloseTermsPop = () => {
		setTermId(null);
	}

	// 약관 동의하고 팝업 닫기
	const fncAgreeTerms = () => {
		if(!termId) return;
		fncCallbackEvent('updateObj', {[termId]: true});
		fncCloseTermsPop();
	}

	useLayoutEffect(() => {
		let defineTerms = fncAllDefined([
			data.terms.taxTerm01,
			data.terms.taxTerm02,
			data.terms.taxTerm03,
			data.terms.taxTerm04,
		])

		if(defineTerms) fncSetIsAll(true);
		else fncSetIsAll(false);

	}, [
		data.terms.taxTerm01,
		data.terms.taxTerm02,
		data.terms.taxTerm03,
		data.terms.taxTerm04
	])

	// 약관 동의
	const fncCheckTerm = (id) => {
		if(id === 'all') {
			let defineTerms = fncAllDefined([
				data.terms.taxTerm01,
				data.terms.taxTerm02,
				data.terms.taxTerm03,
				data.terms.taxTerm04,
			])
			fncCallbackEvent('updateObj', {
				taxTerm01: !defineTerms,
				taxTerm02: !defineTerms,
				taxTerm03: !defineTerms,
				taxTerm04: !defineTerms,
			});
		} else {
			fncCallbackEvent('updateObj', { [id]: !data.terms[id] });
		}
	}

	return (
		<FocusTrap
			active={true}
			focusTrapOptions={{
				escapeDeactivates: true, // ESC로 닫기 허용
				clickOutsideDeactivates: true, // 바깥 클릭 시 닫기 (원하는 경우)
				initialFocus: '#popup-tax-title-mo', // 첫 포커스 요소 ID
			}}
		>
			<div
				className={'absolute top-0 left-0 z-11 w-full h-full bg-dynamic-bg-neutral-base flex flex-col overflow-y-auto'}
				aria-modal={true}
				aria-labelledby={'popup-tax-title-mo'}
				ref={ref}
			>
				<header className={'bg-dynamic-bg-neutral-base'}>
					<div className={'inner-header'}>
						<button
							aria-label={'소득 공제 등록 팝업 닫기'}
							onClick={() => fncCallbackEvent('close')}
						>
							<ArrowLeft color={'text-dynamic-icon-neutral-primary'}/>
						</button>
						<div className={'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'}>
							<p
								id={'popup-tax-title-mo'}
								className={'text-body-2xl text-dynamic-text-neutral-primary font-semibold text-center'}
							>
								소득 공제 등록
							</p>
						</div>
					</div>
				</header>
				<div className={'body-inner-wrap-mobile p-20'}>
					<div className={'flex flex-col flex-1 gap-40'}>
						<p className={'text-heading-md text-dynamic-text-neutral-primary font-semibold whitespace-pre-wrap'}>
							{`소득공제를 받기위한\n본인인증을 진행해 주세요`}
						</p>
						{
							data.step > 0 ? (
								<>
									<div className={'flex flex-col gap-28'}>
										{
											data.isExtrn && (
												<InputText
													size={'md'}
													title={'교통카드 번호'}
													essential={true}
													id={'cardNo'}
													value={fncMaskCardNo(data.cardNo)}
													status={fncValiState('cardNo', data.valid)}
													message={fncValiState('cardNo', data.valid) === 'warning' && '교통카드번호를 확인해주세요.(209X-X5XX-XXXX-XXXX)'}
													allows={['num']}
													maxLength={19}
													disabled={data.isExtrn ? !data.blockNext : true}
													placeholder={'209X-X5XX-XXXX-XXXX'}
													onChange={(e) => {
														data.isExtrn ? fncCallbackEvent('changeInput', e) : null
													}}
												/>
											)
										}
										<InputText
											size={'md'}
											title={'이름'}
											essential={true}
											placeholder={'이름 입력'}
											status={fncValiState('name', data.valid)}
											message={fncValiState('name', data.valid) === 'warning' && '이름을 확인해주세요.'}
											id={'name'}
											value={data.name}
											disabled={data.isExtrn ? !data.blockNext : true}
											onChange={(e) => {
												data.isExtrn ? fncCallbackEvent('changeInput', e) : null
											}}
										/>
										<InputText
											size={'md'}
											title={'주민등록번호 앞자리'}
											essential={true}
											placeholder={'주민등록번호 앞자리 6자리'}
											allows={['num']}
											maxLength={6}
											status={fncValiState('ssnFront', data.valid)}
											message={fncValiState('ssnFront', data.valid) === 'warning' && '주민등록번호 앞자리를 확인해주세요.'}
											id={'ssnFront'}
											value={data.ssnFront}
											disabled={data.isExtrn ? !data.blockNext : true}
											onChange={(e) => {
												data.isExtrn ? fncCallbackEvent('changeInput', e) : null
											}}
										/>
										<InputText
											size={'md'}
											title={'주민등록번호 뒷자리'}
											essential={true}
											placeholder={'주민등록번호 뒷자리 7자리'}
											allows={['num']}
											inputType={'password'}
											maxLength={7}
											status={fncValiState('ssnLast', data.valid)}
											message={fncValiState('ssnLast', data.valid) === 'warning' && '주민등록번호 뒷자리를 확인해주세요.'}
											id={'ssnLast'}
											value={data.ssnLast}
											disabled={!data.blockNext}
											onChange={(e) => fncCallbackEvent('changeInput', e)}
										/>
										<div>
											<FieldTitle
												title={'본인인증'}
												essential={true}
											/>
											<Button
												theme={'secondary'}
												size={'md'}
												text={'실명인증하기'}
												customStyle={'w-full'}
												disabled={!data.blockNext}
												onClick={() => fncCallbackEvent('callSiren')}
											/>
										</div>
									</div>
									<CommentInfo
										title={'소득공제 유의사항'}
										list={[
											{
												id: 'd-0', textColor: 'text-dynamic-text-neutral-secondary',
												message: `소득공제 등록 이후 결제분만 해당 년도 소득공제로 처리되며, 소득공제 등록 이전 결제분은 소득공제에 포함되지 않습니다.\n(조례특례제한법 시행령)`,
											},
											{
												id: 'd-1', textColor: 'text-dynamic-text-neutral-secondary',
												message: `본인인증은 소득공제 등록 용도로만 이용됩니다.`,
											},
										]}
									/>
								</>
							) : (
								<>
									<div className={'page-bottom-space'}>
										<button
											type={'button'}
											className={clsx('agree-all', data.isAll && 'active')}
											aria-label={'약관 전체 동의하기'}
											onClick={() => fncCheckTerm('all')}
											onKeyDown={(e) => {
												if (e.key === 'Enter') fncCheckTerm('all');
											}}
										>
											<Check
												width={24} height={24}
												color={data.isAll ? 'text-dynamic-icon-brand-primary' : 'text-dynamic-icon-neutral-secondary'}
											/>
											<span>전체 동의하기</span>
										</button>
										<div>
											<div className={'checkbox-wrap border'}>
												<Checkbox
													type={'brand'}
													label={'소득공제를 위한 개인정보 수집 및 이용에 대한 동의'}
													essentialLabel={'필수'}
													isChecked={data.terms.taxTerm01}
													onChange={() => fncCheckTerm('taxTerm01')}
												/>
												<button
													className={'terms'}
													onClick={() => fncShowTermsPop('taxTerm01')}
													onKeyDown={(e) => {
														if (e.key === 'Enter') fncShowTermsPop('taxTerm01');
													}}>
													보기
												</button>
											</div>
											<div className={'checkbox-wrap border'}>
												<Checkbox
													type={'brand'}
													label={'고유식별정보 수집 및 이용에 대한 안내'}
													essentialLabel={'필수'}
													isChecked={data.terms.taxTerm02}
													onChange={() => fncCheckTerm('taxTerm02')}
												/>
												<button
													className={'terms'}
													onClick={() => fncShowTermsPop('taxTerm02')}
													onKeyDown={(e) => {
														if (e.key === 'Enter') fncShowTermsPop('taxTerm02');
													}}>
													보기
												</button>
											</div>
											<div className={'checkbox-wrap border'}>
												<Checkbox
													type={'brand'}
													label={'제3자 정보 제공 동의'}
													essentialLabel={'필수'}
													isChecked={data.terms.taxTerm03}
													onChange={() => fncCheckTerm('taxTerm03')}
												/>
												<button
													className={'terms'}
													onClick={() => fncShowTermsPop('taxTerm03')}
													onKeyDown={(e) => {
														if (e.key === 'Enter') fncShowTermsPop('taxTerm03');
													}}>
													보기
												</button>
											</div>
											<div className={'checkbox-wrap border'}>
												<Checkbox
													type={'brand'}
													label={'개인정보의 제3자 제공에 대한 안내'}
													essentialLabel={'필수'}
													isChecked={data.terms.taxTerm04}
													onChange={() => fncCheckTerm('taxTerm04')}
												/>
												<button
													className={'terms'}
													onClick={() => fncShowTermsPop('taxTerm04')}
													onKeyDown={(e) => {
														if (e.key === 'Enter') fncShowTermsPop('taxTerm04');
													}}>
													보기
												</button>
											</div>
										</div>
									</div>
								</>
							)
						}
					</div>
					{
						data.step > 0 ? (
							<Button
								size={'lg'}
								text={'등록 완료하기'}
								ariaLabel={'소득공제 등록'}
								disabled={data.blockNext}
								onClick={() => fncCallbackEvent('done')}
							/>
						) : (
							<>
								<Button
									size={'lg'}
									text={'다음'}
									ariaLabel={'다음'}
									disabled={!(data.terms.taxTerm01 && data.terms.taxTerm02 && data.terms.taxTerm03 && data.terms.taxTerm04)}
									onClick={() => fncCallbackEvent('changeStep')}
								/>

								{
									termId && (
										<TermsPop
											data={data}
											id={termId}
											onClose={fncCloseTermsPop}
											onDone={fncCloseTermsPop}
										/>
									)
								}
							</>
						)
					}
				</div>
			</div>
		</FocusTrap>
	);
}
