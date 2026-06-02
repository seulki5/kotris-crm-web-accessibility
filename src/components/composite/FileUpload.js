import React, {useLayoutEffect, useRef, useState} from 'react';
import {useMutation} from "@tanstack/react-query";
import PropTypes from "prop-types";

// modules
import {usePopContext} from "@modules/context/PopContext";
import {useScreenSizeContext} from "@modules/context/ScreenContext";
import {apiUploadFile} from "@/app/_actions/common.action";
import {useApi} from "@modules/services/useApi";
import {useWebContext} from "@modules/context/WebviewContext";

// components
import FieldTitle from "@components/composite/FieldTitle";
import Button from "@components/common/Button";

// assets
import {Upload, XCircleFill} from "@assets/icons/Svgs";

// const
const MAX_SIZE = 20 * 1024 * 1024;


/**
 * @description: 파일 업로드 컴포넌트 입니다.
 * @screenID:    -
 * @screenPath:  -
 * @author       $Author
 * @since        $Date
 * @version      $Revision
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
FileUpload.propTypes = {
	size: PropTypes.string,
	fileArr: PropTypes.array,
	comments: PropTypes.array,
	onUpdate: PropTypes.func,
};
export default function FileUpload({
	size = 'lg',
	fileArr = [],
	comments = [],
	onUpdate = () => {}
}) {
	
	const fileRef = useRef(null);
	const {isMobile} = useScreenSizeContext();
	const {fncShowPop, fncClosePop} = usePopContext();
	const {fileApiAction} = useApi();
	const {isAccApp, fncPostRN, storeRNPayload} = useWebContext();

	const [files, setFiles] = useState([]);
	const [uploaded, setUploaded] = useState([]);

	const {mutate: mutUploadFile} = useMutation({
		mutationKey: ['mutUploadFile'],
		mutationFn: (payload) => fileApiAction(apiUploadFile, payload, true),
		onSuccess: (data) => {
			setUploaded(prev => [...prev, data]);
		},
		onError: (err) => {
			fncShowPop({
				mainText: '파일 업로드 중 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.',
				primaryText: '확인',
				onClickPrimary: () => fncClosePop(),
			})
		}
	})

	useLayoutEffect(() => {
		if(uploaded.length < 1 && fileArr.length) {
			setUploaded(fileArr)
		}
	}, [fileArr])
	
	useLayoutEffect(() => {
		uploaded && onUpdate(uploaded);
	}, [uploaded])

	useLayoutEffect(() => {
		if(isAccApp && storeRNPayload?.uploadFile) {
			let update = [...uploaded];
			update.push(storeRNPayload?.uploadFile)
			setUploaded(update)
		}
	}, [storeRNPayload]);

	// 파일 선택창 열기
	const fncOpenSelector = () => {
		if(uploaded.length >= 2) {
			return fncShowPop({
				mainText: '최대 2개까지 첨부 가능합니다.',
				primaryText: '확인',
				onClickPrimary: () => fncClosePop(),
			})
		}

		if(isAccApp) {
			fncPostRN({
				id: 'WEB_FILE_UPLOAD',
				payload: {}
			})
 		} else {
			fileRef.current?.click();
		}
	}

	// 파일 선택
	const fncFileChange = async (e) => {
		if(e.target.files){
			const selected = Array.from(e.target.files);
			if(uploaded.length + selected?.length > 2) {
				return fncShowPop({
					mainText: '최대 2개까지 첨부 가능합니다.',
					primaryText: '확인',
					onClickPrimary: () => fncClosePop(),
				})
			}

			for (const file of selected) {
				if(file.size > MAX_SIZE) {
					return fncShowPop({
						mainText: '파일 최대 용량은 20MB 입니다.',
						primaryText: '확인',
						onClickPrimary: () => fncClosePop(),
					})
				}
			}

			const clone = [...files, ...selected];
			setFiles(files);
			clone.forEach(file => {
				const formFiles = new FormData();
				formFiles.append('file', file);
				mutUploadFile(formFiles);
			});

			// 초기화
			e.target.value = null;
		}
	}

	// 파일 삭제
	const fncDelFile = (file) => {
		const clone = uploaded.filter(el => el.atchFileId !== file.atchFileId) || [];
		setUploaded(clone);
	}

	return (
		<>
			<fieldset role={'group'} aria-label={'첨부파일 업로드'}>
				<FieldTitle title={'첨부파일'} essential={true} />
				<input
					type={'file'}
					ref={fileRef}
					multiple
					accept={'.hwp,.pdf,.png,.jpg'}
					style={{display: 'none'}}
					onChange={fncFileChange}
				/>
				<Button
					theme={'secondary'}
					size={size ? size : isMobile ? 'md' : 'lg'}
					text={'첨부파일 업로드'}
					ariaLabel={'파일 업로드'}
					icon={<Upload />}
					iconPosition={'right'}
					customStyle={isMobile ? 'w-full' : 'w-auto'}
					disabled={uploaded.length >= 2}
					onClick={fncOpenSelector}
				/>
				<div className={'mt-12 flex-col-start gap-6 mo:gap-8'}>
					{
						comments?.map((comment) => (
							<p className={'file-size'} key={comment}>
								{`\u00B7`} {comment}
							</p>
						))
					}
					<p className={'file-size'}>
						{`\u00B7`} 최대 20MB 이내 2개까지 첨부 가능하며, .hwp .pdf .png .jpg 형식만 업로드 가능합니다.
					</p>
				</div>
			</fieldset>
			{
				uploaded.length > 0 && (
					<>
						<div className={'divider'} />
						<fieldset
							className={'attachment-wrap'}
							role={'group'}
							aria-label={'첨부된 파일 목록'}
							style={{flexDirection: 'column'}}
						>
							<p>
								{`첨부한 파일 (${uploaded.length}개)`}
							</p>
							<div className={'flex-row-center gap-8 mo:flex-col mo:justify-center mo:items-start'}>
								{
									uploaded.map((file) => (
										<div key={file.atchFileId}>
											<span>{file.atchFileNm}</span>
											<span>{`${(file.atchFileSz / (1024 * 1024)).toFixed(1) || 0}MB`}</span>
											<button
												aria-label={'첨부된 파일 삭제'}
												onClick={() => fncDelFile(file)}
												onKeyDown={(e) => {
													if(e.key === 'Enter' || e.key == ' ') {
														fncDelFile(file)
													}
												}}
											>
												<XCircleFill
													width={18} height={18}
													color={'text-dynamic-icon-neutral-disabled'}
												/>
											</button>
										</div>
									))
								}
							</div>
						</fieldset>
					</>
				)
			}
		</>
	)
}
