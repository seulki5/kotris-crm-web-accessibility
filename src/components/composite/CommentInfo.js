import React from 'react';
import PropTypes from 'prop-types';

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {fncOpenUri} from '@modules/utils/StringUtils';

// assets
import {AlertCircle} from '@assets/icons/Svgs';


/**
 * @description: 정보 주석 컴포넌트 입니다.
 * @screenID:    -
 * @screenPath:  -
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
CommentInfo.propTypes = {
	title: PropTypes.string,
	list: PropTypes.array,
};
export default function CommentInfo({title, list}) {
	
	const {isMobile} = useScreenSizeContext();
	
	return (
		<div className={'w-full flex flex-col gap-12 mo:gap-8'}>
			<div className={'flex-row-center gap-6'}>
				<AlertCircle
					width={isMobile ? 16 : 24}
					height={isMobile ? 16 : 24}
					color={'text-dynamic-icon-info-primary'}
				/>
				<p className={`
					text-body-2xl text-dynamic-text-neutral-primary font-medium
					mo:text-body-md
					mo:font-semibold
				`}>
					{title}
				</p>
			</div>
			<div className={'flex flex-col ml-4 gap-6 mo:gap-8'}>
				{
					list.map((li) => {
						let linkWord = li?.word;
						let splitSentence = [];
						if(li?.composite) {
							splitSentence = li.message.split(linkWord);
						}
						
						return (
							<div key={li.id}>
								<div className={'flex flex-row'}>
									<p className={`text-body-xl font-medium ${li.textColor} mo:text-body-sm mo:font-normal`}>
										{`\u00B7`}
									</p>
									{
										li.composite ? (
											<div className={'flex-row-center ml-3'}>
												<p className={`text-body-xl font-medium ml-3 ${li.textColor} whitespace-pre-wrap mo:text-body-sm mo:font-normal`}>
													{splitSentence[0]}
												</p>
												<button onClick={() => fncOpenUri(li.url)}
												        className={`
												        text-body-xl font-medium ml-3 text-dynamic-text-info-primary whitespace-pre-wrap underline
												        mo:text-body-sm mo:font-normal
												        mo:text-dynamic-text-neutral-secondary
												        mo:font-semibold
												        `}>
														{linkWord}
												</button>
												<p className={`text-body-xl font-medium ml-3 ${li.textColor} whitespace-pre-wrap mo:text-body-sm mo:font-normal`}>
													{splitSentence[1]}
												</p>
											</div>
										) : (
											<p className={`text-body-xl font-medium ml-3 ${li.textColor} whitespace-pre-wrap mo:text-body-sm mo:font-normal`}>
												{li.message}
											</p>
										)
									}
								</div>
								{
									li.subList && li.subList.map((sub, index) => (
										<p key={sub.id} className={`text-body-xl font-medium ml-6 ${li.textColor} whitespace-pre-wrap mo:text-body-sm mo:font-normal`}>
											{`${index + 1})`} {sub.message}
										</p>
									))
								}
							</div>
						);
					})
				}
			</div>
		</div>
	);
}
