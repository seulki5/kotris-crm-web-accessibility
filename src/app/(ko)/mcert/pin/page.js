import React from 'react';
import PropTypes from "prop-types";

// components
import MobilePinCertClient from "@/app/(ko)/mcert/pin/pageClient";


/**
 * @description: 앱 본인인증 화면 입니다.
 * @screenID:    -
 * @screenPath:  -
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by S  Traffic co.,Ltd. All right reserved.
 */
MobilePinCert.propTypes = {
	searchParams: PropTypes.object
};
export default async function MobilePinCert({ searchParams }) {

	const params = await searchParams;
	const status = params.status || '';
	const type = params.type || '';
	let clientVerifyId = type?.toUpperCase();

	return (
		<MobilePinCertClient
			clientVerifyId={clientVerifyId}
			identityParams={params}
		/>
	)
}