'use client'

import React, {useLayoutEffect} from 'react';
import PropTypes from 'prop-types';
import {useRouter} from 'next/navigation';

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {useMoHeaderContext} from '@modules/context/MoHeaderContext';
import {RouteConfig} from '@modules/config/RouteConfig';
import {useLoadingContext} from '@modules/context/LoadingContext';
import {useWebContext} from '@modules/context/WebviewContext';

// components
import Breadcrumb from '@components/layout/Breadcrumb';
import Button from '@components/common/Button';

// assets
import {
	AboutATM, AboutCardStateDestroyed, AboutCardStateNonRefund, AboutCardStateNormal,
	AboutConvenienceStore, AboutMetro, AboutMobileApp, AboutSelfMachine, BasicRailplusCard,
} from '@assets/icons/AboutSvgs';
import {ChevronRight} from '@assets/icons/Svgs';


/**
 * @description: 일반 Rail+ 카드 소개 화면 입니다.
 * @screenID:    UI-CRM-F213, UI-CRM-F421
 * @screenPath:  홈 > Rail+ 소개 > 일반 Rail+ 카드
 * @author       $Author
 * @since        $Date
 * @version      $Revision
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function AboutBasicCard() {

	const router = useRouter();
	const {isMobile} = useScreenSizeContext();
	const {isAccApp, reloadKey, fncFocusLayout} = useWebContext();
	const {fncChangeMoHeader} = useMoHeaderContext();
	const {fncRouteStart} = useLoadingContext();

	// Mobile Only: 모바일 헤더
	useLayoutEffect(() => {
		if (isAccApp) fncFocusLayout();
		if (isMobile) {
			fncChangeMoHeader({
				type: 'back',
				title: '일반 Rail+ 카드'
			})
		}
	}, [isMobile, isAccApp, reloadKey])

	// 이동: 이용안내
	const fncGoGuide = () => {
		const targetUri = RouteConfig.GUIDE_BASIC.PATH;
		fncRouteStart(targetUri);
		router.push(targetUri);
	}

	const fncHandlers = {
		goGuide: fncGoGuide,
	}

	const fncCallbackEvent = (fncName, variable, payload = {}) => {
		const fnc = fncHandlers[fncName];
		if (typeof fnc === 'function') return fnc(variable, payload);
	}

	if (isMobile) return (
		<MoAboutBasicCard
			fncCallbackEvent={fncCallbackEvent}
		/>
	);
	else return (
		<DtAboutBasicCard
			fncCallbackEvent={fncCallbackEvent}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F213
 */
DtAboutBasicCard.propTypes = {
	fncCallbackEvent: PropTypes.func
};

