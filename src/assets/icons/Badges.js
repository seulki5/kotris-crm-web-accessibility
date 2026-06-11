import React from "react";

// NFC ON
export const BdgOn = () => (
	<div className={`
		w-[50px] h-[24px] rounded-full px-6 py-8
		flex items-center justify-center
		bg-dynamic-bg-brand-inverse
	`}>
		<span className={"w-[8px] h-[8px] rounded-full bg-dynamic-bg-brand-primary mr-6"}/>
		<span className={"text-label-xs text-dynamic-text-brand-primary"}>ON</span>
	</div>
);

// NFC OFF
export const BdgOff = () => (
	<div className={`
		w-[50px] h-[24px] rounded-full px-6 py-8
		flex items-center justify-center
		bg-dynamic-bg-neutral-secondary
	`}>
		<span className={"w-[8px] h-[8px] rounded-full bg-dynamic-icon-neutral-secondary mr-6"}/>
		<span className={"text-label-xs text-dynamic-text-neutral-secondary"}>OFF</span>
	</div>
);

// 일반
export const BdgAdult = () => (
	<div className={`
		w-fit h-[29px] rounded-6 px-8 py-4
		flex items-center justify-center
		bg-dynamic-bg-other-blue-bold
	`}>
		<p className={"text-body-md text-dynamic-text-neutral-inverse font-semibold"}>일반</p>
	</div>
);

// 어린이
export const BdgKid = () => (
	<div className={`
		w-fit h-[29px] rounded-6 px-8 py-4
		bg-dynamic-bg-other-orange-bold
	`}>
		<p className={"text-body-md text-dynamic-text-neutral-inverse font-semibold"}>어린이</p>
	</div>
);

// 청소년
export const BdgYouth = () => (
	<div className={`
		w-fit h-[29px] rounded-6 px-8 py-4
		bg-dynamic-bg-other-violet-bold
	`}>
		<p className={"text-body-md text-dynamic-text-neutral-inverse font-semibold"}>청소년</p>
	</div>
);

// 선불/일반
export const BdgPrepaidAdult = () => (
	<div className={`
		w-[78px] h-[26px] rounded-6 px-8 py-4
		flex items-center justify-center
		bg-dynamic-bg-other-blue-bold
	`}>
		<p className={"text-body-xs text-dynamic-text-neutral-inverse font-semibold"}>{`선불/일반`}</p>
	</div>
);

// 선불/어린이
export const BdgPrepaidKid = () => (
	<div className={`
		w-[78px] h-[26px] rounded-6 px-6 py-4
		flex items-center justify-center
		bg-dynamic-bg-other-orange-bold
	`}>
		<p className={"text-body-xs text-dynamic-text-neutral-inverse font-semibold"}>{`선불/어린이`}</p>
	</div>
);

// 선불/청소년
export const BdgPrepaidYouth = () => (
	<div className={`
		w-[78px] h-[26px] rounded-6 px-6 py-4
		flex items-center justify-center
		bg-dynamic-bg-other-violet-bold
	`}>
		<p className={"text-body-xs text-dynamic-text-neutral-inverse font-semibold"}>{`선불/청소년`}</p>
	</div>
);

// 후불/일반
export const BdgPostpaidAdult = () => (
	<div className={`
		w-[78px] h-[26px] rounded-6 px-8 py-4
		flex items-center justify-center
		bg-dynamic-bg-other-blue-bold
	`}>
		<p className={"text-body-xs text-dynamic-text-neutral-inverse font-semibold"}>{`후불/일반`}</p>
	</div>
);

// 후불/어린이
export const BdgPostpaidKid = () => (
	<div className={`
		w-[78px] h-[26px] rounded-6 px-6 py-4
		flex items-center justify-center
		bg-dynamic-bg-other-orange-bold
	`}>
		<p className={"text-body-xs text-dynamic-text-neutral-inverse font-semibold"}>{`후불/어린이`}</p>
	</div>
);

