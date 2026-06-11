'use client'

import React, {useEffect, useLayoutEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {useRouter} from 'next/navigation';
import Image from 'next/image';

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {useMoHeaderContext} from '@modules/context/MoHeaderContext';
import {RouteConfig} from '@modules/config/RouteConfig';
import {useWebContext} from '@modules/context/WebviewContext';
import {useLoadingContext} from '@modules/context/LoadingContext';

// components
import Breadcrumb from '@components/layout/Breadcrumb';
import Button from '@components/common/Button';

// assets
import {
	AboutFnc01, AboutFnc02, AboutFnc03, AboutFnc04, AboutInstall, AboutNfc, AboutPostpaid, AboutPrepaid, MobileRailplusCard,
} from '@assets/icons/AboutSvgs';
import {ChevronRight} from '@assets/icons/Svgs';
import mobileMockupImage from '@assets/images/mobile_mockup.png';
import mobileCardImage from '@assets/images/mobile_card.png';


/**
 * @description: 모바일 Rail+ 카드 소개 화면 입니다.
 * @screenID:    UI-CRM-F214, UI-CRM-F422
 * @screenPath:  홈 > Rail+ 소개 > 모바일 Rail+ 카드
 * @author       $Author
 * @since        $Date
 * @version      $Revision
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function AboutMobileCard() {

	const router = useRouter();
	const {isMobile} = useScreenSizeContext();
	const {isAccApp, reloadKey, fncFocusLayout} = useWebContext();
	const {fncChangeMoHeader} = useMoHeaderContext();
	const {fncRouteStart} = useLoadingContext();

	const [isSafari, setIsSafari] = useState(false);

	useLayoutEffect(() => {
		if (isAccApp) fncFocusLayout();
		if (isMobile) {
			fncChangeMoHeader({
				type: 'back',
				title: '모바일 Rail+ 카드'
			})
		}
	}, [isMobile, isAccApp, reloadKey])

	useEffect(() => {
		const ua = navigator?.userAgent.toLowerCase();
		setIsSafari(ua.indexOf('safari') !== -1 && ua.indexOf('chrome') === -1);
	}, []);

	// 이동: 이용안내
	const fncGoGuide = () => {
		const targetUri = RouteConfig.GUIDE_MOBILE.PATH;
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
		<MoAboutMobileCard
			fncCallbackEvent={fncCallbackEvent}
			data={{
				isSafari
			}}
		/>
	);
	else return (
		<DtAboutMobileCard
			fncCallbackEvent={fncCallbackEvent}
			data={{
				isSafari
			}}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F214
 */
DtAboutMobileCard.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function DtAboutMobileCard({data, fncCallbackEvent}) {
	return (
		<main id={'about'} className={'body-wrap-880'} aria-labelledby={'page-name-dt'}>
			<Breadcrumb addPaths={[]}/>
			<h1 id={'page-name-dt'} className={'page-title'}>
				모바일 Rail+ 카드
			</h1>
			<section className={'card-wrap'}>
				<div className={'image-wrap'}>
					{
						data.isSafari ? (
							<Image
								src={mobileMockupImage}
								style={{width: 'auto', height: 'auto'}}
								alt={'모바일 카드 목업 이미지'}
							/>
						) : (
							<MobileRailplusCard />
						)
					}
				</div>
				<div className={'info-wrap'}>
					<h2 className={'catchphrase'}>
						스마트폰 하나로 모든 교통과 결제,<br/>이제 손끝에서!
					</h2>
					<p className={'catchphrase-sub'}>
						NFC 기능을 활용해 대중교통부터 편의점 결제까지 한 번에 해결하는<br/>모바일 Rail+카드로 간편함을 경험하세요.
					</p>
					<Button
						theme={'textOnly'}
						size={'sm'}
						text={'모바일 Rail+ 카드 이용안내'}
						ariaLabel={'모바일 Rail+ 카드 이용안내'}
						icon={<ChevronRight width={20} height={20}/>}
						iconPosition={'right'}
						customStyle={'w-fit'}
						onClick={() => fncCallbackEvent('goGuide')}
					/>
				</div>
			</section>
			<section className={'detail-wrap'}>
				<div role={'region'} className={'type02'} aria-labelledby={'group01'}>
					<dl>
						<dt id={'group01'}>사용 방법</dt>
						<dd>
							<div>
								<div className={'flex-row-center green'}>
									<AboutNfc/>
									NFC 확인하기
								</div>
								<ul className={'comment'} >
									<li>NFC 기능이 있는 안드로이드, iOS 스마트폰 기기확인</li>
								</ul>
							</div>
							<div>
								<div className={'flex-row-center green'}>
									<AboutInstall/>
									앱 설치하기
								</div>
								<ul className={'comment'} >
									<li>Google Play 또는 App Store 에서 ‘레일플러스’ 또는 ‘코레일’ 검색 후 앱 다운로드</li>
								</ul>
							</div>
						</dd>
					</dl>
				</div>
				<hr />
				<div role={'region'} className={'type02'} aria-labelledby={'group02'}>
					<dl>
						<dt id={'group02'}>카드 종류</dt>
						<dd>
							<div>
								<div className={'flex-row-center blue'}>
									<AboutPrepaid/>
									선불형 (충전)
								</div>
								<ul className={'comment'} >
									<li>NFC 기능이 있는 안드로이드, iOS 스마트폰 기기확인</li>
								</ul>
							</div>
							<div>
								<div className={'flex-row-center orange'}>
									<AboutPostpaid/>
									후불형 (청구)
								</div>
								<ul className={'comment'} >
									<li>Google Play 또는 App Store 에서 ‘레일플러스’ 또는 ‘코레일’ 검색 후 앱 다운로드</li>
								</ul>
							</div>
						</dd>
					</dl>
				</div>
				<hr />
				<div role={'region'} className={'type04'} aria-labelledby={'group03'}>
					<dl>
						<dt id={'group03'}>주요 기능 및<br/>메뉴 구성</dt>
						<dd>
							<div>
								{
									data.isSafari ? (
										<Image
											src={mobileCardImage}
											style={{width: 'auto', height: 'auto'}}
											alt={'모바일 카드 이미지'}
											aria-hidden={true}
										/>
									) : (
										<AboutFnc01 />
									)
								}
								<p className={'title'}>메인화면</p>
								<p>사용가능 금액, 충전 금액, 마일리지 금액 표시</p>
							</div>
							<div>
								<AboutFnc02/>
								<p className={'title'}>이용내역</p>
								<p>최근 및 월별 이용내역 조회</p>
							</div>
							<div>
								<AboutFnc03/>
								<p className={'title'}>카드충전</p>
								<p>다양한 결제 방식 지원</p>
							</div>
							<div>
								<AboutFnc04/>
								<p className={'title'}>공지사항</p>
								<p>새로운 소식과 이벤트 확인</p>
							</div>
						</dd>
					</dl>
				</div>
			</section>
		</main>
	)
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F422
 */
MoAboutMobileCard.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function MoAboutMobileCard({data, fncCallbackEvent}) {
	const {isAccApp} = useWebContext();

	return (
		<main id={'about'} className={'w-full page-bottom-space'} aria-labelledby={'page-name-mo'}>
			<h1 id={'page-name-mo'} className={'sr-only'}>일반 Rail+ 카드</h1>
			<section className={'card-wrap bg-gradient-to-b from-[#C1FF69]/30 to-bg-dynamic-by-neutral-base'}>
				<div className={'image-wrap flex-col-center-center'}>
					{
						(isAccApp || data.isSafari) ? (
							<Image
								src={mobileMockupImage}
								style={{width: 'auto', height: 'auto'}}
								alt={'모바일 카드 목업 이미지'}
								aria-hidden={true}
							/>
						) : (
							<MobileRailplusCard />
						)
					}
				</div>
				<div className={'info-wrap'}>
					<h2 className={'catchphrase'}>
						스마트폰 하나로 모든 교통과 결제,<br/>이제 손끝에서!
					</h2>
					<p className={'catchphrase-sub'}>
						NFC 기능을 활용해 대중교통부터<br/>편의점 결제까지 한 번에 해결하는 모바일 Rail+카드로<br/>간편함을 경험하세요.
					</p>
					<Button
						theme={'textOnly'}
						size={'sm'}
						text={'모바일 Rail+ 카드 이용안내'}
						ariaLabel={'모바일 Rail+ 카드 이용안내'}
						icon={<ChevronRight width={20} height={20}/>}
						iconPosition={'right'}
						customStyle={'w-fit'}
						onClick={() => fncCallbackEvent('goGuide')}
					/>
				</div>
			</section>
			<section className={'detail-wrap'}>
				<div role={'region'} className={'type02'} aria-labelledby={'group01'}>
					<dl>
						<dt id={'group01'}>사용 방법</dt>
						<dd>
							<div>
								<div className={'flex-row-center green'}>
									<AboutNfc/>
									NFC 확인하기
								</div>
								<ul className={'comment'} >
									<li>NFC 기능이 있는 안드로이드, iOS 스마트폰 기기확인</li>
								</ul>
							</div>
							<hr />
							<div>
								<div className={'flex-row-center green'}>
									<AboutInstall/>
									앱 설치하기
								</div>
								<ul className={'comment'} >
									<li>Google Play 또는 App Store 에서 ‘레일플러스’ 또는 ‘코레일’ 검색 후 앱 다운로드</li>
								</ul>
							</div>
						</dd>
					</dl>
				</div>
				<div role={'region'} className={'type02'} aria-labelledby={'group02'}>
					<dl>
						<dt id={'group02'}>카드 종류</dt>
						<dd>
							<div>
								<div className={'flex-row-center blue'}>
									<AboutPrepaid/>
									선불형 (충전)
								</div>
								<ul className={'comment'} >
									<li>신용카드, 체크카드, 계좌이체, 간편결제, KTX 마일리지 등 충전 후 사용</li>
									<li>잔액 충전 후 APP에서 사용</li>
								</ul>
							</div>
							<hr />
							<div>
								<div className={'flex-row-center orange'}>
									<AboutPostpaid/>
									후불형 (청구)
								</div>
								<ul className={'comment'} >
									<li>신한카드, 우리비씨 카드 등록 후 사용 금액 청구</li>
								</ul>
							</div>
						</dd>
					</dl>
				</div>
				<div role={'region'} className={'type04'} aria-labelledby={'group03'}>
					<dl>
						<dt id={'group03'}>주요 기능 및 메뉴 구성</dt>
						<dd>
							<div>
								{
									(isAccApp || data.isSafari) ? (
										<Image
											src={mobileCardImage}
											style={{width: '36%', height: 'auto'}}
											alt={'모바일 카드 이미지'}
											aria-hidden={true}
										/>
									) : (
										<AboutFnc01/>
									)
								}
								<div>
									<p className={'title'}>메인화면</p>
									<p>사용가능 금액, 충전 금액, 마일리지 금액 표시</p>
								</div>
							</div>
							<hr />
							<div>
								<AboutFnc02/>
								<div>
									<p className={'title'}>이용내역</p>
									<p>최근 및 월별 이용내역 조회</p>
								</div>
							</div>
							<hr />
							<div>
								<AboutFnc03/>
								<div>
									<p className={'title'}>카드충전</p>
									<p>다양한 결제 방식 지원</p>
								</div>
							</div>
							<hr />
							<div>
								<AboutFnc04/>
								<div>
									<p className={'title'}>공지사항</p>
									<p>새로운 소식과 이벤트 확인</p>
								</div>
							</div>
						</dd>
					</dl>
				</div>
			</section>
		</main>
	)
}
