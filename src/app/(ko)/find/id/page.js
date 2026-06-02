import React from 'react';
import PropTypes from "prop-types";

// components
import FindIdClient from "@/app/(ko)/find/id/pageClient";


/**
 * @description: 아이디 찾기 화면 입니다.
 * @screenID:    UI-CRM-F205, UI-CRM-F414, UI-CRM-F415
 * @screenPath:  홈 > 아이디 찾기
 * @author
 * @since
 * @version
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
FindId.propTypes = {
	searchParams: PropTypes.object
};
export default async function FindId({ searchParams }) {

	const params = await searchParams;
	const type = params.type || '';
	let clientVerifyId = type?.toUpperCase();

	return (
		<FindIdClient
			clientVerifyId={clientVerifyId}
			identityParams={params}
		/>
	)
}