'use client'

import React, {useLayoutEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {useMutation} from '@tanstack/react-query';
import clsx from "clsx";
import dynamic from "next/dynamic";

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {apiTerms} from '@/app/_actions/common.action';
import {useApi} from '@modules/services/useApi';
import {fncAllDefined} from '@modules/utils/ValidateUtils';
import {useWebContext} from "@modules/context/WebviewContext";
import {usePopContext} from "@modules/context/PopContext";

// components
import Button from '@components/common/Button';
import Checkbox from '@components/common/Checkbox';
import TermsPop from '@components/popup/TermsPop';
import Loading from "@/app/loading";
const ToastViewer = dynamic(() => import('@components/common/Editor'), {
	ssr: false,
	loading: () => <Loading />
})

// assets
import {Check, ChevronDown} from '@assets/icons/Svgs';


/**
 * @description: 회원 가입 Step1 화면 입니다.
 * @screenID:    UI-CRM-F201, UI-CRM-F408
 * @screenPath:  홈 > 회원가입
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
JoinStep1.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export default function JoinStep1({data, fncCallbackEvent}) {

	const {isMobile} = useScreenSizeContext();
	const {jsonApiAction} = useApi();

	// 약관 전체 동의
	const [isAll, setIsAll] = useState(false);

	// Api
	// 조회(이용약관)
	const {mutate: mutQueryTerms, data: termUse} = useMutation({
		mutationKey: ['mutQueryTerms'],
		mutationFn: (payload) => jsonApiAction(apiTerms, payload),
	})

	// 조회(개인정보 수집 및 이용)
	const {mutate: mutQueryReqrdPii, data: termReqrdPii} = useMutation({
		mutationKey: ['mutQueryReqrdPii'],
		mutationFn: (payload) => jsonApiAction(apiTerms, payload),
	})

	// 조회(광고성 정보 수신)
	const {mutate: mutQueryAdOption, data: termAdOption} = useMutation({
		mutationKey: ['mutQueryAdOption'],
		mutationFn: (payload) => jsonApiAction(apiTerms, payload),
	})

	// 조회(마케팅 목적의 개인정보 수집 및 이용)
	const {mutate: mutQueryMktPii, data: termMktPii} = useMutation({
		mutationKey: ['mutQueryMktPii'],
		mutationFn: (payload) => jsonApiAction(apiTerms, payload),
	})

	// 조회(서비스 알림 수신)
	const {mutate: mutQuerySvcNoti, data: termSvcNoti} = useMutation({
		mutationKey: ['mutQuerySvcNoti'],
		mutationFn: (payload) => jsonApiAction(apiTerms, payload),
	})

	useLayoutEffect(() => {
		if(
			process.env.NEXT_PUBLIC_TERMS_JOIN &&
			process.env.NEXT_PUBLIC_REQRD_PII_JOIN &&
			process.env.NEXT_PUBLIC_AD_OPTION &&
			process.env.NEXT_PUBLIC_MKT_PII_JOIN &&
			process.env.NEXT_PUBLIC_SVC_NOTICE
		) {
			mutQueryTerms({trmsTypeCd: process.env.NEXT_PUBLIC_TERMS_JOIN});
			mutQueryReqrdPii({trmsTypeCd: process.env.NEXT_PUBLIC_REQRD_PII_JOIN});
			mutQueryAdOption({trmsTypeCd: process.env.NEXT_PUBLIC_AD_OPTION});
			mutQueryMktPii({trmsTypeCd: process.env.NEXT_PUBLIC_MKT_PII_JOIN});
			mutQuerySvcNoti({trmsTypeCd: process.env.NEXT_PUBLIC_SVC_NOTICE});
		}
	}, []);

	if (isMobile) {
		return (
			<MoJoinStep1
				fncCallbackEvent={fncCallbackEvent}
				fncSetIsAll={(bool) => setIsAll(bool)}
				data={{
					...data,
					termUse,
					termReqrdPii,
					termMktPii,
					termAdOption,
					termSvcNoti,
					isAll
				}}
			/>
		);
	} else {
		return (
			<DtJoinStep1
				fncCallbackEvent={fncCallbackEvent}
				fncSetIsAll={(bool) => setIsAll(bool)}
				data={{
					...data,
					termUse,
					termReqrdPii,
					termMktPii,
					termAdOption,
					isAll
				}}
			/>
		);
	}
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F201
 */
DtJoinStep1.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func,
	fncSetIsAll: PropTypes.func
};

