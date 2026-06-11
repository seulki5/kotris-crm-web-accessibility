'use client';

import React from 'react';
import PropTypes from "prop-types";
import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';

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
const IMAGE = { width: 1478, height: 776 }
const PADDING = 25;
const styles = StyleSheet.create({
    page: {
        backgroundColor: '#FFF',
        position: 'relative',
        padding: PADDING,
        fontFamily: Font.getRegisteredFontFamilies().includes('Pretendard') ? 'Pretendard' : 'Helvetica',
        fontWeight: 500,
        color: '#212327',
        fontSize: 12,
    },
    envelope: {
        position: 'absolute',
        left: PADDING,
        top: PADDING,
        objectFit: 'contain',
        width: A4.width - (PADDING*2),
        height: ((A4.width - (PADDING*2)) / IMAGE.width) * IMAGE.height,
    },
    sender: {
        marginTop: PADDING,
        marginLeft: PADDING + 2
    },
    address01: {
        marginTop: 20,
        marginBottom: 5
    },
    address02: {
        marginBottom: 12
    },
    postNumber: {
        letterSpacing: 9,
        marginLeft: 4
    },
})


/**
 * @description: [환불]우편 환불 봉투 PDF 생성 컴포넌트 입니다.
 * @screenID:    -
 * @screenPath:  홈 > 마이페이지 > 환불신청
 * @author       $Author$
 * @since        $Date$
 * @version      $Revision$
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
PDFEnvelope.propTypes = {
    form: PropTypes.object
};
export default function PDFEnvelope({form}) {
    return (
        <Document>
            <Page
                size={{ width: A4.width, height: A4.height }}
                style={styles.page}
                wrap={true}
            >
                <Image
                    src={`${window.location.origin}/form/form_envelope.jpeg`}
                    style={styles.envelope}
                    alt={'우편환불봉투 이미지'}
                />
                <View style={styles.sender}>
                    <Text style={styles.address01}>{form.address1}</Text>
                    <Text style={styles.address02}>{form.address2}</Text>
                    <Text style={styles.postNumber}>{form.zoneCd}</Text>
                </View>
            </Page>
        </Document>
    );
}
