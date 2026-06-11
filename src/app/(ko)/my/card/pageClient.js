'use client'

import React, {useLayoutEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {useRouter} from 'next/navigation';
import {useMutation} from '@tanstack/react-query';
import moment from "moment";
import Cookies from "js-cookie";

// modules
import {accordionA11yIds} from '@modules/utils/a11yUtils';
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {RouteConfig} from '@modules/config/RouteConfig';
import {CODE, FindCardProductName} from '@modules/consants/Objects';
import {fncMaskComma} from '@modules/utils/NumberUitls';
import {fncClipboardCopy, fncMaskCardNo} from '@modules/utils/StringUtils';
import {useMoHeaderContext} from '@modules/context/MoHeaderContext';
import {useWebContext} from '@modules/context/WebviewContext';
import {useLoadingContext} from '@modules/context/LoadingContext';
import {useApi} from '@modules/services/useApi';
import {
	apiCardList,
	apiDeleteDefaultCard,
	apiDeleteSafeCard,
	apiUpdateCard
} from '@/app/_actions/mypage.action';
import Badge from '@components/composite/Badge';
import {usePopContext} from '@modules/context/PopContext';
import {toMomentFrom14} from "@modules/utils/DateUtils";
import {useUserContext} from "@modules/context/UserContext";

// components
import Breadcrumb from '@components/layout/Breadcrumb';
import Button from '@components/common/Button';
import Accordion from '@components/composite/Accordion';
import ToggleSwitch from '@components/common/ToggleSwitch';
import TaxDeductionPop from '@components/popup/TaxDeductionPop';
import InputText from "@components/common/InputText";

// assets
import {
	CheckBold, ChevronRight,
	Copy,
	Edit,
	EmptyUserCard,
	FileText,
	Gift, MinusCircleFill,
	Plus,
	Rotate,
	Trash
} from '@assets/icons/Svgs';


/**
 * @description: 마이페이지 내 카드 화면 입니다.
 * @screenID:    UI-CRM-F225, UI-CRM-F447
 * @screenPath:  홈 > 마이페이지 > 내 카드
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
MyCardClient.propTypes = {
	identityParams: PropTypes.object
};
export default function MyCardClient({ identityParams = {} }) {

	const router = useRouter();
	const {isAccApp, fncPostRN} = useWebContext();
	const {isMobile} = useScreenSizeContext();
	const {fncChangeMoHeader} = useMoHeaderContext();
	const {jsonApiAction} = useApi();
	const {fncShowPop, fncClosePop} = usePopContext();
	const {isLogin, fncEncode} = useUserContext();
	const {fncRouteStart} = useLoadingContext();

	// 소득공제 등록 팝업
	const [popTaxDeduction, setPopTaxDeduction] = useState(false);
	const [moRealnameRes, setMoRealnameRes] = useState(null);

	// 선택된 카드 정보
	const [isActiveCard, setIsActiveCard] = useState(null);

	// 별칭 수정
	const [isEditNickNm, setIsEditNickNm] = useState(false);
	const [newNickNm, setNewNickNm] = useState(null);

	// --Api
	// 목록
	const {mutate: mutQueryCardList, data: cardList} = useMutation({
		mutationKey: ['mutQueryCardList'],
		mutationFn: () => jsonApiAction(apiCardList, {}),
		onSuccess: (res) => {
			if(res?.length) {
				if(isActiveCard?.cardNoEncpt){
					const pre = res.filter((el) => el.cardNoEncpt === isActiveCard.cardNoEncpt)?.[0];
					setIsActiveCard(pre);
				} else {
					setIsActiveCard(res[0]);
				}
			}
		}
	})

    // 카드 삭제(일반)
    const {mutate: mutDelDefaultCard} = useMutation({
        mutationKey: ['mutDelDefaultCard'],
        mutationFn: (payload) => jsonApiAction(apiDeleteDefaultCard, payload),
        onSuccess: (res) => {
            if(res > 0) {
				setIsActiveCard(null);
				fncShowPop({
					mainText: '카드가 삭제되었습니다.',
					primaryText: '확인',
					onClickPrimary: () => {
						fncClosePop();
                        mutQueryCardList();
					}
				})
            }
        }
    })

    // 카드 삭제(대중교통안심)
    const {mutate: mutDelSafeCard} = useMutation({
        mutationKey: ['mutDelSafeCard'],
        mutationFn: (payload) => jsonApiAction(apiDeleteSafeCard, payload),
        onSuccess: (res) => {
            if(res > 0) {
				setIsActiveCard(null);
                fncShowPop({
                    mainText: '카드가 삭제되었습니다.',
                    primaryText: '확인',
                    onClickPrimary: () => {
                        fncClosePop();
                        mutQueryCardList();
                    }
                })
            }
        }
    })

	// 카드 수정
	const {mutate: mutUpdateCard} = useMutation({
		mutationKey: ['mutUpdateCard'],
		mutationFn: (payload) => jsonApiAction(apiUpdateCard, payload),
		onSuccess: (res) => {
			if(res > 0) {
				fncClosePop();
				setPopTaxDeduction(false);
				setIsEditNickNm(false);
				setNewNickNm(null);
				mutQueryCardList();
			}
		}
	})

	useLayoutEffect(() => {
		isLogin && mutQueryCardList();
	}, [isLogin]);

	useLayoutEffect(() => {
		if(isAccApp) {
			fncPostRN({
				id: 'GO_CARD_MAIN',
				payload: {},
			})
			return;
		}
		if(isMobile) {
			fncChangeMoHeader({
				type: 'back',
				title: '내 카드'
			})
		}
	}, [isAccApp, isMobile])

	// 별칭 수정용
	useLayoutEffect(() => {
		if(isActiveCard?.cardNoEncpt) setNewNickNm(isActiveCard?.cardNcknmNm)
	}, [isActiveCard?.cardNoEncpt]);

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
				const storedActiveCard = storedCookie?.isActiveCard || null;
				setIsActiveCard(storedActiveCard);
				setPopTaxDeduction(true);
				setMoRealnameRes({
					type: identityParams.type,
					result: identityParams.result,
					redirectType: identityParams.redirectType,
					popParams: storedCookie?.popParams || {}
				});

			} else {
				Cookies.remove('crm-verify');
				fncShowPop({
					mainText: '실명인증에 실패했습니다.',
					primaryText: '확인',
					onClickPrimary: () => fncClosePop()
				})
			}
		}
	}, [isMobile, identityParams]);

	// 카드 선택
	const fncSelectCard = (card) => {
		if(isActiveCard?.cardNoEncpt !== card.cardNoEncpt) setIsActiveCard(card);
		setIsEditNickNm(false);
	}

	// 이동: 카드 등록
	const fncGoAdd = () => {
		const targetUri = RouteConfig.CARD_REGISTER.PATH;
		fncRouteStart(targetUri);
		router.push(targetUri);
	}

	// 이동: K-패스 연동
	const fncGoKpass = () => {
		if(process.env.NEXT_PUBLIC_KPASS_URI) {
			window.open(process.env.NEXT_PUBLIC_KPASS_URI, '_blank')
		}
	}

	// 이동: 이용내역조회
	const fncGoUsage = () => {
		if(!isActiveCard?.cardNoEncpt) return;

		const targetUri = `${RouteConfig.USAGE.PATH}?no=${isActiveCard.cardNoEncpt}`;
		fncRouteStart(targetUri);
		router.push(targetUri);
	}

	// 이동: 쿠폰함
	const fncGoCoupon = () => {
		const targetUri = RouteConfig.COUPON.PATH;
		fncRouteStart(targetUri);
		router.push(targetUri);
	}

	// 이동: 환불신청
	const fncGoRefund = () => {
		const targetUri = `${RouteConfig.REFUND.PATH}?no=${isActiveCard.cardNoEncpt}`;
		fncRouteStart(targetUri);
		router.push(targetUri);
	}

	// 이동: 분실신청
	const fncGoLost = () => {
		const targetUri = `${RouteConfig.LOST.PATH}?no=${isActiveCard.cardNoEncpt}`;
		fncRouteStart(targetUri);
		router.push(targetUri);
	}

	// 복사
	const fncCopy = () => {
		if(isActiveCard?.cardNoEncpt) {
			fncClipboardCopy(isActiveCard.cardNoEncpt);
			fncShowPop({
				mainText: '복사되었습니다.',
				primaryText: '확인',
				onClickPrimary: () => fncClosePop()
			})
		}
	}

	// 카드명
	const fncReformCardName = (code) => {
		if(!code) return '-';
		let name = FindCardProductName[code];
		let split = name.split('카드');
		return split.length ? split[0] : '-';
	}

	// 카드해지
	const fncDelete = () => {
        fncShowPop({
	        mainText: '카드를 삭제하시겠어요?\n삭제하면 환불/분실 신청이 어려워요.',
            description: <span className={'text-dynamic-text-negative-primary'}>잔액이 있는 경우, 환불/분실 절차를 먼저 진행해 주세요.</span>,
            tertiaryText: '취소',
            onClickTertiary: () => fncClosePop(),
            primaryText: ' 카드삭제',
            onClickPrimary: async () => {
				fncClosePop();
				const encoded = await fncEncode(isActiveCard?.cardNoEncpt);
				if(!encoded) return;
				if(isActiveCard?.mypgCardSeCd === CODE.CARD_SEG_PLA_DEFAULT) mutDelDefaultCard({cardNoEncpt: encoded});
				if(isActiveCard?.mypgCardSeCd === CODE.CARD_SEG_PLA_SAFE) mutDelSafeCard({cardNoEncpt: encoded});
            }
        })
	}

	// 소득공제 핸들러
	const fncDeduction = () => {
		if(isActiveCard.earnDdcYn === 'Y') {
			fncShowPop({
				mainText: '연동된 소득공제를 해지하시겠어요?',
				tertiaryText: '취소',
				onClickTertiary: () => fncClosePop(),
				warningText: '해지',
				onClickWarning: async () => {
					// 소득공제 해제
					const encoded = await fncEncode(isActiveCard?.cardNoEncpt);
					if(!encoded) return;
					mutUpdateCard({
						cardNoEncpt: encoded,
						earnDdcYn: 'N'
					});
				}
			})
		} else {
			// 소득공제 등록
			setPopTaxDeduction(!popTaxDeduction);
		}
	}

	// 소득공제 팝업 핸들러
	const fncToggleDeductionPop = () => {
        setPopTaxDeduction(!popTaxDeduction);
	}

	// 소득공제 등록
	const fncUpdateObj = async (obj) => {
		if(!isActiveCard?.cardNoEncpt) return;
		const encoded = await fncEncode(isActiveCard?.cardNoEncpt);
		if(!encoded) return;
		mutUpdateCard({
			cardNoEncpt: encoded,
			...obj
		});
	}

	// 수정 모드 핸들러
	const fncToggleEditNickNm = () => {
		setIsEditNickNm(!isEditNickNm);
	}

	// 입력
	const fncChangeInput = (e) => {
		setNewNickNm(e.target.value);
	}

	const fncHandlers = {
		goAdd: fncGoAdd,
		goKpass: fncGoKpass,
		goUsage: fncGoUsage,
		goCoupon: fncGoCoupon,
		goRefund: fncGoRefund,
		goLost: fncGoLost,
		selectCard: fncSelectCard,
		copy: fncCopy,
		reformCardName: fncReformCardName,
		delete: fncDelete,
        deduction: fncDeduction,
        toggleDeductionPop: fncToggleDeductionPop,
		updateObj: fncUpdateObj,
		toggleEditNickNm: fncToggleEditNickNm,
		changeInput: fncChangeInput,
	}

	const fncCallbackEvent = (fncName, variable, payload = {}) => {
		const fnc = fncHandlers[fncName];
		if (typeof fnc === 'function') return fnc(variable, payload);
	}

	if (isMobile) return (
		<MoMyCard
			fncCallbackEvent={fncCallbackEvent}
			data={{
				isActiveCard,
				popTaxDeduction,
				cardList,
				isEditNickNm,
				newNickNm,
				moRealnameRes
			}}
		/>
	);
	else return (
		<DtMyCard
			fncCallbackEvent={fncCallbackEvent}
			data={{
				isActiveCard,
				popTaxDeduction,
				cardList,
				isEditNickNm,
				newNickNm
			}}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F225
 */
DtMyCard.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function DtMyCard({data, fncCallbackEvent}) {
	return (
		<main id={'my'} className={'body-wrap-832'} aria-labelledby={'page-name-dt'}>
		    <Breadcrumb addPaths={[]} />
			<h1 id={'page-name-dt'} className={'page-title'}>
				내 카드
			</h1>
			<div>
				<div className={'flex justify-end'}>
					<Button
						theme={'primary'}
						size={'sm'}
						text={'카드등록'}
						customStyle={'w-[103px]'}
						icon={<Plus color={'text-dynamic-icon-neutral-primary'} />}
						iconPosition={'left'}
						onClick={() => fncCallbackEvent('goAdd')}
					/>
				</div>
				{
					data.cardList?.length > 0 ? (
						<div className={'card-wrap'}>
							<div className={'card-list'}>
								{
									data.cardList.map((card) => {
										const isActive = data.isActiveCard?.cardMngNo === card.cardMngNo;
										return (
											<button
												key={card.cardMngNo}
												type={'button'}
												aria-label={`${card?.mypgCardSeCd ? fncCallbackEvent('reformCardName', card.mypgCardSeCd) : '카드'}, ${card?.cardUseYn === 'N' ? '사용 중지 됨' : `잔액 ${fncMaskComma(card.blncSum || 0)}원`},  ${isActive ? '선택됨' : '선택안됨'}`}
												aria-pressed={isActive}
												className={`card-item ${isActive && 'active'}`}
												onClick={() => fncCallbackEvent('selectCard', card)}
												onKeyDown={(e) => {
													if(e.key === 'Enter' || e.key === ' ') {
														e.preventDefault();
														fncCallbackEvent('selectCard', card)
													}
												}}
											>
												<div className={'text-start'} aria-hidden={true}>
													<p className={'card-name'}>
														{card?.mypgCardSeCd && fncCallbackEvent('reformCardName', card.mypgCardSeCd)}
													</p>
													<p className={'card-amount'}>
														{
															card?.cardUseYn === 'N' ? (
																'사용 중지된 카드'
															) : (
																`${fncMaskComma(card.blncSum || 0)}원`
															)
														}
													</p>
												</div>
												<div aria-hidden={true}>
													{
														isActive ? (
															<CheckBold
																width={24} height={24}
																color={'text-dynamic-icon-brand-primary'}
															/>
														) : (
															<Badge
																id={'issuCardPssrTypeCd'}
																code={card.issuCardPssrTypeCd}
																paymentCode={card.mypgCardSeCd}
															/>
														)
													}
												</div>
											</button>
										)
									})
								}
							</div>
							<div className={'card-detail'}>
								<div className={'min-h-[300px]'}>
									<p className={'title'}>
										카드 정보
									</p>
									<div className={'flex-row-center table-row'}>
										<p className={'table-key'}>카드유형</p>
										<div className={'table-value'}>
											{
												data.isActiveCard ? (
													<Badge
														id={'issuCardPssrTypeCd'}
														code={data.isActiveCard?.issuCardPssrTypeCd}
														paymentCode={data.isActiveCard?.mypgCardSeCd}
													/>
												) : (
													'-'
												)
											}
										</div>
									</div>
									<div className={'flex-row-center table-row'}>
										<p className={'table-key'}>별칭</p>
										<div className={'table-value flex-row-center gap-10'}>
											{
												data.isEditNickNm ? (
													<>
														<InputText
															size={'sm'}
															placeholder={'카드에 등록할 별칭 최대 20자리 입력'}
															allows={['alnum', 'kor']}
															id={'newNickNm'}
															maxLength={20}
															fitWidth={true}
															value={data.newNickNm}
															onChange={(e) => fncCallbackEvent('changeInput', e)}
														/>
														<Button
															theme={'secondary'}
															size={'sm'}
															text={'저장'}
															ariaLabel={'새 카드 별칭 저장'}
															customStyle={'w-[80px]'}
															onClick={() => fncCallbackEvent('updateObj', {cardNcknmNm: data.newNickNm})}
														/>
													</>
												) : (
													<>
														{data.isActiveCard?.cardNcknmNm || '레일플러스'}
														<Button
															theme={'iconOnly'}
															size={'sm'}
															ariaLabel={'카드 별칭 수정'}
															icon={<Edit />}
															iconPosition={'center'}
															onClick={() => fncCallbackEvent('toggleEditNickNm')}
														/>
													</>
												)
											}
										</div>
									</div>
									<div className={'flex-row-center table-row'}>
										<p className={'table-key'}>카드번호</p>
										<div className={'table-value flex-row-center justify-start'}>
											<span>{fncMaskCardNo(data.isActiveCard?.cardNoEncpt) || '-'}</span>
											{
												data.isActiveCard?.mypgCardSeCd === CODE.CARD_SEG_MO_PRE && data.isActiveCard?.cardNoEncpt && (
													<button
														className={'ml-8'}
														aria-label={'카드 번호 복사'}
														onClick={() => fncCallbackEvent('copy')}
														onKeyDown={(e) => {
															if(e.key === 'Enter' || e.key === ' ') {
																e.preventDefault();
																fncCallbackEvent('copy');
															}
														}}
													>
														<Copy
															width={20} height={20}
															color={'text-dynamic-icon-neutral-primary'}
														/>
													</button>
												)
											}
										</div>
									</div>
									{
										data.isActiveCard?.mypgCardSeCd === CODE.CARD_SEG_MO_PRE && (
											<div className={'flex-row-center table-row'}>
												<p className={'table-key'}>KTX마일리지</p>
												<div className={'table-value'}>
													{data.isActiveCard?.mlgSum ? fncMaskComma(data.isActiveCard.mlgSum) : '-'}
												</div>
											</div>
										)
									}
									<div className={'flex-row-center table-row'}>
										<p className={'table-key'}>소득공제 연동</p>
										<div className={'table-value'}>
											<ToggleSwitch
												size={'sm'}
												isChecked={data.isActiveCard?.earnDdcYn === 'Y'}
												label={data.isActiveCard?.earnDdcYn === 'Y' ? `등록일: ${moment(toMomentFrom14(data.isActiveCard?.earnDdcRegDt)).format('YYYY-MM-DD')}` : '미연동'}
												disabled={!data.isActiveCard}
												onChange={() => fncCallbackEvent('deduction')}
											/>
										</div>
									</div>
									{
										// 모바일 선불 only
										[CODE.CARD_SEG_MO_PRE].includes(data.isActiveCard?.mypgCardSeCd) && (
											<div className={'flex-row-center table-row'}>
												<p className={'table-key'}>K-패스 연동</p>
												<div className={'table-value flex-row-center gap-10'}>
													<span>{data.isActiveCard?.kpsItlkYn === 'Y' ? '연동중' : '미연동'}</span>
													{
														data.isActiveCard?.kpsItlkYn !== 'Y' && (
															<button
																className={'button-kpass'}
																onClick={() => fncCallbackEvent('goKpass')}
																onKeyDown={(e) => {
																	if (e.key === 'Enter') fncCallbackEvent('goKpass');
																}}
															>
																<span>K-패스 연동하러가기</span>
																<ChevronRight
																	width={16} height={16}
																	color={'text-dynamic-icon-brand-primary'}
																/>
															</button>
														)
													}
												</div>
											</div>
										)
									}
								</div>
								<div className={'divider'}/>
								<p className={'title'}>
									카드 관리
								</p>
								<div className={'flex-row-center gap-16 flex-wrap'}>
									<button
										className={'button-function'}
										onClick={() => fncCallbackEvent('goUsage')}
										onKeyDown={(e) => {
											if (e.key === 'Enter') fncCallbackEvent('goUsage');
										}}
									>
										<FileText
											width={16} height={16}
											color={'text-dynamic-icon-neutral-tertiary'}
										/>
										<span>이용내역 조회</span>
									</button>
									{
										// 모바일 선불 only
										data.isActiveCard?.mypgCardSeCd === CODE.CARD_SEG_MO_PRE && (
											<button
												className={'button-function'}
												onClick={() => fncCallbackEvent('goCoupon')}
												onKeyDown={(e) => {
													if(e.key === 'Enter') fncCallbackEvent('goCoupon');
												}}
											>
                                                <Gift
                                                    width={16} height={16}
                                                    color={'text-dynamic-icon-neutral-tertiary'}
                                                />
                                                <span>쿠폰함 조회</span>
                                            </button>
                                        )
                                    }
									<button
										className={'button-function'}
										onClick={() => fncCallbackEvent('goRefund')}
										onKeyDown={(e) => {
											if(e.key === 'Enter') fncCallbackEvent('goRefund');
										}}
									>
										<Rotate
											width={16} height={16}
											color={'text-dynamic-icon-neutral-tertiary'}
										/>
										<span>환불신청</span>
									</button>
                                    {
										// 대중교통카드 only
										data.isActiveCard?.mypgCardSeCd === CODE.CARD_SEG_PLA_SAFE && (
                                            <button
												className={'button-function'}
												onClick={() => fncCallbackEvent('goLost')}
												onKeyDown={(e) => {
													if(e.key === 'Enter') fncCallbackEvent('goLost');
												}}
											>
                                                <Edit
                                                    width={16} height={16}
                                                    color={'text-dynamic-icon-neutral-tertiary'}
                                                />
                                                <span>분실신청</span>
                                            </button>
	                                    )
                                    }
                                    {
										// 실물카드 only
                                        [CODE.CARD_SEG_PLA_DEFAULT, CODE.CARD_SEG_PLA_SAFE].includes(data.isActiveCard?.mypgCardSeCd) && (
		                                    <button
												className={'button-function'}
												onClick={() => fncCallbackEvent('delete')}
												onKeyDown={(e) => {
													if(e.key === 'Enter') fncCallbackEvent('delete');
												}}
											>
                                                <Trash
                                                    width={16} height={16}
                                                    color={'text-dynamic-icon-negative-primary'}
                                                />
                                                <span>카드삭제</span>
                                            </button>
                                        )
                                    }
								</div>
								{
									// 사용 중지
									data.isActiveCard?.cardUseYn === 'N' && (
										<div className={'block-wrap'}>
											<div className={'block-warn-wrap'}>
												<MinusCircleFill
													width={24} height={24}
													color={'text-dynamic-icon-negative-primary'}
												/>
												{
													data.isActiveCard?.mypgCardSeCd === CODE.CARD_SEG_MO_PRE ? (
														// 모바일 선불 O
														<>
															<p>사용 중지된 카드</p>
															<p>다시 사용을 원하시면 레일플러스 앱에 접속하여 내 카드 {'\u003E'} 해당 카드 상단의 [더보기]에서 사용중지를 해제하세요.</p>
														</>
													) : (
														// 모바일 선불 X
														<p>사용 불가 카드</p>
													)
												}
											</div>
										</div>
									)
								}
							</div>
						</div>
					) : (
						<div className={'empty-wrap'}>
							<EmptyUserCard />
							<p>등록된 카드가 없어요</p>
							<p>카드 등록을 원하시면 카드 등록 버튼을 클릭해주세요.</p>
						</div>
					)
				}
			</div>

			{
				// 팝업: 소득공제
				data.popTaxDeduction && (
					<TaxDeductionPop
						store={{
							isActiveCard: data.isActiveCard
						}}
						onClose={() => fncCallbackEvent('toggleDeductionPop')}
						onDone={(obj) => fncCallbackEvent('updateObj', obj)}
					/>
				)
			}
		</main>
	)
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F447
 */
MoMyCard.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function MoMyCard({data, fncCallbackEvent}) {

	const CARD_A11Y_PREFIX = 'my-card';

	// 아코디언 헤더
	const renderHeaderComponent = (card) => {
		const isActive = data.isActiveCard?.cardMngNo === card.cardMngNo;
		const {triggerId, panelId} = accordionA11yIds(CARD_A11Y_PREFIX, card.cardMngNo);
		const cardLabel = card?.mypgCardSeCd
			? fncCallbackEvent('reformCardName', card.mypgCardSeCd)
			: '카드';
		return (
			<div className={'card-list w-full'}>
				<button
					type={'button'}
					key={card.cardMngNo}
					id={triggerId}
					aria-expanded={isActive}
					aria-controls={panelId}
					aria-label={`${cardLabel}, ${card?.cardUseYn === 'N' ? '사용 중지 됨' : `잔액 ${fncMaskComma(card.blncSum || 0)}원`}, ${isActive ? '선택됨' : '선택안됨'}`}
					className={`card-item ${isActive && 'active'}`}
					onClick={() => fncCallbackEvent('selectCard', card)}
					onKeyDown={(e) => {
						if(e.key === 'Enter' || e.key === ' ') {
							e.preventDefault();
							fncCallbackEvent('selectCard', card)
						}
					}}
				>
					<div className={'text-start'} aria-hidden={true}>
						<p className={'card-name'}>
							{card?.mypgCardSeCd && fncCallbackEvent('reformCardName', card.mypgCardSeCd)}
						</p>
						<p className={'card-amount'}>
							{
								card?.cardUseYn === 'N' ? (
									'사용 중지된 카드'
								) : (
									`${fncMaskComma(card.blncSum || 0)}원`
								)
							}
						</p>
					</div>
					<div aria-hidden={true}>
						{
							isActive ? (
								<CheckBold
									width={24} height={24}
									color={'text-dynamic-icon-brand-primary'}
									aria-hidden={true}
								/>
							) : (
								<Badge
									id={'issuCardPssrTypeCd'}
									code={card.issuCardPssrTypeCd}
									paymentCode={card.mypgCardSeCd}
								/>
							)
						}
					</div>
				</button>
			</div>
		)
	}

	// 아코디언 바디
	const renderBodyComponent = (card) => {
		const isActive = data.isActiveCard?.cardMngNo === card.cardMngNo;
		const {panelId, triggerId} = accordionA11yIds(CARD_A11Y_PREFIX, card.cardMngNo);
		return (
			<div
				id={panelId}
				role={'region'}
				aria-labelledby={triggerId}
				aria-hidden={!isActive}
				className={'card-detail'}
			>
				<p className={'title'}>
					카드 정보
				</p>
				<div className={'flex-row-center table-row'}>
					<p className={'table-key'}>카드유형</p>
					<div className={'table-value'}>
                        {
                            data.isActiveCard ? (
                                <Badge
                                    id={'issuCardPssrTypeCd'}
                                    code={data.isActiveCard?.issuCardPssrTypeCd}
                                    paymentCode={data.isActiveCard?.mypgCardSeCd}
                                />
                            ) : (
                                '-'
                            )
                        }
					</div>
				</div>
				<div className={'flex-row-center table-row'}>
					<p className={'table-key'}>별칭</p>
					<div className={'table-value flex-row-center gap-10'}>
						{
							data.isEditNickNm ? (
								<>
									<InputText
										size={'sm'}
										placeholder={'카드에 등록할 별칭 최대 20자리 입력'}
										allows={['alnum', 'kor', 'space']}
										id={'newNickNm'}
										maxLength={20}
										fitWidth={true}
										value={data.newNickNm}
										onChange={(e) => fncCallbackEvent('changeInput', e)}
									/>
									<Button
										theme={'secondary'}
										size={'sm'}
										text={'저장'}
										ariaLabel={'새 카드 별칭 저장'}
										customStyle={'w-[80px]'}
										onClick={() => fncCallbackEvent('updateObj', {cardNcknmNm: data.newNickNm})}
									/>
								</>
							) : (
								<>
									{data.isActiveCard?.cardNcknmNm || '레일플러스'}
									<Button
										theme={'iconOnly'}
										size={'sm'}
										ariaLabel={'카드 별칭 수정'}
										icon={<Edit />}
										iconPosition={'center'}
										onClick={() => fncCallbackEvent('toggleEditNickNm')}
									/>
								</>
							)
						}
					</div>
				</div>
				<div className={'flex-row-center table-row'}>
					<p className={'table-key'}>카드번호</p>
					<div className={'table-value'}>
						<span>{fncMaskCardNo(data.isActiveCard?.cardNoEncpt) || '-'}</span>
						{
							data.isActiveCard?.mypgCardSeCd === CODE.CARD_SEG_MO_PRE && data.isActiveCard?.cardNoEncpt && (
								<button
									className={'ml-8'}
									aria-label={'카드 번호 복사'}
									onClick={() => fncCallbackEvent('copy')}
									onKeyDown={(e) => {
										if(e.key === 'Enter' || e.key === ' ') {
											e.preventDefault();
											fncCallbackEvent('copy');
										}
									}}
								>
									<Copy
										width={20} height={20}
										color={'text-dynamic-icon-neutral-primary'}
									/>
								</button>
							)
						}
					</div>
				</div>
				{
					data.isActiveCard?.mypgCardSeCd === CODE.CARD_SEG_MO_PRE && (
						<div className={'flex-row-center table-row'}>
							<p className={'table-key'}>KTX마일리지</p>
							<div className={'table-value'}>
								{data.isActiveCard?.mlgSum ? fncMaskComma(data.isActiveCard.mlgSum) : '-'}
							</div>
						</div>
					)
				}
				<div className={'flex-row-center table-row'}>
					<p className={'table-key'}>소득공제 연동</p>
					<div className={'table-value'}>
                        <ToggleSwitch
                            size={'sm'}
                            isChecked={data.isActiveCard?.earnDdcYn === 'Y'}
							label={data.isActiveCard?.earnDdcYn === 'Y' ? `등록일: ${moment(toMomentFrom14(data.isActiveCard?.earnDdcRegDt)).format('YYYY-MM-DD')}` : '미연동'}
                            onChange={() => fncCallbackEvent('deduction')}
                        />
					</div>
				</div>
				{
					// 모바일 선불 only
					[CODE.CARD_SEG_MO_PRE].includes(data.isActiveCard?.mypgCardSeCd) && (
						<div className={'flex-row-center table-row'}>
							<p className={'table-key'}>K-패스 연동</p>
							<div className={'table-value flex-row-center gap-10'}>
								<span>{data.isActiveCard?.kpsItlkYn === 'Y' ? '연동중' : '미연동'}</span>
								{
									data.isActiveCard?.kpsItlkYn !== 'Y' && (
										<button
											className={'button-kpass'}
											onClick={() => fncCallbackEvent('goKpass')}
											onKeyDown={(e) => {
												if(e.key === 'Enter') fncCallbackEvent('goKpass');
											}}
										>
											<span>K-패스 연동하러가기</span>
											<ChevronRight
												width={16} height={16}
												color={'text-dynamic-icon-brand-primary'}
											/>
										</button>
									)
								}
							</div>
						</div>
					)
				}
				<div className={'divider'} />
				<p className={'title'}>
					카드 관리
				</p>
				<div className={'flex-row-center gap-16 flex-wrap mo:px-8'}>
					<button
						className={'button-function'}
						onClick={() => fncCallbackEvent('goUsage')}
						onKeyDown={(e) => {
							if(e.key === 'Enter') fncCallbackEvent('goUsage');
						}}
					>
						<FileText
							width={16} height={16}
							color={'text-dynamic-icon-neutral-tertiary'}
						/>
						<span>이용내역 조회</span>
					</button>
                    {
						// 모바일 선불 only
						data.isActiveCard?.mypgCardSeCd === CODE.CARD_SEG_MO_PRE && (
                            <button
								className={'button-function'}
								onClick={() => fncCallbackEvent('goCoupon')}
								onKeyDown={(e) => {
									if(e.key === 'Enter') fncCallbackEvent('goCoupon');
								}}
							>
                                <Gift
                                    width={16} height={16}
                                    color={'text-dynamic-icon-neutral-tertiary'}
                                />
                                <span>쿠폰함 조회</span>
                            </button>
                        )
                    }
					<button
						className={'button-function'}
						onClick={() => fncCallbackEvent('goRefund')}
						onKeyDown={(e) => {
							if(e.key === 'Enter') fncCallbackEvent('goRefund');
						}}
					>
						<Rotate
							width={16} height={16}
							color={'text-dynamic-icon-neutral-tertiary'}
						/>
						<span>환불신청</span>
					</button>
                    {
						// 대중교통카드 only
						data.isActiveCard?.mypgCardSeCd === CODE.CARD_SEG_PLA_SAFE && (
                            <button
								className={'button-function'}
								onClick={() => fncCallbackEvent('goLost')}
								onKeyDown={(e) => {
									if(e.key === 'Enter') fncCallbackEvent('goLost');
								}}
							>
                                <Edit
                                    width={16} height={16}
                                    color={'text-dynamic-icon-neutral-tertiary'}
                                />
                                <span>분실신청</span>
                            </button>
                        )
                    }
                    {
						// 실물카드 only
						[CODE.CARD_SEG_PLA_DEFAULT, CODE.CARD_SEG_PLA_SAFE].includes(data.isActiveCard?.mypgCardSeCd) && (
                            <button
								className={'button-function'}
								onClick={() => fncCallbackEvent('delete')}
								onKeyDown={(e) => {
									if(e.key === 'Enter') fncCallbackEvent('delete');
								}}
							>
                                <Trash
                                    width={16} height={16}
                                    color={'text-dynamic-icon-negative-primary'}
                                />
                                <span>카드삭제</span>
                            </button>
	                    )
                    }
				</div>
				{
					// 사용 중지
					data.isActiveCard?.cardUseYn === 'N' && (
						<div className={'block-wrap'}>
							<div className={'block-warn-wrap'}>
								<MinusCircleFill
									width={24} height={24}
									color={'text-dynamic-icon-negative-primary'}
								/>
								{
									data.isActiveCard?.mypgCardSeCd === CODE.CARD_SEG_MO_PRE ? (
										// 모바일 선불 O
										<>
											<p>사용 중지된 카드</p>
											<p>다시 사용을 원하시면 레일플러스 앱에 접속하여 내 카드 {'\u003E'} 해당 카드 상단의 [더보기]에서 사용중지를
												해제하세요.</p>
										</>
									) : (
										// 모바일 선불 X
										<p>사용 불가 카드</p>
									)
								}
							</div>
						</div>
					)
				}
			</div>
		)
	}

	return (
		<main id={'my'} className={'body-wrap-mobile-screen-height'} aria-labelledby={'page-name-mo'}>
			<h1 id={'page-name-mo'} className={'sr-only'}>내 카드 관리</h1>
			{
				data.cardList?.length > 0 ? (
					<div className={'page-bottom-space'}>
						<div className={'card-wrap'}>
							{
								data.cardList.map((card) => {
									return (
										<Accordion
											key={card.cardMngNo}
											active={data.isActiveCard?.cardMngNo === card.cardMngNo}
											panelId={accordionA11yIds(CARD_A11Y_PREFIX, card.cardMngNo).panelId}
											headerComponent={() => renderHeaderComponent(card)}
											bodyComponent={() => renderBodyComponent(card)}
										/>
									)
								})
							}
						</div>
					</div>
				) : (
					<div className={'empty-wrap'}>
						<EmptyUserCard />
						<p>등록된 카드가 없어요</p>
						<p>카드 등록을 원하시면 카드 등록 버튼을 클릭해주세요.</p>
					</div>
				)
			}
			<div className={'page-bottom-button-wrap'}>
				<Button
					theme={'primary'}
					size={'lg'}
					text={'카드등록'}
					icon={<Plus color={'text-dynamic-icon-neutral-primary'} />}
					iconPosition={'left'}
					customStyle={'w-full'}
					onClick={() => fncCallbackEvent('goAdd')}
				/>
			</div>

			{
				// 팝업: 소득공제
				data.popTaxDeduction && (
					<TaxDeductionPop
						store={{
							isActiveCard: data.isActiveCard,
							moRealnameRes: data.moRealnameRes
						}}
						onClose={() => fncCallbackEvent('toggleDeductionPop')}
						onDone={(obj) => fncCallbackEvent('updateObj', obj)}
					/>
				)
			}
		</main>
	)
}
