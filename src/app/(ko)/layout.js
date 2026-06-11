import React from "react";
import {cookies} from 'next/headers';
import PropTypes from "prop-types";

// components
import KoRootPage from "@/app/(ko)/page";
import Header from "@components/layout/Header";
import Footer from "@components/layout/Footer";


/**
 * @description: KoRootLayout 입니다.
 * @screenID:    -
 * @screenPath:  -
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
KoRootLayout.propTypes = {
	children: PropTypes.any,
}
export default async function KoRootLayout({children}) {

	const cookieStore = await cookies();
	const cookieViewport = cookieStore.get('crm-viewport')?.value || null;
	const cookiePathname = cookieStore.get('pathname')?.value || null;
	const mobileMinHeight = ['/mcert/pin', '/mcert/zpy'].includes(cookiePathname) ? 'mo:min-h-full' : 'mo:min-h-[calc(100dvh-51px)]';

	return (
		<>
			{
				!['/mcert/pin', '/mcert/zpy'].includes(cookiePathname) && (
					<Header currentLocale={"ko"} cookieViewport={cookieViewport} />
				)
			}
			<div className={`flex-1 flex flex-col items-center min-h-[calc(100dvh-90px-234px)] ${mobileMinHeight} mo:bg-[env(safe-area-inset-bottom)]`}>
				<KoRootPage children={children} />
			</div>
			<Footer/>
	    </>
	);
}
