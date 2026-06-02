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
 	 cntKey = '',
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

		// requestAnimationFrame(() => {
		// 	const el = slideRef.current[idx];
		// 	if(!el) return;
		//
		// 	el.scrollIntoView({
		// 		behavior: 'smooth',
		// 		block: 'nearest',
		// 		inline: 'center'
		// 	})
		// })
	}

	const fncCalcBottomPosition = () => {
		if(isAccApp && !checkMacOS) {
			return 'bottom-[6px]'
		} else {
			return 'bottom-[2px]'
		}
	}

	return (
		<div className={'w-full min-h-[50px] relative mb-32 mo:mb-12'}>
			<div className={clsx('absolute w-full h-[2px] bg-dynamic-border-neutral-primary z-0', fncCalcBottomPosition())} />
			<Swiper
				slidesPerView={'auto'}
				initialSlide={initial}
				spaceBetween={0}
				modules={[FreeMode, Scrollbar]}
				scrollbar={{draggable: true}}
				observer={true}
				observeParents={true}
				onSwiper={(swiper) => swiperRef.current = swiper}
			>
				{options.map((option, idx) => (
					<SwiperSlide
						key={option.id}
						className={'min-w-[60px] min-h-[47px]'}
						style={{width: 'auto'}}
					>
						<button
							className={clsx(
								'border-b-2 border-solid transform transition-colors duration-200',
								'text-body-lg font-semibold',
								isSelected === option.id ? 'text-dynamic-text-neutral-primary border-dynamic-border-neutral-inverse' : 'text-dynamic-text-neutral-secondary bg-transparent border-transparent',
								'hover:text-dynamic-text-neutral-primary',
								'py-12 px-16 mo:px-20',
							)}
							ref={(ref) => (slideRef.current[idx] = ref)}
							onClick={() => fncFocusSlide(option, idx)}
							onKeyDown={(e) => {
								if(e.key === 'Enter' || e.key === ' ') fncFocusSlide(option, idx)
							}}
						>
							{option.name}
							{/*{option.nick || option.name}*/}
							{/*{*/}
							{/*	// 총 갯수*/}
							{/*	cntKey && (*/}
							{/*		<span className={'text-dynamic-text-brand-primary'}>&nbsp;{option[cntKey] || 0}</span>*/}
							{/*	)*/}
							{/*}*/}
						</button>
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	);
}
