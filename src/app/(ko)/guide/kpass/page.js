'use client'

import React, {useLayoutEffect} from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {useMoHeaderContext} from '@modules/context/MoHeaderContext';
import {useLoadingContext} from '@modules/context/LoadingContext';
import {useWebContext} from '@modules/context/WebviewContext';

// components
import Breadcrumb from '@components/layout/Breadcrumb';
import Button from '@components/common/Button';

// assets
import {RailplusSymbol} from '@assets/icons/Svgs';
import kpassDesktopBanner from '@assets/images/guide_kpass_banner_desktop.png';
import kpassMobileBanner from '@assets/images/guide_kpass_banner_mobile.png';
import kpassJoinMobileImage from '@assets/images/guide_kpass_join_mobile.png';
import kpassJoinDesktopImage from '@assets/images/guide_kpass_join_desktop.png';


/**
 * @description: K-패스 이용안내 화면 입니다.
 * @screenID:    UI-CRM-F218, UI-CRM-F430
 * @screenPath:  홈 > Rail+ 이용안내 > K-패스
 * @author       $Author
 * @since        $Date
 * @version      $Revision
 * Copyright (C) 2025 by STraffic co.,Ltd. All right res스erved.
 */
export default function GuideKpass() {

	const {isMobile} = useScreenSizeContext();
	const {isAccApp, reloadKey, fncFocusLayout} = useWebContext();
	const {fncChangeMoHeader} = useMoHeaderContext();

	useLayoutEffect(() => {
		if (isAccApp) fncFocusLayout();
		if (isMobile) {
			fncChangeMoHeader({
				type: 'back',
				title: 'K-패스 이용안내'
			})
		}
	}, [isMobile, isAccApp, reloadKey])

	// 링크: K-패스 홈페이지
	const fncOpenKpassSite = () => {
		if(process.env.NEXT_PUBLIC_KPASS_URI) {
			window.open(process.env.NEXT_PUBLIC_KPASS_URI, '_blank')
		}
	}

	const fncHandlers = {
		openKpassSite: fncOpenKpassSite
	}

	const fncCallbackEvent = (fncName, variable, payload = {}) => {
		const fnc = fncHandlers[fncName];
		if (typeof fnc === 'function') return fnc(variable, payload);
	}

	if (isMobile) return (
		<MoGuideKpass
			fncCallbackEvent={fncCallbackEvent}
		/>
	);
	else return (
		<DtGuideKpass
			fncCallbackEvent={fncCallbackEvent}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F218
 */
DtGuideKpass.propTypes = {
	fncCallbackEvent: PropTypes.func
};
export function DtGuideKpass({fncCallbackEvent}) {
	return (
		<main id={'guide'} className={'body-wrap-880'} aria-labelledby={'page-name-dt'}>
			<Breadcrumb addPaths={[]}/>
			<h2 className={'catchphrase'}>
				Rail+와 함께 누리는 K-패스 환급 혜택
			</h2>
			<h1 id={'page-name-dt'} className={'page-title'}>
				K-패스 이용안내
			</h1>
			<section aria-label={'K-패스 배너'} className={'mt-48 mb-72'}>
				<Image
					src={kpassDesktopBanner}
					alt={'Rail+에서 K-패스 등록하면 이용금액의 20%~53% 환급 + 최대 10% 추가환급까지!'}
				/>
			</section>
			<section className={'type08'}>
				<dl>
					<dt>
						<h3 aria-hidden={true}>K-패스<br/>이용 방법</h3>
						<h3 className={'sr-only'}>케이패스 이용 방법</h3>
					</dt>
					<dd>
						<div>
							<div className={'timeline'} />
							<p className={'decimal'} aria-label={'첫번째'}>1</p>
							<div className={'detail'}>
								<h5 className={'title'}>Rail+ 앱 설치</h5>
								<p>구글플레이 또는 앱스토어에서 ‘레일플러스’ 또는 ‘코레일’ 검색 후 앱 다운로드</p>
								<p>앱 실행 후 회원가입 또는 로그인 진행</p>
								<p>카드 발급 시 선불형 Rail+ 카드 선택</p>
							</div>
						</div>
						<div>
							<p className={'decimal'} aria-label={'두번째'}>2</p>
							<div className={'detail'}>
								<h5 className={'title'}>K-패스 회원가입</h5>
								<p>Rail+ 앱 <span className={'text-dynamic-text-brand-primary'}>{`[메인 화면 > K - 패스 아이콘]`}</span> 또는 <span className={'text-dynamic-text-brand-primary'}>{`[메인 화면 > K - 패스 등록하기]`}</span> 배너 선택</p>
								<div className={'image-grid-wrap'}>
									<Image
										src={kpassJoinMobileImage}
										alt={'모바일/Rail+ 앱 K-패스 회원가입'}
										aria-hidden={true}
									/>
									<Image
										src={kpassJoinDesktopImage}
										alt={'PC 웹사이트 K-패스 회원가입'}
										aria-hidden={true}
									/>
								</div>
							</div>
						</div>
						<div>
							<div className={'timeline'} />
							<p className={'decimal'} aria-label={'세번째'}>3</p>
							<div className={'detail'}>
								<h5 className={'title'}>모바일 Rail+로 전국 대중교통 이용</h5>
							</div>
						</div>
					</dd>
				</dl>
			</section>
			<hr className={'margin-y'} />
			<section className={'type06'}>
				<dl>
					<dt>
						<h3>혜택 안내</h3>
					</dt>
					<dd>
						<div className={'benefit-wrap'}>
							<div className={'benefit-title'}>
								<div className={'benefit-group'}>
									<RailplusSymbol />
								</div>
								첫번째 혜택
							</div>
							<ul>
								<li
									aria-label={'K-패스에 모바일 Rail+ 카드를 등록 후 이용하면, 대중교통 이용금액의 20%~53% 환급 혜택. 구분 적립률 일반: 20%, 청년 30%, 저소득 53%, 다자녀부모(2자녀) 30%, 다자녀부모(3자녀) 50%'}
								>
									K-패스에 모바일 Rail+ 카드를 등록 후 이용하면, 대중교통 이용금액의 <span className={'text-dynamic-text-other-violet'}>20%~53% 환급 혜택</span>
									<table
										className={'my-20'}
										summary={'사용자 유형별 대중교통 이용금액 환급 적립률을 보여주는 표입니다.'}
										aria-hidden={true}
									>
										<caption className='sr-only'>K-패스 환급 적립률</caption>
										<thead>
											<tr>
												<th scope='col' className={'col-span-1'}>구분</th>
												<th scope='col' className={'col-span-1'}>일반</th>
												<th scope='col' className={'col-span-1'}>청년</th>
												<th scope='col' className={'col-span-1'}>저소득</th>
												<th scope='col' className={'col-span-1'}>다자녀부모<br/>(2자녀)</th>
												<th scope='col' className={'col-span-1'}>다자녀부모<br/>(3자녀)</th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<td className={'col-span-1'}>적립률</td>
												<td className={'col-span-1'}>20%</td>
												<td className={'col-span-1'}>30%</td>
												<td className={'col-span-1'}>53%</td>
												<td className={'col-span-1'}>30%</td>
												<td className={'col-span-1'}>50%</td>
											</tr>
										</tbody>
										<tfoot></tfoot>
									</table>
								</li>
								<li>청년: 청년기본법에 따른 만 19세~34세</li>
								<li>저소득층: 기초생활 보장법에 따른 기초생활수급자 및 차상위계층</li>
								<li>이동 거리와 관계없이 대중교통 이용 금액의 일정 비율이 환급금으로 지급</li>
								<li>월 15회 이상 대중교통 이용 시 최대 60회까지 지급 (지역에 따라 추가 혜택 지원)</li>
							</ul>
						</div>
						<div className={'benefit-wrap'}>
							<div className={'benefit-title'}>
								<div className={'benefit-group'}>
									<RailplusSymbol />
								</div>
								두번째 혜택
							</div>
							<ul>
								<li>전월 모바일 Rail+ 이용 금액 기준으로 대중교통(교통 및 유통 사용실적) <span className={'text-dynamic-text-other-violet'}>이용 금액의 최대 10% 쿠폰 지급</span></li>
								<li className={'comment'}>
									기차표 구매 실적 제외
									<table className={'my-20'} summary='전월 총 사용금액 구간별 교통분야 이용 금액 환급률과 최대 환급금액을 보여주는 표입니다.'>
										<caption className='sr-only'>K-패스 추가 환급 기준 표</caption>
										<thead aria-hidden={true}>
											<tr>
												<th scope='col' className={'col-span-2'}>전월<br/>총 사용금액</th>
												<th scope='col' className={'col-span-2'}>교통분야 이용 금액 환급률</th>
												<th scope='col' className={'col-span-2'}>최대 환급금액</th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<td className={'col-span-2'}>50,000원 미만</td>
												<td className={'col-span-2'}>0.1%</td>
												<td className={'col-span-2'}>-</td>
											</tr>
											<tr>
												<td className={'col-span-2'}>50,000원 이상<br/>100,000원 미만</td>
												<td className={'col-span-2'}>0.2%</td>
												<td className={'col-span-2'}>-</td>
											</tr>
											<tr>
												<td className={'col-span-2'}>100,000원 이상<br/>200,000원 미만</td>
												<td className={'col-span-2'}>10%</td>
												<td className={'col-span-2'}>2,000원</td>
											</tr>
											<tr>
												<td className={'col-span-2'}>200,000원 이상<br/>300,000원 미만</td>
												<td className={'col-span-2'}>10%</td>
												<td className={'col-span-2'}>5,000원</td>
											</tr>
											<tr>
												<td className={'col-span-2'}>300,000원 이상</td>
												<td className={'col-span-2'}>10%</td>
												<td className={'col-span-2'}>7,000원</td>
											</tr>
										</tbody>
										<tfoot></tfoot>
									</table>
								</li>
							</ul>
						</div>
						<div className={'benefit-wrap'}>
							<div className={'benefit-title'}>
								<div className={'benefit-group'}>
									<RailplusSymbol />
								</div>
								세번째 혜택
							</div>
							<ul>
								<li>모바일 Rail+로 코레일톡 간편결제를 통해 기차표 구매 시 <span className={'text-dynamic-text-other-violet'}>KTX 마일리지 1% 추가 적립</span></li>
								<li>KTX 마일리지를 <span className={'text-dynamic-text-other-violet'}>모바일 Rail+ 충전금으로 전환</span>하여 사용 가능</li>
							</ul>
						</div>
					</dd>
				</dl>
			</section>
			<hr className={'margin-y'} />
			<section className={'type07'}>
				<dl>
					<dt>
						<h3>지급 안내</h3>
					</dt>
					<dd>
						<ul>
							<li>K-패스에 모바일 Rail+ 카드번호를 등록하고 모바일 Rail+ 앱으로 대중교통을 이용해야 환급금이 지급</li>
							<li>적립 월의 다음 달 20~25일까지 모바일 Rail+ 앱의 쿠폰함으로 환급 쿠폰 지급</li>
						</ul>
					</dd>
				</dl>
			</section>
			<hr className={'margin-y'} />
			<section className={'type09'}>
				<dl>
					<dt>
						<h3>이용 문의</h3>
					</dt>
					<dd>
						<div className={'center-wrap'}>
							<a href={'tel:0314274415'} aria-label={'케이패스 고객센터: 공삼일 사이칠 사사일오'}>
								<span aria-hidden={true}>K-패스 고객센터</span>
								<span aria-hidden={true} className={'text-dynamic-text-brand-primary font-semibold'}>
									031-427-4415
								</span>
							</a>
							<a href={'tel:15887788'} aria-label={'레일플러스 고객센터: 일오팔팔 칠칠팔팔'}>
								<span aria-hidden={true}>레일플러스 고객센터</span>
								<span aria-hidden={true} className={'text-dynamic-text-brand-primary font-semibold'}>
									1588-7788
								</span>
							</a>
						</div>
						<p>*자세한 내용은 K-패스 홈페이지 또는 앱에서 확인</p>
					</dd>
				</dl>
			</section>
			<div className={'page-bottom-button-wrap px-20'}>
				<Button
					theme={'secondary'}
					size={'xl'}
					text={'K-패스 홈페이지 바로가기'}
					customStyle={'w-fit'}
					onClick={() => fncCallbackEvent('openKpassSite')}
				/>
			</div>
		</main>
	)
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F430
 */
MoGuideKpass.propTypes = {
	fncCallbackEvent: PropTypes.func
};
export function MoGuideKpass({fncCallbackEvent}) {
	return (
		<main id={'guide'} className={'body-wrap-mobile page-bottom-space'} aria-labelledby={'page-name-mo'}>
			<h2 className={'catchphrase'}>
				Rail+와 함께 누리는 K-패스 환급 혜택
			</h2>
			<h1 id={'page-name-mo'} className={'page-title'}>
				K-패스 이용안내
			</h1>
			<div className={'grid gap-48 mt-20 page-bottom-space'}>
				<section aria-label={'K-패스 배너'}>
					<Image
						src={kpassMobileBanner}
						alt={'Rail+에서 K-패스 등록하면 이용금액의 20%~53% 환급 + 최대 10% 추가환급까지!'}
					/>
				</section>
				<section className={'type08'}>
					<dl>
						<dt>
							<h3 aria-label={'케이패스 이용 방법'}>K-패스 이용 방법</h3>
						</dt>
						<dd>
							<div>
								<div className={'timeline'} />
								<p className={'decimal'} aria-label={'첫번째'}>1</p>
								<div className={'detail'}>
									<h5 className={'title'}>Rail+ 앱 설치</h5>
									<p>구글플레이 또는 앱스토어에서 ‘레일플러스’ 또는 ‘코레일’ 검색 후 앱 다운로드</p>
									<p>앱 실행 후 회원가입 또는 로그인 진행</p>
									<p>카드 발급 시 선불형 Rail+ 카드 선택</p>
								</div>
							</div>
							<div>
								<p className={'decimal'} aria-label={'두번째'}>2</p>
								<div className={'detail'}>
									<h5 className={'title'}>K-패스 회원가입</h5>
									<p>Rail+ 앱 <span className={'text-dynamic-text-brand-primary'}>{`[메인 화면 > K - 패스 아이콘]`}</span> 또는 <span className={'text-dynamic-text-brand-primary'}>{`[메인 화면 > K - 패스 등록하기]`}</span> 배너 선택</p>
									<div className={'image-grid-wrap'}>
										<Image
											src={kpassJoinMobileImage}
											alt={'모바일/Rail+ 앱 K-패스 회원가입'}
											aria-hidden={true}
										/>
										<Image
											src={kpassJoinDesktopImage}
											alt={'PC 웹사이트 K-패스 회원가입'}
											aria-hidden={true}
										/>
									</div>
								</div>
							</div>
							<div>
								<div className={'timeline'} />
								<p className={'decimal'} aria-label={'세번째'}>3</p>
								<div className={'detail'}>
									<h5>모바일 Rail+로 전국 대중교통 이용</h5>
								</div>
							</div>
						</dd>
					</dl>
				</section>
				<section className={'type06'}>
					<dl>
						<dt>
							<h3>혜택 안내</h3>
						</dt>
						<dd>
							<div className={'benefit-wrap'}>
								<div className={'benefit-title'}>
									<div className={'benefit-group'}>
										<RailplusSymbol />
									</div>
									첫번째 혜택
								</div>
								<ul>
									<li>K-패스에 모바일 Rail+ 카드를 등록 후 이용하면, 대중교통 이용금액의 <span className={'text-dynamic-text-other-violet'}>20%~53% 환급 혜택</span>
										<table className={'my-20'} summary='사용자 유형별 대중교통 이용금액 환급 적립률을 보여주는 표입니다.'>
											<caption className='sr-only'>K-패스 환급 적립률</caption>
											<thead>
												<tr>
													<th scope='col' className={'col-span-1'}>구분</th>
													<th scope='col' className={'col-span-1'}>일반</th>
													<th scope='col' className={'col-span-1'}>청년</th>
													<th scope='col' className={'col-span-1'}>저소득</th>
													<th scope='col' className={'col-span-1'}>다자녀<br/>부모<br/>(2자녀)</th>
													<th scope='col' className={'col-span-1'}>다자녀<br/>부모<br/>(3자녀)</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td className={'col-span-1'}>적립률</td>
													<td className={'col-span-1'}>20%</td>
													<td className={'col-span-1'}>30%</td>
													<td className={'col-span-1'}>53%</td>
													<td className={'col-span-1'}>30%</td>
													<td className={'col-span-1'}>50%</td>
												</tr>
											</tbody>
											<tfoot></tfoot>
										</table>
									</li>
									<li>청년: 청년기본법에 따른 만 19세~34세</li>
									<li>저소득층: 기초생활 보장법에 따른 기초생활수급자 및 차상위계층</li>
									<li>이동 거리와 관계없이 대중교통 이용 금액의 일정 비율이 환급금으로 지급</li>
									<li>월 15회 이상 대중교통 이용 시 최대 60회까지 지급<br/>(지역에 따라 추가 혜택 지원)</li>
								</ul>
							</div>
							<div className={'benefit-wrap'}>
								<div className={'benefit-title'}>
									<div className={'benefit-group'}>
										<RailplusSymbol />
									</div>
									두번째 혜택
								</div>
								<ul>
									<li>전월 모바일 Rail+ 이용 금액 기준으로 대중교통(교통 및 유통 사용실적) <span className={'text-dynamic-text-other-violet'}>이용 금액의 최대 10% 쿠폰 지급</span></li>
									<li className={'comment'}>
										기차표 구매 실적 제외
										<table className={'my-20'} summary='전월 총 사용금액 구간별 교통분야 이용 금액 환급률과 최대 환급금액을 보여주는 표입니다.'>
											<caption className='sr-only'>K-패스 추가 환급 기준</caption>
											<thead aria-hidden={true}>
												<tr>
													<th scope='col' className={'col-span-2'}>전월<br/>총 사용금액</th>
													<th scope='col' className={'col-span-2'}>교통분야 이용 금액 환급률</th>
													<th scope='col' className={'col-span-2'}>최대 환급금액</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td className={'col-span-2'}>50,000원 미만</td>
													<td className={'col-span-2'}>0.1%</td>
													<td className={'col-span-2'}>-</td>
												</tr>
												<tr>
													<td className={'col-span-2'}>50,000원 이상<br/>100,000원 미만</td>
													<td className={'col-span-2'}>0.2%</td>
													<td className={'col-span-2'}>-</td>
												</tr>
												<tr>
													<td className={'col-span-2'}>100,000원 이상<br/>200,000원 미만</td>
													<td className={'col-span-2'}>10%</td>
													<td className={'col-span-2'}>2,000원</td>
												</tr>
												<tr>
													<td className={'col-span-2'}>200,000원 이상<br/>300,000원 미만</td>
													<td className={'col-span-2'}>10%</td>
													<td className={'col-span-2'}>5,000원</td>
												</tr>
												<tr>
													<td className={'col-span-2'}>300,000원 이상</td>
													<td className={'col-span-2'}>10%</td>
													<td className={'col-span-2'}>7,000원</td>
												</tr>
											</tbody>
											<tfoot></tfoot>
										</table>
									</li>
								</ul>
							</div>
							<div className={'benefit-wrap'}>
								<div className={'benefit-title'}>
									<div className={'benefit-group'}>
										<RailplusSymbol />
									</div>
									세번째 혜택
								</div>
								<ul>
									<li>모바일 Rail+로 코레일톡 간편결제를 통해 기차표 구매 시 <span className={'text-dynamic-text-other-violet'}>KTX 마일리지 1% 추가 적립</span></li>
									<li>KTX 마일리지를 <span className={'text-dynamic-text-other-violet'}>모바일 Rail+ 충전금으로 전환</span>하여 사용 가능</li>
								</ul>
							</div>
						</dd>
					</dl>
				</section>
				<section className={'type07'}>
					<dl>
						<dt>
							<h3>지급 안내</h3>
						</dt>
						<dd>
							<ul>
								<li>K-패스에 모바일 Rail+ 카드번호를 등록하고 모바일 Rail+ 앱으로 대중교통을 이용해야 환급금이 지급</li>
								<li>적립 월의 다음 달 20~25일까지 모바일 Rail+ 앱의 쿠폰함으로 환급 쿠폰 지급</li>
							</ul>
						</dd>
					</dl>
				</section>
				<section className={'type09'}>
					<dl>
						<dt>
							<h3>이용 문의</h3>
						</dt>
						<dd>
							<div className={'center-wrap'}>
								<a href={'tel:0314274415'} aria-label={'케이패스 고객센터: 공삼일 사이칠 사사일오'}>
									<span aria-hidden={true}>K-패스 고객센터</span>
									<span aria-hidden={true} className={'text-body-xl text-dynamic-text-brand-primary font-semibold'}>
										031-427-4415
									</span>
								</a>
								<a href={'tel:15887788'} aria-label={'레일플러스 고객센터: 일오팔팔 칠칠팔팔'}>
									<span aria-hidden={true}>레일플러스 고객센터</span>
									<span aria-hidden={true} className={'text-body-xl text-dynamic-text-brand-primary font-semibold'}>
										1588-7788
									</span>
								</a>
							</div>
							<p>*자세한 내용은 K-패스 홈페이지 또는 앱에서 확인</p>
						</dd>
					</dl>
				</section>
			</div>
			<div className={'page-bottom-button-wrap'}>
				<Button
					theme={'secondary'}
					size={'lg'}
					text={'K-패스 홈페이지 바로가기'}
					customStyle={'w-full'}
					onClick={() => fncCallbackEvent('openKpassSite')}
				/>
			</div>
		</main>
	)
}