export function DtJoinStep1({data, fncCallbackEvent, fncSetIsAll}) {

	useLayoutEffect(() => {
		let defineMkt = fncAllDefined([
			data.smsSndngYn,
			data.emlSndngYn,
		]);

		if(defineMkt) {
			fncCallbackEvent('updateObj', {
				terms04: true,
				smsSndngYn: true,
				emlSndngYn: true,
			});
		}

		if(data.terms04) {
			fncCallbackEvent('updateObj', {
				mktgMkusAgreYn: true
			});
		}

		let defineTerms = fncAllDefined([
			data.terms01,
			data.terms02,
			data.mktgMkusAgreYn,
			data.terms04
		])

		if(defineTerms) fncSetIsAll(true);
		else fncSetIsAll(false);

	}, [
		data.terms01,
		data.terms02,
		data.mktgMkusAgreYn,
		data.terms04,
		data.smsSndngYn,
		data.emlSndngYn,
	]);

	// 약관 동의
	const fncCheck = (id) => {
		let condition;
		switch (id) {
			case 'all':
				let defineTerms = fncAllDefined([
					data.terms01,
					data.terms02,
					data.mktgMkusAgreYn,
					data.terms04,
				])
				fncCallbackEvent('updateObj', {
					terms01: !defineTerms,
					terms02: !defineTerms,
					mktgMkusAgreYn: !defineTerms,
					terms04: !defineTerms,
					smsSndngYn: !defineTerms,
					emlSndngYn: !defineTerms,
				});
				break;
			case 'terms01':
			case 'terms02':
				fncCallbackEvent('updateObj', { [id]: !data[id] });
				break;
			case 'mktgMkusAgreYn':
				if(!data[id] === false) {
					fncCallbackEvent('updateObj', {
						[id]: !data[id],
						terms04: false,
						smsSndngYn: false,
						emlSndngYn: false,
					});
				} else {
					fncCallbackEvent('updateObj', {
						[id]: !data[id]
					});
				}
				break;
			case 'terms04':
				if(!data[id] === true) {
					fncCallbackEvent('updateObj', {
						[id]: !data[id],
						mktgMkusAgreYn: !data[id],
						smsSndngYn: !data[id],
						emlSndngYn: !data[id],
					});
				} else {
					fncCallbackEvent('updateObj', {
						[id]: !data[id],
						smsSndngYn: !data[id],
						emlSndngYn: !data[id],
					});
				}
				break;
			case 'smsSndngYn':
				condition = data.emlSndngYn
				fncCallbackEvent('updateObj', {
					terms04: condition ? true : !data[id],
					smsSndngYn: !data[id]
				});
				break;
			case 'emlSndngYn':
				condition = data.smsSndngYn
				fncCallbackEvent('updateObj', {
					terms04: condition ? true : !data[id],
					emlSndngYn: !data[id]
				});
				break;
			default: return;
		}
	}

	return (
		<>
			<div className={'flex-col-center gap-48'}>
				<button
					className={`agree-all ${data.isAll && 'active'}`}
					onClick={() => fncCheck('all')}
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
						label={'레일플러스 서비스 이용약관'}
						essentialLabel={'필수'}
						isChecked={data.terms01}
						onChange={() => fncCheck('terms01')}
					/>
					<div className={'term-wrap'}>
						<ToastViewer
							className={'prose max-w-none dark:text-dynamic-text-neutral-primary'}
							initialValue={data?.termUse?.trmsDtlCn ?? ''}
						/>
					</div>
				</div>
				<div className={'checkbox-wrap'}>
					<Checkbox
						type={'square'}
						label={'개인정보 수집 및 이용에 관한 동의'}
						essentialLabel={'필수'}
						isChecked={data.terms02}
						onChange={() => fncCheck('terms02')}
					/>
					<div className={'term-wrap'}>
						<ToastViewer
							className={'prose max-w-none dark:text-dynamic-text-neutral-primary'}
							initialValue={data?.termReqrdPii?.trmsDtlCn ?? ''}
						/>
					</div>
				</div>
				<div className={'checkbox-wrap'}>
					<Checkbox
						type={'square'}
						label={'마케팅 목적의 개인정보 수집 및 이용동의'}
						essentialLabel={'선택'}
						isChecked={data.mktgMkusAgreYn}
						onChange={() => fncCheck('mktgMkusAgreYn')}
					/>
					<div className={'term-wrap'}>
						<ToastViewer
							className={'prose max-w-none dark:text-dynamic-text-neutral-primary'}
							initialValue={data?.termMktPii?.trmsDtlCn ?? ''}
						/>
					</div>
				</div>
				<div className={'checkbox-wrap'}>
					<Checkbox
						type={'square'}
						label={'광고성 정보 수신 동의'}
						essentialLabel={'선택'}
						isChecked={data.terms04}
						onChange={() => fncCheck('terms04')}
					/>
					<div className={'flex-row-center gap-20 ml-30 mt-16'}>
						<Checkbox
							type={'square'}
							label={'SMS 수신'}
							isChecked={data.smsSndngYn}
							onChange={() => fncCheck('smsSndngYn')}
						/>
						<Checkbox
							type={'square'}
							label={'이메일 수신'}
							isChecked={data.emlSndngYn}
							onChange={() => fncCheck('emlSndngYn')}
						/>
					</div>
					<div className={'term-wrap'}>
						<ToastViewer
							className={'prose max-w-none dark:text-dynamic-text-neutral-primary'}
							initialValue={data?.termAdOption?.trmsDtlCn ?? ''}
						/>
					</div>
					<div className={'flex-col-start gap-2 mt-16'}>
						<p className={'comment'}>
							{`\u00B7 필수 안내에 대한 고지 내용은 선택 여부와 상관없이 발송됩니다.`}
						</p>
						<p className={'comment'}>
							{`\u00B7 선택 변경은 ‘마이페이지>내 정보’에서 철회가 가능합니다.`}
						</p>
					</div>
				</div>
			</div>
			<div className={'page-bottom-button-wrap'}>
				<Button
					theme={'primary'}
					size={'xl'}
					text={'동의하고 가입하기'}
					customStyle={'w-[240px]'}
					disabled={data.blockNext}
					onClick={() => fncCallbackEvent('nextStep')}
				/>
			</div>
		</>
	)
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F408
 */
MoJoinStep1.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func,
	fncSetIsAll: PropTypes.func
};

