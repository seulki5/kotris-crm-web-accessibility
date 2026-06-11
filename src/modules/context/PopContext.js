"use client"

import React, {useState, useContext, useMemo, useCallback} from "react";
import PropTypes from "prop-types";

// modules
import {useScreenSizeContext} from "@modules/context/ScreenContext";

// components
import AlertPop from '@components/popup/AlertPop'

// const
const initPopProps = {
	active: false,
	mainText: '',
	description: '',
	bodyContents: null,
	customStyle: null,
	primaryText: '',
	onClickPrimary: () => {},
	secondaryText: '',
	onClickSecondary: () => {},
	tertiaryText: '',
	onClickTertiary: () => {},
	warningText: '',
	onClickWarning: () => {},
};
const PopContext = React.createContext();
PopProvider.propTypes = {
	children: PropTypes.any,
}

/**
 * @description:  전역으로 확인 버튼만 보이는 Alert 팝업을 관리하는 Context 입니다.
 */
export function PopProvider({ children }) {
	
	const {isMobile} = useScreenSizeContext();

	const [isPop, setIsPop] = useState(initPopProps);
	
	// 팝업 오픈
	const fncShowPop = useCallback((props) => {
		return setIsPop(prev => ({
			...prev,
			...props,
			active: true,
		}));
	}, [isPop]);

	// 팝업 닫기
	const fncClosePop = useCallback(() => {
		return setIsPop(initPopProps);
	}, []);

	// 공통 에러
	const fncErrorPop = useCallback(() => {
		return setIsPop({
			active: true,
			mainText: '예상하지 못한 오류가 발생했어요.',
			description: `일시적인 현상이거나 네트워크 문제일 수 있으니,\n잠시 후 다시 시도해주세요.`,
			primaryText: '확인',
			onClickPrimary: () => fncClosePop()
		});
	}, []);
	
	// provider props
	const obj = useMemo(() => (
		{ isPop, fncShowPop, fncClosePop, fncErrorPop }
	), [isPop, fncShowPop, fncClosePop, fncErrorPop]);
	
	return (
		<PopContext.Provider value={obj}>
			{children}
			{isPop.active && (
				<AlertPop
					screen={isMobile ? 'mobile' : 'desktop'}
					mainText={isPop.mainText}
					description={isPop.description}
					primaryText={isPop.primaryText}
					secondaryText={isPop.secondaryText}
					tertiaryText={isPop.tertiaryText}
					warningText={isPop.warningText}
					bodyContents={isPop.bodyContents}
					customStyle={isPop.customStyle}
					onClickPrimary={isPop.onClickPrimary}
					onClickSecondary={isPop.onClickSecondary}
					onClickTertiary={isPop.onClickTertiary}
					onClickWarning={isPop.onClickWarning}
				/>
			)}
		</PopContext.Provider>
	);
};

export const usePopContext = () => useContext(PopContext);
