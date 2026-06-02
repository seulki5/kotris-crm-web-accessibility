'use client';

import React, {useEffect, useState, useRef} from 'react';
import PropTypes from 'prop-types';
import Calendar from 'react-calendar';
import moment from "moment";
import clsx from "clsx";
import Holidays from 'date-holidays';

// modules
import {useScreenSizeContext} from "@modules/context/ScreenContext";

// components
import Button from "@components/common/Button";

// assets
import {CalendarSvg, ChevronLeft, ChevronRight} from '@assets/icons/Svgs';


DatePicker.propTypes = {
	inputWidth: PropTypes.number,
	size: PropTypes.string,
	placeholder: PropTypes.string,
	id: PropTypes.string,
	minDate: PropTypes.string,
	maxDate: PropTypes.string,
	disabled: PropTypes.bool,
	value: PropTypes.string,
	onChange: PropTypes.func,
	onFocus: PropTypes.func,
	onBlur: PropTypes.func,
};
export default function DatePicker({
   inputWidth = 0,
   size = 'md',
   placeholder = 'YYYY-MM-DD',
   id = '',
   minDate = '',
   maxDate = '',
   disabled = false,
   value = null,
   onChange = () => {},
   onFocus = () => {},
   onBlur = () => {},
}) {
	const inputRef = useRef(null);
	const calendarRef = useRef(null);
	const liveRef = useRef(null);
	const {isMobile} = useScreenSizeContext();

	const [dateValue, setDateValue] = useState(value || new Date())
	const [isCalendar, setIsCalendar] = useState(false);
	const [holidayList, setHolidayList] = useState([]);

	// 캘린더 밖으로 마우스 클릭시 캘린더 닫기
	useEffect(() => {
		const handleClickOutside = (e) => {
			if (calendarRef.current && !calendarRef.current.contains(e.target)) {
				setIsCalendar(false);
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	// 한국 공휴일 정보 업데이트
	useEffect(() => {
		const hd = new Holidays('KR'); // 국가코드 KR
		const holidayList = hd.getHolidays(2025); // 2025년 모든 공휴일 배열
		const holidaysKR = holidayList.map(h => h.date.split(' ')[0]); // 'YYYY-MM-DD' 형태
		setHolidayList(holidaysKR);
	}, [])

	useEffect(() => {
		// 모바일일때는 MoFilterContentHeight 이벤트 호출
		if(isMobile) {
			const eventMoFilterHeight = new CustomEvent('eventMoFilterHeight');
			window.dispatchEvent(eventMoFilterHeight);

			if(isCalendar) onFocus();
			else onBlur();
		}

		// 열릴 때 달력 내부로 포커스 이동
		if (isCalendar && calendarRef.current) {
			const focusable = calendarRef.current.querySelector('button, [href], [tabindex]:not([tabindex="-1"])');
			focusable?.focus();
		}

		// ESC 닫기
		const onKeyDown = (e) => {
			if (e.key === 'Escape') {
				setIsCalendar(false);
				inputRef.current?.focus();
			}
		};
		if (isCalendar) document.addEventListener('keydown', onKeyDown);
		return () => document.removeEventListener('keydown', onKeyDown);
	}, [isCalendar]);

	// 날짜 업데이트
	useEffect(() => {
		if(inputRef.current) {
			setDateValue(value);
			if(value !== null) {
                const selectedDate = moment(value).format('YYYY-MM-DD');
                inputRef.current.value = selectedDate;
			} else {
                inputRef.current.value = null;
			}
		}
	}, [value]);

	// 닫을 때 input 복귀
	const toggleCalendar = () => {
		if(disabled) return;
		setIsCalendar((v) => {
			const next = !v;
			if (next) inputRef.current?.focus();
			return next;
		});
	};

	// 선택완료
	const selectComplete = () => {
		if(disabled) return;
		if (inputRef.current) {
            const selectedDate = moment(dateValue).format('YYYY-MM-DD');
			liveRef.current && (liveRef.current.textContent = `선택된 날짜 ${selectedDate}`);
			inputRef.current.value = selectedDate;
			onChange(id, selectedDate);
			toggleCalendar();
		}
	}

	const stylesBySize = {
		sm: {
			height: 40,
			textSize: 'text-body-sm',
			padding: 'pl-12 pr-55',
			iconSize: 16,
		},
		md: {
			height: 48,
			textSize: 'text-body-md',
			padding: 'pl-16 pr-68',
			iconSize: 20,
		},
		lg: {
			height: 56,
			textSize: 'text-body-xl',
			padding: 'pl-20 pr-80',
			iconSize: 24,
		},
	};

	const stylesByStatus = {
		default: {
			input: `
	            text-dynamic-text-neutral-primary
	            bg-dynamic-bg-neutral-primary
	            hover:border-dynamic-border-brand-primary-subtle
	        `,
			iconColor: isCalendar ? 'text-dynamic-icon-brand-primary' : 'text-dynamic-icon-neutral-primary'
		},
		disabled: {
			input: 'bg-dynamic-bg-neutral-disabled text-dynamic-text-neutral-disabled cursor-not-allowed border-transparent',
			iconColor: 'text-dynamic-icon-neutral-disabled'
		}
	};

	return (
		<div className={'relative'}>
			<div
				role={disabled ? 'none' : 'dialog'}
				className={clsx('relative rounded-12', `h-[${stylesBySize[size].height}px]`)}
				onFocusCapture={toggleCalendar}
			>
				<input
					ref={inputRef}
					id={id}
					aria-label={'선택한 일자'}
					type={'text'}
					placeholder={placeholder}
					inputMode={"numeric"}
					pattern={`[0-9]{4}-[0-9]{2}-[0-9]{2}`}
					className={clsx(
						'h-full overflow-hidden border transition-colors duration-300 rounded-12',
						'text-ellipsis  whitespace-nowrap',
						'focus:outline-none',
						stylesBySize[size].textSize,
						stylesBySize[size].padding,
						disabled ? stylesByStatus['disabled'].input : stylesByStatus['default'].input,
						inputWidth > 0 ? `w-[${inputWidth}px]` : 'w-full',
						isCalendar ? 'border-dynamic-border-brand-primary-subtle' : 'border-dynamic-border-neutral-primary'
					)}
					readOnly
					onChange={() => {
						return;
					}}
				/>
				<div
					className={'absolute right-3 top-1/2 transform -translate-y-1/2 flex flex-row items-center gap-2 focus:outline-none'}
					role={'none'}
					onClick={() => {if(inputRef.current) inputRef.current.focus()}}
				>
					<CalendarSvg
						width={stylesBySize[size].iconSize}
						height={stylesBySize[size].iconSize}
						color={disabled ? stylesByStatus['disabled'].iconColor : stylesByStatus['default'].iconColor}
					/>
				</div>
			</div>
			{
				isMobile ? (
					<>
						<div className={clsx(
							     'fixed inset-x-0 bottom-0 z-50 w-full rounded-t-[32px] shadow-lg',
							     'bg-dynamic-bg-neutral-primary pt-40 px-20 pb-48',
							     'h-fit max-h-[80%]',
							     'transition-all duration-300 ease-out',
							     isCalendar ? 'translate-y-0' : 'translate-y-full',
							     'scrollbar-thin scrollbar-thumb-dynamic-border-neutral-secondary scrollbar-thumb-rounded-full scrollbar-track-transparent',
						     )}
						>
							<p className={'text-heading-xs text-dynamic-text-neutral-primary font-bold mb-36'}>
								{`${id === 'dateEnd' ? '종료일' : '시작일'}을 선택해 주세요`}
							</p>

							<RenderCalendar
								value={dateValue}
								setValue={setDateValue}
								holidayList={holidayList}
								toggleCalendar={toggleCalendar}
								selectComplete={selectComplete}
                                minDate={minDate}
								maxDate={maxDate}
							/>
						</div>
						<button
							onClick={toggleCalendar}
							className={clsx(
								'fixed top-0 left-0 w-full h-full z-10 bg-neutral-10 transition-opacity duration-300',
								isCalendar ? 'opacity-80 pointer-events-auto' : 'opacity-0 pointer-events-none'
							)}
							aria-label={"필터 닫기"}
						/>
					</>
				) : (
					<div
						ref={calendarRef}
						aria-modal={"true"}
						aria-label={"날짜 선택"}
						className={clsx(
							'w-[390px] px-28 py-32 rounded-16 absolute left-0 z-25 mt-10',
							'bg-dynamic-bg-neutral-base',
							isCalendar ? 'visible' : 'hidden'
						)}
						style={{boxShadow: '0px 1px 13px 0px rgba(0, 0, 0, 0.13)'}}
					>
						<RenderCalendar
							value={dateValue}
							setValue={setDateValue}
							holidayList={holidayList}
							toggleCalendar={toggleCalendar}
							selectComplete={selectComplete}
                            minDate={minDate}
							maxDate={maxDate}
						/>
					</div>
				)
			}
		</div>
	)
}


RenderCalendar.propTypes = {
	value: PropTypes.string,
	setValue: PropTypes.func,
	minDate: PropTypes.string,
	maxDate: PropTypes.string,
	holidayList: PropTypes.array,
	toggleCalendar: PropTypes.func,
	selectComplete: PropTypes.func,
	liveRef: PropTypes.any,
};
function RenderCalendar({value, setValue, minDate, maxDate, holidayList, toggleCalendar, selectComplete, liveRef}) {
	const {isMobile} = useScreenSizeContext();
	return (
		<>
			<Calendar
				value={value}
				locale={"ko-KR"}
				calendarType={'hebrew'}
				minDetail={'month'}
				maxDetail={'month'}
				next2Label={null}
				prev2Label={null}
				prevLabel={<ChevronLeft width={20} height={20} color={'text-dynamic-icon-neutral-tertiary'}/>}
				prevAriaLabel={'이전 월 달력 보기'}
				nextLabel={<ChevronRight width={20} height={20} color={'text-dynamic-icon-neutral-tertiary'}/>}
				nextAriaLabel={'다음 월 달력 보기'}
				formatMonthYear={(_, date) =>
					moment(date).format("YYYY.M")
				}
				formatShortWeekday={(locale, date) =>
					date.toLocaleDateString('ko-KR', {weekday: 'short'}).replace('요일', '')
				}
				formatDay={(locale, date) => moment(date).format("DD")}
				tileClassName={({date, view}) => {
					if (view !== 'month') return undefined;
					const dateStr = moment(date).format('YYYY-MM-DD');
					if (holidayList.includes(dateStr)) return 'rc-holiday';
					if (date.getDay() === 0) return 'rc-sun';
					if (date.getDay() === 6) return 'rc-sat';
					return undefined;
				}}
				minDate={minDate}
				maxDate={maxDate}
				onChange={(value, event) => {
					event.stopPropagation();
					setValue(value);
				}}
				onClickYear={() => {
					return;
				}}
			/>
			<div className={'flex-row-center justify-end gap-8 mt-20'}>
				{
					!isMobile && (
						<Button
							theme={'tertiary'}
							size={'sm'}
							text={'닫기'}
							ariaLabel={'달력 팝업 닫기'}
							customStyle={'w-fit'}
							onClick={toggleCalendar}
						/>
					)
				}
				<Button
					theme={'primary'}
					size={isMobile ? 'lg' : 'sm'}
					text={'선택 완료'}
					ariaLabel={'달력 팝업 닫기'}
					customStyle={isMobile ? 'w-full mt-36' : 'w-fit'}
					onClick={selectComplete}
				/>
				<div aria-live={"polite"} aria-atomic={"true"} className={"sr-only"} ref={liveRef}/>
			</div>
		</>
	)
}