export function MoJoinStep1({data, fncCallbackEvent, fncSetIsAll}) {

	const {isAccApp} = useWebContext();
	const {fncShowPop, fncClosePop} = usePopContext();

	// 팝업: 약관
	const [termId, setTermId] = useState(null);

	// 아코디언 body 오픈 여부
	const [openAccordion, setOpenAccordion] = useState(true);

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
		switch (termId) {
			case 'termUse':
				fncCallbackEvent('updateObj', {terms01: true});
				break;
			case 'termReqrdPii':
				fncCallbackEvent('updateObj', {terms02: true});
				break;
			case 'termSvcNoti':
				fncCallbackEvent('updateObj', {srvcNotiRcptnAgreYn: true});
				break;
			case 'termAdOption':
				if(isAccApp) {
					fncCallbackEvent('updateObj', {
						terms04: true,
						smsSndngYn: true,
						emlSndngYn: true,
						pushSndngYn: true,
					});
				} else {
					fncCallbackEvent('updateObj', {
						terms04: true,
						smsSndngYn: true,
						emlSndngYn: true,
					});
				}
				break;
			case 'termMktPii':
				fncCallbackEvent('updateObj', {
					terms05: true,
					mktgMkusAgreYn: true
				});
				break;
			default: return;
		}
		fncCloseTermsPop();
	}

	useLayoutEffect(() => {
		let defineMkt;
		if(isAccApp) {
			defineMkt = fncAllDefined([
				data.smsSndngYn,
				data.emlSndngYn,
				data.pushSndngYn
			]);
			if(defineMkt) {
				fncCallbackEvent('updateObj', {
					terms04: true,
					smsSndngYn: true,
					emlSndngYn: true,
					pushSndngYn: true,
				});
			}

			let defineSvcMkt = fncAllDefined([
				!data.mktgMkusAgreYn,
				!data.terms04,
				!data.srvcNotiRcptnAgreYn
			]);
			if(defineSvcMkt) {
				fncCallbackEvent('updateObj', {
					terms05: false,
				});
			}
		} else {
			defineMkt = fncAllDefined([
				data.smsSndngYn,
				data.emlSndngYn,
			]);
			if(defineMkt) {
				fncCallbackEvent('updateObj', {
					terms04: true,
					smsSndngYn: true,
					emlSndngYn: true,
				});
			}

			let defineSvcMkt = fncAllDefined([
				!data.mktgMkusAgreYn,
				!data.terms04,
			]);
			if(defineSvcMkt) {
				fncCallbackEvent('updateObj', {
					terms05: false,
				});
			}
		}

		if(data.terms04) {
			fncCallbackEvent('updateObj', {
				mktgMkusAgreYn: true,
				terms05: true,
			});
		}

		let defineTerms;
		if(isAccApp) {
			defineTerms = fncAllDefined([
				data.terms01,
				data.terms02,
				data.mktgMkusAgreYn,
				data.terms04,
				data.terms05,
				data.srvcNotiRcptnAgreYn,
			])
		} else {
			defineTerms = fncAllDefined([
				data.terms01,
				data.terms02,
				data.mktgMkusAgreYn,
				data.terms04,
				data.terms05,
			])
		}

		if(defineTerms) fncSetIsAll(true);
		else fncSetIsAll(false);

	}, [
		data.terms01,
		data.terms02,
		data.mktgMkusAgreYn,
		data.terms04,
		data.terms05,
		data.srvcNotiRcptnAgreYn,
		data.smsSndngYn,
		data.emlSndngYn,
		data.pushSndngYn
	]);

	// 약관 동의
	const fncCheck = (id) => {
		let updateParams;
		let condition;
		switch (id) {
			case 'all':
				let defineTerms;
				if(isAccApp) {
					defineTerms = fncAllDefined([
						data.terms01,
						data.terms02,
						data.mktgMkusAgreYn,
						data.terms04,
						data.terms05,
						data.srvcNotiRcptnAgreYn,
					])

					updateParams = {
						terms01: !defineTerms,
						terms02: !defineTerms,
						mktgMkusAgreYn: !defineTerms,
						terms04: !defineTerms,
						terms05: !defineTerms,
						srvcNotiRcptnAgreYn: !defineTerms,
						smsSndngYn: !defineTerms,
						emlSndngYn: !defineTerms,
						pushSndngYn: !defineTerms
					};
				} else {
					defineTerms = fncAllDefined([
						data.terms01,
						data.terms02,
						data.mktgMkusAgreYn,
						data.terms04,
						data.terms05,
					])

					updateParams = {
						terms01: !defineTerms,
						terms02: !defineTerms,
						mktgMkusAgreYn: !defineTerms,
						terms04: !defineTerms,
						terms05: !defineTerms,
						smsSndngYn: !defineTerms,
						emlSndngYn: !defineTerms,
					};
				}

				fncCallbackEvent('updateObj', updateParams);
				break;
			case 'terms01':
			case 'terms02':
				fncCallbackEvent('updateObj', { [id]: !data[id] });
				break;
			case 'mktgMkusAgreYn':
				if(!data[id] === false) {
					if(isAccApp) {
						updateParams = {
							[id]: !data[id],
							terms04: false,
							smsSndngYn: false,
							emlSndngYn: false,
							pushSndngYn: false,
						}
					} else {
						updateParams = {
							[id]: !data[id],
							terms04: false,
							smsSndngYn: false,
							emlSndngYn: false,
						}
					}

					fncCallbackEvent('updateObj', updateParams);
				} else {
					fncCallbackEvent('updateObj', {
						terms05: true,
						[id]: !data[id]
					});
				}
				break;
			case 'terms04':
				if(!data[id] === true) {
					if(isAccApp) {
						updateParams = {
							[id]: !data[id],
							mktgMkusAgreYn: !data[id],
							smsSndngYn: !data[id],
							emlSndngYn: !data[id],
							pushSndngYn: !data[id],
						}
					} else {
						updateParams = {
							[id]: !data[id],
							mktgMkusAgreYn: !data[id],
							smsSndngYn: !data[id],
							emlSndngYn: !data[id],
						}
					}
					fncCallbackEvent('updateObj', updateParams);
				} else {
					if(isAccApp) {
						updateParams = {
							[id]: !data[id],
							smsSndngYn: !data[id],
							emlSndngYn: !data[id],
							pushSndngYn: !data[id],
						}
					} else {
						updateParams = {
							[id]: !data[id],
							smsSndngYn: !data[id],
							emlSndngYn: !data[id],
						}
					}
					fncCallbackEvent('updateObj', updateParams);
				}
				break;
			case 'terms05':
				if(isAccApp) {
					updateParams = {
						[id]: !data[id],
						mktgMkusAgreYn: !data[id],
						terms04: !data[id],
						srvcNotiRcptnAgreYn: !data[id],
						smsSndngYn: !data[id],
						emlSndngYn: !data[id],
						pushSndngYn: !data[id],
					}
				} else {
					updateParams = {
						[id]: !data[id],
						mktgMkusAgreYn: !data[id],
						terms04: !data[id],
						smsSndngYn: !data[id],
						emlSndngYn: !data[id],
					}
				}
				fncCallbackEvent('updateObj', updateParams);
				break;
			case 'srvcNotiRcptnAgreYn':
				fncCallbackEvent('updateObj', {
					terms05: true,
					srvcNotiRcptnAgreYn: !data[id],
				});
				break;
			case 'smsSndngYn':
				if(isAccApp) {
					condition = data.emlSndngYn || data.pushSndngYn;
				} else {
					condition = data.emlSndngYn;
				}
				fncCallbackEvent('updateObj', {
					terms04: condition ? true : !data[id],
					smsSndngYn: !data[id]
				});
				break;
			case 'emlSndngYn':
				if(isAccApp) {
					condition = data.smsSndngYn || data.pushSndngYn;
				} else {
					condition = data.smsSndngYn;
				}
				fncCallbackEvent('updateObj', {
					terms04: condition ? true : !data[id],
					emlSndngYn: !data[id]
				});
				break;
			case 'pushSndngYn':
				condition = data.smsSndngYn || data.emlSndngYn;
				fncCallbackEvent('updateObj', {
					terms04: condition ? true : !data[id],
					pushSndngYn: !data[id]
				});
				break;
			default: return;
		}
	}

	const fncNextStepMo = () => {
		if(isAccApp && !data.srvcNotiRcptnAgreYn) {
			fncShowPop({
				mainText: '서비스 알림 수신을 동의하지 않을 경우 서비스 이용과 관련된 중요한 알림을 받으실 수 없어요.',
				tertiaryText: '동의 안 함',
				onClickTertiary: () => {
					fncClosePop();
					fncCallbackEvent('nextStep');
				},
				primaryText: '동의하고 계속',
				onClickPrimary: () => {
					fncClosePop();
					fncCheck('srvcNotiRcptnAgreYn');
					fncCallbackEvent('nextStep');
				}
			})
		} else {
			fncCallbackEvent('nextStep')
		}
	}

	return (
		<>
			<div className={'mt-40 page-bottom-space'}>
				<button
					type={'button'}
					className={clsx('agree-all', data.isAll && 'active')}
					aria-label={'약관 전체 동의하기'}
					onClick={() => fncCheck('all')}
					onKeyDown={(e) => {
						if(e.key === 'Enter') fncCheck('all');
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
							label={'레일플러스 서비스 이용약관'}
							essentialLabel={'필수'}
							isChecked={data.terms01}
							onChange={() => fncCheck('terms01')}
						/>
						<button
							className={'terms'}
							aria-label={'약관 상세 보기'}
							onClick={() => fncShowTermsPop('termUse')}
						>
							보기
						</button>
					</div>
					<div className={'checkbox-wrap border'}>
						<Checkbox
							type={'brand'}
							label={'개인정보 수집 및 이용에 관한 동의'}
							essentialLabel={'필수'}
							isChecked={data.terms02}
							onChange={() => fncCheck('terms02')}
						/>
						<button
							className={'terms'}
							aria-label={'약관 상세 보기'}
							onClick={() => fncShowTermsPop('termReqrdPii')}
						>
							보기
						</button>
					</div>
					<div className={'relative'}>
						<div className={'checkbox-wrap accordion-header-wrap'}>
							<Checkbox
								type={'brand'}
								label={'서비스 및 마케팅 정보 수신 동의'}
								essentialLabel={'선택'}
								ariaLabel={`서비스 및 마케팅 정보 수신 동의 선택. 체크시 ${isAccApp ? ', 서비스 알림 수신동의' : ''}, 광고성 정보 수신 동의(${isAccApp ? '푸시 수신,' : ''}SMS수신, 이메일 수신) 과 마케팅 목적의 개인정보 수집 및 이용동의가 모두 동의로 체크됩니다.`}
								isChecked={data.terms05}
								onChange={() => fncCheck('terms05')}
							/>
							<button
								className={`inline-block transform transition-transform duration-300`}
								style={{ transform: `rotate(${openAccordion ? 180 : 0}deg)` }}
								aria-hidden={true}
								onClick={(e) => {
									e.stopPropagation();
									setOpenAccordion(!openAccordion)
								}}
							>
								<ChevronDown
									width={20} height={20}
									color={'text-dynamic-text-neutral-secondary'}
								/>
							</button>
						</div>
						
						{/* 아코디언 콘텐츠 영역 */}
						<div
							className={'accordion-body-wrap'}
							style={{visibility: openAccordion ? 'visible' : 'hidden'}}
						>
							{
								isAccApp && (
									<div className={'w-full'}>
										<div className={'sub-checkbox-wrap'}>
											<Checkbox
												type={'brand'}
												label={'서비스 알림 수신 동의'}
												essentialLabel={'선택'}
												isChecked={data.srvcNotiRcptnAgreYn}
												onChange={() => fncCheck('srvcNotiRcptnAgreYn')}
											/>
											<button
												className={'terms'}
												aria-label={'약관 상세 보기'}
												onClick={() => fncShowTermsPop('termSvcNoti')}
											>
												보기
											</button>
										</div>
										<p className={'description'}>
											레일플러스 서비스 이용과 관련된 중요한 정보를 푸시 알림으로 알려드립니다.
										</p>
									</div>
								)
							}
							<div className={'w-full'}>
								<div className={'sub-checkbox-wrap'}>
									<Checkbox
										type={'brand'}
										label={'광고성 정보 수신 동의'}
										essentialLabel={'선택'}
										isChecked={data.terms04}
										onChange={() => fncCheck('terms04')}
									/>
									<button
										className={'terms'}
										aria-label={'약관 상세 보기'}
										onClick={() => fncShowTermsPop('termAdOption')}
									>
										보기
									</button>
								</div>
								<div className={'ad-wrap'}>
									{
										isAccApp && (
											<Checkbox
												type={'brand'}
												label={'푸시 수신'}
												isChecked={data.pushSndngYn}
												onChange={() => fncCheck('pushSndngYn')}
											/>
										)
									}
									<Checkbox
										type={'brand'}
										label={'SMS 수신'}
										isChecked={data.smsSndngYn}
										onChange={() => fncCheck('smsSndngYn')}
									/>
									<Checkbox
										type={'brand'}
										label={'이메일 수신'}
										isChecked={data.emlSndngYn}
										onChange={() => fncCheck('emlSndngYn')}
									/>
								</div>
							</div>
							<div className={'w-full'}>
								<div className={'sub-checkbox-wrap'}>
									<Checkbox
										type={'brand'}
										label={'마케팅 목적의 개인정보 수집 및 이용동의'}
										essentialLabel={'선택'}
										isChecked={data.mktgMkusAgreYn}
										onChange={() => fncCheck('mktgMkusAgreYn')}
									/>
									<button
										className={'terms'}
										aria-label={'약관 상세 보기'}
										onClick={() => fncShowTermsPop('termMktPii')}
									>
										보기
									</button>
								</div>
								<p className={'description'}>
									필수 안내에 대한 고지 내용은 선택 여부와 상관없이 발송되며, 선택 변경은 앱 설정화면에서 가능합니다.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className={'page-bottom-button-wrap'}>
				<Button
					theme={'primary'}
					size={'lg'}
					text={'동의하고 가입하기'}
					customStyle={'w-full'}
					disabled={data.blockNext}
					onClick={fncNextStepMo}
				/>
			</div>

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
