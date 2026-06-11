'use client'

import React from 'react';

// assets
import {GuideCoalition, GuideConvenienceStore, GuideMetro} from '@assets/icons/GuideSvgs';


/**
 * @description: 사용처 안내 충전처 컴포넌트 입니다.
 * @screenID:    -
 * @screenPath:  홈 > Rail+ 이용안내 > 사용처 안내
 * @author       $Author
 * @since        $Date
 * @version      $Revision
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function GuideUsableTab02() {
	return (
		<section className={'type07'}>
			<dl>
				<dt>
					<h3>교통안내</h3>
				</dt>
				<dd>
					<div>
						<div className={'image-wrap'}>
							<GuideMetro color={'pink'} />
							<p>철도/<br/>지하철</p>
						</div>
						<ul>
							<li>전국 철도역 매표창구<br/>(수도권, 광역전철역(용인경전철 제외), 동해선, 대경선)</li>
						</ul>
					</div>
				</dd>
			</dl>
			<hr/>
			<dl>
				<dt>
					<h3>유통안내</h3>
				</dt>
				<dd>
					<div>
						<div className={'image-wrap'}>
							<GuideConvenienceStore color={'pink'} />
							<p>편의점</p>
						</div>
						<ul>
							<li>전국 스토리웨이, 이마트24, CU</li>
						</ul>
					</div>
					<div>
						<div className={'image-wrap'}>
							<GuideCoalition color={'pink'} />
							<p>가맹점</p>
						</div>
						<ul>
							<li>전국 우리은행, 농협, 롯데(세븐일레븐, 롯데마트, 롯데백화점, 롯데슈퍼 등), ATM</li>
						</ul>
					</div>
				</dd>
			</dl>
		</section>
	)
}
