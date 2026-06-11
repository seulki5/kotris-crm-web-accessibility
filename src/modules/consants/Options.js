import React from "react";

// modules
import {CODE} from "@modules/consants/Objects";
import {RouteConfig} from "@modules/config/RouteConfig";

// components
import Badge from "@components/composite/Badge";


// 탈퇴 사유
export const WithdrawalOptions = [
	{ id: '01', name: '서비스 이용중지' },
	{ id: '02', name: '재가입' },
	{ id: '03', name: '기타' },
]

// 언어
export const LanguageOptions = [
	{id: 'ko', name: '한국어', ariaLabel: '한국어'},
	{id: 'en', name: 'English 영어', ariaLabel: '영어'},
	{id: 'ja', name: '日本語 일본어', ariaLabel: '일본어'},
	{id: 'zh', name: '中文 중국어', ariaLabel: '중국어'},
]

// 카드 발급 목록
export const IssueCardOptions = [
	{
		id: CODE.CARD_SEG_PLA_SAFE,
		name: '대중교통안심카드',
		badge: null,
		details: [
			{id: 'metro-d1', body: (
					<p className={'text-body-md text-dynamic-text-neutral-primary font-medium'}>실물카드 준비 후 등록 가능</p>
				)},
		],
		color: 'text-dynamic-icon-other-green',
		comment: [
			{id: 'comment_01', message: '주민등록번호 기준으로 1인 1카드만 등록/사용이 원칙이며, 타인에게 양도/양수 할 수 없습니다.'}
		],
	},
	{
		id: CODE.CARD_SEG_PLA_DEFAULT,
		name: '일반 Rail+ 카드',
		badge: null,
		details: [
			{id: 'normal-d1', body: (
					<p className={'text-body-md text-dynamic-text-neutral-primary font-medium'}>실물카드 준비 후 등록 가능</p>
				)},
		],
		color: 'text-dynamic-icon-other-green',
		comment: [
			{id: 'comment_01', message: 'CU레일플러스카드의 할인요금 적용은 가까운 CU 편의점을 방문하여 주시기 바랍니다.\n(별도 등록 불필요)'},
			{id: 'comment_02', message: '토스유스카드의 어린이/청소년 할인요금은 발급 시 적용됩니다. (별도 등록 불필요)'},
		],
	},
];

// 환불/분실 신청 segment
export const RefundAndLostOptions = [
	{
		id: 'refund',
		name: '환불신청',
		url: RouteConfig.REFUND.PATH
	},
	{
		id: 'lost',
		name: '분실신청',
		url: RouteConfig.LOST.PATH
	},
	{
		id: 'claim',
		name: '신청내역',
		url: RouteConfig.CLAIM.PATH
	}
];

// 환불 사유 목록
export const RefundReasonOptions = [
	{id: CODE.REFUND_CLAIM_VERIFY, name: '카드 인식이 안되는 경우'},
	{id: CODE.REFUND_CLAIM_CHARGE, name: '충전이 안되는 경우'},
	{id: CODE.REFUND_CLAIM_BROKEN, name: '외형이 훼손 및 파손된 경우'},
	{id: CODE.REFUND_CLAIM_LOST, name: '안심카드 분실'},
	{id: CODE.REFUND_CLAIM_ETC, name: '기타'}
]

// 할인 등록 유형
export const DiscountOptions = [
	{
		id: CODE.DC_TEEN,
		name: '국가신분증(청소년증)',
		conditions: [
			{id: 'metro-d1', label: '어린이 : 만 9세 이상 ~ 만 12세 이하'},
			{id: 'metro-d2', label: '청소년 : 만 13세 이상~ 만 18세 이하'}
		],
		badges: [
			{id: '10', badge: <Badge id={'crdUsrTpCd'} code={'10'}/>},
			{id: '01', badge: <Badge id={'crdUsrTpCd'} code={'01'}/>},
		],
		iconColor: 'icon-other-orange',
		registerUrl: RouteConfig.DISCOUNT_TEENAGER_REGISTER.PATH,
		searchUrl: RouteConfig.DISCOUNT_TEENAGER.PATH,
	},
	{
		id: CODE.DC_STUDENT,
		name: '청소년 연령초과 학생 할인',
		conditions: [
			{id: 'normal-d1', label: '청소년 연령 이상이지만 학생인 경우'},
		],
		badges: [
			{id: '01', badge: <Badge id={'crdUsrTpCd'} code={'01'}/>},
		],
		iconColor: 'icon-other-violet',
		registerUrl: RouteConfig.DISCOUNT_STUDENT_REGISTER.PATH,
		searchUrl: RouteConfig.DISCOUNT_STUDENT.PATH,
	},
];

