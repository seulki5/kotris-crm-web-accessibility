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
	AboutAmount, AboutApply, AboutATM, AboutBus, AboutMetro, AboutSelfMachine, SafeTransitCard
} from '@assets/icons/AboutSvgs';
import {ChevronRight} from '@assets/icons/Svgs';


/**
 * @description: 대중교통안심카드 소개 화면 입니다.
 * @screenID:    UI-CRM-F212, UI-CRM-F420
 * @screenPath:  홈 > Rail+ 소개 > 대중교통안심카드
 * @author       $Author
 * @since        $Date
 * @version      $Revision
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function AboutSafeTransitCard() {

	const router = useRouter();
	const {isMobile} = useScreenSizeContext();
	const {isAccApp, reloadKey, fncFocusLayout} = useWebContext();
	const {fncChangeMoHeader} = useMoHeaderContext();
    const {fncRouteStart} = useLoadingContext();

	useLayoutEffect(() => {
		if (isAccApp) fncFocusLayout();
		if (isMobile) {
			fncChangeMoHeader({
				type: 'back',
				title: '대중교통안심카드'
			})
		}
	}, [isMobile, isAccApp, reloadKey])

	// 이동: 이용안내
	const fncGoGuide = () => {
		const targetUri = RouteConfig.GUIDE_ASSURANCE.PATH;
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
		<MoAboutSafeTransitCard
			fncCallbackEvent={fncCallbackEvent}
		/>
	);
	else return (
		<DtAboutSafeTransitCard
			fncCallbackEvent={fncCallbackEvent}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F212
 */
DtAboutSafeTransitCard.propTypes = {
	fncCallbackEvent: PropTypes.func
};