export function DtAboutBasicCard({fncCallbackEvent}) {
	return (
		<main id={'about'} className={'body-wrap-880'} aria-labelledby={'page-name-dt'}>
			<Breadcrumb addPaths={[]}/>
			<h1 id={'page-name-dt'} className={'page-title'}>
				일반 Rail+ 카드
			</h1>
			<section className={'card-wrap'}>
				<div className={'image-wrap'}>
					<BasicRailplusCard />
				</div>
				<div className={'info-wrap'}>
					<h1 className={'catchphrase'}>
						카드 한 장으로 전국 어디서나<br/>모든 교통을 해결하세요!
					</h1>
					<h2 className={'catchphrase-sub'}>
						지하철, 버스, 택시, 고속도로부터 편의점과 주차장까지 이용 가능한 전국 호환 선불 교통카드로, 어린이, 청소년, 일반용의 다양한 권종으로 제공됩니다.
					</h2>
					<Button
						theme={'textOnly'}
						size={'xs'}
						text={'일반 Rail+ 카드 이용안내'}
						ariaLabel={'일반 Rail+ 카드 이용안내'}
						icon={<ChevronRight width={20} height={20}/>}
						iconPosition={'right'}
						customStyle={'w-fit'}
						onClick={() => fncCallbackEvent('goGuide')}
					/>
				</div>
			</section>
			<section className={'detail-wrap'}>
				<div className={'type01'} aria-labelledby={'group01'}>
					<dl>
						<dt id={'group01'}>충전 안내</dt>
						<dd>
							<div className={'flex-row-center'}>
								<AboutMobileApp/>
								레일플러스 모바일 앱
							</div>
							<div className={'flex-row-center'}>
								<AboutMetro/>
								기차역 매표창구
							</div>
							<div className={'flex-row-center'}>
								<AboutSelfMachine/>
								지하철 내 무인기기 (충전기, 발매기, 정산기)
							</div>
							<div className={'flex-row-center'}>
								<AboutConvenienceStore/>
								편의점 (스토리웨이, 이마트24, CU)
							</div>
							<div className={'flex-row-center'}>
								<AboutATM/>
								ATM기기 (우리은행, 농협, 롯데)
							</div>
							<ul className={'comment'}>
								<li>충전한도는 1회 최대 7만원, 총 50만원까지 가능합니다.</li>
								<li>농협 ATM은 계좌이체 충전만 지원합니다.</li>
							</ul>
						</dd>
					</dl>
				</div>
				<hr />
				<div className={'type02'} aria-labelledby={'group02'}>
					<dl>
						<dt id={'group02'}>환불 안내</dt>
						<dd>
							<div>
								<div className={'flex-row-center green'}>
									<AboutCardStateNormal/>
									정상카드일 때
								</div>
								<ul className={'comment'}>
									<li>수수료 500원을 제외한 잔액 환불 가능</li>
									<li>20만원 이상 잔액은 본사에서 처리</li>
								</ul>
							</div>
							<div>
								<div className={'flex-row-center green'}>
									<AboutCardStateDestroyed/>
									고장난 카드일 때
								</div>
								<ul className={'comment'}>
									<li>환불 접수 후 2주 이내 절차 완료 후 계좌로 입금</li>
								</ul>
							</div>
							<div>
								<div className={'flex-row-center green'}>
									<AboutCardStateNonRefund/>
									환불 불가 조건
								</div>
								<ul className={'comment'}>
									<li>카드 손상, 분실, 포장 개봉 및 사용된 경우</li>
									<li>충전 금액 확인이 불가한 경우</li>
								</ul>
							</div>
						</dd>
					</dl>
				</div>
				<hr />
				<div className={'type03'} aria-labelledby={'group03'}>
					<dl>
						<dt id={'group03'}>환불 및 수수료</dt>
						<dd>
							<div className={'relative'}>
								<h3 className={'title'}>온라인</h3>
								<table aria-label={'온라인 환불 및 수수료 안내 표'} summary={'온라인 환불 및 수수료 안내 표입니다.'}>
									<caption className='sr-only'>온라인 환불 및 수수료 안내</caption>
									<thead>
										<tr>
											<th scope='col' className='sr-only'>구분</th>
											<th scope='col' className='sr-only'>내용</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<th scope='col'>환불처</th>
											<td className={'col-span-3'}>Rail+ 홈페이지, Rail+ 앱</td>
										</tr>
										<tr>
											<th scope='col'>환불금액기준<br/>(소요시간)</th>
											<td className={'col-span-3'}>20만원 초과 (최대 14일 이내)</td>
										</tr>
										<tr>
											<th scope='col'>환불수수료</th>
											<td className={'col-span-3'}>500원</td>
										</tr>
										<tr>
											<th scope='col'>환불방법</th>
											<td className={'col-span-3'}>
												<ul>
													<li>홈페이지 접속 및 로그인</li>
													<li>환불봉투 작성/출력 (카드동봉)</li>
													<li>우편 접수(KN 환불담당자 앞)</li>
												</ul>
											</td>
										</tr>
										<tr>
											<th scope='col'>1일 최대<br/>환불 금액</th>
											<td className={'col-span-3'}>50만원</td>
										</tr>
									</tbody>
									<tfoot></tfoot>
								</table>
							</div>
							<div className={'relative'}>
								<h3 className={'title'}>오프라인</h3>
								<table aria-label={'오프라인 환불 및 수수료 안내 표'} summary='오프라인 환불 및 수수료 안내 표입니다.'>
									<caption className='sr-only'>오프라인 환불 및 수수료 안내</caption>
									<thead>
										<tr>
											<th scope='col' className='sr-only'>구분</th>
											<th scope='col' className='sr-only'>내용</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<th scope='col'>환불처</th>
											<td className={'col-span-1'}>
												<p className={'font-semibold'}>철도역</p>
												<p>- 간선 철도역</p>
												<p>- 광역 철도역</p>
											</td>
											<td className={'col-span-1'}>
												<p className={'font-semibold'}>편의점</p>
												<p>- emart 24</p>
												<p>- CU</p>
											</td>
											<td className={'col-span-1'} style={{justifyContent: 'flex-start'}}>
												<p className={'font-semibold'}>ATM</p>
												<p>- 우리은행</p>
											</td>
										</tr>
										<tr>
											<th scope='col'>환불금액기준<br/>(소요시간)</th>
											<td className={'col-span-1'}>20만원 이하 (즉시반환)</td>
											<td className={'col-span-1'}>3만원 이하 (즉시 반환)</td>
											<td className={'col-span-1'}>20만원 이하 (즉시 반환)</td>
										</tr>
										<tr>
											<th scope='col'>환불수수료</th>
											<td className={'col-span-1'}>500원</td>
											<td className={'col-span-1'}>500원</td>
											<td className={'col-span-1'}>500원</td>
										</tr>
										<tr>
											<th scope='col'>환불방법</th>
											<td className={'col-span-1'}>
												<p>- 매표창구(WTIM)<br/>단말기 환불</p>
												<p>- 휴대 정산기 환불</p>
											</td>
											<td className={'col-span-1'}>
												<p>- 결제 단말기 환불</p>
											</td>
											<td className={'col-span-1'}>
												<p>- ATM 단말기 환불<br/>(우리은행 계좌 보유고객 限)</p>
											</td>
										</tr>
										<tr>
											<th scope='col'>1일 최대<br/>환불 금액</th>
											<td className={'col-span-1'}>20만원</td>
											<td className={'col-span-1'}>5만원</td>
											<td className={'col-span-1'}>20만원</td>
										</tr>
									</tbody>
									<tfoot></tfoot>
								</table>
							</div>
							<ul className={'comment'}>
								<li>불량카드는 홈페이지에서 온라인 환불접수 후 우편 송부</li>
								<li>연간 누적 50만원을 초과하는 경우의 환불수수료 : 환불금액의 1%</li>
							</ul>
						</dd>
					</dl>
				</div>
			</section>
		</main>
	)
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F421
 */
MoAboutBasicCard.propTypes = {
	fncCallbackEvent: PropTypes.func
};
export function MoAboutBasicCard({fncCallbackEvent}) {
	return (
		<main id={'about'} className={'w-full page-bottom-space'} aria-labelledby={'page-name-mo'}>
			<h1 id={'page-name-mo'} className={'sr-only'}>일반 Rail+ 카드</h1>
			<section className={'card-wrap bg-gradient-to-b from-[#6EC3FF]/30 to-bg-dynamic-by-neutral-base'}>
				<div className={'image-wrap'}>
					<BasicRailplusCard />
				</div>
				<div className={'info-wrap'}>
					<h1 className={'catchphrase'}>
						카드 한 장으로 전국 어디서나<br/>모든 교통을 해결하세요!
					</h1>
					<h2 className={'catchphrase-sub'}>
						지하철, 버스, 택시, 고속도로부터 편의점과 주차장까지<br/>이용 가능한 전국 호환 선불 교통카드로,<br/>어린이, 청소년, 일반용의 다양한 권종으로 제공됩니다.
					</h2>
					<Button
						theme={'textOnly'}
						size={'sm'}
						text={'일반 Rail+ 카드 이용안내'}
						ariaLabel={'일반 Rail+ 카드 이용안내'}
						icon={<ChevronRight width={20} height={20}/>}
						iconPosition={'right'}
						customStyle={'w-fit'}
						onClick={() => fncCallbackEvent('goGuide')}
					/>
				</div>
			</section>
			<section className={'detail-wrap'}>
				<div className={'type01'} aria-labelledby={'group01'}>
					<dl>
						<dt id={'group01'}>충전 안내</dt>
						<dd>
							<div className={'flex-row-center'}>
								<AboutMobileApp width={36} height={36} />
								레일플러스 모바일 앱
							</div>
							<div className={'flex-row-center'}>
								<AboutMetro width={36} height={36} />
								기차역 매표창구
							</div>
							<div className={'flex-row-center'}>
								<AboutSelfMachine width={36} height={36} />
								지하철 내 무인기기 (충전기, 발매기, 정산기)
							</div>
							<div className={'flex-row-center'}>
								<AboutConvenienceStore width={36} height={36} />
								편의점 (스토리웨이, 이마트24, CU)
							</div>
							<div className={'flex-row-center'}>
								<AboutATM width={36} height={36} />
								ATM기기 (우리은행, 농협, 롯데)
							</div>
							<ul className={'comment'}>
								<li>충전한도는 1회 최대 7만원, 총 50만원까지 가능합니다.</li>
								<li>농협 ATM은 계좌이체 충전만 지원합니다.</li>
							</ul>
						</dd>
					</dl>
				</div>
				<div className={'type02'} aria-labelledby={'group02'}>
					<dl>
						<dt id={'group02'}>환불 안내</dt>
						<dd>
							<div>
								<div className={'flex-row-center green'}>
									<AboutCardStateNormal/>
									정상카드일 때
								</div>
								<ul className={'comment'}>
									<li>수수료 500원을 제외한 잔액 환불 가능</li>
									<li>20만원 이상 잔액은 본사에서 처리</li>
								</ul>
							</div>
							<hr/>
							<div>
								<div className={'flex-row-center green'}>
									<AboutCardStateDestroyed/>
									고장난 카드일 때
								</div>
								<ul className={'comment'}>
									<li>환불 접수 후 2주 이내 절차 완료 후 계좌로 입금</li>
								</ul>
							</div>
							<hr/>
							<div>
								<div className={'flex-row-center green'}>
									<AboutCardStateNonRefund/>
									환불 불가 조건
								</div>
								<ul className={'comment'}>
									<li>카드 손상, 분실, 포장 개봉 및 사용된 경우</li>
									<li>충전 금액 확인이 불가한 경우</li>
								</ul>
							</div>
						</dd>
					</dl>
				</div>
				<div className={'type03'} aria-labelledby={'group03'}>
					<dl style={{padding: 0}}>
						<dt id={'group03'}>환불처 및 환불수수료</dt>
						<dd>
							<div className={'relative'}>
								<h3 className={'title'}>온라인</h3>
								<table aria-label={'온라인 환불 및 수수료 안내 표'} summary='온라인 환불 및 수수료 안내 표입니다.'>
									<caption className='sr-only'>온라인 환불 및 수수료 안내</caption>
									<thead>
										<tr>
											<th scope='col' className='sr-only'>구분</th>
											<th scope='col' className='sr-only'>내용</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<th scope='col'style={{paddingLeft: 4, paddingRight: 4}}>환불처</th>
											<td className={'col-span-3'}>Rail+ 홈페이지, Rail+ 앱</td>
										</tr>
										<tr>
											<th scope='col' style={{paddingLeft: 1, paddingRight: 1}}>환불금액기준<br/>(소요시간)</th>
											<td className={'col-span-3'} style={{justifyContent: 'center'}}>20만원 초과 (최대 14일 이내)</td>
										</tr>
										<tr>
											<th scope='col'style={{paddingLeft: 4, paddingRight: 4}}>환불수수료</th>
											<td className={'col-span-3'}>500원</td>
										</tr>
										<tr>
											<th scope='col'style={{paddingLeft: 4, paddingRight: 4}}>환불방법</th>
											<td className={'col-span-3'}>
												<ul>
													<li>홈페이지 접속 및 로그인</li>
													<li>환불봉투 작성/출력 (카드동봉)</li>
													<li>우편 접수(KN 환불담당자 앞)</li>
												</ul>
											</td>
										</tr>
										<tr>
											<th scope='col'style={{paddingLeft: 4, paddingRight: 4}}>1일 최대<br/>환불 금액</th>
											<td className={'col-span-3'} style={{justifyContent: 'center'}}>50만원</td>
										</tr>
									</tbody>
									<tfoot></tfoot>
								</table>
							</div>
							<div className={'relative'}>
								<h3 className={'title'}>오프라인</h3>
								<table aria-label={'오프라인 환불 및 수수료 안내 표'} summary='오프라인 환불 및 수수료 안내 표입니다.'>
									<thead>
										<tr>
											<th scope='col' className='sr-only'>구분</th>
											<th scope='col' className='sr-only'>내용</th>
										</tr>
									</thead>
									<caption className='sr-only'>오프라인 환불 및 수수료 안내</caption>
									<tbody>
										<tr>
											<th scope='col' style={{paddingLeft: 4, paddingRight: 4}}>환불처</th>
											<td className={'col-span-1'} style={{paddingLeft: 8, paddingRight: 8}}>
												<p className={'font-semibold'}>철도역</p>
												<p className={'break-keep'}>- 간선 철도역</p>
												<p className={'break-keep'}>- 광역 철도역</p>
											</td>
											<td className={'col-span-1'} style={{paddingLeft: 8, paddingRight: 8}}>
												<p className={'font-semibold'}>편의점</p>
												<p className={'break-keep'}>- emart 24</p>
												<p className={'break-keep'}>- CU</p>
											</td>
											<td className={'col-span-1'} style={{justifyContent: 'flex-start', paddingLeft: 8, paddingRight: 8}}>
												<p className={'font-semibold'}>ATM</p>
												<p className={'break-keep'}>- 우리은행</p>
											</td>
										</tr>
										<tr>
											<th scope='col' style={{paddingLeft: 1, paddingRight: 1}}>환불금액기준<br/>(소요시간)</th>
											<td className={'col-span-1'} style={{paddingLeft: 8, paddingRight: 8}}>
												<p className={'break-keep'}>20만원 이하 (즉시 반환)</p>
											</td>
											<td className={'col-span-1'} style={{paddingLeft: 8, paddingRight: 8}}>
												<p className={'break-keep'}>3만원 이하 (즉시 반환)</p>
											</td>
											<td className={'col-span-1'} style={{paddingLeft: 8, paddingRight: 8}}>
												<p className={'break-keep'}>20만원 이하 (즉시 반환)</p>
											</td>
										</tr>
										<tr>
											<th scope='col' style={{paddingLeft: 4, paddingRight: 4}}>환불수수료</th>
											<td className={'col-span-1'} style={{paddingLeft: 8, paddingRight: 8}}>500원</td>
											<td className={'col-span-1'} style={{paddingLeft: 8, paddingRight: 8}}>500원</td>
											<td className={'col-span-1'} style={{paddingLeft: 8, paddingRight: 8}}>500원</td>
										</tr>
										<tr>
											<th scope='col' style={{paddingLeft: 4, paddingRight: 4}}>환불방법</th>
											<td className={'col-span-1'} style={{paddingLeft: 8, paddingRight: 8}}>
												<p className={'break-keep'}>- 매표창구(WTIM) 단말기 환불</p>
												<p className={'break-keep'}>- 휴대 정산기 환불</p>
											</td>
											<td className={'col-span-1'} style={{paddingLeft: 8, paddingRight: 8}}>
												<p className={'break-keep'}>- 결제 단말기 환불</p>
											</td>
											<td className={'col-span-1'} style={{paddingLeft: 8, paddingRight: 8}}>
												<p className={'break-keep'}>- ATM 단말기 환불 (우리은행 계좌 보유고객 限)</p>
											</td>
										</tr>
										<tr>
											<th scope='col' style={{paddingLeft: 4, paddingRight: 4}}>1일 최대<br/>환불 금액</th>
											<td className={'col-span-1'} style={{paddingLeft: 8, paddingRight: 8, justifyContent: 'center'}}>20만원</td>
											<td className={'col-span-1'} style={{paddingLeft: 8, paddingRight: 8, justifyContent: 'center'}}>5만원</td>
											<td className={'col-span-1'} style={{paddingLeft: 8, paddingRight: 8, justifyContent: 'center'}}>20만원</td>
										</tr>
									</tbody>
									<tfoot></tfoot>
								</table>
								<ul className={'comment'}>
									<li>불량카드는 홈페이지에서 온라인 환불접수 후 우편 송부</li>
									<li>연간 누적 50만원을 초과하는 경우의 환불수수료 : 환불금액의 1%</li>
								</ul>
							</div>
						</dd>
					</dl>
				</div>
			</section>
		</main>
	)
}
