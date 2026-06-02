'use client'

import React from 'react';
import Image from 'next/image';

// modules
import {useScreenSizeContext} from "@modules/context/ScreenContext";

// assets
import PostpaidImage01 from '@assets/images/guide_mo_postpaid_01.png';
import PostpaidImage02 from '@assets/images/guide_mo_postpaid_02.png';
import PostpaidImage03 from '@assets/images/guide_mo_postpaid_03.png';
import PrepaidImage03 from "@assets/images/guide_mo_prepaid_03.png";


/**
 * @description: 모바일 Rail+ 후불형 컴포넌트 입니다.
 * @screenID:    -
 * @screenPath:  홈 > Rail+ 이용안내 > 모바일 Rail+ 선불형 / 후불형
 * @author       $Author
 * @since        $Date
 * @version      $Revision
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function GuideMobileBillingTab02() {
	const {isMobile} = useScreenSizeContext();
	return (
		<>
			<section className={'type04'}>
				<dl>
					<dt>사용방법</dt>
					<dd>
						<div>
							<div className={'timeline'}/>
							<div className={'decimal'}>1</div>
							<div className={'detail'}>
								<h3 className={'title'}>레일플러스 앱 다운로드 및 실행</h3>
								<p>Google Play 또는 App Store 에서 ‘레일플러스’ 또는 ‘코레일’ 검색 후 앱 다운로드</p>
							</div>
						</div>
						<div>
							<div className={'timeline'}/>
							<div className={'decimal'}>2</div>
							<div className={'detail'}>
								<h3 className={'title'}>후불형 카드 등록 및 사용</h3>
								<p>우리카드 또는 신한카드 중 선택</p>
							</div>
						</div>
						<div>
							<div className={'decimal'}>3</div>
							<div className={'detail'}>
								<h3 className={'title'}>사용대금 후불 청구</h3>
								<p>잔액 부족 시 한도복원 (최대 2회, 6만원)</p>
							</div>
						</div>
					</dd>
				</dl>
			</section>
			<hr className={'margin-y'}/>
			<section className={'type10'}>
				<dl>
					<dt>서비스 전환방법 (선불 → 후불)</dt>
					<dd>
						<div className={'cols-3-wrap'}>
							<div className={'billing'}><Image src={PostpaidImage01} alt={`Step1: 메인화면 '카드전환' 선택`}/></div>
							<div className={'billing'}><Image src={PostpaidImage02} alt={'Step2: 후불형 서비스 전환 안내'}/></div>
							{
								isMobile ? (
									<div className={'billing relative'}>
										<Image src={PostpaidImage03} alt={'Step3: 후불형 카드 전환 완료'}/>
										<div className={'guide-bottom-comment'}>
											<p>후불형 카드가 없을 경우 신규발급이 필요합니다.</p>
										</div>
									</div>
								) : (
									<div className={'billing'}>
										<Image src={PostpaidImage03} alt={'Step3: 후불형 카드 전환 완료'}/>
									</div>
								)
							}
						</div>
					</dd>
				</dl>
			</section>
		</>
	)
}
