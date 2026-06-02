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
export default function GuideSafeTransitTab03() {
	return (
		<section className={'type06'}>
			<dl>
				<dt>환불 일정</dt>
				<dd>
					<table summary={'분실접수 신청(일), 환불금액 확정, 고객계좌 환불을 보여주는 표입니다.'}>
						<caption className='sr-only'>환불 일정</caption>
						<thead>
							<tr>
								<th scope='col' className='sr-only'>구분</th>
								<th scope='col' className='sr-only'>내용</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<th scope='col' className={'col-span-1'}>분실접수 신청(일)</th>
								<th scope='col' className={'col-span-1'}>환불금액 확정</th>
								<th scope='col' className={'col-span-1'}>고객계좌 환불</th>
							</tr>
							<tr>
								<td className={'col-span-1'}>18:00 이전</td>
								<td className={'col-span-1'}>D+2일</td>
								<td className={'col-span-1'}>D+4일</td>
							</tr>
							<tr>
								<td className={'col-span-1'}>18:00 이후</td>
								<td className={'col-span-1'}>D+3일</td>
								<td className={'col-span-1'}>D+5일</td>
							</tr>
						</tbody>
						<tfoot></tfoot>
					</table>
				</dd>
			</dl>
			<hr />
			<dl>
				<dt>환불 안내</dt>
				<dd>
					<table summary='환불 계좌, 환불 조건을 보여주는 표입니다.'>
						<caption className='sr-only'>환불 안내</caption>
						<thead>
							<tr>
								<th scope='col' className='sr-only'>구분</th>
								<th scope='col' className='sr-only'>내용</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<th scope='col' className={'col-span-1'}>환불 계좌</th>
								<td className={'col-span-2'}>
									<p className={'w-full text-start'}>본인 명의 계좌 필수, 어린이 · 청소년은 보호자 계좌로 신청 가능</p>
								</td>
							</tr>
							<tr>
								<th scope='col' className={'col-span-1'}>환불 조건</th>
								<td className={'col-span-2'}>
									<ul className={'text-start w-full'}>
										<li>충전잔액 환불 시 카드구입 대금은 제외</li>
										<li>토 · 일 · 공휴일 제외, 영업일 기준 처리</li>
									</ul>r
								</td>
							</tr>
						</tbody>
						<tfoot></tfoot>
					</table>
				</dd>
			</dl>
		</section>
	)
}
