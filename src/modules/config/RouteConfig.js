function safeTrail(...names) {
	return names.filter(Boolean);
}
export const RouteConfig = {
	HOME: {
		PATH: "/", NAME: "홈",
		get TRAIL() {return safeTrail(this.NAME)}
	},
	LOGIN: {
		PATH: "/login", NAME: "로그인",
		get TRAIL() {return safeTrail(RouteConfig.HOME.NAME, this.NAME)}
	},
	JOIN: {
		PATH: "/join", NAME: "회원가입",
		get TRAIL() {return safeTrail(RouteConfig.HOME.NAME, this.NAME)}
	},
	SITEMAP: {
		PATH: '/sitemap', NAME: '전체 메뉴',
		get TRAIL() {return safeTrail(RouteConfig.HOME.NAME, this.NAME)}
	},
	FIND_ID: {
		PATH: "/find/id", NAME: "아이디 찾기",
		get TRAIL() {return safeTrail(RouteConfig.HOME.NAME, this.NAME)}
	},
	FIND_PW: {
		PATH: "/find/pw", NAME: "비밀번호 찾기",
		get TRAIL() {return safeTrail(RouteConfig.HOME.NAME, this.NAME)}
	},
	ABOUT: {
		PATH: "/about", NAME: "Rail+ 소개",
		get TRAIL() {return safeTrail(RouteConfig.HOME.NAME, this.NAME)}
	},
	ABOUT_BASIC: {
		PATH: "/about/basiccard", NAME: "일반 Rail+ 카드",
		get TRAIL() {return safeTrail(RouteConfig.HOME.NAME, RouteConfig.ABOUT.NAME, this.NAME)}
	},
	ABOUT_MOBILE: {
		PATH: "/about/mobilecard", NAME: "모바일 Rail+ 카드",
		get TRAIL() {return safeTrail(RouteConfig.HOME.NAME, RouteConfig.ABOUT.NAME, this.NAME)}
	},
	ABOUT_ASSURANCE: {
		PATH: "/about/assurancecard", NAME: "대중교통안심카드",
		get TRAIL() {return safeTrail(RouteConfig.HOME.NAME, RouteConfig.ABOUT.NAME, this.NAME)}
	},
	GUIDE: {
		PATH: "/guide", NAME: "Rail+ 이용안내",
		get TRAIL() {return safeTrail(RouteConfig.HOME.NAME, this.NAME)}
	},
	GUIDE_BASIC: {
		PATH: "/guide/basiccard", NAME: "일반 Rail+ 카드 이용안내",
		get TRAIL() {return safeTrail(RouteConfig.HOME.NAME, RouteConfig.GUIDE.NAME, this.NAME)}
	},
	GUIDE_MOBILE: {
		PATH: "/guide/mobilecard", NAME: "모바일 Rail+ 카드 이용안내",
		get TRAIL() {return safeTrail(RouteConfig.HOME.NAME, RouteConfig.GUIDE.NAME, this.NAME)}
	},
	GUIDE_ASSURANCE: {
		PATH: "/guide/assurancecard", NAME: "대중교통안심카드 이용안내",
		get TRAIL() {return safeTrail(RouteConfig.HOME.NAME, RouteConfig.GUIDE.NAME, this.NAME)}
	},
	GUIDE_USABLE: {
		PATH: "/guide/usable", NAME: "사용처 안내",
		get TRAIL() {return safeTrail(RouteConfig.HOME.NAME, RouteConfig.ABOUT.NAME, this.NAME)}
	},
	GUIDE_KPASS: {
		PATH: "/guide/kpass", NAME: "K-패스 이용안내",
		get TRAIL() {return safeTrail(RouteConfig.HOME.NAME, RouteConfig.GUIDE.NAME, this.NAME)}
	},
	GUIDE_BILLING: {
		PATH: "/guide/billing", NAME: "선불형 / 후불형 카드안내",
		get TRAIL() {return safeTrail(RouteConfig.HOME.NAME, RouteConfig.GUIDE.NAME, this.NAME)}
	},
	GUIDE_CHILDPROOF: {
		PATH: "/guide/childproof", NAME: "어린이 안심서비스 이용안내",
		get TRAIL() {return safeTrail(RouteConfig.HOME.NAME, RouteConfig.GUIDE.NAME, this.NAME)}
	},
	GUIDE_ZEROPAY: {
		PATH: "/guide/zeropay", NAME: "제로페이 이용 안내",
		get TRAIL() {return safeTrail(RouteConfig.HOME.NAME, RouteConfig.GUIDE.NAME, this.NAME)}
	},
	TERMS: {
		PATH: "/terms", NAME: "이용약관",
		get TRAIL() {return safeTrail(RouteConfig.HOME.NAME)}
	},
	MY: {
		PATH: "/my", NAME: "마이페이지",
		get TRAIL() {return safeTrail(RouteConfig.HOME.NAME, this.NAME)}
	},
	INFO: {
		PATH: "/my/info", NAME: "내 정보",
		get TRAIL() {return safeTrail(RouteConfig.HOME.NAME, RouteConfig.MY.NAME, this.NAME)}
	},
	WITHDRAWAL: {
		PATH: "/my/info/withdrawal", NAME: "회원탈퇴",
		get TRAIL() {return safeTrail(RouteConfig.HOME.NAME, RouteConfig.INFO.NAME, this.NAME)}
	},
	CARD: {
		PATH: "/my/card", NAME: "내 카드",
		get TRAIL() {return safeTrail(RouteConfig.HOME.NAME, RouteConfig.MY.NAME, this.NAME)}
	},
	CARD_REGISTER: {
		PATH: "/my/card/register", NAME: "카드등록",
		get TRAIL() {return safeTrail(RouteConfig.HOME.NAME, RouteConfig.MY.NAME, RouteConfig.CARD.NAME, this.NAME)}
	},
	USAGE: {
		PATH: "/my/usage", NAME: "Rail+ 이용내역",
		get TRAIL() {return safeTrail(RouteConfig.HOME.NAME, RouteConfig.INFO.NAME, this.NAME)}
	},
	USAGE_STATISTICS: {
		PATH: "/my/usage/statistics", NAME: "Rail+ 이용내역 통계",
		get TRAIL() {return safeTrail(RouteConfig.HOME.NAME, RouteConfig.INFO.NAME, RouteConfig.USAGE.NAME)}
	},
	REFUND: {
		PATH: "/my/refund", NAME: "환불신청",
		get TRAIL() {return safeTrail(RouteConfig.HOME.NAME, RouteConfig.MY.NAME, this.NAME)}
	},
	LOST: {
		PATH: "/my/lost", NAME: "대중교통안심카드 분실신청",
		get TRAIL() {return safeTrail(RouteConfig.HOME.NAME, RouteConfig.MY.NAME, this.NAME)}
	},
	CLAIM: {
		PATH: "/my/claim", NAME: "환불/분실신청 내역",
		get TRAIL() {return safeTrail(RouteConfig.HOME.NAME, RouteConfig.MY.NAME, this.NAME)}
	},
	DISCOUNT: {
		PATH: "/my/discount", NAME: "할인등록",
		get TRAIL() {return safeTrail(RouteConfig.HOME.NAME, RouteConfig.MY.NAME, this.NAME)}
	},
	DISCOUNT_TEENAGER: {
		PATH: "/my/discount/teenager", NAME: "국가신분증 등록정보",
		get TRAIL() {return safeTrail(RouteConfig.HOME.NAME, RouteConfig.MY.NAME, RouteConfig.DISCOUNT.NAME, this.NAME)}
	},
	DISCOUNT_TEENAGER_REGISTER: {
		PATH: "/my/discount/teenager/register", NAME: "국가신분증 등록 / 수정",
		get TRAIL() {return safeTrail(RouteConfig.HOME.NAME, RouteConfig.MY.NAME, RouteConfig.DISCOUNT.NAME, this.NAME)}
	},
	DISCOUNT_STUDENT: {
		PATH: "/my/discount/student", NAME: "청소년 연령초과 학생 할인 조회",
		get TRAIL() {return safeTrail(RouteConfig.HOME.NAME, RouteConfig.MY.NAME, RouteConfig.DISCOUNT.NAME, this.NAME)}
	},
	DISCOUNT_STUDENT_REGISTER: {
		PATH: "/my/discount/student/register", NAME: "청소년 연령초과 학생 할인 등록 / 수정",
		get TRAIL() {return safeTrail(RouteConfig.HOME.NAME, RouteConfig.MY.NAME, RouteConfig.DISCOUNT.NAME, this.NAME)}
	},
	CHILDPROOF: {
		PATH: "/my/childproof", NAME: "어린이 안심서비스",
		get TRAIL() {return safeTrail(RouteConfig.HOME.NAME, RouteConfig.MY.NAME, this.NAME)}
	},
	CHILDPROOF_HISTORY: {
		PATH: "/my/childproof/history", NAME: "어린이 안심서비스",
		get TRAIL() {return safeTrail(RouteConfig.HOME.NAME, RouteConfig.MY.NAME, this.NAME)}
	},
	CHILDPROOF_REGISTER: {
		PATH: "/my/childproof/register", NAME: "내 자녀 등록 / 수정",
		get TRAIL() {return safeTrail(RouteConfig.HOME.NAME, RouteConfig.MY.NAME, RouteConfig.CHILDPROOF.NAME, this.NAME)}
	},
	CHILDPROOF_DETAIL: {
		PATH: "/my/childproof/detail", NAME: "내 자녀 등록현황",
		get TRAIL() {return safeTrail(RouteConfig.HOME.NAME, RouteConfig.MY.NAME, RouteConfig.CHILDPROOF.NAME, this.NAME)}
	},
	COUPON: {
		PATH: "/my/coupon", NAME: "쿠폰함",
		get TRAIL() {return safeTrail(RouteConfig.HOME.NAME, RouteConfig.MY.NAME, this.NAME)}
	},
	SUPPORT: {
		PATH: "/support", NAME: "고객센터",
		get TRAIL() {return safeTrail(RouteConfig.HOME.NAME, this.NAME)}
	},
	CONTACT: {
		PATH: "/support/contact", NAME: "문의하기",
		get TRAIL() {return safeTrail(RouteConfig.HOME.NAME, RouteConfig.SUPPORT.NAME, this.NAME)}
	},
	EVENT: {
		PATH: "/support/event", NAME: "이벤트",
		get TRAIL() {return safeTrail(RouteConfig.HOME.NAME, RouteConfig.SUPPORT.NAME, this.NAME)}
	},
	EVENT_DETAIL: {
		PATH: "/support/event/detail", NAME: "이벤트 상세",
		get TRAIL() {return safeTrail(RouteConfig.HOME.NAME, RouteConfig.SUPPORT.NAME, RouteConfig.EVENT.NAME)}
	},
	FAQ: {
		PATH: "/support/faq", NAME: "자주 묻는 질문",
		get TRAIL() {return safeTrail(RouteConfig.HOME.NAME, RouteConfig.SUPPORT.NAME, this.NAME)}
	},
	LOCATION: {
		PATH: "/support/location", NAME: "오시는 길",
		get TRAIL() {return safeTrail(RouteConfig.HOME.NAME, RouteConfig.SUPPORT.NAME, this.NAME)}
	},
	NOTICE: {
		PATH: "/support/notice", NAME: "공지사항",
		get TRAIL() {return safeTrail(RouteConfig.HOME.NAME, RouteConfig.SUPPORT.NAME, this.NAME)}
	},
	NOTICE_DETAIL: {
		PATH: "/support/notice/detail", NAME: "공지 상세",
		get TRAIL() {return safeTrail(RouteConfig.HOME.NAME, RouteConfig.SUPPORT.NAME,  RouteConfig.NOTICE.NAME)}
	},
	NONMEMBER: {
		PATH: "/support/nonmember", NAME: "비회원 할인등록",
		get TRAIL() {return safeTrail(RouteConfig.HOME.NAME, RouteConfig.SUPPORT.NAME, this.NAME)}
	},
	NONMEMBER_TEENAGER: {
		PATH: "/support/nonmember/teenager", NAME: "국가신분증 조회",
		get TRAIL() {return safeTrail(RouteConfig.HOME.NAME, RouteConfig.SUPPORT.NAME, RouteConfig.NONMEMBER.NAME, this.NAME)}
	},
	NONMEMBER_TEENAGER_REGISTER: {
		PATH: "/support/nonmember/teenager/register", NAME: "국가신분증 등록 / 수정",
		get TRAIL() {return safeTrail(RouteConfig.HOME.NAME, RouteConfig.SUPPORT.NAME, RouteConfig.NONMEMBER.NAME, this.NAME)}
	},
	NONMEMBER_MINORS: {
		PATH: "/support/nonmember/minors", NAME: "어린이 및 청소년 할인 조회",
		get TRAIL() {return safeTrail(RouteConfig.HOME.NAME, RouteConfig.SUPPORT.NAME, RouteConfig.NONMEMBER.NAME, this.NAME)}
	},
	NONMEMBER_MINORS_REGISTER: {
		PATH: "/support/nonmember/minors/register", NAME: "어린이 및 청소년 등록 / 수정",
		get TRAIL() {return safeTrail(RouteConfig.HOME.NAME, RouteConfig.SUPPORT.NAME, RouteConfig.NONMEMBER.NAME, this.NAME)}
	},
	NONMEMBER_STUDENT: {
		PATH: "/support/nonmember/student", NAME: "청소년 연령초과 학생 할인 조회",
		get TRAIL() {return safeTrail(RouteConfig.HOME.NAME, RouteConfig.SUPPORT.NAME, RouteConfig.NONMEMBER.NAME, this.NAME)}
	},
	NONMEMBER_STUDENT_REGISTER: {
		PATH: "/support/nonmember/student/register", NAME: "청소년 연령초과 학생 할인 등록 / 수정",
		get TRAIL() {return safeTrail(RouteConfig.HOME.NAME, RouteConfig.SUPPORT.NAME, RouteConfig.NONMEMBER.NAME, this.NAME)}
	},
	ALARM: {
		PATH: "/alarm", NAME: "알림",
		get TRAIL() {return safeTrail(RouteConfig.HOME.NAME, this.NAME)}
	},
	APP_BLANK: {
		PATH: "/mblank", NAME: "앱 대기",
		get TRAIL() {return safeTrail(this.NAME)}
	},
	CERT: {
		PATH: "/cert", NAME: "서비스 이용동의",
		get TRAIL() {return safeTrail(RouteConfig.HOME.NAME, this.NAME)}
	},
	APP_PAD: {
		PATH: "/mpad", NAME: "앱 비밀번호",
		get TRAIL() {return safeTrail(RouteConfig.HOME.NAME, this.NAME)}
	},
}


export const RouteIntlConfig = {
	DISCOUNT: {
		PATH: "/discount", NAME: "discount"
	},
	REGISTRATION: {
		PATH: "/discount/registration", NAME: "registration"
	},
	INQUIRY: {
		PATH: "/discount/inquiry", NAME: "inquiry"
	},
	HOWTOUSE: {
		PATH: "/howtouse", NAME: "how to use"
	},
}
