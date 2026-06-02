import React from 'react';
import PropTypes from "prop-types";

// components
import FindPwClient from "@/app/(ko)/find/pw/pageClient";


/**
 * @description: 비밀번호 찾기 화면 입니다.
 * @screenID:    UI-CRM-F206, UI-CRM-F207, UI-CRM-F416, UI-CRM-F417
 * @screenPath:  홈 > 비밀번호 찾기
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
FindPw.propTypes = {
	searchParams: PropTypes.object
};
export default async function FindPw({ searchParams }) {

	const params = await searchParams;
	const type = params.type || '';
	let clientVerifyId = type?.toUpperCase();

	return (
		<FindPwClient
			clientVerifyId={clientVerifyId}
			identityParams={params}
		/>
	)
}
