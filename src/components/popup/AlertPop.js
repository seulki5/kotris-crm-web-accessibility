import React from 'react';
import PropTypes from 'prop-types';
import {FocusTrap} from "focus-trap-react";

// component
import Button from '@components//common/Button';

// svg
import { Trash } from '@assets/icons/Svgs';


/**
 * @description: alert 컴포넌트 입니다.
 * @screenID:    -
 * @screenPath:  -
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
AlertPop.propTypes = {
    screen: PropTypes.string, // desktop, mobile
    mainText: PropTypes.string,
    description: PropTypes.string,
    bodyContents: PropTypes.any,
    tertiaryText: PropTypes.string,
    primaryText: PropTypes.string,
    secondaryText: PropTypes.string,
    warningText: PropTypes.string,
    customStyle: PropTypes.string,
    onClickTertiary: PropTypes.func,
    onClickPrimary: PropTypes.func,
    onClickSecondary: PropTypes.func,
    onClickWarning: PropTypes.func,
};
export default function AlertPop({
    screen = 'desktop',
    mainText = '',
    description = '',
    bodyContents = null,
    tertiaryText = '',
    primaryText = '',
    secondaryText = '',
    warningText = '',
    customStyle = '',
    onClickTertiary = () => { },
    onClickPrimary = () => { },
    onClickSecondary = () => {},
    onClickWarning = () => { },
}) {
    const sizesByScreen = {
        desktop: {
            width: 'min-w-[400px] max-w-[400px]',
            padding: 'p-28'
        },
        mobile: {
            width: 'min-w-[300px] max-w-[90vw] w-full',
            padding: 'p-20'
        }
    }

    return (
        <FocusTrap
            active={true}
            focusTrapOptions={{
                escapeDeactivates: true,
                clickOutsideDeactivates: true,
                initialFocus: '#popup-title',
                returnFocusOnDeactivate: true,
            }}
        >
            <div className={'popup-bg-opacity'}>
                <div
                    role={'dialog'}
                    aria-modal={true}
                    aria-labelledby={'popup-title'}
                    className={`${sizesByScreen[screen].width} ${sizesByScreen[screen].padding} popup-float-wrap`}
                >
                    <div className={'min-h-[54px] mb-24 flex flex-col justify-center'}>
                        <p
                            className={'text-body-2xl text-dynamic-text-neutral-primary font-medium whitespace-pre-line'}
                            id={'popup-title'}
                            tabIndex={-1}
                        >
                            {mainText}
                        </p>
                        <div className={`
                            mt-8 text-body-lg font-light whitespace-pre-line
                            ${ warningText ? 'text-dynamic-text-negative-primary' : 'text-dynamic-text-neutral-secondary'}
                        `}>
                            {description}
                            {bodyContents}
                        </div>
                    </div>
                    <div className={`flex ${screen === 'desktop' && 'justify-end'} gap-8`}>
                        {tertiaryText && (
                            <Button
                                size={'md'}
                                theme={'tertiary'}
                                text={tertiaryText}
                                onClick={onClickTertiary}
                                ariaLabel={tertiaryText}
                                customStyle={screen === 'mobile' && 'flex-1'}
                            />
                        )}
                        {secondaryText && (
                            <Button
                                size={'md'}
                                theme={'secondary'}
                                text={secondaryText}
                                onClick={onClickSecondary}
                                ariaLabel={secondaryText}
                                customStyle={screen === 'mobile' && 'flex-1'}
                            />
                        )}
                        {warningText && warningText.includes('삭제') && (
                            <Button
                                size={'md'}
                                theme={'primary'}
                                text={warningText}
                                ariaLabel={warningText}
                                icon={<Trash />}
                                iconPosition={'left'}
                                customStyle={`bg-dynamic-bg-negative-primary-bold hover:bg-dynamic-bg-negative-primary ${screen === 'mobile' && 'flex-1'}`}
                                onClick={onClickWarning}
                            />
                        )}
                        {warningText && !warningText.includes('삭제') && (
                            <Button
                                size={'md'}
                                theme={'primary'}
                                text={warningText}
                                ariaLabel={warningText}
                                customStyle={`bg-dynamic-bg-negative-primary hover:bg-dynamic-bg-negative-primary-bold ${screen === 'mobile' && 'flex-1'}`}
                                onClick={onClickWarning}
                            />
                        )}
                        {primaryText && (
                            <Button
                                size={'md'}
                                theme={'primary'}
                                text={primaryText}
                                ariaLabel={primaryText}
                                onClick={onClickPrimary}
                                customStyle={`${screen === 'mobile' && 'flex-1'} ${customStyle}`}
                            />
                        )}
                    </div>
                </div>
            </div>
        </FocusTrap>
    )
}
