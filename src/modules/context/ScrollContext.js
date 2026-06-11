'use client'

import {createContext, useContext, useState, useEffect, useRef, useMemo} from 'react';

const ScrollContext = createContext(0);

export function ScrollProvider({ children }) {
	
	const containerRef = useRef(null);
	
	const [scrollY, setScrollY] = useState(0);
	
	// 스크롤 위치
	useEffect(() => {
		const el = containerRef.current
		if (!el) return
		
		const onScroll = () => {
			setScrollY(el.scrollTop)
		}
		el.addEventListener('scroll', onScroll)
		return () => el.removeEventListener('scroll', onScroll)
	}, [])
	
	// 스크롤 위로 올리기
	const fncScrollToTop = () => {
		containerRef.current && containerRef.current.scrollTo({top: 0, behavior: 'smooth'});
	}
	
	// provider props
	const obj = useMemo(() => (
		{scrollY, fncScrollToTop}
	), [scrollY]);
	
	return (
		<ScrollContext.Provider value={obj}>
			<div ref={containerRef} className='w-full h-[100dvh] overflow-y-auto'>
				{children}
			</div>
		</ScrollContext.Provider>
	)
}
export const useScrollContext = () => useContext(ScrollContext)

