'use client'

import React from 'react';


/**
 * @description: 대중교통안심카드 분실신청 컴포넌트 입니다.
 * @screenID:    -
 * @screenPath:  홈 > Rail+ 이용안내 > 대중교통안심카드
 * @author       $Author
 * @since        $Date
 * @version      $Revision
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function GuideSafeTransitTab02() {
	return (
		<>
			<section className={'type04'}>
				<dl>
					<dt>분실 신청 방법</dt>
					<dd>
						<div>
							<div className={'timeline'} />
							<div className={'decimal'}>1</div>
							<div className={'detail'}>
								<h3 className={'title'}>레일플러스 홈페이지 또는 앱 로그인</h3>
							</div>
						</div>
						<div>
							<div className={'timeline'} />
							<div className={'decimal'}>2</div>
							<div className={'detail'}>
								<h3 className={'title'}>{`마이페이지 > 분실 신청 접속`}</h3>
							</div>
						</div>
						<div>
							<div className={'timeline'} />
							<div className={'decimal'}>3</div>
							<div className={'detail'}>
								<h3 className={'title'}>분실 신청서 작성 후 제출</h3>
							</div>
						</div>
						<div>
							<div className={'decimal'}>4</div>
							<div className={'detail'}>
								<h3 className={'title'}>신청 완료 후 환불 진행</h3>
							</div>
						</div>
					</dd>
				</dl>
				<hr />
			</section>
			<section className={'type05 mt-[54px] mo:mt-16'}>
				<dl>
					<dt>카드 분실 시 처리</dt>
					<dd>
						<ul>
							<li>홈페이지 가입 및 카드등록 후에만 신청 가능</li>
							<li>분실신청 후 충전잔액 환불 가능</li>
						</ul>
					</dd>
				</dl>
				<hr />
				<dl>
					<dt>유의사항</dt>
					<dd>
						<ul>
							<li>분실신청 이후 카드를 다시 습득하더라도 재등록 및 사용 불가</li>
							<li>신청 철회는 불가하므로 신중히 신청 바랍니다</li>
						</ul>
					</dd>
				</dl>
			</section>
		</>
	)
}
