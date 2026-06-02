'use client'

import React from 'react';

// assets
import {
	GuideBus, GuideCoalition,
	GuideConvenienceStore, GuideEtc,
	GuideHighway,
	GuideMetro, GuideParking,
	GuideTaxi,
	GuideTerminal,
	GuideTrain
} from '@assets/icons/GuideSvgs';
import AboutBasicCard from "@/app/(ko)/about/basiccard/page";


/**
 * @description: 일반 Rail+ 카드 이용안내 사용처 컴포넌트 입니다.
 * @screenID:    -
 * @screenPath:  홈 > Rail+ 이용안내 > 일반 Rail+ 카드
 * @author       $Author
 * @since        $Date
 * @version      $Revision
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function GuideBasicTab01() {
	return (
		<section className={'type03'}>
			<dl>
				<dt>교통안내</dt>
				<dd>
					<div>
						<GuideBus/>
						<p>버스</p>
					</div>
					<div>
						<GuideMetro/>
						<p>지하철</p>
					</div>
					<div>
						<GuideTrain/>
						<p>기차</p>
					</div>
					<div>
						<GuideTaxi/>
						<p>택시</p>
					</div>
					<div>
						<GuideHighway/>
						<p>고속도로</p>
					</div>
					<div>
						<GuideTerminal/>
						<p>고속버스<br/>터미널</p>
					</div>
				</dd>
			</dl>
			<hr />
			<dl>
				<dt>
					유통안내
					<p><span className={'text-dynamic-text-alert-primary'}>*</span>편의점: 스토리웨이, 이마트24, CU</p>
				</dt>
				<dd>
					<div>
						<GuideConvenienceStore/>
						<p>편의점</p>
					</div>
					<div>
						<GuideParking/>
						<p>주차장</p>
					</div>
					<div>
						<GuideCoalition/>
						<p>제휴가맹점</p>
					</div>
					<div>
						<GuideEtc/>
						<p>기타</p>
					</div>
				</dd>
			</dl>
		</section>
	)
}
