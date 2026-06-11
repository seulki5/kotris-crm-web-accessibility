'use client';

import React from 'react';
import PropTypes from "prop-types";
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// modules
import {RefundReasonOptions} from "@modules/consants/Options";
import {fncMaskCardNo, fncMaskContactNo} from "@modules/utils/StringUtils";

// const
if (typeof window !== 'undefined') {
    Font.register({
        family: 'Pretendard',
        fonts: [
            {src: `${window.location.origin}/form/Pretendard-Medium.ttf`, fontWeight: 500},
            {src: `${window.location.origin}/form/Pretendard-SemiBold.ttf`, fontWeight: 600},
        ],
        format: 'truetype'
    })
}
const A4 = { width: 595.28, height: 841.89 };
const styles = StyleSheet.create({
    page: {
        backgroundColor: '#FFF',
        fontFamily: Font.getRegisteredFontFamilies().includes('Pretendard') ? 'Pretendard' : 'Helvetica',
        fontWeight: 500,
        paddingVertical: 40,
        paddingHorizontal: 44,
        fontSize: 12,
    },
    title: {
        fontWeight: 600,
        fontSize: 24,
    },
    tableWrap: {
        wirowKeyViewh: '100%',
        borderTopWidth: 2,
        borderTopStyle: 'solid',
        borderTopColor: '#00A867',
        borderBottomWidth: 2,
        borderBottomStyle: 'solid',
        borderBottomColor: '#00A867',
        marginTop: 36
    },
    rowWrap: {
        display: 'flex',
        flexDirection: 'row',
    },
    rowKeyView: {
        width: 200,
        height: '100%',
        backgroundColor: '#EEFCF3',
        paddingVertical: 6,
        paddingHorizontal: 16,
        alignSelf: 'flex-start',
    },
    rowValueView: {
        width: '100%',
        paddingVertical: 6,
        paddingHorizontal: 16,
        display: 'flex',
        flexWrap: 'wrap',
    },
    rowBottomBorder: {
        borderBottomWidth: 1,
        borderBottomStyle: 'solid',
        borderBottomColor: '#EEFCF3'
    },
    rowKeyText: {
        fontWeight: 500,
        color: '#6F7781'
    },
    rowValueText: {
        fontWeight: 500,
        color: '#212327'
    }
})


/**
 * @description: [환불]환불신청서 PDF 생성 컴포넌트 입니다.
 * @screenID:    -
 * @screenPath:  홈 > 마이페이지 > 환불신청
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
PDFRefundForm.propTypes = {
    form: PropTypes.object
};
export default function PDFRefundForm({form}) {

    // 반환 사유 옵션
    const demandInfo = RefundReasonOptions.filter((el) => el.id === form.rfndDmndCd)?.[0] || {};

    return (
        <Document>
            <Page
                size={{ width: A4.width, height: A4.height }}
                style={styles.page}
                wrap={true}
            >
                <Text style={styles.title}>신청정보</Text>

                <View style={styles.tableWrap}>
                    <View style={styles.rowWrap}>
                        <View style={[styles.rowKeyView, styles.rowBottomBorder]}>
                            <Text style={styles.rowKeyText}>카드번호</Text>
                        </View>
                        <View style={[styles.rowValueView, styles.rowBottomBorder]}>
                            <Text style={styles.rowValueText}>{fncMaskCardNo(form.cardNoEncpt)}</Text>
                        </View>
                    </View>
                    <View style={styles.rowWrap}>
                        <View style={[styles.rowKeyView, styles.rowBottomBorder]}>
                            <Text style={styles.rowKeyText}>환불 받을 은행</Text>
                        </View>
                        <View style={[styles.rowValueView, styles.rowBottomBorder]}>
                            <Text style={styles.rowValueText}>{form.micBankNm}</Text>
                        </View>
                    </View>
                    <View style={styles.rowWrap}>
                        <View style={[styles.rowKeyView, styles.rowBottomBorder]}>
                            <Text style={styles.rowKeyText}>예금주</Text>
                        </View>
                        <View style={[styles.rowValueView, styles.rowBottomBorder]}>
                            <Text style={styles.rowValueText}>{form.bacntOwnrNm}</Text>
                        </View>
                    </View>
                    <View style={styles.rowWrap}>
                        <View style={[styles.rowKeyView, styles.rowBottomBorder]}>
                            <Text style={styles.rowKeyText}>계좌번호</Text>
                        </View>
                        <View style={[styles.rowValueView, styles.rowBottomBorder]}>
                            <Text style={styles.rowValueText}>{form.dpstActnoEncpt}</Text>
                        </View>
                    </View>
                    <View style={styles.rowWrap}>
                        <View style={[styles.rowKeyView, styles.rowBottomBorder]}>
                            <Text style={styles.rowKeyText}>핸드폰번호</Text>
                        </View>
                        <View style={[styles.rowValueView, styles.rowBottomBorder]}>
                            <Text style={styles.rowValueText}>{fncMaskContactNo(form.rqstrTelno)}</Text>
                        </View>
                    </View>
                    <View style={styles.rowWrap}>
                        <View style={[styles.rowKeyView, styles.rowBottomBorder]}>
                            <Text style={styles.rowKeyText}>반환사유</Text>
                        </View>
                        <View style={styles.rowValueView}>
                            <Text style={styles.rowValueText}>{`(${demandInfo?.name}) ${form.rfndDmndCn}`}</Text>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
}
