'use client'

import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {useMutation} from '@tanstack/react-query';
import {useSearchParams} from 'next/navigation';
import InfiniteScroll from "react-infinite-scroll-component";
import dynamic from "next/dynamic";

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {useMoHeaderContext} from '@modules/context/MoHeaderContext';
import {useWebContext} from '@modules/context/WebviewContext';
import {useApi} from '@modules/services/useApi';
import {apiFaqCategoryList, apiFaqList, apiFaqDetail} from '@/app/_actions/support.action';
import {useScrollContext} from '@modules/context/ScrollContext';

// components
import Breadcrumb from '@components/layout/Breadcrumb';
import InputText from '@components/common/InputText';
import TabControl from '@components/common/TabControl';
import Accordion from '@components/composite/Accordion';
import {
	accordionHeaderA11yProps,
	accordionPanelA11yProps,
	accordionA11yIds,
} from '@modules/utils/a11yUtils';
import Pagination from '@components/common/Pagination';
import Loading from "@/app/loading";
const ToastViewer = dynamic(() => import('@components/common/Editor'), {
	ssr: false,
	// loading: () => <Loading />
})

// assets
import {EmptyDefault, Minus, Plus, Search} from '@assets/icons/Svgs';


/**
 * @description: 자주 묻는 질문 목록 화면 입니다.
 * @screenID:    UI-CRM-F255, UI-CRM-F490
 * @screenPath:  홈 > 고객센터 > 자주 묻는 질문
 * @author       $Author
 * @since        $Date
 * @version      $Revision
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
export default function SupportNoticeList() {

	const searchParams = useSearchParams();
	const searchWord = searchParams.get('searchWd');
	const searchCode = searchParams.get('searchCd');
	const searchRef = useRef(null);
	const {isMobile} = useScreenSizeContext();
	const {isAccApp, reloadKey, fncFocusLayout} = useWebContext();
	const {fncChangeMoHeader} = useMoHeaderContext();
	const {fncScrollToTop} = useScrollContext();
	const {jsonApiAction} = useApi();

	// 카데고리 목록(PC)
	const [categoryList, setCategoryList] = useState([]);

	// 카데고리 목록(MO)
	const [infiniteList, setInfiniteList] = useState([]);

	// 활성화된 질문
	const [activeFaq, setActiveFaq] = useState({});

	// 활성화된 질문 상세
	const [activeDetail, setActiveDetail] = useState({});

	// 파라미터
	const [params, setParams] = useState({
		page: 1,
		pageSize: 10,
		faqTypeCd: '',
		faqTtl: '',
	});

	// --Api
	// 분류 코드 목록
	const {mutate: mutFaqCodeList} = useMutation({
		mutationKey: ['mutFaqCodeList'],
		mutationFn: () => jsonApiAction(apiFaqCategoryList, {}),
		onSuccess: (res) => {
			if(res) {
				let formatted = res.map((item) => ({
					...item,
					id: item.faqTypeCd,
					name: item.faqTypeNm
				}));
				setCategoryList(formatted);

				if(!searchWord && !searchCode) {
					fncChangeTab(formatted[0].id)
				}
			}
		}
	})

	// 목록
	const {mutate: mutFaqList, data: faqList} = useMutation({
		mutationKey: ['mutFaqList'],
		mutationFn: (payload) => jsonApiAction(apiFaqList, {
			...payload,
			recordCnt: (isMobile || isAccApp) ? 30 : 10,
		}),
		onSuccess: (res) => {
			setActiveFaq({});
			setActiveDetail({});

			if(res.page === 1) {
				setInfiniteList(res.list);
			} else if (res?.endPage >= res.page) {
				setInfiniteList((prev) => [...prev, ...res.list]);
			} else {
				setInfiniteList(res.list);
			}
			
			if(!isMobile) fncScrollToTop();
		}
	})

	// FAQ 조회
	const {mutate: mutFaqDetail} = useMutation({
		mutationKey: ['mutFaqDetail'],
		mutationFn: (payload) => jsonApiAction(apiFaqDetail, payload),
		onSuccess: (res) => {
			setActiveDetail(res ?? {});
		}
	})

	useLayoutEffect(() => {
		mutFaqCodeList();
		if(searchWord) {
			fncChangeInput(searchWord);
			mutFaqList({faqTtl: searchWord});
		} else if(searchCode) {
			fncChangeTab(searchCode);
		}
	}, []);

	useLayoutEffect(() => {
		if(params.page && params.faqTypeCd) {
			mutFaqList(params);
		}
	}, [params.page, params.faqTypeCd]);

	useLayoutEffect(() => {
		if (isAccApp) fncFocusLayout();
		if (isMobile) {
			fncChangeMoHeader({
				type: 'back',
				title: '자주 묻는 질문'
			})
		}
	}, [isMobile, isAccApp, reloadKey])

	// FAQ 조회
	useEffect(() => {
		if(activeFaq?.faqId) {
			mutFaqDetail({faqId: activeFaq.faqId})
		}
	}, [activeFaq])

	// 카테고리 선택
	const fncChangeTab = (faqCode) => {
		setParams({
			...params,
			faqTtl: '',
			faqTypeCd: faqCode,
			page: 1
		});
		mutFaqList({
			faqTypeCd: faqCode,
			page: 1
		});
	}

	// 검색어 입력
	const fncChangeInput = (text) => {
		setParams({
			...params,
			faqTypeCd: '',
			faqTtl: text
		});
	}

	// 검색어 검색
	const fncSearch = () => {
		searchRef.current?.blur();
		if(params.page > 1) {
			setParams({...params, page: 1});
		} else {
			mutFaqList(params);
		}
	}

	// 페이지네이션
	const fncChangePage = (page) => {
		setParams({...params, page: page});
	}

	// faq 아코디언 보기
	const fncSelectFaq = (faqId) => {
		const isActive = activeFaq === faqId ? {} : faqId;
		setActiveFaq(isActive);
	}

	const fncHandlers = {
		changeInput: fncChangeInput,
		changeTab: fncChangeTab,
		selectFaq: fncSelectFaq,
		search: fncSearch,
		changePage: fncChangePage
	}

	const fncCallbackEvent = (fncName, variable, payload = {}) => {
		const fnc = fncHandlers[fncName];
		if (typeof fnc === 'function') return fnc(variable, payload);
	}

	if (isMobile) return (
		<MoSupportNoticeList
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...params,
				categoryList,
				infiniteList,
				faqList,
				activeFaq,
				activeDetail
			}}
			ref={searchRef}
		/>
	);
	else return (
		<DtSupportNoticeList
			fncCallbackEvent={fncCallbackEvent}
			data={{
				...params,
				categoryList,
				faqList,
				activeFaq,
				activeDetail
			}}
			ref={searchRef}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F255
 */
