'use client'

import React, {useState, useContext, useMemo} from 'react';

const MoHeaderContext = React.createContext();
export const MoHeaderProvider = ({ children }) => {
	
	const [headerType, setHeaderType] = useState('main');  //back, main, none, sitemap, close
	const [headerTitle, setHeaderTitle] = useState(null);

	// 모바일 헤더 정보 변경
	const fncChangeMoHeader = ({type = 'back', title = ''}) => {
		setHeaderType(type);
		setHeaderTitle(title);
	};
	
	// provider props
	const obj = useMemo(() => (
		{ headerType, headerTitle, fncChangeMoHeader }
	), [headerType, headerTitle]);
	
	return (
		<MoHeaderContext.Provider value={obj}>
			{children}
		</MoHeaderContext.Provider>
	);
};

export const useMoHeaderContext = () => useContext(MoHeaderContext);
