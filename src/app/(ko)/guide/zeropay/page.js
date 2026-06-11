'use client'

import React, {useLayoutEffect} from 'react';
import Image from 'next/image';

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {useMoHeaderContext} from '@modules/context/MoHeaderContext';
import {useLoadingContext} from '@modules/context/LoadingContext';
import {useWebContext} from '@modules/context/WebviewContext';

// components
import Breadcrumb from '@components/layout/Breadcrumb';

// assets
import {GuideDeduction, GuideZeroPayQr} from '@assets/icons/GuideSvgs';
import ZeropayImage01 from '@assets/images/guide_zeropay_01.png';
import ZeropayImage02 from '@assets/images/guide_zeropay_02.png';
import ZeropayImage03 from '@assets/images/guide_zeropay_03.png';


/**
 * @description: 제로페이 이용 안내 화면 입니다.
 * @screenID:    UI-CRM-F222, UI-CRM-F432
 * @screenPath:  홈 > Rail+ 이용안내 > 제로페이
 * @author       $Author
 * @since        $Date
 * @version      $Revision
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function GuideZeropay() {
	
	const {isMobile} = useScreenSizeContext();
	const {isAccApp, reloadKey, fncFocusLayout} = useWebContext();
	const {fncChangeMoHeader} = useMoHeaderContext();

	useLayoutEffect(() => {
		if (isAccApp) fncFocusLayout();
		if (isMobile) {
			fncChangeMoHeader({
				type: 'back',
				title: '제로페이 이용 안내'
			})
		}
	}, [isMobile, isAccApp, reloadKey])
	
	if (isMobile) return (
		<MoGuideZeropay />
	);
	else return (
		<DtGuideZeropay />
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F222
 */
export function DtGuideZeropay() {
	return (
		<main id={'guide'} className={'body-wrap-880'} aria-labelledby={'page-name-dt'}>
			<Breadcrumb addPaths={[]}/>
			<h2 className={'catchphrase'}>
				Rail+ 앱에도 간편한 결제 서비스!
			</h2>
			<h1 id={'page-name-dt'} className={'page-title'}>
				제로페이 이용 안내
			</h1>
			<section className={'type01'} aria-label={'기능 요약'}>
				<dl>
					<div>
						<dt className={'bg-[#E9FCF8]'}>
							<GuideZeroPayQr/>
						</dt>
						<dd>
							<h3 className={'title'}>제로페이란?</h3>
							<p>소상공인의 가맹점 수수료 부담을 줄이고 소비자에게도 혜택을 제공하는 QR코드 기반의 모바일 간편결제 서비스</p>
						</dd>
					</div>
					<div>
						<dt className={'bg-[#FDF8E3]'}>
							<GuideDeduction/>
						</dt>
						<dd>
							<h3 className={'title'}>소득공제 혜택</h3>
							<p>레일플러스 사용자에게 소득공제 혜택 제공</p>
						</dd>
					</div>
				</dl>
			</section>
			<section className={'type11'}>
				<dl>
					<dt>
						<h3>제로페이<br/>이용 방법</h3>
					</dt>
					<dd>
						<div><Image src={ZeropayImage01} alt={`QR코드로 결제: [하단 메뉴 ‘제로페이' > QR 스캔 결제]에서 QR코드를 스캔하여 간편 결제 완료`}/></div>
						<div><Image src={ZeropayImage02} alt={`결제 내역 조회: [하단 메뉴 ‘제로페이' > 제로페이 이용 내역]에서 최근 결제 내역을 간편하게 확인`}/></div>
						<div><Image src={ZeropayImage03} alt={`연동 계좌 관리: [하단 메뉴 ‘제로페이' > 제로페이 계좌 관리]에서 은행 계좌를 연동하여 결제를 쉽게 설정`}/></div>
					</dd>
				</dl>
			</section>
		</main>
	)
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F432
 */
export function MoGuideZeropay() {
	return (
		<main id={'guide'} className={'body-wrap-mobile page-bottom-space'} aria-labelledby={'page-name-mo'}>
			<h2 className={'catchphrase'}>
				Rail+ 앱에도 간편한 결제 서비스!
			</h2>
			<h1 id={'page-name-mo'} className={'page-title'}>
				제로페이 이용 안내
			</h1>
			<section
				className={'type01'} aria-label={'기능 요약'}
				style={{marginTop: 32, paddingLeft: 0, paddingRight: 0}}
			>
				<dl>
					<div>
						<dt>
							<GuideZeroPayQr width={13} height={17} />
						</dt>
						<dd>
							<h3 className={'title'}>제로페이란?</h3>
							<p>소상공인의 가맹점 수수료 부담을 줄이고 소비자에게도 혜택을 제공하는 QR코드 기반의 모바일 간편결제 서비스</p>
						</dd>
					</div>
					<div>
						<dt>
							<GuideDeduction width={18} height={18} />
						</dt>
						<dd>
							<h3 className={'title'}>소득공제 혜택</h3>
							<p>레일플러스 사용자에게 소득공제 혜택 제공</p>
						</dd>
					</div>
				</dl>
			</section>
			<section className={'type11'}>
				<dl>
					<dt>제로페이 이용 방법</dt>
					<dd>
						<div><Image src={ZeropayImage01} alt={`QR코드로 결제: [하단 메뉴 ‘제로페이' > QR 스캔 결제]에서 QR코드를 스캔하여 간편 결제 완료`}/></div>
						<div><Image src={ZeropayImage02} alt={`결제 내역 조회: [하단 메뉴 ‘제로페이' > 제로페이 이용 내역]에서 최근 결제 내역을 간편하게 확인`}/></div>
						<div><Image src={ZeropayImage03} alt={`연동 계좌 관리: [하단 메뉴 ‘제로페이' > 제로페이 계좌 관리]에서 은행 계좌를 연동하여 결제를 쉽게 설정`}/></div>
					</dd>
				</dl>
			</section>
		</main>
	)
}
