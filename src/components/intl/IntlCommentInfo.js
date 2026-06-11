import React from 'react';
import PropTypes from 'prop-types';
import {useLocale} from 'next-intl';
import clsx from 'clsx';

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {fncOpenUri} from '@modules/utils/StringUtils';

// assets
import {AlertCircle} from '@assets/icons/Svgs';
import {
	FontBody2xlClasses,
	FontBodyMdClasses,
	FontBodySmClasses,
	FontBodyXlClasses
} from '@/styles/intlFontSizeClasses';


/**
 * @description: 정보 주석 컴포넌트(다국어) 입니다.
 * @screenID:    -
 * @screenPath:  -
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
IntlCommentInfo.propTypes = {
	title: PropTypes.string,
	list: PropTypes.array,
};
export default function IntlCommentInfo({title, list}) {
	
	const {isMobile} = useScreenSizeContext();
	const locale = useLocale();
	
	return (
		<div className={'w-full flex flex-col gap-12 mo:gap-8'}>
			<div className={'flex-row-center gap-6'}>
				<AlertCircle
					width={isMobile ? 16 : 24}
					height={isMobile ? 16 : 24}
					color={'text-dynamic-icon-info-primary'}
				/>
				<p className={clsx(
					'text-dynamic-text-neutral-primary font-medium',
					'mo:font-semibold',
					isMobile ? FontBodyMdClasses[locale] : FontBody2xlClasses[locale]
				)}>
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
									<p className={clsx(
										'font-medium mo:font-normal',
										li.textColor,
										isMobile ? FontBodySmClasses[locale] : FontBodyXlClasses[locale])
									}>
										{`\u00B7`}
									</p>
									{
										li.composite ? (
											<div className={'flex-row-center ml-3'}>
												<p className={clsx(
													'ml-3 whitespace-pre-wrap font-medium mo:font-normal',
													li.textColor,
													isMobile ? FontBodySmClasses[locale] : FontBodyXlClasses[locale]
												)}>
													{splitSentence[0]}
												</p>
												<button onClick={() => fncOpenUri(li.url)}
												        className={clsx(
															'ml-3 whitespace-pre-wrap underline',
															'font-medium mo:font-semibold',
													        'text-dynamic-text-info-primary mo:text-dynamic-text-neutral-secondary',
													        isMobile ? FontBodySmClasses[locale] : FontBodyXlClasses[locale]
												        )}>
														{linkWord}
												</button>
												<p className={clsx(
													'ml-3 whitespace-pre-wrap font-medium mo:font-normal',
													li.textColor,
													isMobile ? FontBodySmClasses[locale] : FontBodyXlClasses[locale]
												)}>
													{splitSentence[1]}
												</p>
											</div>
										) : (
											<p className={clsx(
												'ml-3 whitespace-pre-wrap font-medium mo:font-normal',
												li.textColor,
												isMobile ? FontBodySmClasses[locale] : FontBodyXlClasses[locale]
											)}>
												{li.message}
											</p>
										)
									}
								</div>
								{
									li.subList && li.subList.map((sub, index) => (
										<p key={sub.id} className={clsx(
											'ml-3 whitespace-pre-wrap font-medium mo:font-normal',
											li.textColor,
											isMobile ? FontBodySmClasses[locale] : FontBodyXlClasses[locale]
										)}>
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
