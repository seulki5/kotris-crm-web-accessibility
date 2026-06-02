'use client'

import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {useMoHeaderContext} from '@modules/context/MoHeaderContext';
import {useLoadingContext} from '@modules/context/LoadingContext';
import {useWebContext} from '@modules/context/WebviewContext';

// components
import Breadcrumb from '@components/layout/Breadcrumb';

// assets
import {
	KorailMapDesktop, KorailMapMobile,
	LocationBus,
	LocationCall,
	LocationMap,
	LocationMetro
} from '@assets/icons/Svgs';


/**
 * @description: 오시는 길 화면 입니다.
 * @screenID:    UI-CRM-F271, UI-CRM-F492
 * @screenPath:  홈 > 고객센터 > 오시는 길
 * @author       $Author
 * @since        $Date
 * @version      $Revision
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function SupportLocation() {
	
	const {isMobile} = useScreenSizeContext();
	const {isAccApp, reloadKey, fncFocusLayout} = useWebContext();
	const {fncChangeMoHeader} = useMoHeaderContext();

	
	useLayoutEffect(() => {
		if (isAccApp) fncFocusLayout();
		if (isMobile) {
			fncChangeMoHeader({
				type: 'back',
				title: '오시는 길'
			})
		}
	}, [isMobile, isAccApp, reloadKey])
	
	if (isMobile) return (
		<MoSupportLocation />
	);
	else return (
		<DtSupportLocation />
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F492
 */
export function DtSupportLocation() {
	return (
		<main id={'support'} className={'body-wrap-832 location-wrap'} aria-labelledby={'page-name-dt'}>
			<Breadcrumb addPaths={[]} />
			<h1 id={'page-name-dt'} className={'page-title'}>
				오시는 길
			</h1>
			<div>
				<div className={'map-wrap'}>
					<KorailMapDesktop />
				</div>
				<dl>
					<div>
						<dt>
							<LocationMap color={'text-dynamic-icon-neutral-secondary'} />
							주소
						</dt>
						<dd>서울특별시 중구 청파로 426 한국철도공사</dd>
					</div>
					<div>
						<dt>
							<LocationCall color={'text-dynamic-icon-neutral-secondary'} />
							대표 전화
						</dt>
						<dd><a href={'tel:15887788'}>1588-7788</a></dd>
					</div>
					<div>
						<dt>
							<LocationMetro color={'text-dynamic-icon-neutral-secondary'} />
							지하철
						</dt>
						<dd className={'flex-row-center'}>
							<span className={'subway-line bg-[#0B7EFE]'}>1</span>
							<span className={'subway-line bg-[#00C4FF]'}>4</span>
							<span className={'ml-8'}>서울역 하차, 1번 출구</span>
						</dd>
					</div>
					<div>
						<dt>
							<LocationBus color={'text-dynamic-icon-neutral-secondary'} />
							버스
						</dt>
						<dd className={'flex flex-col gap-12'}>
							<div className={'flex-row-center'}>
								<span className={'bus-line text-dynamic-text-other-lime border-dynamic-border-other-lime'}>지선</span>
								<span>7011, 7017, 7019, 7021, 7022, 8000</span>
							</div>
							<div className={'flex-row-center'}>
								<span className={'bus-line text-dynamic-text-other-blue border-dynamic-border-other-blue'}>간선</span>
								<span>103, 163, 202, 405, 500, 702A, 505, 506</span>
							</div>
							<div className={'flex-row-center'}>
								<span className={'bus-line text-dynamic-text-other-red border-dynamic-border-other-red'}>직행</span>
								<span>9401, 9703, 9706, 9709, 9710, 9713, 9714</span>
							</div>
						</dd>
					</div>
				</dl>
			</div>
		</main>
	)
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F491
 */
export function MoSupportLocation() {
	
	const divRef = useRef(null);
	const mobileMapWidth = 350;
	const mobileMapHeight = 234;
	
	// 이미지 사이즈
	const [mapSize, setMapSize] = useState({width: 350, height: 234});
	
	// div 사이즈에 맞춰 이미지 비율 조정
	useEffect(() => {
		if(divRef.current) {
			const divWidth = divRef.current.offsetWidth;
			const ratio = mobileMapHeight / mobileMapWidth;
			const ratioHeight = divWidth * ratio;
			setMapSize({width: divWidth, height: ratioHeight});
		}
	}, [])
	
	return (
		<main id={'support'} className={'body-wrap-mobile-screen-height location-wrap'} aria-labelledby={'page-name-mo'}>
			<h1 id={'page-name-mo'} className={'sr-only'}>오시는 길</h1>
			<div className={'w-full flex-col-center'}>
				<div className={'map-wrap'} ref={divRef}>
					<KorailMapMobile width={mapSize.width} height={mapSize.height} />
				</div>
				<dl>
					<div>
						<dt>
							<LocationMap color={'text-dynamic-icon-neutral-secondary'} />
							주소
						</dt>
						<dd>서울특별시 중구 청파로 426 한국철도공사</dd>
					</div>
					<div>
						<dt>
							<LocationCall color={'text-dynamic-icon-neutral-secondary'} />
							대표 전화
						</dt>
						<dd><a href={'tel:15887788'}>1588-7788</a></dd>
					</div>
					<div>
						<dt>
							<LocationMetro color={'text-dynamic-icon-neutral-secondary'} />
							지하철
						</dt>
						<dd className={'flex-row-center'}>
							<span className={'subway-line bg-[#0B7EFE]'}>1</span>
							<span className={'subway-line bg-[#00C4FF]'}>4</span>
							<span className={'ml-6'}>서울역 하차, 1번 출구</span>
						</dd>
					</div>
					<div>
						<dt>
							<LocationBus color={'text-dynamic-icon-neutral-secondary'} />
							버스
						</dt>
						<dd className={'flex flex-col gap-6'}>
							<div className={'flex-row-center'}>
								<span className={'bus-line text-dynamic-text-other-lime border-dynamic-border-other-lime'}>지선</span>
								<span>7011, 7017, 7019, 7021, 7022, 8000</span>
							</div>
							<div className={'flex-row-center'}>
								<span className={'bus-line text-dynamic-text-other-blue border-dynamic-border-other-blue'}>간선</span>
								<span>103, 163, 202, 405, 500, 702A, 505, 506</span>
							</div>
							<div className={'flex-row-center'}>
								<span className={'bus-line text-dynamic-text-other-red border-dynamic-border-other-red'}>직행</span>
								<span>9401, 9703, 9706, 9709, 9710, 9713, 9714</span>
							</div>
						</dd>
					</div>
				</dl>
			</div>
		</main>
	)
}
