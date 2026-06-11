import React from 'react';
import PropTypes from "prop-types";

// modules
import {ageOptions} from "@modules/consants/Options";

// components
import CertClient from "@/app/(ko)/cert/pageClient";


/**
 * @description: 본인인증 화면 입니다.
 * @screenID:    -
 * @screenPath:  홈 > 본인인증
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by S  Traffic co.,Ltd. All right reserved.
 */
Cert.propTypes = {
	searchParams: PropTypes.object
};
export default async function Cert({ searchParams }) {

	const params = await searchParams;
	const status = params.status || '';
	const type = params.type || '';
	let clientVerifyId = type?.toUpperCase();
	let clientStep = 0;
	if(
		[
			ageOptions[0].id?.toUpperCase(),
			ageOptions[0].id?.toLowerCase(),
			ageOptions[1].id?.toUpperCase(),
			ageOptions[1].id?.toLowerCase(),
		].includes(type)
	) {
		clientStep = 1;
	}

	return (
		<CertClient
			clientStep={clientStep}
			clientVerifyId={clientVerifyId}
			identityParams={params}
		/>
	)
}