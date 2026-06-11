import React, {useEffect, useRef} from 'react'
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
			wrapper: 'min-w-[118px] min-h-[60px]',
			blockWidth: 'min-w-[114px]',
			blockHeight: 'min-h-[56px]'
		}
	}

	const stylesBySelected = (isSelected) => {
		if(isSelected) {
			// 배경색 있을 경우
			if(filled) {
				return `
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

		if(filled){
			if(options.length < 3) return;

			if(selectedValue) {
				const selectedIndex = options.findIndex(e => e.id === selectedValue);
				if(selectedIndex > 0 && selectedIndex - 1 === index) return null;
				if(selectedIndex === index) return null;
			}

			if(index === options.length - 1) return null;

			return dividerStyle;
		}

	    if(index !== options.length - 1) return dividerStyle;
    }

	return (
		<fieldset
			role={'radiogroup'}
			className={`
				w-fit p-4
				${fullSize && 'w-full'}
                ${stylesBySize[size]?.wrapper}
                flex rounded-8 gap-4
                ${filled && 'bg-dynamic-bg-neutral-secondary'}
            `}
			{...props}
		>
			<legend className={'sr-only'}>
				선택 항목 그룹:
			</legend>
			{options.map((option, index) => {
				const isSelected = selectedValue === option.id;
				return (
					<div
						key={option.id}
						style={{
							width: '100%',
							boxShadow: selectedValue === option.id ? `0px 1px 5px 0px rgba(0, 0, 0, 0.13)` : undefined
						}}
					>
						<button
							type={'button'}
							role={'radio'}
							aria-checked={isSelected}
							aria-label={option.name}
							className={clsx(
								'w-full h-auto transition-all rounded-6',
								'border border-solid',
								fullSize && 'flex-1',
								stylesBySize[size]?.blockWidth,
								stylesBySize[size].blockHeight,
								stylesBySelected(selectedValue === option.id),
							)}
							onClick={() => onChange?.(option.id)}
						>
							<div
								aria-hidden={true}
								className={`
			                       h-fit leading-none px-0
			                       ${stylesBySize[size]?.blockWidth}
			                       ${stylesBySize[size]?.textSize}
								   ${stylesByDivider(option, index)}
		                        `}
							>
								{option.name}
							</div>
						</button>
					</div>
				)
			})}
		</fieldset>
	)
}