DtSupportNoticeList.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func,
	ref: PropTypes.any
};
export function DtSupportNoticeList({data, fncCallbackEvent, ref}) {

	const FAQ_A11Y_PREFIX = 'support-faq';

	const renderHeaderComponent = (item, index) => {
		const isActive = data.activeFaq?.faqId === item.faqId || false;
		return (
			<button
				key={item.faqId}
				{...accordionHeaderA11yProps(FAQ_A11Y_PREFIX, item.faqId, isActive)}
				className={`header ${isActive && 'active'} ${!isActive && index < data.faqList?.list?.length - 1 ? 'border-b' : 'border-0'}`}
				onClick={() => fncCallbackEvent('selectFaq', item)}
			>
				<p className={'text-start'}>
					{item.faqTtl}
				</p>
				{
					isActive ? <Minus aria-hidden={true} /> : <Plus aria-hidden={true} />
				}
			</button>
		)
	}

	const renderBodyComponent = (item) => {
		const isActive = data.activeFaq?.faqId === item.faqId;
		return (
			<div className={'body'} {...accordionPanelA11yProps(FAQ_A11Y_PREFIX, item.faqId, isActive)}>
				{
					isActive && data.activeDetail ? (
						<ToastViewer
							className={'dark:text-dynamic-text-neutral-primary'}
							initialValue={data.activeDetail?.faqCn ?? ''}
						/>
					) : null
				}
			</div>
		)
	}

	return (
		<main id={'support'} className={'body-wrap-880 faq-wrap'} aria-labelledby={'page-name-dt'}>
			<Breadcrumb addPaths={[]} />
			<h1 id={'page-name-dt'} className={'page-title'}>
				자주 묻는 질문
			</h1>
			<div className={'mt-48'}>
				<InputText
					ref={ref}
					size={'lg'}
					placeholder={'검색할 키워드를 입력하세요'}
					icon={<Search />}
					iconAriaLabel={'자주 묻는 질문 검색어 입력란'}
					allows={['kor','alnum','space','dash','dot','char']}
					id={'faqTtl'}
					value={data.faqTtl}
					onChange={(e) => fncCallbackEvent('changeInput', e.target.value)}
					onClickIcon={() => fncCallbackEvent('search')}
					onKeyDown={(e) => {
						if(e.nativeEvent.isComposing) return;
						if (e.key === 'Enter') fncCallbackEvent('search');
					}}
				/>
				<div className={'mt-36 mb-24'}>
					<TabControl
						options={data.categoryList}
						isSelected={data.faqTypeCd}
						cntKey={'detailCnt'}
						onChange={(id) => fncCallbackEvent('changeTab', id)}
					/>
				</div>
				{
					data.faqList?.list?.length ? (
						<div className={'accordion-wrap'}>
							<div className={'content-wrap'}>
								{
									data.faqList.list.map((item, index) => {
										return (
											<Accordion
												key={item.faqId}
												active={data.activeFaq?.faqId === item.faqId}
												panelId={accordionA11yIds(FAQ_A11Y_PREFIX, item.faqId).panelId}
												headerComponent={() => renderHeaderComponent(item, index)}
												bodyComponent={() => renderBodyComponent(item)}
											/>
										)
									})
								}
							</div>
							<div className={'flex-col-center mt-48'}>
								<Pagination
									pagingData={{
										dataTotal: data.faqList?.total,
										blockData: 10,
										blockGroup: 20,
										activePage: data.page,
										activeLastBtn: true,
									}}
									onPaging={(page) => fncCallbackEvent('changePage', page)}
								/>
							</div>
						</div>
					) : (
						<div className={'empty-wrap'}>
							<EmptyDefault/>
							<p>검색된 게시물이 없어요<br/>다시 검색해 주세요</p>
						</div>
					)
				}
			</div>
		</main>
	)
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F490
 */
MoSupportNoticeList.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func,
	ref: PropTypes.any
};
export function MoSupportNoticeList({data, fncCallbackEvent, ref}) {

	const scrollDivRef = useRef(null);

	const [offsetHeight, setOffsetHeight] = useState(0);

	useEffect(() => {
		if(scrollDivRef.current) {
			setOffsetHeight(scrollDivRef.current?.offsetHeight / 2);
		}
	}, [scrollDivRef.current]);

	// 페이징
	const fncFetchMoreItems = () => {
		if(data.page + 1 <= data.faqList?.endPage) {
			fncCallbackEvent('changePage', data.page + 1);
		}
	}

	// 검색
	const fncInfiniteSearch = () => {
		fncCallbackEvent('search');
	}

	const FAQ_A11Y_PREFIX = 'support-faq';

	const renderHeaderComponent = (item, index) => {
		const isActive = data.activeFaq?.faqId === item.faqId || false;
		return (
			<button
				key={item.faqId}
				{...accordionHeaderA11yProps(FAQ_A11Y_PREFIX, item.faqId, isActive)}
				className={`header ${isActive && 'active'} ${!isActive && index < data.infiniteList?.length - 1 ? 'border-b' : 'border-0'}`}
				onClick={() => fncCallbackEvent('selectFaq', item)}
			>
				<p className={'text-start'}>
					{item.faqTtl}
				</p>
				{
					isActive ? <Minus width={20} height={20} aria-hidden={true} /> : <Plus width={20} height={20} aria-hidden={true} />
				}
			</button>
		)
	}

	const renderBodyComponent = (item) => {
		const isActive = data.activeFaq?.faqId === item.faqId;
		return (
			<div className={'body prose max-w-none'} {...accordionPanelA11yProps(FAQ_A11Y_PREFIX, item.faqId, isActive)}>
				{
					isActive && data.activeDetail ? (
						<ToastViewer
							className={'prose max-w-none dark:text-dynamic-text-neutral-primary'}
							initialValue={data.activeDetail?.faqCn ?? ''}
						/>
					) : null
				}
			</div>
		)
	}

	return (
		<main id={'support'} className={'body-wrap-mobile-screen-height faq-wrap'} aria-labelledby={'page-name-mo'}>
			<h1 id={'page-name-mo'} className={'sr-only'}>자주 묻는 질문</h1>
			<div className={'body-inner-wrap-mobile'} style={{justifyContent: 'flex-start'}}>
				<InputText
					ref={ref}
					size={'md'}
					placeholder={'검색할 키워드를 입력하세요'}
					icon={<Search />}
					iconAriaLabel={'공지사항 검색어 입력란'}
					allows={['kor','alnum','space','dash','dot','char']}
					id={'faqTtl'}
					value={data.faqTtl}
					onChange={(e) => fncCallbackEvent('changeInput', e.target.value)}
					onClickIcon={fncInfiniteSearch}
					onKeyDown={(e) => {
						if(e.nativeEvent.isComposing) return;
						if (e.key === 'Enter') fncInfiniteSearch();
					}}
				/>
				<div className={'mt-16'}>
					<TabControl
						options={data.categoryList}
						isSelected={data.faqTypeCd}
						cntKey={'detailCnt'}
						onChange={(id) => fncCallbackEvent('changeTab', id)}
					/>
				</div>
				<div className={'accordion-wrap flex-1'} ref={scrollDivRef}>
					{
						data.infiniteList?.length > 0 ? (
							<InfiniteScroll
								className={'scrollbar-none content-wrap'}
								dataLength={data.infiniteList.length}
								scrollThreshold={0.9}
								hasMore={data.faqList?.endPage ? data.page < data.faqList.endPage : true}
								next={fncFetchMoreItems}
							>
								{
									data.infiniteList.map((item, index) => {
										return (
											<Accordion
												key={item.faqId}
												active={data.activeFaq?.faqId === item.faqId}
												panelId={accordionA11yIds(FAQ_A11Y_PREFIX, item.faqId).panelId}
												headerComponent={() => renderHeaderComponent(item, index)}
												bodyComponent={() => renderBodyComponent(item)}
											/>
										)
									})
								}
							</InfiniteScroll>
						) : (
							<div className={'empty-wrap'}>
								<EmptyDefault/>
								<p>검색된 게시물이 없어요<br/>다시 검색해 주세요</p>
							</div>
						)
					}
				</div>
			</div>
		</main>
	)
}
