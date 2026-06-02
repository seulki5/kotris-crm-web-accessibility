'use client'

import React, {useLayoutEffect, useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import {useRouter} from 'next/navigation';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Pagination, Autoplay, A11y} from 'swiper/modules';
import {useMutation} from '@tanstack/react-query';
import Link from 'next/link';
import Cookies from "js-cookie";
// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {useMoHeaderContext} from '@modules/context/MoHeaderContext';
import {RouteConfig} from '@modules/config/RouteConfig';
import {useApi} from '@modules/services/useApi';
import {useLoadingContext} from '@modules/context/LoadingContext';
import {usePopContext} from '@modules/context/PopContext';
import {apiBannerList, apiFaqList, apiFaqTypeList, apiFaqDetail} from '@/app/_actions/home.action';
import {useUserContext} from '@modules/context/UserContext';
import {apiDelayPwChange} from "@/app/_actions/user.action";
import {fncGetBaseUrl} from "@modules/services/api.service";
import {SWIPER_A11Y, usePrefersReducedMotion, accordionA11yIds} from '@modules/utils/a11yUtils';

// components
import Accordion from '@components/composite/Accordion';
import AdvertisementPop from "@components/popup/AdvertisementPop";

// assets
import {AppStore, ChevronRight, GooglePlay, Minus, Plus, Search, Symbol, XCircleFill} from '@assets/icons/Svgs';
import card01Image from '@assets/images/card01.png';
import card02Image from '@assets/images/card02.png';
import card03Image from '@assets/images/card03.png';
import service01Image from '@assets/images/service01.png';
import service02Image from '@assets/images/service02.png';
import service03Image from '@assets/images/service03.png';
import service04Image from '@assets/images/service04.png';
import storeImage from '@assets/images/store.png';
import 'swiper/css';
import 'swiper/css/pagination';

const HOME_FAQ_TRIGGER_ID = (faqId) => `home-faq-trigger-${faqId}`;
const HOME_FAQ_PANEL_ID = (faqId) => `home-faq-panel-${faqId}`;

