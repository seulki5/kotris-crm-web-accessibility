'use client'

import React from 'react';
import Image from 'next/image';

// modules
import {useScreenSizeContext} from "@modules/context/ScreenContext";

// assets
import PrepaidImage01 from '@assets/images/guide_mo_prepaid_01.png';
import PrepaidImage02 from '@assets/images/guide_mo_prepaid_02.png';
import PrepaidImage03 from '@assets/images/guide_mo_prepaid_03.png';
import PrepaidImage04 from '@assets/images/guide_mo_prepaid_04.png';
import PrepaidImage05 from '@assets/images/guide_mo_prepaid_05.png';
import PrepaidImage06 from '@assets/images/guide_mo_prepaid_06.png';
import PrepaidImage07 from '@assets/images/guide_mo_prepaid_07.png';
import PrepaidImage08 from '@assets/images/guide_mo_prepaid_08.png';
import PrepaidImage09 from '@assets/images/guide_mo_prepaid_09.png';
import PrepaidImage10 from '@assets/images/guide_mo_prepaid_10.png';
import PrepaidImage11 from '@assets/images/guide_mo_prepaid_11.png';
import PrepaidImage12 from '@assets/images/guide_mo_prepaid_12.png';
import PrepaidImage13 from '@assets/images/guide_mo_prepaid_13.png';


/**
 * @description: 모바일 Rail+ 선불형 컴포넌트 입니다.
 * @screenID:    -
 * @screenPath:  홈 > Rail+ 이용안내 > 모바일 Rail+ 선불형 / 후불형
 * @author       $Author
 * @since        $Date
 * @version      $Revision
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function GuideMobileBillingTab01() {
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
								<h3 className={'title'}>카드 잔액 충전</h3>
								<p>오프라인, 신용카드, 체크카드, 휴대폰, 계좌이체로 충전 가능</p>
							</div>
						</div>
						<div>
							<div className={'timeline'}/>
							<div className={'decimal'}>2</div>
							<div className={'detail'}>
								<h3 className={'title'}>레일플러스 사용</h3>
							</div>
						</div>
						<div>
							<div className={'decimal'}>3</div>
							<div className={'detail'}>
								<h3 className={'title'}>충전 금액 잔액 내 사용</h3>
							</div>
						</div>
					</dd>
				</dl>
			</section>
			<hr className={'margin-y'}/>
			<section className={'type10'}>
				<dl>
					<dt>서비스 전환방법 (후불 → 선불)</dt>
					<dd>
						<div className={'cols-3-wrap'}>
							<div className={'billing'}><Image src={PrepaidImage01} alt={`Step1: 메인화면 '카드전환' 선택`}/></div>
							<div className={'billing'}><Image src={PrepaidImage02} alt={'Step2: 선불형 서비스 전환 안내'}/></div>
							{
								isMobile ? (
									<div className={'billing relative'}>
										<Image src={PrepaidImage03} alt={'Step3: 선불형 카드 전환 완료'}/>
										<div className={'guide-bottom-comment'}>
											<p>선불형 카드가 없을 경우 신규발급이 필요합니다.</p>
										</div>
									</div>
								) : (
									<div className={'billing'}>
										<Image src={PrepaidImage03} alt={'Step3: 선불형 카드 전환 완료'}/>
									</div>
								)
							}
						</div>
					</dd>
				</dl>
				<hr/>
				<dl>
					<dt>충전 방법</dt>
					<dd>
						<div className={'cols-3-wrap'}>
							<div className={'billing'}><Image src={PrepaidImage04} alt={'Step1: 충전 방법 선택'}/></div>
							<div className={'billing'}><Image src={PrepaidImage05} alt={'Step2: 충전 금액 선택'}/></div>
							<div className={'billing'}><Image src={PrepaidImage06} alt={'Step3: 충전 금액 결제 및 완료'}/></div>
						</div>
					</dd>
				</dl>
				<hr/>
				<dl>
					<dt>KTX 마일리지 전환</dt>
					<dd>
						<div className={'cols-2-wrap'}>
							<div className={'billing'}><Image src={PrepaidImage07} alt={'Step1: 코레일 톡+ 앱 접속'}/></div>
							<div className={'billing'}><Image src={PrepaidImage08} alt={'Step2: KTX 마일리지 R+ 자동전환 신청'}/></div>
							<div className={'billing'}><Image src={PrepaidImage09} alt={'Step3: KTX 마일리지 자동전환 신청 확인'}/></div>
							<div className={'billing'}><Image src={PrepaidImage10} alt={'Step4: 자동전환 완료'}/></div>
						</div>
						<div className={'comment'}>
							<p>이용안내</p>
							<ul>
								<li>자동전환 신청은 코레일톡+(앱) 내에서 합니다.</li>
								<li>매일 07시 이후에 천원단위로 1일 최대 5천원까지 전환됩니다.</li>
								<li>환불 시 기존 철도회원 마일리지로 복원됩니다.</li>
							</ul>
						</div>
					</dd>
				</dl>
				<hr />
				<dl>
					<dt>환불 방법</dt>
					<dd>
						<div className={'cols-3-wrap my-36'}>
							<div className={'billing'}><Image src={PrepaidImage11} alt={'Step1: 전체메뉴에서 환불 신청'}/></div>
							<div className={'billing'}><Image src={PrepaidImage12} alt={'Step2: 환불신청 정보 입력'}/></div>
							<div className={'billing'}><Image src={PrepaidImage13} alt={'Step3: 환불신청 완료'}/></div>
						</div>
						<div className={'comment'}>
							<p>이용안내</p>
							<ul>
								<li>환불신청 계좌는 본인명의(휴대폰 명의)의 계좌만 가능합니다.</li>
								<li>환불에 따른 별도의 수수료는 없으며, 환불 신청 완료 후에는 취소할 수 없습니다.</li>
								<li>환불은 보유금액에서 마일리지 금액을 제외한 환불가능금액에 대해 전액 환불 받으실 수 있습니다.</li>
								<li>환불요청에 따른 계좌입금 소요기간은 접수일로부터 평균 2~3일(최대 14일) 소요됩니다.</li>
								<li>환불신청은 1일 1회 가능하며, 10만원 초과금액 환불은 월 1회/연 5회 이내에서 환불 받으실 수 있습니다.</li>
								<li>KTX 마일리지로 자동전환된 금액은 전환 전 철도회원의 KTX 마일리지로 복구됩니다.</li>
								<li>환불신청 후 반드시 코레일톡+에서 KTX 마일리지 R+ 자동전환이 해지되었는지 확인하여 주시기 바랍니다.</li>
							</ul>
						</div>
					</dd>
				</dl>
			</section>
		</>
	)
}
