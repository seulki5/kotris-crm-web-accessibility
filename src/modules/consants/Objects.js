import {
	BdgApprovalCmptn,
	BdgApprovalRjct,
	BdgApprovalWait,
	BdgApprovalImps,
	BdgApprovalCancel, BdgApprovalError
} from "@assets/icons/Badges";

export const CODE = {
	plasticCard: 'plasticCard',
	appCard: 'appCard',

	/* 할인 코드 */
	DC_TEEN: '01',               // 할인(국가신분증)
	DC_STUDENT: '03',            // 할인(청소년 연령초과 학생)
	DC_MINOR: '02',              // 할인(어린이 및 청소년)

	/* 카드 구분 코드 */
	CARD_SEG_MO_PRE: '01',         // 모바일카드(선불)
	CARD_SEG_MO_POST: '02',        // 모바일카드(후불)
	CARD_SEG_PLA_DEFAULT: '03',    // 일반
	CARD_SEG_PLA_SAFE: '04',       // 대중교통안심

	/* 카드 사용자 유형 코드 */
	CARD_USER_ADULT: '11',        // 일반
	CARD_USER_KID: '10',          // 어린이
	CARD_USER_YOUTH: '01',        // 청소년

	/* 환불 사유 */
	REFUND_CLAIM_VERIFY: '01',    // 카드인식불가
	REFUND_CLAIM_CHARGE: '02',    // 충전불가
	REFUND_CLAIM_BROKEN: '03',    // 외형 훼손 및 파손
	REFUND_CLAIM_ETC: '04',       // 기타
	REFUND_CLAIM_LOST: '05',      // 안심카드 분실

	/* 유저 유형 코드 */
	USER_ADULT: '01',        // 일반
	USER_YOUTH: '02',        // 청소년
	USER_KID: '03',          // 어린이

	/* SNS */
	SOCIAL_KAKAO: 'KAKAO',
	SOCIAL_NAVER: 'NAVER',
	SOCIAL_GOOGLE: 'GOOGLE',
	SOCIAL_APPLE: 'APPLE',

	/* 어린이 안심서비스 상태 */
	CHILDPROOF_APPLIED: '01',
	CHILDPROOF_APPROVED: '02',
	CHILDPROOF_REJECTED: '03',

	/* 환불/분실 상태 */
	REFUND_CANCEL: '00',
	REFUND_APPLIED: '01',
	REFUND_APPROVED: '02',
	REFUND_HOLD: '03',
	REFUND_DEPOSIT: '04',
	REFUND_PROCESS: '05',
	REFUND_COMPLETE: '06',
	REFUND_ERROR: '99'

};

// 어린이 안심서비스 등록 상태
export const FindChildproofStatusBadge = {
	[CODE.CHILDPROOF_APPLIED]: <BdgApprovalWait />,
	[CODE.CHILDPROOF_APPROVED]: <BdgApprovalCmptn />,
	[CODE.CHILDPROOF_REJECTED]: <BdgApprovalRjct />,
}

// 카드 유형 이름
export const FindCardProductName = {
	[CODE.CARD_SEG_MO_PRE]: '모바일 Rail+ 카드 (선불형)',
	[CODE.CARD_SEG_MO_POST]: '모바일 Rail+ 카드 (후불형)',
	[CODE.CARD_SEG_PLA_DEFAULT]: '일반 Rail+ 카드',
	[CODE.CARD_SEG_PLA_SAFE]: '대중교통안심카드'
}

// 환불/분실 상태
export const FindRefundStatusBadge = {
	[CODE.REFUND_CANCEL]: <BdgApprovalCancel />,     // 신청취소(취소)
	[CODE.REFUND_APPLIED]: <BdgApprovalWait />,      // 승인대기(신청)
	[CODE.REFUND_APPROVED]: <BdgApprovalWait />,     // 승인대기(승인완료)
	[CODE.REFUND_HOLD]: <BdgApprovalImps />,         // 승인불가(보류)
	[CODE.REFUND_DEPOSIT]: <BdgApprovalCmptn />,     // 승인(입금완료)
	[CODE.REFUND_PROCESS]: <BdgApprovalWait />,      // 승인대기(처리중)
	[CODE.REFUND_COMPLETE]: <BdgApprovalCmptn />,     // 승인(완료)
	[CODE.REFUND_ERROR]: <BdgApprovalError /> // 오휴
}