/**
 * @description: Desktop 홈 화면 입니다.
 * @screenID:    UI-CRM-F208
 * @screenPath:  홈
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function Home() {

	const router = useRouter();
	const {jsonApiAction} = useApi();
	const {isMobile} = useScreenSizeContext();
	const {fncChangeMoHeader} = useMoHeaderContext();
	const {fncShowPop, fncClosePop} = usePopContext();
	const {isLogin} = useUserContext();
	const {fncRouteStart} = useLoadingContext();
	const {fncSetLoading} = useLoadingContext();

	// API URL
	const [fileApiUri, setFileApiUrl] = useState(null);

	// 동영상 url
	const [videoUrl, setVideoUrl] = useState(null);

	// 검색창 focus
	const [isSearchFocused, setIsSearchFocused] = useState(false);

	const prefersReducedMotion = usePrefersReducedMotion();

	// 활성화된 자주묻는 질문
	const [activeQnaInfo, setActiveQnaInfo] = useState({});

	// 활성화된 자주묻는 질문 바디디
	const [activeQnaDetail, setActiveQnaDetail] = useState({});

	// faq 검색
	const [params, setParams] = useState({
		page: 1,
		recordCnt: 5,
		pageSize: 10,
		faqTypeCd: '',
		faqTtl: '',
	});

	// --Api
	// 메인동영상
	const {mutate: mutGetVideo} = useMutation({
		mutationKey: ['mutGetVideo'],
		mutationFn: (payload) => jsonApiAction(apiBannerList, payload),
		onSuccess: async (res) => {
			if(res?.[0]?.atchFileList && fileApiUri) {
				setVideoUrl(`${fileApiUri}/api/crm/racs/file/download/video/${res[0].atchFileList[0]?.atchFileId}`)
			}
			if(isMobile) {
				mutBannerList({bnrSeCd: '03'});
			} else {
				mutBannerList({bnrSeCd: '02'});
			}
		}
	})

	// 배너 목록
	const {mutate: mutBannerList, data: bannerList} = useMutation({
		mutationKey: ['mutBannerList'],
		mutationFn: (payload) => jsonApiAction(apiBannerList, payload),
		onSuccess: (res) => {
			mutFaqCodeList();
		}
	})

	// FAQ 키워드 목록
	const {mutate: mutFaqCodeList, data: faqCodeList} = useMutation({
		mutationKey: ['mutFaqCodeList'],
		mutationFn: () => jsonApiAction(apiFaqTypeList, {}),
		onSuccess: (res) => {
			mutFaqList({
				page: 1,
				recordCnt: 5
			});
		}
	})

	// FAQ 목록
	const {mutate: mutFaqList, data: faqList} = useMutation({
		mutationKey: ['mutFaqList'],
		mutationFn: () => jsonApiAction(apiFaqList, {...params, __localHandle: true}),
	})

	// FAQ 조회
	const {mutate: mutFaqDetail} = useMutation({
		mutationKey: ['mutFaqDetail'],
		mutationFn: (payload) => jsonApiAction(apiFaqDetail, {...payload, __localHandle: true}),
		onSuccess: (res) => {
			setActiveQnaDetail(res ?? {});
		}
	})

	// 90일 후 비밀번호 변경
	const {mutate: mutAskPwAgain} = useMutation({
		mutationKey: ['mutAskPwAgain'],
		mutationFn: () => jsonApiAction(apiDelayPwChange, {}),
		onSuccess: (data) => {
			const pwDiff = Cookies.get('crm-diff');
			pwDiff && Cookies.remove('crm-diff');
		}
	})

	useLayoutEffect(() => {
		async function initApiUrl() {
			const apiUrl = await fncGetBaseUrl();
			setFileApiUrl(apiUrl);

			mutGetVideo({bnrSeCd: '01'});
		}

		fncSetLoading(false);
		initApiUrl();

		return () => fncClosePop();
	}, [])

	useLayoutEffect(() => {
		const pwDiff = Cookies.get('crm-diff');
		if(isLogin) {
			if(pwDiff > 90) {
				fncShowPop({
					mainText: '보안을 위해 비밀번호를 변경해 주세요.',
					description: '3개월 이상 동일한 비밀번호를 사용 중입니다.',
					secondaryText: '90일 후 변경',
					onClickSecondary: () => {
						fncClosePop();
						mutAskPwAgain();
					},
					primaryText: '변경하기',
					onClickPrimary: () => {
						pwDiff && Cookies.remove('crm-diff');
						fncClosePop();

						// 이동: 내 정보
						const targetUri = RouteConfig.INFO.PATH;
						fncRouteStart(targetUri);
						router.push(targetUri);
					},
				})
			}
		}
	}, [isLogin])

	useEffect(() => {
		if(isMobile) {
			fncChangeMoHeader({
				type: 'main',
				title: ''
			})
		}
	}, [isMobile])

	// FAQ 조회
	useEffect(() => {
		if(activeQnaInfo?.faqId) {
			mutFaqDetail({faqId: activeQnaInfo.faqId})
		}
	}, [activeQnaInfo])

	// 검색창 focus
	const fncChangeSearchFocus = (boolean) => {
		setIsSearchFocused(boolean);
	}

	// 검색어 입력
	const fncChangeInput = (e) => {
		if (e.target.value === '' || /^[0-9a-zA-Z가-힣ㄱ-ㅎㅏ-ㅣ]+$/.test(e.target.value)) {
			setParams(prev => ({
				...prev,
				faqTtl: e.target.value
			}));
		}
	}

	// 검색어 초기화
	const fncClearSearch = () => {
		setParams({
			...params,
			faqTtl: ''
		});
	}

	// 검색어 검색
	const fncFaqSearch = () => {
		if(params.faqTtl.length < 1) return;

		const targetUri = `${RouteConfig.FAQ.PATH}?searchWd=${params.faqTtl}`;
		fncRouteStart(targetUri);
		router.push(targetUri);
	}

	// 키워드 검색
	const facSearchfaqTtl = (faqTypeCd) => {
		const targetUri = `${RouteConfig.FAQ.PATH}?searchCd=${faqTypeCd}`;
		fncRouteStart(targetUri);
		router.push(targetUri);
	}

	// 자주묻는질문 답변 보기
	const fncSelectQna = (item) => {
		if(activeQnaInfo?.faqId === item.faqId) setActiveQnaInfo({});
		else setActiveQnaInfo(item);
	}

	// 이동: 자주묻는질문
	const fncGoQna = () => {
		const targetUri = RouteConfig.FAQ.PATH;
		fncRouteStart(targetUri);
		router.push(targetUri);
	}

	// 이동: 회원가입
	const fncGoJoin = () => {
		const targetUri = RouteConfig.JOIN.PATH;
		fncRouteStart(targetUri);
		router.push(targetUri);
	}

	// 이동: 비회원 할인등록
	const fncGoNonMemberDiscount = () => {
		const targetUri = RouteConfig.NONMEMBER.PATH;
		fncRouteStart(targetUri);
		router.push(targetUri);
	}

	// 이동: 회원 할인등록
	const fncGoDiscount = () => {
		if(isLogin) {
			const targetUri = RouteConfig.DISCOUNT.PATH;
			fncRouteStart(targetUri);
			router.push(targetUri);
        } else {
            fncShowPop({
                mainText: '비회원은 고객센터 > 비회원 할인등록에서 등록이 가능합니다.',
                secondaryText: '회원가입하기',
                onClickSecondary: () => fncGoJoin(),
                primaryText: '비회원 할인등록 하기',
                onClickPrimary: () => fncGoNonMemberDiscount(),
            });
        }
	}

	// 이동: 어린이안심서비스
	const fncGoChildproof = () => {
	    if(isLogin) {
			const childproofUri = RouteConfig.CHILDPROOF.PATH;
			fncRouteStart(childproofUri);
			router.push(childproofUri);
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

	// 이동: 링크
	const fncLinkBanner = (url) => {
		const isHttp = url.includes('http://')
		if(isHttp) {
			return fncShowPop({
				mainText: '링크 주소가 잘못되었습니다.',
				primaryText: '확인',
				onClickPrimary: () => fncClosePop()
			})
		};

		let targetUrl = url;
		const isWWW = url.includes('www.');
		if(!isWWW) targetUrl = `www.${url}`;

		const isHttps = targetUrl.includes('https://');
		if(!isHttps) targetUrl = `https://${targetUrl}`;

		window.open(targetUrl, '_blank')
	}

	const fncHandlers = {
		changeInput: fncChangeInput,
		changeSearchFocus: fncChangeSearchFocus,
		clearSearch: fncClearSearch,
		faqSearch: fncFaqSearch,
		searchfaqTtl: facSearchfaqTtl,
		selectQna: fncSelectQna,
		goQna: fncGoQna,
		goDiscount: fncGoDiscount,
		goChildproof: fncGoChildproof,
		linkBanner: fncLinkBanner
	}

	const fncCallbackEvent = (fncName, variable, payload = {}) => {
		const fnc = fncHandlers[fncName];
		if (typeof fnc === 'function') return fnc(variable, payload);
	}

	if (isMobile) return (
		<MoHome
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...params,
				isSearchFocused,
				activeQnaInfo,
				bannerList,
				faqCodeList,
				faqList: faqList?.list || [],
				activeQnaDetail,
				videoUrl,
				fileApiUri,
				prefersReducedMotion,
			}}/>
	);
	else return (
		<DtHome
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...params,
				isSearchFocused,
				activeQnaInfo,
				bannerList,
				faqCodeList,
				faqList: faqList?.list || [],
				activeQnaDetail,
				videoUrl,
				fileApiUri,
				prefersReducedMotion,
			}}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F208
 */
