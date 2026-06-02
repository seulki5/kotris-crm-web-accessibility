'use client';

import React from 'react';
import PropTypes from "prop-types";
import {useMutation} from "@tanstack/react-query";

// modules
import {useApi} from "@modules/services/useApi";
import {apiDownloadFile} from "@/app/_actions/common.action";
import {useScreenSizeContext} from "@modules/context/ScreenContext";
import {useWebContext} from "@modules/context/WebviewContext";

// components
import Button from "@components/common/Button";

// assets
import {Download} from "@assets/icons/Svgs";
import Cookies from "js-cookie";


/**
 * @description: 파일 다운로드 컴포넌트 입니다.
 * @screenID:    -
 * @screenPath:  -
 * @author       $Author
 * @since        $Date
 * @version      $Revision
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
FileDownload.propTypes = {
	type: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	fileId: PropTypes.string,
	fileName: PropTypes.string,
	size: PropTypes.string,
	customStyle: PropTypes.string,
	onDownload: PropTypes.func,
};
export default function FileDownload({
	type = 'button', // or attached or text
	name = '',
	fileId = '',
	fileName = '',
	size = 'lg',
	buttonTheme = 'secondary',
	customStyle = '',
	onDownload = () => {}
}) {

	const {fileApiAction} = useApi();
	const {isMobile} = useScreenSizeContext()
	const {isAccApp, fncPostRN} = useWebContext();
	const iconSize = isMobile ? 20 : 16;
	const cookieViewport = Cookies.get('crm-viewport')?.value || null;


	// -- Api
	// 파일 다운로드
	const {mutate: mutDownloadFile} = useMutation({
		mutationKey: ['mutDownloadFile'],
		mutationFn: (fileId) => fileApiAction(apiDownloadFile, fileId),
		enabled: fileId,
		onSuccess: (res) => {
			const url = window.URL.createObjectURL(res.blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = res.filename || 'file';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);
		}
	})

	// 다운로드
	const fncDownload = () => {
		if(fileId) {
			if(isAccApp || cookieViewport === 'mobile') {
				fncPostRN({
					id: 'WEB_FILE_DOWNLOAD',
					payload: {
						fileId: fileId,
						name: fileName
					}
				})
			} else {
				mutDownloadFile(fileId);
			}
		}
		else onDownload();
	}

	if(type === 'attached') {
		return (
			<button
				type={'button'}
				className={'attachment-item'}
				aria-label={name}
				onClick={fncDownload}
				onKeyDown={(e) => {
					if (e.key === 'Enter') fncDownload();
				}}
			>
				{name}
				<Download
					width={iconSize} height={iconSize}
					color={'text-dynamic-icon-neutral-primary'}
				/>
			</button>
		)
	} else if(type === 'text') {
		return  (
			<button
				type={'button'}
				className={'attachment-text'}
				aria-label={name}
				onClick={fncDownload}
				onKeyDown={(e) => {
					if(e.key === 'Enter') fncDownload();
				}}
			>
				{name}
			</button>
		)
	} else {
		return (
			<Button
				theme={buttonTheme}
				size={size ? size : isMobile ? 'md' : 'lg'}
				text={name}
				ariaLabel={name}
				icon={<Download />}
				iconPosition={'right'}
				customStyle={customStyle ? customStyle : isMobile ? 'w-full' : 'w-auto'}
				onClick={fncDownload}
			/>
		)
	}
}