export function DtAboutSafeTransitCard({fncCallbackEvent}) {
	return (
		<main id={'about'} className={'body-wrap-880'} aria-labelledby={'page-name-dt'}>
			<Breadcrumb addPaths={[]}/>
			<h1 id={'page-name-dt'} className={'page-title'}>
				대중교통안심카드
			</h1>
			<section className={'card-wrap'}>
				<div className={'image-wrap'}>
					<SafeTransitCard />
				</div>
				<div className={'info-wrap'}>
					<h1 className={'catchphrase'}>
						전국 대중교통 이용하고<br/>분실 시에도 걱정없이 잔액 환불!
					</h1>
					<h2 className={'catchphrase-sub'}>
						전국 버스,지하철에서 사용할 수 있으며 카드 분실 시 잔액을 환불 받을 수 있는 교통전용 안심카드로 분실/도난 걱정없이 이용하세요.
					</h2>
					<Button
						theme={'textOnly'}
						size={'sm'}
						text={'대중교통안심카드 이용안내'}
						ariaLabel={'대중교통안심카드 이용안내'}
						icon={<ChevronRight/>}
						iconPosition={'right'}
						customStyle={'w-fit'}
						onClick={() => fncCallbackEvent('goGuide')}
					/>
				</div>
			</section>
			<section className={'detail-wrap'}>
				<div className={'type01'} aria-labelledby={'group01'}>
					<dl>
						<dt id={'group01'}>구매 안내</dt>
						<dd>
							<div className={'flex-row-center'}>
								<AboutSelfMachine/>
								수도권 광역전철역 자동발매기 구매 (일부 제외)
							</div>
							<div className={'flex-row-center'}>
								<AboutAmount/>
								2,000원
							</div>
							<ul className={'comment'}>
								<li>대중교통 안심카드는 통합 권종으로 자동발매기에서 카드 발매 시 일반, 청소년, 어린이로 권종이 변경되어 발매됩니다.</li>
								<li>구매 이후 권종 변경 등에 따른 카드 교체 및 카드값 환불은 불가합니다.</li>
							</ul>
						</dd>
					</dl>
				</div>
				<hr />
				<div className={'type01'} aria-labelledby={'group02'}>
					<dl>
						<dt id={'group02'}>충전 안내</dt>
						<dd>
							<div className={'flex-row-center'}>
								<AboutMetro/>
								기차역 매표창구
							</div>
							<div className={'flex-row-center'}>
								<AboutSelfMachine/>
								수도권 지하철 내 무인기기 (충전기, 발매기, 정산기)
							</div>
							<div className={'flex-row-center'}>
								<AboutATM/>
								ATM기기 (우리은행, 농협, 롯데 등)
							</div>
						</dd>
					</dl>
				</div>
				<hr />
				<div className={'type01'} aria-labelledby={'group03'}>
					<dl>
						<dt id={'group03'}>구매 안내</dt>
						<dd>
							<div className={'flex-row-center'}>
								<AboutBus/>
								전국 버스 · 지하철에서만 사용 가능
							</div>
							<div className={'flex-row-center'}>
								<AboutApply/>
								분실/도난 시 홈페이지에서 접수 후 환불
							</div>
							<ul className={'comment'}>
								<li>분실접수 및 환불은 카드등록이 되어있는 경우만 가능합니다.</li>
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
 * @screenID:    UI-CRM-F420
 */
MoAboutSafeTransitCard.propTypes = {
	fncCallbackEvent: PropTypes.func
};
export function MoAboutSafeTransitCard({fncCallbackEvent}) {
	return (
		<main id={'about'} className={'w-full page-bottom-space'} aria-labelledby={'page-name-mo'}>
			<h1 id={'page-name-mo'} className={'sr-only'}>대중교통안심카드</h1>
			<section className={'card-wrap bg-gradient-to-b from-[#FFE15D]/30 to-bg-dynamic-by-neutral-base'}>
				<div className={'image-wrap'}>
					<SafeTransitCard />
				</div>
				<div className={'info-wrap'}>
					<h1 className={'catchphrase'}>
						전국 대중교통 이용하고<br/>분실 시에도 걱정없이 잔액 환불!
					</h1>
					<h2 className={'catchphrase-sub'}>
						전국 버스,지하철에서 사용할 수 있으며<br/>카드 분실 시 잔액을 환불 받을 수 있는 교통전용 안심카드로<br/>분실/도난 걱정없이 이용하세요.
					</h2>
					<Button
						theme={'textOnly'}
						size={'sm'}
						text={'대중교통안심카드 이용안내'}
						ariaLabel={'대중교통안심카드 이용안내'}
						icon={<ChevronRight />}
						iconPosition={'right'}
						customStyle={'w-fit'}
						onClick={() => fncCallbackEvent('goGuide')}
					/>
				</div>
			</section>
			<section className={'detail-wrap'}>
				<div className={'type01'} aria-labelledby={'group01'}>
					<dl>
						<dt id={'group01'}>구매 안내</dt>
						<dd>
							<div className={'flex-row-center'}>
								<AboutSelfMachine/>
								수도권 광역전철역 자동발매기 구매 (일부 제외)
							</div>
							<div className={'flex-row-center'}>
								<AboutAmount/>
								2,000원
							</div>
							<ul className={'comment'}>
								<li>대중교통 안심카드는 통합 권종으로 자동발매기에서 카드 발매 시 일반, 청소년, 어린이로 권종이 변경되어 발매됩니다.</li>
								<li>구매 이후 권종 변경 등에 따른 카드 교체 및 카드값 환불은 불가합니다.</li>
							</ul>
						</dd>
					</dl>
				</div>
				<div className={'type01'} aria-labelledby={'group02'}>
					<dl>
						<dt id={'group02'}>충전 안내</dt>
						<dd>
							<div className={'flex-row-center'}>
								<AboutMetro/>
								기차역 매표창구
							</div>
							<div className={'flex-row-center'}>
								<AboutSelfMachine/>
								수도권 지하철 내 무인기기 (충전기, 발매기, 정산기)
							</div>
							<div className={'flex-row-center'}>
								<AboutATM/>
								ATM기기 (우리은행, 농협, 롯데 등)
							</div>
						</dd>
					</dl>
				</div>
				<div className={'type01'} aria-labelledby={'group03'}>
					<dl>
						<dt id={'group03'}>구매 안내</dt>
						<dd>
							<div className={'flex-row-center'}>
								<AboutBus/>
								전국 버스 · 지하철에서만 사용 가능
							</div>
							<div className={'flex-row-center'}>
								<AboutApply/>
								분실/도난 시 홈페이지에서 접수 후 환불
							</div>
							<ul className={'comment'}>
								<li>분실접수 및 환불은 카드등록이 되어있는 경우만 가능합니다.</li>
							</ul>
						</dd>
					</dl>
				</div>
			</section>
		</main>
	)
}