DtHome.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function DtHome({data, fncCallbackEvent}) {

	const appStoreDivRef = useRef(null);

	const [appStoreImgSize, setAppStoreImgSize] = useState(300);

	useEffect(() => {
		if(appStoreDivRef.current) setAppStoreImgSize(appStoreDivRef.current?.offsetHeight);
	}, [appStoreDivRef.current?.offsetHeight])

	const renderHeaderComponent = (item, index) => {
		const isActive = data.activeQnaInfo?.faqId === item.faqId || false;
		const triggerId = HOME_FAQ_TRIGGER_ID(item.faqId);
		const panelId = HOME_FAQ_PANEL_ID(item.faqId);
		return (
			<button
				key={item.faqId}
				type={'button'}
				id={triggerId}
				aria-expanded={isActive}
				aria-controls={panelId}
				className={`header ${isActive && 'active'} ${!isActive && index < data.faqList.length - 1 ? 'border-b' : 'border-0'}`}
				onClick={() => fncCallbackEvent('selectQna', item)}
			>
				<p className={'text-start'}>
					{item.faqTtl}
				</p>
				{
					isActive ? (
						<Minus color={'text-dynamic-icon-neutral-primary'} aria-hidden={true} />
					) : (
						<Plus color={'text-dynamic-icon-neutral-primary'} aria-hidden={true} />
					)
				}
			</button>
		)
	}

	const renderBodyComponent = (item) => {
		const isActive = data.activeQnaInfo?.faqId === item.faqId;
		const panelId = HOME_FAQ_PANEL_ID(item.faqId);
		return (
			<div
				id={panelId}
				role={'region'}
				aria-labelledby={HOME_FAQ_TRIGGER_ID(item.faqId)}
				aria-hidden={!isActive}
				className={'body prose max-w-none'}
			>
				{
					isActive && data.activeQnaDetail ? (
						<div
							className={'prose max-w-none dark:text-dynamic-text-neutral-primary'}
							dangerouslySetInnerHTML={{__html: data.activeQnaDetail?.faqCn}}
						/>
					) : null
				}
			</div>
		)
	}

	return (
		<main id={'home'} className={'w-full -mt-[90px] overflow-hidden'} aria-labelledby={'page-name-dt'}>
			<h1 id={'page-name-dt'} className={'sr-only'}>
				레일플러스 메인
			</h1>
			<div className={'video-wrap'}>
				{
					data.videoUrl &&  (
						<video
							autoPlay={!data.prefersReducedMotion}
							loop={!data.prefersReducedMotion}
							muted
							playsInline
							controls={false}
							aria-hidden={true}
							tabIndex={-1}
							style={{width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', zIndex: 0}}
						>
							<source src={data.videoUrl}/>
						</video>
					)
				}
				<div
					className={'absolute z-1 w-full h-full flex-col-center-center'}
					role={'img'}
					aria-label={'언제나 당신 곁에 레일플러스 메인 화면 동영상'}
				>
					<div className={'text-wrap'} aria-hidden={true}>
						<p>언제나 당신 곁에</p>
						<p className={'relative'}>레일플러스<span aria-hidden={true}><Symbol width={'100%'} height={'100%'}/></span>
						</p>
					</div>
				</div>
			</div>
			<fieldset role={'group'} aria-label={'레일플러스 카드 유형'} className={'card-wrap'}>
				<Link
					href={RouteConfig.ABOUT_BASIC.PATH}
					className={'card-item'}
				>
					<Image
						src={card01Image}
						alt={''}
						aria-hidden={true}
						width={400} height={400}
						style={{
							width: '100%',
							height: '100%'
						}}
					 />
					<p>
						카드 하나로 출퇴근 지하철·버스·KTX까지
					</p>
					<p>
						일반 Rail+ 카드
					</p>
				</Link>
				<Link
					href={RouteConfig.ABOUT_MOBILE.PATH}
					className={'card-item'}
					aria-label={'레일플러스 모바일카드: 바쁜 출퇴근길도 앱 하나로 간편하게'}
				>
					<Image
                        src={card02Image}
                        alt={''}
                        aria-hidden={true}
					    width={400} height={400}
                         style={{
                             width: '100%',
                             height: '100%'
                         }}
                    />
					<p>
						바쁜 출퇴근길도 앱 하나로 간편하게
					</p>
					<p>
						Rail+ 모바일카드
					</p>
				</Link>
				<Link
					href={RouteConfig.ABOUT_ASSURANCE.PATH}
					className={'card-item'}
					aria-label={'대중교통안심카드: 분실 걱정은 줄이고 안심은 더하고'}
				>
					<Image
                        src={card03Image}
                        alt={''}
                        aria-hidden={true}
                        width={400} height={400}
                        style={{
                            width: '100%',
                            height: '100%'
                        }}
                    />
					<p>
						분실 걱정은 줄이고 안심은 더하고
					</p>
					<p>
						대중교통안심카드
					</p>
				</Link>
			</fieldset>
			<fieldset className={'service-wrap'} role={'group'} aria-label={'레일플러스 대표 서비스 안내'}>
				<p className={'sub-catchphrase'}>
					이토록 간편한 레일플러스
				</p>
				<h2 className={'catchphrase'}>
					{`한결 더 간편해진 일상을\n레일플러스와 함께`}
				</h2>
				<div className={'service-item-wrap'}>
					<button
						className={'service-item'}
						type={'button'}
						aria-label={'할인카드 등록'}
						onClick={() => fncCallbackEvent('goDiscount')}
						onKeyDown={(e) => {
							if(e.key === 'Enter') fncCallbackEvent('goDiscount');
						}}
					>
						<Image
                            src={service01Image}
                            alt={''}
                            aria-hidden={true}
                            width={400} height={400}
                             style={{
                                 width: '100%',
                                 height: '100%'
                             }}
                         />
						<p className={'service-name'}>
							할인카드 등록
						</p>
						<p className={'service-detail'}>
							국가 신분증, 청소년연령초과 학생등록도 Rail+
						</p>
					</button>
					<button
						className={'service-item'}
						type={'button'}
						aria-label={'어린이 안심 서비스'}
						onClick={() => fncCallbackEvent('goChildproof')}
						onKeyDown={(e) => {
							if(e.key === 'Enter') fncCallbackEvent('goChildproof');
						}}
					>
						<div className={'round-bg start'} aria-hidden={true} />
						<Image
                            src={service02Image}
                            alt={''}
                            aria-hidden={true}
							width={400} height={400}
							style={{width: '100%', height: '100%'}}
                        />
						<p className={'service-name'}>
							어린이 안심 서비스
						</p>
						<p className={'service-detail'}>
							우리 아이의 안전한 대중교통을 책임지는 Rail+
						</p>
					</button>
					<Link
						href={RouteConfig.NOTICE.PATH}
						className={'service-item'}
						aria-label={'새로운 소식: 공지사항 페이지로 이동'}
					>
						<div className={'round-bg end'} aria-hidden={true} />
						<Image
							src={service03Image}
							alt={''}
							aria-hidden={true}
							width={400} height={400}
							style={{width: '100%', height: '100%'}}
                        />
						<p className={'service-name'}>
							새로운 소식
						</p>
						<p className={'service-detail'}>
							새롭게 업데이트 된 Rail+의 소식을 알려드려요
						</p>
					</Link>
					<Link
						href={RouteConfig.EVENT.PATH}
						className={'service-item'}
						aria-label={'이벤트: 이벤트 페이지로 이동'}
					>
						<Image
							src={service04Image}
							alt={''}
							aria-hidden={true}
						  	width={400} height={400}
							style={{width: '100%', height: '100%'}}
						 />
						<p className={'service-name'}>
							이벤트
						</p>
						<p className={'service-detail'}>
							Rail+에서 진행하는 다양한 이벤트를 놓치지 마세요
						</p>
					</Link>
				</div>
			</fieldset>
			<fieldset className={'guide-wrap'} role={'group'} aria-label={'레일플러스 이용가이드'}>
				<p className={'sub-catchphrase'}>
					레일플러스 이용가이드
				</p>
				<h2 className={'catchphrase'}>
					어떤 점이 궁금하신가요?
				</h2>
				<div className={'search-wrap'}
				     onFocusCapture={() => fncCallbackEvent('changeSearchFocus', true)}
				     onBlurCapture={() => fncCallbackEvent('changeSearchFocus', false)}>
					<div className={'icon-search'}>
						<button
							type={'button'}
							aria-label={'검색 실행'}
							onMouseDown={(e) => e.preventDefault()}
							onClick={() => fncCallbackEvent('faqSearch')}
							onKeyDown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault();
									fncCallbackEvent('faqSearch');
								}
							}}
						>
							<Search
								width={24} height={24}
								color={'text-dynamic-icon-neutral-secondary'}
								aria-hidden={true}
							/>
						</button>
					</div>
					<label htmlFor={'home-search-dt'} className={'sr-only'}>FAQ 검색</label>
					<input
						id={'home-search-dt'}
						type={'search'}
						autoComplete={'off'}
						value={data.faqTtl}
						placeholder={'검색어를 입력하세요'}
						onChange={(e) => fncCallbackEvent('changeInput', e)}
						onKeyDown={(e) => {
							if(e.nativeEvent.isComposing) return;
							if (e.key === 'Enter') {
								fncCallbackEvent('faqSearch');
							}
						}}
					/>
					<div className={'icon-clear'}>
						{
							data.faqTtl.length > 0 && (
								<button
									type={'button'}
									aria-label={'입력 내용 지우기'}
									onMouseDown={(e) => e.preventDefault()}
									onClick={() => fncCallbackEvent('clearSearch')}
									onKeyDown={(e) => {
										if (e.key === 'Enter' || e.key === ' ') {
											e.preventDefault();
											fncCallbackEvent('clearSearch');
										}
									}}
								>
									<XCircleFill
										width={24} height={24}
										color={'text-dynamic-icon-neutral-secondary'}
										aria-hidden={true}
									/>
								</button>
							)
						}
					</div>
				</div>
				{
					data.faqCodeList && (
						<div className={'tab-wrap'} role={'tablist'} aria-label={'FAQ 키워드'}>
							{
								data.faqCodeList.map((tag) => {
									return (
										<button
											key={tag.faqTypeCd}
											type={'button'}
											role={'tab'}
											aria-label={`${tag.faqTypeNm} 검색`}
											onClick={() => fncCallbackEvent('searchfaqTtl', tag.faqTypeCd)}
											onKeyDown={(e) => {
												if (e.key === 'Enter' || e.key === ' ') {
													e.preventDefault();
													fncCallbackEvent('searchfaqTtl', tag.faqTypeCd);
												}
											}}
										>
											{`#${tag.faqTypeNm}`}
										</button>
									)
								})
							}
						</div>
					)
				}
				<div className={'accordion-wrap'}>
					{
						data.faqList?.map((item, index) => {
							return (
								<Accordion
									key={item.faqId}
									active={data.activeQnaInfo?.faqId === item.faqId}
									panelId={accordionA11yIds('home-faq', item.faqId).panelId}
									headerComponent={() => renderHeaderComponent(item, index)}
									bodyComponent={() => renderBodyComponent(item)}
								/>
							)
						})
					}
				</div>
				<button
					type={'button'}
					className={'button-more'}
					aria-label={'자주찾는질문 페이지로 이동'}
					onClick={() => fncCallbackEvent('goQna')}
				>
					<span>더 보러가기</span>
					<ChevronRight color={'text-dynamic-brand-primary'} aria-hidden={true} />
				</button>
			</fieldset>
			{
				data.bannerList?.length > 0 && (
					<fieldset className={'banner-wrap'} role={'group'} aria-label={'배너 목록'}>
						<Swiper
							slidesPerView={2}
							centeredSlides={true}
							initialSlide={1}
							spaceBetween={48}
							modules={[Autoplay, A11y]}
							a11y={SWIPER_A11Y}
							autoplay={data.prefersReducedMotion ? false : {
								delay: 1500,
								disableOnInteraction: false
							}}
							loop={true}
							className={'swiper'}
							autoHeight={true}
						>
							{
								[...data.bannerList, ...data.bannerList]?.map((slide, i) => {
									if(!data.fileApiUri) return;
									const hasLink = Boolean(slide.bnrMvmnUrlAddr);
									const bannerImage = slide?.atchFileList?.[0]?.atchFileId && (
										<div style={{width:'100%', aspectRatio: 1300/294, display: 'relative'}}>
											<Image
												src={`/api/crm/racs/file/download/${slide.atchFileList[0].atchFileId}`}
												alt={''}
												aria-hidden={true}
												fill
												style={{objectFit: 'cover'}}
												unoptimized
											/>
										</div>
									);
									if(!bannerImage) return null;
									return (
										<SwiperSlide
											key={`${slide?.bnrId}${i}`}
											className={'swiper-item'}
										>
											{
												hasLink ? (
													<button
														type={'button'}
														className={'w-full cursor-pointer'}
														aria-label={`${slide.bnrNm} 배너, 새 창에서 링크 열기`}
														onClick={() => fncCallbackEvent('linkBanner', slide.bnrMvmnUrlAddr)}
													>
														{bannerImage}
													</button>
												) : (
													<div className={'w-full'} role={'img'} aria-label={`${slide.bnrNm} 배너`}>
														{bannerImage}
													</div>
												)
											}
										</SwiperSlide>
									)
								})
							}
						</Swiper>
					</fieldset>
				)
			}
			<fieldset className={'store-wrap'} role={'group'} aria-label={'레일플러스 어플 다운로드 스토어 안내'}>
				<div className={'store-inner-wrap'} ref={appStoreDivRef}>
					<Image
						src={storeImage}
						alt={''}
						aria-hidden={true}
						width={appStoreImgSize * (1004/664)} height={appStoreImgSize}
						className={'absolute bottom-0 right-0 z-0 object-contain h-fit'}
					/>
					<p>
						전국 대중교통을 레일플러스 단 하나로!<br/>지금 시작해보세요
					</p>
					<div className={'flex-row-center gap-12 z-1'}>
						<Link
							aria-label={'구글플레이에서 레일플러스 앱 다운로드, 새 창'}
							href={process.env.NEXT_PUBLIC_GOOGLE_PLAY_URI}
							target={'_blank'}
							rel={'noopener noreferrer'}
						>
							<GooglePlay width={108} height={36} aria-hidden={true} />
						</Link>
						<Link
							aria-label={'앱스토어에서 레일플러스 앱 다운로드, 새 창'}
							href={process.env.NEXT_PUBLIC_APP_STORE_URI}
							target={'_blank'}
							rel={'noopener noreferrer'}
						>
							<AppStore width={108} height={36} aria-hidden={true} />
						</Link>
					</div>
				</div>
			</fieldset>
			<AdvertisementPop />
		</main>
	)
}

