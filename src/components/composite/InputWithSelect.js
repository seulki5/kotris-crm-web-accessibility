import React from 'react';
import PropTypes from "prop-types";

// components
import InputText from "@components/common/InputText";
import Select from "@components/common/Select";
import clsx from "clsx";


/**
 * @description: input과 Select가 함께 있는 컴포넌트 입니다.
 * @screenID:    -
 * @screenPath:  -
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
InputWithSelect.propTypes = {
	status: PropTypes.string,
	inputId: PropTypes.string,
	size: PropTypes.string,
	inputValue: PropTypes.string,
	message: PropTypes.string,
	title: PropTypes.string,
	direction: PropTypes.string,
	essential: PropTypes.bool,
	inputPlaceholder: PropTypes.string,
	inputIcon: PropTypes.any,
	dataOnly: PropTypes.bool,
	inputDisabled: PropTypes.bool,
	onClickIcon: PropTypes.func,
	onChangeInput: PropTypes.func,
	options: PropTypes.array,
	selectPlaceholder: PropTypes.string,
	emptyMsg: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
	selectValue: PropTypes.string,
	onSelect: PropTypes.func,
};
export default function InputWithSelect({
    status = 'default',
	inputId = '',
    size = 'md',
	inputValue = '',
    message = '',
    title = '',
    direction = 'vertical',
    essential = false,
    inputPlaceholder = '',
    inputIcon = null,
    dataOnly = false,
    inputDisabled = false,
    onClickIcon = () => {},
    onChangeInput = () => {},
	options = [],
	selectPlaceholder = '',
	emptyMsg = null,
	selectValue = '',
	onSelect = () => {},
    ...inputProps
}) {
	return (
		<div className={`flex flex-1 flex-row gap-6 items-end`}>
			<div className={clsx('w-[100px]', message?.length > 0 ? 'mb-18' : undefined)}>
				<Select
					size={size}
					options={options}
					title={title}
					essential={essential}
					emptyMsg={emptyMsg}
					placeholder={selectPlaceholder}
					value={selectValue}
					onSelect={onSelect}
				/>
			</div>
			<div className={'flex-1'}>
				<InputText
					id={inputId}
					status={status}
					size={size}
					value={inputValue}
					message={message}
					direction={direction}
					placeholder={inputPlaceholder}
					icon={inputIcon}
					dataOnly={dataOnly}
					disabled={inputDisabled}
					onClickIcon={onClickIcon}
					onChange={onChangeInput}
					{...inputProps}
				/>
			</div>
		</div>
	);
}