// 비회원 할인등록
export const NonMemberDiscountOptions = [
	{
		id: '국가신분증',
		name: '국가신분증(청소년증)',
		conditions: [
			{id: 0, label: '어린이 : 만 9세 이상 ~ 만 12세 이하'},
			{id: 1, label: '청소년 : 만 13세 이상~ 만 18세 이하'}
		],
		badges: [
			{id: '10', badge: <Badge id={'crdUsrTpCd'} code={'10'}/>},
			{id: '01', badge: <Badge id={'crdUsrTpCd'} code={'01'}/>},
		],
		iconColor: 'icon-other-orange',
		registerUrl: RouteConfig.NONMEMBER_TEENAGER_REGISTER.PATH,
		searchUrl: RouteConfig.NONMEMBER_TEENAGER.PATH,
	},
	{
		id: '어린이',
		name: '어린이 및 청소년 할인',
		conditions: [
			{id: 0, label: '어린이 : 만 6세 이상 ~ 만 12세 이하'},
			{id: 1, label: '청소년 : 만 13세 이상~ 만 18세 이하'},
			{id: 2, label: '일반 Rail+ 카드 및 대중교통안심카드 할인 등록 시'},
		],
		badges: [
			{id: '10', badge: <Badge id={'crdUsrTpCd'} code={'10'}/>},
			{id: '01', badge: <Badge id={'crdUsrTpCd'} code={'01'}/>},
		],
		iconColor: 'icon-other-orange',
		registerUrl: RouteConfig.NONMEMBER_MINORS_REGISTER.PATH,
		searchUrl: RouteConfig.NONMEMBER_MINORS.PATH,
	},
	{
		id: '청소년',
		name: '청소년 연령초과 학생 할인',
		badgeYouth: true,
		badgeKid: false,
		conditions: [
			{id: 0, label: '청소년 연령 이상이지만 학생인 경우'}
		],
		badges: [
			{id: '01', badge: <Badge id={'crdUsrTpCd'} code={'01'}/>},
		],
		iconColor: 'icon-other-violet',
		registerUrl: RouteConfig.NONMEMBER_STUDENT_REGISTER.PATH,
		searchUrl: RouteConfig.NONMEMBER_STUDENT.PATH,
	},
];

// 어린이 안심서비스 segment
export const ChildproofPageOptions = [
	{ id: RouteConfig.CHILDPROOF.PATH, name: '내 자녀 등록현황' },
	{ id: RouteConfig.CHILDPROOF_HISTORY.PATH, name: '내 자녀 이용내역' }
];

// 검색조건: 조회기간
export const FilterPeriod = [
	{ id: 'month', name: '이번달' },
	{ id: '3months', name: '3개월' },
	{ id: 'year', name: '1년' },
	{ id: 'custom', name: '직접입력' },
];

// 검색조건: 거래구분
export const FilterType = [
	{ id: '00', name: '전체' },
	{ id: '01', name: '대중교통' },
	{ id: '02', name: '유통' },
	{ id: '03', name: '충전' },
	{ id: '04', name: '환불' },
	{ id: '05', name: '승차권 예매' },
	{ id: '06', name: '기타' }
];

// 검색조건: 정렬순서
export const FilterOrder = [
	{ id: '00', name: '최신순' },
	{ id: '01', name: '과거순' },
];

// 검색조건: 쿠폰 사용 유무
export const FilterCouponState = [
	{ id: '00', name: '전체' },
	{ id: '01', name: '사용가능' },
	{ id: '02', name: '사용만료' },
	{ id: '03', name: '기한만료' },
];