/**
 * @description: Mobile
 * @screenID:    -
 */
MoHome.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function MoHome({data, fncCallbackEvent}) {

    const appStoreDivRef = useRef(null);

    const [appStoreImgSize, setAppStoreImgSize] = useState(300);

	useEffect(() => {
		if(appStoreDivRef.current) setAppStoreImgSize(appStoreDivRef.current?.offsetHeight || 300);
    }, [appStoreDivRef.current?.offsetHeight])

	const renderHeaderComponent = (item, index) => {
		const isActive = data.activeQnaInfo?.faqId === item.faqId || false;
		const triggerId = HOME_FAQ_TRIGGER_ID(item.faqId);
		const panelId = HOME_FAQ_PANEL_ID(item.faqId);
		return (
			<button
				key={item.faqId}
				type={'button'}
				id={triggerId}
				aria-expanded={isActive}
				aria-controls={panelId}
				className={`header ${isActive && 'active'} ${!isActive && index < data.faqList.length - 1 ? 'border-b' : 'border-0'}`}
				onClick={() => fncCallbackEvent('selectQna', item)}
			>
				<p className={'text-start'}>
					{item.faqTtl}
				</p>
				{
					isActive ? (
						<Minus
							width={20} height={20}
							color={'text-dynamic-icon-neutral-primary'}
							aria-hidden={true}
						/>
					) : (
						<Plus
							width={20} height={20}
							color={'text-dynamic-icon-neutral-primary'}
							aria-hidden={true}
						/>
					)
				}
			</button>
		)
	}

	const renderBodyComponent = (item) => {
		const isActive = data.activeQnaInfo?.faqId === item.faqId;
		const panelId = HOME_FAQ_PANEL_ID(item.faqId);
		return (
			<div
				id={panelId}
				role={'region'}
				aria-labelledby={HOME_FAQ_TRIGGER_ID(item.faqId)}
				aria-hidden={!isActive}
				className={'body prose max-w-none'}
			>
				{
					isActive && data.activeQnaDetail ? (
						<div
							className={'prose max-w-none dark:text-dynamic-text-neutral-primary'}
							dangerouslySetInnerHTML={{__html: data.activeQnaDetail?.faqCn}}
						/>
					) : null
				}
			</div>
		)
	}

	return (
		<main id={'home'} className={'w-full -mt-[90px] overflow-hidden'} aria-labelledby={'page-name-mo'} style={{padding: 0}}>
			<h1 id={'page-name-mo'} className={'sr-only'}>레일플러스 메인</h1>
			<div className={'video-wrap'}>
				{
					data.videoUrl &&  (
						<video
							autoPlay={!data.prefersReducedMotion}
							loop={!data.prefersReducedMotion}
							muted
							playsInline
							controls={false}
							aria-hidden={true}
							tabIndex={-1}
							style={{width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', zIndex: 0}}
						>
							<source src={data.videoUrl}/>
						</video>
					)
				}
                <div
					className={'absolute z-1 w-full h-full flex-col-center-center'}
					role={'img'}
					aria-label={'언제나 당신 곁에 레일플러스'}
				>
                    <div className={'text-wrap'} aria-hidden={true}>
                        <p>언제나 당신 곁에</p>
                        <p className={'relative'}>레일플러스<span aria-hidden={true}><Symbol width={'100%'} height={'100%'}/></span></p>
                    </div>
                </div>
			</div>
			<fieldset className={'card-wrap'} role={'group'} aria-label={'레일플러스 카드 유형'}>
				<Link
					href={RouteConfig.ABOUT_BASIC.PATH}
					className={'card-item'}
					aria-label={'레일플러스 통합카드: 카드 하나로 출퇴근 지하철·버스·KTX까지'}
				>
					<Image src={card01Image} alt={''} aria-hidden={true} width={400} height={400} />
					<p>
						카드 하나로 출퇴근 지하철·버스·KTX까지
					</p>
					<p>
						일반 Rail+ 카드
					</p>
				</Link>
				<Link
					href={RouteConfig.ABOUT_MOBILE.PATH}
					className={'card-item'}
					aria-label={'레일플러스 모바일카드: 바쁜 출퇴근길도 앱 하나로 간편하게'}
				>
					<Image src={card02Image} alt={''} aria-hidden={true} width={400} height={400} />
					<p>
						바쁜 출퇴근길도 앱 하나로 간편하게
					</p>
					<p>
						Rail+ 모바일카드
					</p>
				</Link>
				<Link
					href={RouteConfig.ABOUT_ASSURANCE.PATH}
					className={'card-item'}
					aria-label={'대중교통안심카드: 분실 걱정은 줄이고 안심은 더하고'}
				>
					<Image src={card03Image} alt={''} aria-hidden={true} width={400} height={400} />
					<p>
						분실 걱정은 줄이고 안심은 더하고
					</p>
					<p>
						대중교통안심카드
					</p>
				</Link>
			</fieldset>
			<fieldset className={'service-wrap'} role={'group'} aria-label={'레일플러스 대표 서비스 안내'}>
				<p className={'sub-catchphrase'}>
					이토록 간편한 레일플러스
				</p>
				<h2 className={'catchphrase'}>
					{`한결 더 간편해진 일상을\n레일플러스와 함께`}
				</h2>
				<div className={'service-item-wrap'}>
					<button
						className={'service-item'}
						type={'button'}
						aria-label={'할인카드 등록'}
						onClick={() => fncCallbackEvent('goDiscount')}
						onKeyDown={(e) => {
							if(e.key === 'Enter') fncCallbackEvent('goDiscount');
						}}
					>
						<Image src={service01Image} alt={''} aria-hidden={true} width={400} height={400} />
						<p className={'service-name'}>
							할인카드 등록
						</p>
						<p className={'service-detail'}>
							Rail+ 할인카드 등록으로 더 스마트하게 즐겨보세요
						</p>
					</button>
					<button
						className={'service-item'}
						type={'button'}
						aria-label={'어린이 안심 서비스'}
						onClick={() => fncCallbackEvent('goChildproof')}
						onKeyDown={(e) => {
							if(e.key === 'Enter') fncCallbackEvent('goChildproof');
						}}
					>
						<div className={'round-bg start'} aria-hidden={true} />
						<Image src={service02Image} alt={''} aria-hidden={true} width={400} height={400} />
						<p className={'service-name'}>
							어린이 안심 서비스
						</p>
						<p className={'service-detail'}>
							우리 아이의 안전한 대중교통을 책임지는 Rail+
						</p>
					</button>
					<Link
						href={RouteConfig.NOTICE.PATH}
						className={'service-item'}
						aria-label={'새로운 소식: 공지사항 페이지로 이동'}
					>
						<div className={'round-bg end'} aria-hidden={true} />
						<Image src={service03Image} alt={''} aria-hidden={true} width={400} height={400} />
						<p className={'service-name'}>
							새로운 소식
						</p>
						<p className={'service-detail'}>
							새롭게 업데이트 된 Rail+의 소식을 알려드려요
						</p>
					</Link>
					<Link
						href={RouteConfig.EVENT.PATH}
						className={'service-item'}
						aria-label={'이벤트: 이벤트 페이지로 이동'}
					>
						<Image src={service04Image} alt={''} aria-hidden={true} width={400} height={400} />
						<p className={'service-name'}>
							이벤트
						</p>
						<p className={'service-detail'}>
							Rail+에서 진행하는 다양한 이벤트를 놓치지 마세요
						</p>
					</Link>
				</div>
			</fieldset>
			<fieldset className={'guide-wrap'} role={'group'} aria-label={'레일플러스 이용가이드'}>
				<p className={'sub-catchphrase'}>
					레일플러스 이용가이드
				</p>
				<h2 className={'catchphrase'}>
					어떤 점이 궁금하신가요?
				</h2>
				<div className={'search-wrap'}
					 onFocusCapture={() => fncCallbackEvent('changeSearchFocus', true)}
					 onBlurCapture={() => fncCallbackEvent('changeSearchFocus', false)}>
					<div className={'icon-search'}>
						<button
							type={'button'}
							aria-label={'검색 실행'}
							onMouseDown={(e) => e.preventDefault()}
							onClick={() => fncCallbackEvent('faqSearch')}
							onKeyDown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault();
									fncCallbackEvent('faqSearch');
								}
							}}
						>
							<Search
								width={20} height={20}
								color={'text-dynamic-icon-neutral-secondary'}
								aria-hidden={true}
							/>
						</button>
					</div>
					<label htmlFor={'home-search-mo'} className={'sr-only'}>FAQ 검색</label>
					<input
						id={'home-search-mo'}
						type={'search'}
						autoComplete={'off'}
						value={data.faqTtl}
						placeholder={'검색어를 입력하세요'}
						onChange={(e) => fncCallbackEvent('changeInput', e)}
						onKeyDown={(e) => {
							if(e.nativeEvent.isComposing) return;
							if (e.key === 'Enter') {
								fncCallbackEvent('faqSearch');
							}
						}}
					/>
					<div className={'icon-clear'}>
						{
							data.faqTtl.length > 0 && (
								<button
									type={'button'}
									aria-label={'입력 내용 지우기'}
									onMouseDown={(e ) => e.preventDefault()}
									onClick={() => fncCallbackEvent('clearSearch')}
									onKeyDown={(e) => {
										if (e.key === 'Enter' || e.key === ' ') {
											e.preventDefault();
											fncCallbackEvent('clearSearch');
										}
									}}
								>
									<XCircleFill
										width={20} height={20}
										color={'text-dynamic-icon-neutral-secondary'}
										aria-hidden={true}
									/>
								</button>
							)
						}
					</div>
				</div>
				{
					data.faqCodeList && (
						<div className={'tab-wrap'} role={'tablist'} aria-label={'FAQ 키워드'}>
							{
								data.faqCodeList.map((tag) => {
									return (
										<button
											key={tag.faqTypeCd}
											type={'button'}
											role={'tab'}
											aria-label={`${tag.faqTypeNm} 검색`}
											onClick={() => fncCallbackEvent('searchfaqTtl', tag.faqTypeCd)}
											onKeyDown={(e) => {
												if (e.key === 'Enter' || e.key === ' ') {
													e.preventDefault();
													fncCallbackEvent('searchfaqTtl', tag.faqTypeCd);
												}
											}}
										>
											{`#${tag.faqTypeNm}`}
										</button>
									)
								})
							}
						</div>
					)
				}
				<div className={'accordion-wrap'}>
					{
						data.faqList.map((item, index) => {
							return (
								<Accordion
									key={item.faqId}
									active={data.activeQnaInfo?.faqId === item.faqId}
									panelId={accordionA11yIds('home-faq', item.faqId).panelId}
									headerComponent={() => renderHeaderComponent(item, index)}
									bodyComponent={() => renderBodyComponent(item)}
								/>
							)
						})
					}
				</div>
				<button
					type={'button'}
					className={'button-more'}
					aria-label={'자주찾는질문 페이지로 이동'}
					onClick={() => fncCallbackEvent('goQna')}
				>
					<span>더 보러가기</span>
					<ChevronRight color={'text-dynamic-brand-primary'} aria-hidden={true} />
				</button>
			</fieldset>
			{
				data.bannerList?.length > 0 && (
					<fieldset className={'banner-wrap'} role={'group'} aria-label={'배너 목록'}>
						<Swiper
							slidesPerView={1}
							centeredSlides={true}
							initialSlide={0}
							spaceBetween={48}
							modules={[Pagination, Autoplay, A11y]}
							a11y={SWIPER_A11Y}
							pagination={{
								clickable: true,
							}}
							autoplay={data.prefersReducedMotion ? false : {
								delay: 1500,
								disableOnInteraction: false
							}}
							className={'swiper'}
						>
							{
								[...data.bannerList, ...data.bannerList]?.map((slide, i) => {
								    if(!data.fileApiUri) return;
									const hasLink = Boolean(slide.bnrMvmnUrlAddr);
									const bannerImage = slide?.atchFileList?.[0]?.atchFileId && (
										<div style={{
											width: '100%',
											aspectRatio: 1170 / 348,
											display: 'relative'
										}}>
											<Image
												src={`/api/crm/racs/file/download/${slide.atchFileList[0].atchFileId}`}
												alt={''}
												aria-hidden={true}
												fill
												style={{objectFit: 'cover'}}
												unoptimized
											/>
										</div>
									);
									if(!bannerImage) return null;
									return (
										<SwiperSlide
											key={`${slide?.bnrId}${i}`}
											className={'swiper-item'}
										>
											{
												hasLink ? (
													<button
														type={'button'}
														className={'w-full cursor-pointer'}
														aria-label={`${slide.bnrNm} 배너, 새 창에서 링크 열기`}
														onClick={() => fncCallbackEvent('linkBanner', slide.bnrMvmnUrlAddr)}
													>
														{bannerImage}
													</button>
												) : (
													<div className={'w-full'} role={'img'} aria-label={`${slide.bnrNm} 배너`}>
														{bannerImage}
													</div>
												)
											}
										</SwiperSlide>
									)
								})
							}
						</Swiper>
					</fieldset>
				)
			}
			<fieldset className={'store-wrap'} role={'group'} aria-label={'레일플러스 어플 다운로드 스토어 안내'} ref={appStoreDivRef}>
				<Image
					src={storeImage}
					alt={''}
					aria-hidden={true}
					width={appStoreImgSize * (1004/664)} height={appStoreImgSize}
					className={'absolute bottom-0 right-0 z-0 object-contain h-fit'}
				/>
				<div className={'store-inner-wrap'}>
					<p>
						전국 대중교통을<br/>레일플러스 단 하나로!<br/>지금 시작해보세요
					</p>
					<div className={'flex-row-center gap-12 z-1'}>
						<Link
							aria-label={'구글플레이에서 레일플러스 앱 다운로드, 새 창'}
							href={process.env.NEXT_PUBLIC_GOOGLE_PLAY_URI}
							target={'_blank'}
							rel={'noopener noreferrer'}
						>
							<GooglePlay width={108} height={36} aria-hidden={true} />
						</Link>
						<Link
							aria-label={'앱스토어에서 레일플러스 앱 다운로드, 새 창'}
							href={process.env.NEXT_PUBLIC_APP_STORE_URI}
							target={'_blank'}
							rel={'noopener noreferrer'}
						>
							<AppStore width={108} height={36} aria-hidden={true} />
						</Link>
					</div>
				</div>
			</fieldset>

			<AdvertisementPop />
		</main>
	)
}
