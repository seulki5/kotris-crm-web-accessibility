"use client";

import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import {useLocale, useTranslations} from "next-intl";

// assets
import { ChevronRight } from "@assets/icons/Svgs";
import {FontLabelLgClasses} from "@/styles/intlFontSizeClasses";


/**
 * @description: 다국어 공통 Breadcrumb 입니다.
 * @screenID:    -
 * @screenPath:  -
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
IntlBreadcrumb.propTypes = {
    addPaths: PropTypes.array
};
export default function IntlBreadcrumb({paths}) {

    const locale = useLocale();
    const t = useTranslations();

    return (
        <section className={'w-full h-[24px] flex flex-wrap mb-48'} aria-labelledby={'breadcrumbs-section'}>
            <p className={'sr-only'} id={'breadcrumbs-section'}>
                {t('BREADCRUMB.BREADCRUMB')}
            </p>
            <span
                id={'breadcrumbs-section'}
                className={'sr-only'}
            >
				{`${t('BREADCRUMB.BREADCRUMB')} ${paths?.map((path) => `${path}.`)}`}
			</span>
            {
                paths?.map((path, index) => {
                    return (
                        <div
                            key={path}
                            className={clsx('flex-row-center text-dynamic-text-neutral-secondary', FontLabelLgClasses[locale])}
                            aria-hidden={true}
                        >
                            {
                                index > 0 && (
                                    <ChevronRight
                                        width={20} height={20}
                                        color={'text-dynamic-border-neutral-tertiary'}
                                    />
                                )
                            }
                            <p>{path}</p>
                        </div>
                    );
                })
            }
        </section>
    );
}