// Rail+ 이용내역 segment
export const UsagePageOptions = [
	{ id: 'PERIOD', name: '기간별 이용내역' },
	{ id: 'MONTH_USE', name: '이용내역통계' },
	{ id: 'MONTH_CHARGE', name: '충전내역통계' }
];

// 쿠폰함 segment
export const CouponPageOptions = [
	{ id: 'R', name: '받은 쿠폰' },
	{ id: 'S', name: '보낸 쿠폰' }
];

// 알림 segment
export const AlarmTypeOptions = [
	{ id: '00', name: '전체' },
	{ id: '01', name: '공지사항' },
	{ id: '02', name: '이벤트' },
	{ id: '03', name: '쿠폰' },
	{ id: '04', name: '서비스' }
];

// 비밀번호 찾기 segment
export const FindPWOptions = [
	{ id: '02', name: '휴대폰으로 찾기' },
	{ id: '03', name: '이메일로 찾기' }
];

// 관련사이트
export const LinkedSitesOptions = [
	{
		id: 'letsKorail',
		name: '코레일',
		intlName: 'FOOTER.LETS_KORAIL',
		uri: process.env.NEXT_PUBLIC_KORAIL_COM_URI},
	{
		id: 'korailtravel',
		name: '코레일관광개발',
		intlName: 'FOOTER.KORAIL_TRAVEL',
		uri: process.env.NEXT_PUBLIC_KORAIL_TRAVEL_URI},
	{
		id: 'korailretail',
		name: '코레일유통',
		intlName: 'FOOTER.KORAIL_RETAIL',
		uri: process.env.NEXT_PUBLIC_KORAIL_RETAIL_URI},
];

// 이용약관 목록
export const policyOptions = [
	{
		type: 'privacy',
		koName: '개인정보처리방침',
		intlName: 'FOOTER.PRIVACY_POLICY',
		id: 'privacy',
		hide: false,
		link: process.env.NEXT_PUBLIC_PRIVACY_URI,
	},
	{
		type: 'pii',
		koName: '개인정보 수집 및 이용에 관한 동의',
		intlName: '',
		id: process.env.NEXT_PUBLIC_REQRD_PII_JOIN,
		hide: true,
		link: null,
	},
	{
		type: 'terms',
		koName: '이용약관',
		intlName: 'FOOTER.SERVICE_TERMS',
		id: process.env.NEXT_PUBLIC_TERMS_JOIN,
		hide: false,
		link: null,
	},
	{
		type: 'franchise',
		koName: '가맹점 서비스',
		intlName: 'FOOTER.FRANCHISE',
		id: process.env.NEXT_PUBLIC_MERCHANT_URI,
		hide: false,
		link: process.env.NEXT_PUBLIC_MERCHANT_URI,
	},
	{
		type: 'mktPii',
		koName: '마케팅 목적의 개인정보 수집 및 이용',
		intlName: '',
		id: process.env.NEXT_PUBLIC_MKT_PII_JOIN,
		hide: true,
		link: null,
	},
	{
		type: 'adOption',
		koName: '광고성 정보 수신',
		intlName: '',
		id: process.env.NEXT_PUBLIC_AD_OPTION,
		hide: true,
		link: null,
	},
	{
		type: 'svcNotice',
		koName: '서비스 알림 수신 동의',
		intlName: '',
		id: process.env.NEXT_PUBLIC_SVC_NOTICE,
		hide: true,
		link: null,
	},
	{
		type: 'returnPii',
		koName: '반환을 위한 개인정보 수집 및 이용',
		intlName: '',
		id: process.env.NEXT_PUBLIC_PII_LOST,
		hide: true,
		link: null,
	},
	{
		type: 'refundPii',
		koName: '분실/환불을 위한 개인정보 수집 및 이용',
		intlName: '',
		id: process.env.NEXT_PUBLIC_PII_REFUND,
		hide: true,
		link: null,
	},
];

export const ageOptions = [
	{id: 'PASS', name: '만 14세 이상\n회원가입'},
	{id: 'IPIN', name: '만 14세 미만\n회원가입'},
]
