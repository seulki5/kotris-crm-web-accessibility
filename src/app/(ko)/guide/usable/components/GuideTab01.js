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


/**
 * @description: 사용처 안내 사용처 컴포넌트 입니다.
 * @screenID:    -
 * @screenPath:  홈 > Rail+ 이용안내 > 사용처 안내
 * @author       $Author
 * @since        $Date
 * @version      $Revision
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function GuideUsableTab01() {
	return (
		<section className={'type07'}>
			<dl>
				<dt>
					<h3>교통안내</h3>
				</dt>
				<dd>
					<div>
						<div className={'image-wrap'}>
							<GuideBus/>
							<p>버스</p>
						</div>
						<ul>
							<li>전국 버스</li>
							<li>서울/제주 시티투어버스</li>
							<li>공항 리무진</li>
						</ul>
					</div>
					<div>
						<div className={'image-wrap'}>
							<GuideMetro/>
							<p>지하철</p>
						</div>
						<ul>
							<li>전국 지하철</li>
							<li className={'comment'}>이용제외지역: (전남) 진도군, (경북) 군위군, 청송군, 영양군, 영덕군, 봉화군</li>
						</ul>
					</div>
					<div>
						<div className={'image-wrap'}>
							<GuideTrain/>
							<p>기차</p>
						</div>
						<ul>
							<li>KTX, 새마을, 무궁화, ITX청춘, 누리로 등</li>
						</ul>
					</div>
					<div>
						<div className={'image-wrap'}>
							<GuideTaxi/>
							<p>택시</p>
						</div>
						<ul>
							<li>서울, 경기, 인천, 대전, 울산, 부산, 강원(원주, 인제), 충북(청주, 진천 음성), 전북(전주), 경북(포항, 칠곡, 청송, 안동, 성주, 구미,
								고령, 경주), 경남(의형, 김해)
							</li>
							<li className={'comment'}>㈜티머니 운영 택시에 한함</li>
						</ul>
					</div>
					<div>
						<div className={'image-wrap'}>
							<GuideHighway/>
							<p>고속도로</p>
						</div>
						<ul>
							<li>전국 한국도로공사 요금소</li>
							<li>민자 요금소 (일부도로 제외)</li>
						</ul>
					</div>
					<div>
						<div className={'image-wrap'}>
							<GuideTerminal/>
							<p>고속버스<br/>터미널</p>
						</div>
						<ul>
							<li>전국 고속버스터미널 (김해시 제외)</li>
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
							<GuideConvenienceStore/>
							<p>편의점</p>
						</div>
						<ul>
							<li>전국 스토리웨이, 이마트24, CU</li>
						</ul>
					</div>
					<div>
						<div className={'image-wrap'}>
							<GuideParking/>
							<p>주차장</p>
						</div>
						<ul>
							<li>전국 철도역 주차장 (서울, 대전, 동대구, 경주, 부산, 창원, 마산, 여수엑스포 등 41개역)</li>
						</ul>
					</div>
					<div>
						<div className={'image-wrap'}>
							<GuideCoalition/>
							<p>가맹점</p>
						</div>
						<ul>
							<li>레일플러스 스티커를 부착한 제휴 가맹점</li>
						</ul>
					</div>
					<div>
						<div className={'image-wrap'}>
							<GuideEtc/>
							<p>기타</p>
						</div>
						<ul>
							<li>전국 철도 역사 내 매장 (민자역사 운영 매장 제외)</li>
						</ul>
					</div>
				</dd>
			</dl>
		</section>
	)
}
