import moment from 'moment'

/** 1) 14자리(또는 부분) 압축 문자열 → 구성 요소 분해 */
export function splitYmdHms(compact) {
    const raw = (compact || '').replace(/\D/g, '')
    const y = Number(raw.slice(0, 4))
    const M = Number(raw.slice(4, 6) || 0)
    const d = Number(raw.slice(6, 8) || 0)
    const h = Number(raw.slice(8,10) || 0)
    const m = Number(raw.slice(10,12) || 0)
    const s = Number(raw.slice(12,14) || 0)
    return { y, M, d, h, m, s }
}

/** 2) 부분 날짜(YYYY | YYYYMM | ... | YYYYMMDDHHmmss) → 14자리
 *    mode='start' : 하위 단위를 최소값으로
 *    mode='end'   : 하위 단위를 최대값으로(월 말일, 23:59:59)
 *    tzOffset: number = 9  → Asia/Seoul 고정
 */
export function to14FromPartial(
    partial,
    mode= 'start', //'start' | 'end'
    tzOffset = 9
) {
    const raw = (partial || '').replace(/\D/g, '')
    if (raw.length < 4) throw new Error('최소 YYYY 형식 필요')

    const y = Number(raw.slice(0, 4))
    const M = raw.length >= 6 ? Number(raw.slice(4, 6)) : (mode === 'end' ? 12 : 1)

    let d
    if (raw.length >= 8) d = Number(raw.slice(6, 8))
    else {
        if (mode === 'end') {
            const days = moment({ year: y, month: M - 1 }).daysInMonth()
            d = days
        } else d = 1
    }

    const h = raw.length >= 10 ? Number(raw.slice(8,10)) : (mode === 'end' ? 23 : 0)
    const m = raw.length >= 12 ? Number(raw.slice(10,12)) : (mode === 'end' ? 59 : 0)
    const s = raw.length >= 14 ? Number(raw.slice(12,14)) : (mode === 'end' ? 59 : 0)

    // ✅ tzOffset(+9) 강제로 로컬타임존 영향 제거
    const mm = moment({ year: y, month: M - 1, day: d, hour: h, minute: m, second: s }).utcOffset(tzOffset)

    if (!mm.isValid()) throw new Error('유효하지 않은 날짜')
    return mm.format('YYYYMMDDHHmmss')
}

/** 3) 14자리 → moment (tzOffset 적용) */
export function to14FromMoment(input, tzOffset = 9) {
    let m
    if (moment.isMoment(input)) {
        m = input.clone()
    } else if (typeof input === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(input)) {
        m = moment(input, 'YYYY-MM-DD').utcOffset(tzOffset).format('YYYYMMDDHHmmss')
    } else if (typeof input === 'string' && /^\d{8}$/.test(input)) {
        m = moment(input, 'YYYYMMDD').utcOffset(tzOffset).format('YYYYMMDDHHmmss')
    } else if (typeof input === 'string' && /^\d{6}$/.test(input)) {
        m = moment(input, 'YYMMDD').utcOffset(tzOffset).format('YYYYMMDDHHmmss')
    } else {
        m = moment(input)
    }

    return m
}

/** 4) moment → 14자리 */
export function toMomentFrom14(input, tzOffset = 9) {
    let m
    if (moment.isMoment(input)) {
        m = input.clone()
    } else if (typeof input === 'string' && /^\d{14}$/.test(input)) {
        m = moment(input, 'YYYYMMDDHHmmss', true)
    } else if (typeof input === 'string' && /^\d{8}$/.test(input)) {
        m = moment(input, 'YYYYMMDD', true)
    } else if (typeof input === 'string' && /^\d{6}$/.test(input)) {
        m = moment(input, 'YYMMDD', true)
    } else {
        m = moment(input)
    }

    if (!m.isValid()) {
        return moment();
        // throw new Error('유효한 moment 필요')
    }

    return m.utcOffset(tzOffset).format('YYYY-MM-DDTHH:mm:ssZ')
}

/** 4) moment → yyyymmdd */
// export function toYmdFromMoment(input, { tzOffset = 9, when = 'start' } = {}) {
//     let m
//     let ymdOnly = false
//
//     if (moment.isMoment(input)) {
//         m = input.clone()
//     } else if (typeof input === 'string') {
//         const raw = input.replace(/\D/g, '')
//         if (/^\d{14}$/.test(raw)) {
//             m = moment(raw, 'YYYYMMDDHHmmss', true)
//         } else if (/^\d{8}$/.test(raw)) {
//             m = moment(raw, 'YYYYMMDD', true)
//             ymdOnly = true
//         } else {
//             throw new Error('지원하지 않는 문자열 형식: YYYYMMDD or YYYYMMDDHHmmss 만 허용')
//         }
//     } else if (input instanceof Date || typeof input === 'number') {
//         m = moment(input)
//     } else {
//         throw new Error('입력이 비어있거나 지원하지 않는 타입')
//     }
//
//     if (!m.isValid()) throw new Error('유효하지 않은 moment/입력')
//     if (ymdOnly) {
//         if (when === 'end') m = m.endOf('day')
//         else m = m.startOf('day')
//     }
//
//     return m.utcOffset(tzOffset).format('YYYYMMDDHHmmss')
// }


/** 목록 등록 일자 계산 **/
export function fncCalcTimesFromNow(date) {
    // 1) 1시간 전 ~ 23시간 전 : 24시간 은 1일로 표시
    // 2) 일 : 1일 23시간 까지 1일 전으로 표시
    // 3) 1일 이후 날짜로 표시

    const now = moment();
    const m = moment(toMomentFrom14(date));
    if (!m.isValid()) return '';

    // 미래 시간은 날짜로 표기
    if (m.isAfter(now)) return m.format('YYYY-MM-DD');

    const diffMinutes = now.diff(m, 'minutes');
    const diffHours   = now.diff(m, 'hours');
    const diffDays    = now.diff(m, 'days');

    if (diffMinutes < 60) return '방금 전';              // 1시간 미만
    if (diffHours   < 24) return `${diffHours}시간 전`;  // 1~23시간
    if (diffDays    < 2)  return `${diffDays}일 전`;    // 1일
    return m.format('YYYY-MM-DD');
}
