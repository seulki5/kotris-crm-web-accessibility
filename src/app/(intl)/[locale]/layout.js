import React from 'react'
import {NextIntlClientProvider} from 'next-intl';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import PropTypes from "prop-types";

// components
import IntlHeader from "@components/intl/IntlHeader";
import IntlFooter from "@components/intl/IntlFooter";
import IntlPage from "@/app/(intl)/[locale]/page";

// metadata 글로벌 언어 적용(en, ja, zh)
export async function generateMetadata({params}) {
	const {locale} = await params;
	const t = await getTranslations({locale, namespace: 'metadata'});
	
	return {
		title: t('title')
	};
}


/**
 * @description: 글로벌 언어 적용 화면(en, ja, zh) Layout 영역입니다.
 * @screenID:    -
 * @screenPath:  -
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
IntlLayout.propTypes = {
	children: PropTypes.any,
	params: PropTypes.object,
};
export default async function IntlLayout({ children, params }) {
	
	const { locale } = await params;
	setRequestLocale(locale) // 서버측 로케일 설정
	
	return (
		<NextIntlClientProvider>
			<IntlHeader />
			<div lang={locale} className={'w-full'}>
				<IntlPage children={children}/>
				{/*{children}*/}
				<IntlFooter />
			</div>
		</NextIntlClientProvider>
	)
}