// 후불/청소년
export const BdgPostpaidYouth = () => (
	<div className={`
		w-[78px] h-[26px] rounded-6 px-6 py-4
		flex items-center justify-center
		bg-dynamic-bg-other-violet-bold
	`}>
		<p className={"text-body-xs text-dynamic-text-neutral-inverse font-semibold"}>{`후불/청소년`}</p>
	</div>
);

// 선불형
export const BdgPrepaid = () => (
	<div className={`
		w-[78px] h-[26px] rounded-full px-6 py-4
		flex items-center justify-center
		bg-dynamic-bg-other-lightblue
	`}>
		<p className={"text-body-xs text-dynamic-text-neutral-primary font-semibold"}>선불형</p>
	</div>
);

// 후불
export const BdgPostPaid = () => (
	<div className={`
		w-[78px] h-[26px] rounded-full px-6 py-4
		flex items-center justify-center
		bg-dynamic-bg-other-yellow
	`}>
		<p className={"text-body-xs text-dynamic-text-neutral-primary font-semibold"}>후불형</p>
	</div>
);

// 승인
export const BdgApprovalCmptn = () => (
	<div className={`
		w-auto min-w-[50px] h-auto
		rounded-full px-8 py-4
		flex items-center justify-center
		bg-dynamic-bg-other-teal
	`}>
		<p className={"text-body-md mo:text-body-xs text-dynamic-text-neutral-inverse font-semibold"}>승인</p>
	</div>
);

// 승인대기
export const BdgApprovalWait= () => (
	<div className={`
		w-auto min-w-[50px] h-auto
		rounded-full px-8 py-4
		flex items-center justify-center
		bg-dynamic-bg-caution-primary-bold
	`}>
		<p className={"text-body-md mo:text-body-xs text-dynamic-text-neutral-inverse font-semibold"}>승인대기</p>
	</div>
);

// 승인불가
export const BdgApprovalImps = () => (
	<div className={`
		w-auto min-w-[50px] h-auto
		rounded-full px-8 py-4
		flex items-center justify-center
		bg-dynamic-bg-negative-primary
	`}>
		<p className={"text-body-md mo:text-body-xs text-dynamic-text-neutral-inverse font-semibold"}>승인불가</p>
	</div>
);

// 승인반려
export const BdgApprovalRjct = () => (
	<div className={`
		w-auto min-w-[50px] h-auto
		rounded-full px-4 py-4
		flex items-center justify-center
		bg-dynamic-bg-neutral-inverse-subtle
	`}>
		<p className={"text-body-md mo:text-body-xs text-dynamic-text-neutral-inverse font-semibold"}>반려</p>
	</div>
);

// 오류
export const BdgApprovalError = () => (
	<div className={`
		w-auto min-w-[50px] h-auto
		rounded-full px-8 py-4
		flex items-center justify-center
		bg-dynamic-bg-negative-primary
	`}>
		<p className={"text-body-md mo:text-body-xs text-dynamic-text-neutral-inverse font-semibold"}>환불오류</p>
	</div>
);

// 환불/분실 신청취소
export const BdgApprovalCancel = () => (
	<div className={`
		w-auto min-w-[50px] h-auto
		rounded-full px-4 py-4
		flex items-center justify-center
		bg-dynamic-bg-other-orange
	`}>
		<p className={"text-body-md mo:text-body-xs text-dynamic-text-neutral-inverse font-semibold"}>신청취소</p>
	</div>
);

// 보호자
export const BdgGuardian = () => (
	<div className={`
		w-fit h-fit rounded-6 px-8 py-4
		bg-dynamic-bg-other-violet-subtle
		text-label-md text-dynamic-text-other-violet font-medium
		mo:px-6 mo:py-2 mo:text-label-xs
	`}>
		보호자
	</div>
);

// 자녀
export const BdgChildren = () => (
	<div className={`
		w-fit h-fit rounded-6 px-8 py-4
		bg-dynamic-bg-other-orange-subtle
		text-label-md text-dynamic-text-other-orange font-medium
		mo:px-6 mo:py-2 mo:text-label-xs
	`}>
		자녀
	</div>
);
