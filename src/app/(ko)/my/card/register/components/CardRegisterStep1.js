'use client'

import React from "react";
import PropTypes from "prop-types";

// modules
import {useScreenSizeContext} from "@modules/context/ScreenContext";
import {IssueCardOptions} from "@modules/consants/Options";

// components
import {RadioSelector} from "@components/composite/RaidoArray";
import Button from "@components/common/Button";


/**
 * @description: 카드 등록 > 카드 선택 화면 입니다.
 * @screenID:    UI-CRM-F226, UI-CRM-F454
 * @screenPath:  홈 > 마이페이지 > 내 카드 > 카드 등록
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
CardRegisterStep1.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export default function CardRegisterStep1({data, fncCallbackEvent}) {

	const {isMobile} = useScreenSizeContext();

	if (isMobile) return (
		<MoCardRegisterStep1
			fncCallbackEvent={fncCallbackEvent}
			data={data}
        />
	);
	else return (
		<DtCardRegisterStep1
			fncCallbackEvent={fncCallbackEvent}
			data={data}
		/>
	);
}

/**
 * @description: Desktop
 * @screenID:    UI-CRM-F226
 */
DtCardRegisterStep1.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function DtCardRegisterStep1({data, fncCallbackEvent}) {
	return (
		<>
			<fieldset>
				<legend id={'legend-card-type-dt'} className={'sr-only'}>
					등록할 카드 종류 선택
				</legend>
				<div
					role={'radiogroup'}
					aria-labelledby={'legend-card-type-dt'}
					className={'flex-col-center gap-20'}
				>
					{
						IssueCardOptions.map((card) => {
							const isChecked = data.utztnDsctnSeCd === card.id;
							return (
								<RadioSelector
									key={card.id}
									type={'card'}
									data={card}
									isChecked={isChecked}
									value={data.utztnDsctnSeCd}
									onClick={(id) => fncCallbackEvent('changeCardType', id)}
								/>
							)
						})
					}
				</div>
			</fieldset>
			<div className={'page-bottom-button-wrap'}>
				<Button
					theme={'primary'}
					size={'xl'}
					text={'다음'}
					ariaLabel={'카드 등록을 위한 다음 단계로 이동'}
					customStyle={'w-[240px]'}
					disabled={!data.utztnDsctnSeCd}
					onClick={() => fncCallbackEvent('next')}
				/>
			</div>
		</>
	)
}

/**
 * @description: Mobile
 * @screenID:    UI-CRM-F454
 */
MoCardRegisterStep1.propTypes = {
	data: PropTypes.object,
	fncCallbackEvent: PropTypes.func
};
export function MoCardRegisterStep1({data, fncCallbackEvent}) {
	return (
		<>
			<fieldset>
				<legend id={'legend-card-type-mo'} className={'sr-only'}>
					등록할 카드 종류 선택
				</legend>
				<p className={'page-title mb-40'} aria-describedby={'legend-card-type-mo'}>
					{`등록할 카드의 종류를\n선택해 주세요`}
				</p>
				<div
					role={'radiogroup'}
					aria-labelledby={'legend-card-type-mo'}
					className={'flex flex-col gap-20'}
				>
					{
						IssueCardOptions.map((card) => {
							const isChecked = data.utztnDsctnSeCd === card.id;
							return (
								<RadioSelector
									key={card.id}
									type={'card'}
									data={card}
									isChecked={isChecked}
									value={data.utztnDsctnSeCd}
									onClick={(id) => fncCallbackEvent('changeCardType', id)}
								/>
							)
						})
					}
				</div>
			</fieldset>
			<div className={'page-bottom-button-wrap'}>
				<Button
					theme={'primary'}
					size={'lg'}
					text={'다음'}
					ariaLabel={'카드 등록을 위한 다음 단계로 이동'}
					customStyle={'w-full'}
					disabled={!data.utztnDsctnSeCd}
					onClick={() => fncCallbackEvent('next')}
				/>
			</div>
		</>
	)
}
