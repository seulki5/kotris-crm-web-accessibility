'use client'

import React, {useLayoutEffect} from 'react';

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {useMoHeaderContext} from '@modules/context/MoHeaderContext';
import {useWebContext} from '@modules/context/WebviewContext';

// components
import Breadcrumb from '@components/layout/Breadcrumb';

// assets
import {BdgChildren, BdgGuardian} from '@assets/icons/Badges';


/**
 * @description: 어린이 안심서비스 이용안내 화면 입니다.
 * @screenID:    UI-CRM-F221, UI-CRM-F431
 * @screenPath:  홈 > Rail+ 이용안내 > 어린이 안심서비스
 * @author       $Author
 * @since        $Date
 * @version      $Revision
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function GuideChildproof() {
	
	const {isMobile} = useScreenSizeContext();
	const {isAccApp, reloadKey, fncFocusLayout} = useWebContext();
	const {fncChangeMoHeader} = useMoHeaderContext();

	useLayoutEffect(() => {
		if (isAccApp) fncFocusLayout();
		if (isMobile) {
			fncChangeMoHeader({
				type: 'back',
				title: '어린이 안심서비스 이용안내'
			})
		}
	}, [isMobile, isAccApp, reloadKey])
	
	if (isMobile) return (
		<MoGuideChildproof />
	);
	else return (
		<DtGuideChildproof />
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F221
 */
export function DtGuideChildproof() {
	return (
		<main id={'guide'} className={'body-wrap-880'} aria-labelledby={'page-name-dt'}>
			<Breadcrumb addPaths={[]}/>
			<p className={'catchphrase'}>
				Rail+에서 어린이를 더 안전하게!
			</p>
			<h1 id={'page-name-dt'} className={'page-title'}>
				어린이 안심서비스 이용안내
			</h1>
			<p className={'page-description'}>
				어린이 승객의 안전한 이동을 위한 레일플러스 서비스로 자녀의 정보를 간편하게 확인하세요
			</p>
			<section className={'type08'}>
				<dl>
					<dt>서비스<br/>이용 방법</dt>
					<dd>
						<div>
							<div className={'timeline'} />
							<div className={'decimal'}>1</div>
							<div className={'detail'}>
								<h3 className={'title'}>Rail+ 회원가입 <span className={'flex-row-center gap-6'}><BdgGuardian/><BdgChildren/></span></h3>
								<p>보호자, 자녀 모두 레일플러스에 회원가입</p>
							</div>
						</div>
						<div>
							<div className={'timeline'} />
							<div className={'decimal'}>2</div>
							<div className={'detail'}>
								<h3 className={'title'}>Rail+ 카드 등록 <BdgChildren/></h3>
								<p>오프라인에서 카드를 구매하거나 Rail+ 에서 카드 발급/등록 진행</p>
								<p>오프라인에서 구매했을 경우 Rail+ 앱 또는 웹사이트에서 카드 등록 진행</p>
							</div>
						</div>
						<div>
							<div className={'timeline'} />
							<div className={'decimal'}>3</div>
							<div className={'detail'}>
								<h3 className={'title'}>어린이 안심서비스 신청 <BdgGuardian/></h3>
								<p>Rail+ 앱 또는 웹사이트에서 ‘어린이 안심서비스’ 신청</p>
							</div>
						</div>
						<div>
							<div className={'decimal'}>4</div>
							<div className={'detail'}>
								<h3 className={'title'}>신청 접수 처리</h3>
								<p>보호자의 서비스 신청이 접수되면 Rail+ 운영팀에서 승인 절차 진행</p>
								<p>승인 완료 후 보호자에게 서비스 알림 전송</p>
								<p>이후 자녀가 레일플러스 이용 시 이용내역 확인 가능</p>
							</div>
						</div>
					</dd>
				</dl>
			</section>
		</main>
	)
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F431
 */
export function MoGuideChildproof() {
	return (
		<main id={'guide'} className={'body-wrap-mobile page-bottom-space'} aria-labelledby={'page-name-mo'}>
			<p className={'catchphrase'}>
				Rail+에서 어린이를 더 안전하게!
			</p>
			<h1 id={'page-name-mo'} className={'page-title'}>
				어린이 안심서비스 이용안내
			</h1>
			<p className={'page-description'}>
				어린이 승객의 안전한 이동을 위한 레일플러스 서비스로 자녀의 정보를 간편하게 확인하세요
			</p>
			<section className={'type08'}>
				<dl>
					<dt>서비스 이용 방법</dt>
					<dd>
						<div>
							<div className={'timeline'} />
							<div className={'decimal'}>1</div>
							<div className={'detail'}>
								<h3 className={'title'}>Rail+ 회원가입 <span className={'flex-row-center gap-2'}><BdgGuardian/><BdgChildren/></span></h3>
								<p>보호자, 자녀 모두 레일플러스에 회원가입</p>
							</div>
						</div>
						<div>
							<div className={'timeline'} />
							<div className={'decimal'}>2</div>
							<div className={'detail'}>
								<h3 className={'title'}>Rail+ 카드 등록 <BdgChildren/></h3>
								<p>오프라인에서 카드를 구매하거나 Rail+ 에서 카드 발급/등록 진행</p>
								<p>오프라인에서 구매했을 경우 Rail+ 앱 또는 웹사이트에서 카드 등록 진행</p>
							</div>
						</div>
						<div>
							<div className={'timeline'} />
							<div className={'decimal'}>3</div>
							<div className={'detail'}>
								<h3 className={'title'}>어린이 안심서비스 신청 <BdgGuardian/></h3>
								<p>Rail+ 앱 또는 웹사이트에서 ‘어린이 안심서비스’ 신청</p>
							</div>
						</div>
						<div>
							<div className={'decimal'}>4</div>
							<div className={'detail'}>
								<h3 className={'title'}>신청 접수 처리</h3>
								<p>보호자의 서비스 신청이 접수되면 Rail+ 운영팀에서 승인 절차 진행</p>
								<p>승인 완료 후 보호자에게 서비스 알림 전송</p>
								<p>이후 자녀가 레일플러스 이용 시 이용내역 확인 가능</p>
							</div>
						</div>
					</dd>
				</dl>
			</section>
		</main>
	)
}
