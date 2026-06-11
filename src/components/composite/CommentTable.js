import React from 'react';
import PropTypes from 'prop-types';

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {fncOpenUri} from '@modules/utils/StringUtils';

// assets
import {AlertCircle} from '@assets/icons/Svgs';

// const
const TableTitle = {
	issue: '카드 종류별 발급 기준 및 기능(어린이/청소년 할인등록)',
	type: '환불 일정'
}


/**
 * @description: 표가 있는 주석 컴포넌트 입니다.
 * @screenID:    -
 * @screenPath:  -
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
CommentTable.propTypes = {
	type: PropTypes.string
};
export default function CommentTable({type}) {

	const {isMobile} = useScreenSizeContext();

	// 새 창 열기
	const fncOpenUrl = () => {
		fncOpenUri('https://railplus.korail.com/');
	}

	return (
		<div className={'w-full flex flex-col gap-8'}>
			<div className={'flex-row-center gap-6'}>
				<AlertCircle
					width={isMobile ? 16 : 24}
					height={isMobile ? 16 : 24}
					color={'text-dynamic-icon-info-primary'}
				/>
				<p className={`
					text-body-2xl text-dynamic-text-neutral-primary font-medium
					mo:text-body-md
					mo:font-semibold
				`}>
					{TableTitle.type}
				</p>
			</div>
			{
				type === 'issue' && (
					<table
						className={'w-full text-center'}
						summary={'카드 종류별로 카드명, 종류, 대상, 발급일 정보를 제공하는 표입니다.'}
					>
						<caption className='sr-only'>카드 종류별 발급 기준 및 기능 안내 표</caption>
						<thead className={'text-body-md text-dynamic-text-neutral-primary font-medium mo:text-body-sm'}>
							<tr className={`
								h-[44px] bg-dynamic-bg-neutral-quarternary
								border-y border-solid border-dynamic-border-neutral-primary
							`}>
								<th scope={'col'} className={'border-r border-solid border-dynamic-border-neutral-primary'}>카드명</th>
								<th scope={'col'} className={'border-r border-solid border-dynamic-border-neutral-primary'}>종류</th>
								<th scope={'col'} className={'border-r border-solid border-dynamic-border-neutral-primary'}>대상</th>
								<th scope={'col'}>발급일</th>
							</tr>
						</thead>
						<tbody className={'text-body-md text-dynamic-text-neutral-secondary font-normal mo:text-body-sm'}>
							<tr className={'h-[47px] border-b border-solid border-dynamic-border-neutral-primary'}>
								<td className={'border-r border-solid border-dynamic-border-neutral-primary mo:p-12 mo:whitespace-pre-wrap'}>
									{`무기명\n선불카드`}
								</td>
								<td className={'border-r border-solid border-dynamic-border-neutral-primary mo:p-12 mo:whitespace-pre-wrap'}>
									어린이
								</td>
								<td className={'border-r border-solid border-dynamic-border-neutral-primary mo:p-12 mo:whitespace-pre-wrap'}>
									만 6세 이상 ~ 만 12세 이하
								</td>
								<td rowSpan={2} className={'mo:p-12 mo:whitespace-pre-wrap'}>
									<p className={'mb-8'}>사용 시작일로부터 10일 이내<br/>레일플러스 홈페이지 등록</p>
									<button onClick={fncOpenUrl}
									        aria-label={'레일플러스 홈페이지 이동'}
									        className={'underline font-semibold'}>
										홈페이지 바로가기
									</button>
								</td>
							</tr>
							<tr className={'h-[47px] border-b border-solid border-dynamic-border-neutral-primary'}>
								<td className={'border-r border-solid border-dynamic-border-neutral-primary mo:p-12 mo:whitespace-pre-wrap'}>
									{`무기명\n선불카드`}
								</td>
								<td className={'border-r border-solid border-dynamic-border-neutral-primary mo:p-12 mo:whitespace-pre-wrap'}>
									청소년
								</td>
								<td className={'border-r border-solid border-dynamic-border-neutral-primary mo:p-12 mo:whitespace-pre-wrap'}>
									만 13세 이상 ~ 만 18세 이하
								</td>
								<td rowSpan={0} className={'sr-only'}>
									<p className={'mb-8'}>사용 시작일로부터 10일 이내<br/>레일플러스 홈페이지 등록</p>
									<button onClick={fncOpenUrl}
											aria-label={'레일플러스 홈페이지 이동'}
											className={'underline font-semibold'}>
										홈페이지 바로가기
									</button>
								</td>
							</tr>
							<tr className={'h-[47px] border-b border-solid border-dynamic-border-neutral-primary'}>
								<td className={'border-r border-solid border-dynamic-border-neutral-primary mo:p-12 mo:whitespace-pre-wrap'}>
									{`무기명\n선불카드`}
								</td>
								<td className={'border-r border-solid border-dynamic-border-neutral-primary mo:p-12 mo:whitespace-pre-wrap'}>
									일반용
								</td>
								<td className={'border-r border-solid border-dynamic-border-neutral-primary mo:p-12 mo:whitespace-pre-wrap'}>
									만 19세 이상
								</td>
								<td>-</td>
							</tr>
						</tbody>
					</table>
				)
			}
			{
				type === 'lost' && (
					<table className={'w-full text-center'} aria-label={'환불 일정 안내 표'} summary='분실접수 신청 시간에 따른 환불금액 확정일과 고객계좌 환불일을 안내하는 표입니다.'>
						<caption className='sr-only'>환불 일정 안내</caption>
						<thead className={'text-body-md text-dynamic-text-neutral-primary font-medium mo:text-body-sm'}>
							<tr className={`
								h-[44px] bg-dynamic-bg-neutral-quarternary
								border-y border-solid border-dynamic-border-neutral-primary
							`}>
								<th scope={'col'} className={'border-r border-solid border-dynamic-border-neutral-primary'}>분실접수 신청(일)</th>
								<th scope={'col'} className={'border-r border-solid border-dynamic-border-neutral-primary'}>환불금액 확정</th>
								<th scope={'col'}>고객계좌 환불</th>
							</tr>
						</thead>
						<tbody className={'text-body-md text-dynamic-text-neutral-secondary font-normal mo:text-body-sm'}>
							<tr className={'h-[47px] border-b border-solid border-dynamic-border-neutral-primary'}>
								<td className={'border-r border-solid border-dynamic-border-neutral-primary mo:p-12 mo:whitespace-pre-wrap'}>
									18:00 이전
								</td>
								<td className={'border-r border-solid border-dynamic-border-neutral-primary mo:p-12 mo:whitespace-pre-wrap'}>
									D+2일
								</td>
								<td>
									D+4일
								</td>
							</tr>
							<tr className={'h-[47px] border-b border-solid border-dynamic-border-neutral-primary'}>
								<td className={'border-r border-solid border-dynamic-border-neutral-primary mo:p-12 mo:whitespace-pre-wrap'}>
									18:00 이후
								</td>
								<td className={'border-r border-solid border-dynamic-border-neutral-primary mo:p-12 mo:whitespace-pre-wrap'}>
									D+3일
								</td>
								<td>
									D+5일
								</td>
							</tr>
						</tbody>
						<tfoot></tfoot>
					</table>
				)
			}
		</div>
	);
}
