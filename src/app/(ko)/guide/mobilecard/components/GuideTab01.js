'use client'

import React from 'react';


/**
 * @description: 모바일 Rail+ 카드 이용안내 컴포넌트 입니다.
 * @screenID:    -
 * @screenPath:  홈 > Rail+ 이용안내 > 모바일 Rail+ 카드
 * @author       $Author
 * @since        $Date
 * @version      $Revision
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function GuideMobileTab01() {
	return (
		<section className={'type04'}>
			<dl>
				<dt>설치 및 발급 방법</dt>
				<dd>
					<div>
						<div className={'timeline'} />
						<div className={'decimal'}>1</div>
						<div className={'detail'}>
							<h3 className={'title'}>Rail+ 앱 설치</h3>
							<p>구글 플레이스토어, 앱 스토어에서 ‘레일플러스’ 앱 다운로드 및 설치</p>
						</div>
					</div>
					<div>
						<div className={'decimal'}>2</div>
						<div className={'detail'}>
							<h3 className={'title'}>모바일 Rail+ 카드 발급</h3>
							<p>앱 실행 후 선불형 또는 후불형 카드 선택 및 본인 인증을 통해 모바일 교통 카드 발급</p>
						</div>
					</div>
				</dd>
			</dl>
			<hr />
			<dl>
				<dt>사용 방법</dt>
				<dd>
					<div>
						<div className={'timeline'} />
						<div className={'decimal'}>1</div>
						<div className={'detail'}>
							<h3 className={'title'}>NFC 기능 활성화</h3>
							<p>스마트폰의 NFC 기능 기본 모드로 활성화 </p>
						</div>
					</div>
					<div>
						<div className={'timeline'} />
						<div className={'decimal'}>2</div>
						<div className={'detail'}>
							<h3 className={'title'}>Rail+ 앱 실행</h3>
							<p>Rail+ 앱을 실행하고 화면을 켠 상태 유지</p>
						</div>
					</div>
					<div>
						<div className={'decimal'}>3</div>
						<div className={'detail'}>
							<h3 className={'title'}>태그하여 이용</h3>
							<p>단말기에 스마트폰을 접촉하여 결제 및 이용</p>
						</div>
					</div>
				</dd>
			</dl>
		</section>
	)
}
