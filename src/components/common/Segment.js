import React from 'react'
import PropTypes from 'prop-types';
import clsx from "clsx";

Segment.propTypes = {
	size: PropTypes.string,
	filled: PropTypes.bool,
	options: PropTypes.array,
	selectedValue: PropTypes.string,
	fullSize: PropTypes.bool,
	onChange: PropTypes.func.isRequired,
};
export default function Segment({
     size = 'md',
	 filled = true,
     options = [],
     selectedValue = null,
     fullSize = false,
     onChange = () => {},
     ...props
 }) {
	
	const stylesBySize = {
		sm: {
			textSize: 'text-body-sm font-semibold',
			wrapper: 'min-w-[68px] min-h-[44px] p-2',
			blockWidth: 'min-w-[66px]',
			blockHeight: 'min-h-[40px]'
		},
		md: {
			textSize: 'text-body-lg font-semibold',
			wrapper: 'min-w-[99px] min-h-[52px] p-2',
			blockWidth: 'min-w-[95px]',
			blockHeight: 'min-h-[48px]'
		},
		lg: {
			textSize: 'text-body-xl font-semibold',
			wrapper: 'min-w-[118px] min-h-[60px] p-2',
			blockWidth: 'min-w-[114px]',
			blockHeight: 'min-h-[56px]'
		}
	}

	const stylesBySelected = (isSelected) => {
		if(isSelected) {
			// 배경색 있을 경우
			if(filled) {
				return `
					rounded-6
					flex items-center justify-center
					bg-dynamic-bg-neutral-primary
					 border-dynamic-border-neutral-primary
					text-dynamic-text-neutral-primary
				`
			}
			
			// 배경색 없을 경우
			return 'text-dynamic-text-neutral-primary'
			
		} else {
			return `
				border-transparent
				text-dynamic-text-neutral-secondary
				hover:text-dynamic-text-neutral-primary
			`
		}
	}
	
    const stylesByDivider = (option, index) => {
	    const dividerStyle = 'border-r border-solid border-r-dynamic-border-neutral-primary';
		
		// 배경색이 있을 경우: 조건에 따라 유무 결정
		if(filled){
			// 두개 항목만 있을 경우 구분선 지우기
			if(options.length < 3) return;
			
			// 선택된 값이 있으면 좌우로 구분선 만들지 않음
			if(selectedValue) {
				const selectedIndex = options.findIndex(e => e.id === selectedValue);
				
				// 이전 index 에서 구분선 지우기
				if(selectedIndex > 0 && selectedIndex - 1 === index) return null;
				
				// 현재 index 에서 구분선 지우기
				if(selectedIndex === index) return null;
			}
			
			// 마지막 index 일 경우엔 구분선 만들지 않음
			if(index === options.length - 1) return null;
			
			// 이회 모든 경우의 구분선 만들기
			return dividerStyle;
		}
		
		// 배경색이 없을 경우: 마지막 index 일 경우를 제외하고선 구분선 있음
	    if(index !== options.length - 1) return dividerStyle;
    }
	
	return (
		<fieldset
			role={'group'}
			className={`
				w-fit
				${fullSize && 'w-full'}
                ${stylesBySize[size]?.wrapper}
                flex overflow-hidden rounded-8 gap-2
                ${filled && 'bg-dynamic-bg-neutral-secondary'}
            `}
			{...props}
		>
			{options.map((option, index) => (
				<button
					key={option.id}
					className={clsx(
						'h-auto transition-all',
						'border border-solid',
						fullSize && 'flex-1',
						stylesBySize[size]?.blockWidth,
						stylesBySize[size].blockHeight,
						stylesBySelected(selectedValue === option.id),
					)}
					style={{boxShadow: `0px 1px 5px 0px ${selectedValue === option.id ? 'rgba(0, 0, 0, 0.13)' : 'transparent'}`}}
					onClick={() => onChange?.(option.id)}
				>
					<div className={`
                        h-fit leading-none px-0
                        ${stylesBySize[size]?.blockWidth}
                        ${stylesBySize[size]?.textSize}
                        ${stylesByDivider(option, index)}
                    `}>
						{option.name}
					</div>
				</button>
			))}
		</fieldset>
	)
}
