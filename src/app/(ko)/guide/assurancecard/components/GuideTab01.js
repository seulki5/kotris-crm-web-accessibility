'use client'

import React from 'react';
import {useRouter} from 'next/navigation';

// modules
import {RouteConfig} from '@modules/config/RouteConfig';
import {useUserContext} from '@modules/context/UserContext';
import {useLoadingContext} from "@modules/context/LoadingContext";
import {usePopContext} from "@modules/context/PopContext";
import {useWebContext} from "@modules/context/WebviewContext";


/**
 * @description: 대중교통안심카드 등록 절차 컴포넌트 입니다.
 * @screenID:    -
 * @screenPath:  홈 > Rail+ 이용안내 > 대중교통안심카드
 * @author       $Author
 * @since        $Date
 * @version      $Revision
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function GuideSafeTransitTab01() {

	const router = useRouter();
	const {isLogin} = useUserContext();
	const {fncRouteStart} = useLoadingContext();
	const {fncShowPop, fncClosePop} = usePopContext();
	const {isAccApp, fncPostRN} = useWebContext();

	// 이동: 내 카드
	const fncGoMyCard = () => {
		// 로그인 후만 이동 가능
		if(isLogin) {
			if(isAccApp) {
				fncPostRN({
					id: "WEB_NAVIGATE_USERCARD",
					payload: {}
				});
			} else {
				const targetUri = RouteConfig.CARD.PATH;
				fncRouteStart(targetUri);
				router.push(targetUri);
			}
		} else {
			fncShowPop({
				mainText: '로그인 후 이용해주세요.',
				primaryText: '확인',
				onClickPrimary: () => {
					fncClosePop();

					const targetUri = RouteConfig.LOGIN.PATH;
					fncRouteStart(targetUri);
					router.push(targetUri);
				}
			})
		}
	}

	return (
		<section className={'type04'}>
			<dl>
				<dt>카드 등록 절차</dt>
				<dd>
					<div>
						<div className={'timeline'} />
						<div className={'decimal'}>1</div>
						<div className={'detail'}>
							<h3 className={'title'}>회원가입</h3>
							<p>레일플러스 홈페이지 또는 앱에서 약관 동의 및 본인인증 완료</p>
						</div>
					</div>
					<div>
						<div className={'timeline'} />
						<div className={'decimal'}>2</div>
						<div className={'detail'}>
							<h3 className={'title'}>카드 등록 신청</h3>
							<p>
								<button
									type={'button'}
									className={'text-dynamic-text-brand-primary'}
									onClick={fncGoMyCard}
									onKeyDown={(e) => {
										if(e.key === 'Enter') fncGoMyCard();
									}}
								>
									{`[마이페이지 > 내카드]`}
								</button>
								{' '}에서 카드 등록/소득공제 신청
							</p>
						</div>
					</div>
					<div>
						<div className={'decimal'}>3</div>
						<div className={'detail'}>
							<h3 className={'title'}>완료</h3>
							<p>카드 등록 및 소득공제 신청 완료</p>
						</div>
					</div>
				</dd>
			</dl>
		</section>
	)
}
