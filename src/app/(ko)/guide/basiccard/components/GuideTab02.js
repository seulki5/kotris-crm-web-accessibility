'use client'

import React from 'react';

// assets
import {GuideApplication, GuideCoalition, GuideConvenienceStore, GuideMetro} from '@assets/icons/GuideSvgs';
import AboutBasicCard from "@/app/(ko)/about/basiccard/page";


/**
 * @description: 일반 Rail+ 카드 이용안내 충전처 컴포넌트 입니다.
 * @screenID:    -
 * @screenPath:  홈 > Rail+ 이용안내 > 일반 Rail+ 카드
 * @author       $Author
 * @since        $Date
 * @version      $Revision
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function GuideBasicTab02() {
	return (
		<section className={'type03'}>
			<dl>
				<dt>교통안내</dt>
				<dd>
					<div>
						<GuideMetro color={'pink'}/>
						<p>지하철</p>
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
						<GuideConvenienceStore color={'pink'}/>
						<p>편의점</p>
					</div>
					<div>
						<GuideCoalition color={'pink'}/>
						<p>제휴가맹점</p>
					</div>
				</dd>
			</dl>
			<hr />
			<dl>
				<dt>온라인안내</dt>
				<dd>
					<div>
						<GuideApplication/>
						<p>Rail+ 앱</p>
					</div>
				</dd>
			</dl>
		</section>
	)
}
