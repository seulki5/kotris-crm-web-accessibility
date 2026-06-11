import React from 'react';
import PropTypes from "prop-types";

// modules
import {ageOptions} from "@modules/consants/Options";

// components
import JoinClient from "@/app/(ko)/join/pageClient";


/**
 * @description: 회원가입 화면 입니다.
 * @screenID:    UI-CRM-F201 ~ UI-CRM-F204, UI-CRM-F408 ~ UI-CRM-F413
 * @screenPath:  홈 > 회원가입
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by S  Traffic co.,Ltd. All right reserved.
 */
Join.propTypes = {
	searchParams: PropTypes.object
};
export default async function Join({ searchParams }) {

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
		<JoinClient
			clientStep={clientStep}
			clientVerifyId={clientVerifyId}
			identityParams={params}
		/>
	)
}