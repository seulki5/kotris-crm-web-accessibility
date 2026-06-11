import React from "react";

// modules
import {RouteConfig} from "@modules/config/RouteConfig";

// assets
import {
	SitemapAbout,
	SitemapAboutFill,
	SitemapGuide,
	SitemapGuideFill,
	SitemapMy,
	SitemapMyFill, SitemapSupport, SitemapSupportFill
} from "@assets/icons/Svgs";


export const GnbMap = [
	{
		id: 'about',
		name: 'Rail+ 소개',
		url: '',
		icon: {
			activeLight: <SitemapAboutFill/>,
			activeDark: <SitemapAbout color={'#FFFFFF'}/>,
			nonActive: <SitemapAbout/>,
		},
		lnb: [
			{id: 'mobile', name: '모바일 Rail+ 카드', uri: RouteConfig.ABOUT_MOBILE.PATH},
			{id: 'basic', name: '일반 Rail+ 카드', uri: RouteConfig.ABOUT_BASIC.PATH},
			{id: 'safety', name: '대중교통안심카드', uri: RouteConfig.ABOUT_ASSURANCE.PATH},
		]
	},
	{
		id: 'guide',
		name: '이용안내',
		url: '',
		icon: {
			activeLight: <SitemapGuideFill/>,
			activeDark: <SitemapGuide color={'#FFFFFF'}/>,
			nonActive: <SitemapGuide/>,
		},
		lnb: [
			{id: 'mobile-railplus', name: '모바일 Rail+ 카드 이용안내', uri: RouteConfig.GUIDE_MOBILE.PATH},
			{id: 'plastic-railplus', name: '일반 Rail+ 카드 이용안내', uri: RouteConfig.GUIDE_BASIC.PATH},
			{id: 'metro', name: '대중교통안심카드 이용안내', uri: RouteConfig.GUIDE_ASSURANCE.PATH},
			{id: 'kpass', name: 'K-패스 이용안내', uri: RouteConfig.GUIDE_KPASS.PATH},
			{id: 'zeropay', name: '제로페이 이용안내', uri: RouteConfig.GUIDE_ZEROPAY.PATH},
			{id: 'credit', name: '선불형/후불형 카드안내', uri: RouteConfig.GUIDE_BILLING.PATH},
			{id: 'available', name: '사용처 안내', uri: RouteConfig.GUIDE_USABLE.PATH},
			{id: 'childproof', name: '어린이 안심서비스 이용안내', uri: RouteConfig.GUIDE_CHILDPROOF.PATH}
		]
	},
	{
		id: 'my',
		name: '마이페이지',
		url: '',
		icon: {
			activeLight: <SitemapMyFill/>,
			activeDark: <SitemapMy color={'#FFFFFF'}/>,
			nonActive: <SitemapMy/>,
		},
		lnb: [
			{id: 'sub1', name: '내 정보', uri: RouteConfig.INFO.PATH, userRequired: true},
			{id: 'sub2', name: '내 카드', uri: RouteConfig.CARD.PATH, userRequired: true},
			{id: 'sub3', name: 'Rail+ 이용내역', uri: RouteConfig.USAGE.PATH, userRequired: true},
			{id: 'sub4', name: '환불신청', uri: RouteConfig.REFUND.PATH, userRequired: true},
			{id: 'sub5', name: '대중교통안심카드 분실신청', uri: RouteConfig.LOST.PATH, userRequired: true},
			{id: 'sub6', name: '할인등록', uri: RouteConfig.DISCOUNT.PATH, userRequired: true},
			{id: 'sub7', name: '어린이 안심서비스', uri: RouteConfig.CHILDPROOF.PATH, userRequired: true},
			{id: 'sub8', name: '쿠폰함', uri: RouteConfig.COUPON.PATH, userRequired: true},
		]
	},
	{
		id: 'support',
		name: '고객센터',
		url: '',
		icon: {
			activeLight: <SitemapSupportFill/>,
			activeDark: <SitemapSupport color={'#FFFFFF'}/>,
			nonActive: <SitemapSupport/>,
		},
		lnb: [
			{id: 'sub1', name: '공지사항', uri: RouteConfig.NOTICE.PATH},
			{id: 'sub2', name: '이벤트', uri: RouteConfig.EVENT.PATH},
			{id: 'sub3', name: '자주묻는질문', uri: RouteConfig.FAQ.PATH},
			{id: 'sub4', name: '비회원 할인등록', uri: RouteConfig.NONMEMBER.PATH},
			{id: 'sub5', name: '문의하기', uri: RouteConfig.CONTACT.PATH},
			{id: 'sub6', name: '오시는 길', uri: RouteConfig.LOCATION.PATH}
		]
	}
];
