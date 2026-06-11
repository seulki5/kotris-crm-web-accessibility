import React, {useEffect, useRef, useState} from 'react'
import PropTypes from 'prop-types';
import {FreeMode, Scrollbar} from 'swiper/modules';
import {Swiper, SwiperSlide} from 'swiper/react';
import clsx from 'clsx';
import {useWebContext} from "@modules/context/WebviewContext";


TabControl.propTypes = {
	options: PropTypes.array,
	isSelected: PropTypes.string,
	initial: PropTypes.number,
	cntKey: PropTypes.string,
	onChange: PropTypes.func.isRequired,
};
export default function TabControl({
     options = [],
	 isSelected = null,
	 initial = 0,
	 ariaLabel = null,
     onChange = () => {},
 }) {

	const swiperRef = useRef(null);
	const slideRef = useRef([]);
	const {isAccApp} = useWebContext();

	const [ua, setUa] = useState('');
	const checkMacOS = /iPhone|iPad|Mac|Macintosh/i.test(ua);

	useEffect(() => {
		if(typeof  navigator === 'undefined') {
			setUa('');
		} else {
			setUa(navigator.userAgent);
		}
	}, []);

	// 카드번호가 넘어올때 해당 탭 이동
	useEffect(() => {
		if(isSelected && options.length) {
			const idx = options.findIndex(el => el.id === isSelected);
			if(idx !== -1) fncFocusSlide(isSelected, idx, false);
		}
	}, [isSelected, options]);

	// 슬라이드 포커스
	const fncFocusSlide = (option, idx, update = true) => {
		const s = swiperRef.current;
		if(!s) return;

		s.slideTo(idx, 300);
		update && onChange(option.id);
	}

	return (
		<div className={'w-full min-h-[50px] relative mb-32 mo:mb-12 border-b-[2px] border-b-dynamic-border-neutral-primary px-2'}>
			<Swiper
				slidesPerView={'auto'}
				initialSlide={initial}
				spaceBetween={0}
				modules={[FreeMode, Scrollbar]}
				scrollbar={{draggable: true}}
				observer={true}
				observeParents={true}
				onSwiper={(swiper) => swiperRef.current = swiper}
				role={'tablist'}
				aria-label={ariaLabel || '카테고리 선택 메뉴'}
			>
				{options.map((option, idx) => {
					const isCurrentSlide = isSelected === option.id;
					return (
						<SwiperSlide
							key={option.id}
							className={clsx(
								'min-w-[60px] min-h-[47px] py-6 px-2 h-full relative',
								'border-b-2 border-solid transform transition-colors duration-200',
								isSelected === option.id ? 'text-dynamic-text-neutral-primary border-dynamic-border-neutral-inverse' : 'text-dynamic-text-neutral-secondary bg-transparent border-transparent',
							)}
							style={{width: 'auto'}}
							role={'presentation'}
						>
							<button
								type={'button'}
								role={'tab'}
								aria-selected={isCurrentSlide}
								className={clsx(
									'text-body-lg font-semibold',
									'hover:text-dynamic-text-neutral-primary',
									'py-6 px-16 mo:px-18',
								)}
								ref={(ref) => (slideRef.current[idx] = ref)}
								onClick={() => fncFocusSlide(option, idx)}
								onKeyDown={(e) => {
									if(e.key === 'Enter' || e.key === ' ') {
										e.preventDefault();
										fncFocusSlide(option, idx);
									}
								}}
							>
								{option.name}
							</button>
						</SwiperSlide>
					)}
				)}
			</Swiper>
		</div>
	);
}
