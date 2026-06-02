import React from 'react';
import clsx from "clsx";
import PropTypes from "prop-types";

// modules
import {useScreenSizeContext} from "@modules/context/ScreenContext";

// components
import Button from "@components/common/Button";

// assets
import {Check, Plus, Search} from "@assets/icons/Svgs";


/**
 * @description: 비회원 할인등록 유형 컴포넌트 입니다.
 * @screenID:    -
 * @screenPath:  -
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
DiscountBox.propTypes = {
	name: PropTypes.string,
	iconColor: PropTypes.string,
	conditions: PropTypes.array,
	badges: PropTypes.array,
	onClickRegister: PropTypes.func,
	onClickSearch: PropTypes.func
};
export default function DiscountBox({
    name,
    iconColor,
    conditions = [],
    badges = [],
	disabled = false,
	onClickRegister = () => {},
    onClickSearch = () => {},
}) {
	
	const {isMobile} = useScreenSizeContext();

	return (
		<div className={clsx(
			'w-full rounded-16 p-36 flex flex-col gap-16 border border-solid border-dynamic-border-neutral-primary',
			'mo:p-20 mo:gap-12'
		)}>
			<div className={'flex-row-center gap-4 flex-wrap'}>
				<p className={clsx(
					'text-heading-md text-dynamic-text-neutral-primary font-semibold mr-6',
					'mo:text-heading-sm mo:mr-2 mo:whitespace-wrap'
				)}>
					{name}
				</p>
				{
					badges?.map((badge) => (
						<span key={badge.id}>{badge.badge}</span>
					))
				}
			</div>
			<div className={'flex flex-col gap-4'}>
				{
					conditions?.map((condition) => (
						<div className={'flex-row-center gap-6'} key={condition.id}>
							<Check
								width={20} height={20}
								color={clsx(`text-dynamic-${iconColor}`)}
							/>
							<span className={clsx(
								'text-body-xl text-dynamic-text-neutral-primary font-medium',
								'mo:text-body-md'
							)}>
								{condition.label}
							</span>
						</div>
					))
				}
			</div>
			<div className={'flex-row-center gap-12 mt-16 mo:mt-8'}>
				<Button
					theme={'primary'}
					size={isMobile? 'sm' : 'md'}
					text={'등록'}
					ariaLabel={'등록'}
					customStyle={'w-full'}
					icon={<Plus />}
					iconPosition={'left'}
					onClick={onClickRegister}
					disabled={disabled}
				/>
				<Button
					theme={'tertiary'}
					size={isMobile? 'sm' : 'md'}
					text={'조회'}
					ariaLabel={'조회'}
					customStyle={'w-full'}
					icon={<Search />}
					iconPosition={'left'}
					onClick={onClickSearch}
					disabled={disabled}
				/>
			</div>
		</div>
	)
}
