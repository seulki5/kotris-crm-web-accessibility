'use client'

import React, {useEffect, useLayoutEffect, useState} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {AnimatePresence, motion} from 'framer-motion';
import moment from 'moment';

// modules
import {useScreenSizeContext} from '@modules/context/ScreenContext';
import {FilterOrder, FilterPeriod, FilterType} from '@modules/consants/Options';
import {usePopContext} from "@modules/context/PopContext";

// components
import Button from '@components/common/Button';
import Checkbox from '@components/common/Checkbox';
import DatePicker from '@components/common/DatePicker';
import FileDownload from '@components/composite/FileDownload';

// assets
import {ChevronUp, Filter, Rotate} from '@assets/icons/Svgs';

// const
export const initSearchConditions = {
    sortCrtrCd: FilterOrder[0].id,                                                 // 정렬
    dlngSeCdList: [FilterType[0].id],                                              // 거래구분
    dlngBgngDt: moment().startOf('month').format('YYYY-MM-DD'),   // 시작일
    dlngEndDt: moment().format('YYYY-MM-DD')                                // 종료일
}


/**
 * @description: 검색 필터링 컴포넌트 입니다.
 * @screenID:    -
 * @screenPath:  -
 * @author       $Author
 * @since        $Date
 * @version      $Revision
 * Copyright (C) 2025 by STraffic co.,Ltd. All right reserved.
 */
SearchFilter.propTypes = {
    data: PropTypes.object,
    isOpen: PropTypes.bool,
    triggerId: PropTypes.string,
    onUpdate: PropTypes.func,
    onSearch: PropTypes.func,
    onInit: PropTypes.func,
    onToggle: PropTypes.func,
    onDownload: PropTypes.func,
};
export default function SearchFilter({
    data,
    isOpen,
    triggerId,
    onUpdate,
    onSearch,
    onInit,
    onToggle,
    onDownload
}) {
    const {isMobile} = useScreenSizeContext();
    const {fncShowPop, fncClosePop} = usePopContext();
    const today = moment().format('YYYY-MM-DD');
    const preThisMonth = moment().startOf('month').format('YYYY-MM-DD');
    const pre3Months = moment().subtract(3, 'M').format('YYYY-MM-DD');
    const preYear = moment().subtract(1, 'y').format('YYYY-MM-DD');

    const [isPeriod, setIsPeriod] = useState(null);
    const [clone, setClone] = useState({
        period: FilterPeriod[0],
        type: [FilterType[0].id],
        order: FilterOrder[0],
        startDt: moment().startOf('month').format('YYYY-MM-DD'),
        endDt: moment().format('YYYY-MM-DD')
    });
    const [applied, setApplied] = useState({
        period: FilterPeriod[0],
        type: [FilterType[0].id],
        order: FilterOrder[0]
    });

    useLayoutEffect(() => {
        // 이번달, 3개월, 1년
        if (data.dlngEndDt === today) {
            if (data.dlngBgngDt === preThisMonth) {
                setIsPeriod(FilterPeriod[0].id);
            }
            if (data.dlngBgngDt === pre3Months) {
                setIsPeriod(FilterPeriod[1].id);
            }
            if (data.dlngBgngDt === preYear) {
                setIsPeriod(FilterPeriod[2].id);
            }
        } else {
            // 직접입력
            setIsPeriod(FilterPeriod[FilterPeriod.length - 1].id);
        }
    }, [data.dlngBgngDt, data.dlngEndDt]);

    // 자녀
    useLayoutEffect(() => {
        if(triggerId) {
            let period;

            // 이번달, 3개월, 1년
            if (data.dlngEndDt === today) {
                if (data.dlngBgngDt === preThisMonth) {
                    period = FilterPeriod[0].id;
                }
                if (data.dlngBgngDt === pre3Months) {
                    period = FilterPeriod[1].id;
                }
                if (data.dlngBgngDt === preYear) {
                    period = FilterPeriod[2].id;
                }
            } else {
                // 직접입력
                period = FilterPeriod[FilterPeriod.length - 1].id;
            }

            setIsPeriod(period);

            // 기간
            let updatePeriod;
            if (period === FilterPeriod[FilterPeriod.length - 1].id) {
                updatePeriod = {
                    id: period,
                    name: `${moment(data.dlngBgngDt).format('YYYY-MM-DD')} ~ ${moment(data.dlngEndDt).format('YYYY-MM-DD')}`
                }
            } else {
                updatePeriod = FilterPeriod.filter((el) => el.id === period)?.[0];
            }

            // 거래구분
            let updateType = data.dlngSeCdList;

            // 순서
            let updateOrder = FilterOrder.filter((el) => el.id === data.sortCrtrCd)?.[0];
            setApplied({
                period: updatePeriod,
                type: updateType,
                order: updateOrder
            });
        }
    }, [triggerId]);

    // 기간 날짜 계산
    const fncCalcDates = (id) => {
        switch (id) {
            case FilterPeriod[1].id: // 3개월
                return {
                    dlngBgngDt: pre3Months,
                    dlngEndDt: today
                }
            case FilterPeriod[2].id: // 1년
                return {
                    dlngBgngDt: preYear,
                    dlngEndDt: today
                }
            case FilterPeriod[3].id: // 직접입력
                return {
                    dlngBgngDt: null,
                    dlngEndDt: null
                }
            default: // 이번달
                return {
                    dlngBgngDt: preThisMonth,
                    dlngEndDt: today
                }
        }
    }

    // 기간 옵션 선택
    const fncClickPeriodOption = (id) => {
        if (isPeriod === id) return;
        let updated = fncCalcDates(id);
        setIsPeriod(id);
        onUpdate(updated);
    }

    // 일자 선택
    const fncSelectDate = (date) => {
        onUpdate({
            dlngBgngDt: data.dlngBgngDt,
            dlngEndDt: data.dlngEndDt,
            [date.id]: date.date
        })
    }

    // 단일 체크
    const fncSingleCheck = (obj) => {
        onUpdate(obj);
    }

    // 다중 선택
    const fncMultiCheck = (type) => {
        const ALL_ID = FilterType[0].id;
        const INDIV_IDS = FilterType.slice(1).map(x => x.id);
        const arr = data.dlngSeCdList;
        const cur = new Set(Array.isArray(arr) ? arr.map(v => v) : []);
        const id = type.id;
        let updated;

        if (id === ALL_ID) {
            updated = cur.has(ALL_ID) ? [] : [ALL_ID];
        } else {
            cur.delete(ALL_ID);
            if (cur.has(id)) cur.delete(id);
            else cur.add(id);

            const selectedIndivs = INDIV_IDS.filter(x => cur.has(x));
            if (selectedIndivs.length === INDIV_IDS.length) {
                updated = [ALL_ID];
            } else {
                updated = Array.from(cur);
            }
        }

        onUpdate({dlngSeCdList: updated});
    }

    // 거래구분 이름 얻기
    const fncNamesFromIds = (ids) => {
        const ID_NAME = Object.fromEntries(FilterType.map(x => [x.id, x.name]));
        const list = Array.isArray(ids) ? ids.map(String) : [];
        const names = list.map(id => ID_NAME[id]).filter(Boolean).filter(n => n !== FilterType[FilterType.length - 1].id);
        const order = FilterType.map(f => f.name);
        const unique = Array.from(new Set(names));
        unique.sort((a, b) => order.indexOf(a) - order.indexOf(b));

        return unique.join('/')
    }

    // 적용
    const fncApply = async () => {
        // 기간
        let updatePeriod;
        if (isPeriod === FilterPeriod[FilterPeriod.length - 1].id) {
            updatePeriod = {
                id: isPeriod,
                name: `${moment(data.dlngBgngDt).format('YYYY-MM-DD')} ~ ${moment(data.dlngEndDt).format('YYYY-MM-DD')}`
            }
        } else {
            updatePeriod = FilterPeriod.filter((el) => el.id === isPeriod)?.[0];
        }

        // 거래구분
        let updateType = data.dlngSeCdList;

        // 순서
        let updateOrder = FilterOrder.filter((el) => el.id === data.sortCrtrCd)?.[0];

        // 직접입력 일자 데이터 유무 체크
        if(updatePeriod.id === 'custom' && (data.dlngBgngDt === null || data.dlngEndDt === null)) {
            return fncShowPop({
                mainText: '조회 기간을 선택해주세요.',
                primaryText: '확인',
                onClickPrimary: () => fncClosePop()
            })
        }

        const diff = moment(data.dlngEndDt).diff(moment(data.dlngBgngDt), 'days');
        if(diff > 365) {
            return fncShowPop({
                mainText: '최대 1년까지 조회 가능합니다.',
                primaryText: '확인',
                onClickPrimary: () => fncClosePop()
            })
        }

        setClone({
            period: FilterPeriod.filter((el) => el.id === isPeriod)?.[0],
            type: updateType,
            order: updateOrder,
            startDt: data.dlngBgngDt,
            endDt: data.dlngEndDt
        });

        setApplied({
            period: updatePeriod,
            type: updateType,
            order: updateOrder
        });

        onSearch();
    }

    // 초기화
    const fncInitialize = () => {
        onInit();
        setClone({
            period: FilterPeriod[0],
            type: [FilterType[0].id],
            order: FilterOrder[0],
            startDt: moment().startOf('month').format('YYYY-MM-DD'),
            endDt: moment().format('YYYY-MM-DD')
        })
        setApplied({
            period: FilterPeriod[0],
            type: [FilterType[0].id],
            order: FilterOrder[0]
        })
    }

    // 열기/닫기
    const fncToggle = () => {
        if(isOpen) {
            let calcDates = fncCalcDates(clone.period.id);
            onUpdate({
                sortCrtrCd: clone.order.id,
                dlngSeCdList: clone.type,
                dlngBgngDt: calcDates.dlngBgngDt,
                dlngEndDt: calcDates.dlngEndDt
            });
        }

        onToggle('toggleFilter');
    }

    // 내역 다운로드
    const fncDownload = () => {
        onDownload && onDownload();
    }

    const fncHandlers = {
        clickPeriodOption: fncClickPeriodOption,
        selectDate: fncSelectDate,
        singleCheck: fncSingleCheck,
        multiCheck: fncMultiCheck,
        namesFromIds: fncNamesFromIds,
        apply: fncApply,
        toggle: fncToggle,
        initialize: fncInitialize,
        download: fncDownload,
    }

    const fncCallbackEvent = (fncName, variable, payload = {}) => {
        const fnc = fncHandlers[fncName];
        if (typeof fnc === 'function') return fnc(variable, payload);
    }

    if (isMobile) return (
        <MoListFilter
            fncCallbackEvent={fncCallbackEvent}
            data={{
                ...data,
                isOpen,
                isPeriod,
                applied
            }}
        />
    );
    else return (
        <DtListFilter
            fncCallbackEvent={fncCallbackEvent}
            data={{
                ...data,
                isOpen,
                isPeriod,
                applied
            }}
        />
    )
}

/**
 * @description: Desktop
 * @screenID:    -
 */
DtListFilter.propTypes = {
    data: PropTypes.object,
    fncCallbackEvent: PropTypes.func
};
export function DtListFilter({data, fncCallbackEvent}) {
    return (
        <>
            <div className={'flex-row-center justify-between'}>
                <button
                    className={`filter-button-wrap ${data.isFilter && 'bg-dynamic-bg-brand-inverse'}`}
                    aria-label={'목록 검색 조건 설정'}
                    onClick={() => fncCallbackEvent('toggle')}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            fncCallbackEvent('toggle');
                        }
                    }}
                >
                    <p>{`${data.applied.period.name} \u00B7 ${fncCallbackEvent('namesFromIds', data.applied.type)} \u00B7 ${data.applied.order.name}`}</p>
                    <Filter
                        width={20} height={20}
                        color={data.isFilter ? 'text-dynamic-icon-brand-primary' : 'text-dynamic-icon-neutral-primary'}
                    />
                </button>
                <FileDownload
                    type={'button'}
                    size={'sm'}
                    buttonTheme={'tertiary'}
                    name={'이용내역 다운로드'}
                    fileName={'이용내역 다운로드.xlsx'}
                    onDownload={() => fncCallbackEvent('download')}
                />
            </div>
            <div className={'filter-wrap'}>
                <div
                    className={clsx(
                        'w-full rounded-16 absolute -top-3 z-5 transition-all duration-200 ease-in-out',
                        data.isOpen ? 'max-h-fit py-8 bg-dynamic-bg-neutral-primary' : 'max-h-0 py-0 bg-transparent'
                    )}
                    style={{boxShadow: `0 2px 10px 0px rgba(0, 0, 0, 0.1)`}}
                >
                    {
                        data.isOpen && (
                            <>
                                <div className={'filter-inner-top-wrap'}>
                                    <fieldset role={'group'} aria-label={'조회기간 설정'} className={'filter-group'}>
                                        <p className={'filter-name'}>조회기간</p>
                                        <div className={'flex-row-center gap-20'}>
                                            {
                                                FilterPeriod.map((period) => {
                                                    const isChecked = data.isPeriod === period.id;
                                                    return (
                                                        <Checkbox
                                                            key={period.id}
                                                            ariaLabel={period.name}
                                                            type={'square'}
                                                            isChecked={isChecked}
                                                            label={period.name || null}
                                                            onChange={(checked) => fncCallbackEvent('clickPeriodOption', period.id)}
                                                        />
                                                    )
                                                })
                                            }
                                        </div>
                                        <AnimatePresence initial={false} mode={'wait'}>
                                            {
                                                data.isPeriod === FilterPeriod[FilterPeriod.length - 1].id && (
                                                    <motion.div
                                                        initial={{height: 0, opacity: 0, y: -8}}
                                                        animate={{height: 'auto', opacity: 1, y: 0}}
                                                        exit={{height: 0, opacity: 0, y: -8}}
                                                        transition={{duration: 0.32, ease: 'easeInOut'}}
                                                        className={'flex-row-center'}
                                                    >
                                                        <DatePicker
                                                            size={'sm'}
                                                            inputWidth={150}
                                                            placeholder={'시작일 선택'}
                                                            maxDate={new Date(moment().format('YYYY-MM-DD'))}
                                                            disabled={false}
                                                            id={'dlngBgngDt'}
                                                            value={data.dlngBgngDt}
                                                            onChange={(id, date) => fncCallbackEvent('selectDate', {id, date})}
                                                        />
                                                        <span className={'mx-8'}>~</span>
                                                        <DatePicker
                                                            size={'sm'}
                                                            inputWidth={150}
                                                            placeholder={'종료일 선택'}
                                                            minDate={new Date(data.dlngBgngDt)}
                                                            maxDate={new Date(moment().format('YYYY-MM-DD'))}
                                                            id={'dlngEndDt'}
                                                            value={data.dlngEndDt}
                                                            onChange={(id, date) => fncCallbackEvent('selectDate', {id, date})}
                                                        />
                                                    </motion.div>
                                                )
                                            }
                                        </AnimatePresence>
                                    </fieldset>
                                    <fieldset role={'group'} aria-label={'거래구분 설정'} className={'filter-group'}>
                                        <p className={'filter-name'}>거래구분</p>
                                        <div className={'flex-row-center gap-20'}>
                                            {
                                                FilterType.map((type) => {
                                                    const isChecked = data.dlngSeCdList.includes(type.id);
                                                    return (
                                                        <Checkbox
                                                            key={type.id}
                                                            ariaLabel={type.name}
                                                            type={'square'}
                                                            isChecked={isChecked}
                                                            label={type.name}
                                                            onChange={(checked) => fncCallbackEvent('multiCheck', type)}
                                                        />
                                                    )
                                                })
                                            }
                                        </div>
                                    </fieldset>
                                    <fieldset role={'group'} aria-label={'정렬순서 설정'} className={'filter-group'}>
                                        <p className={'filter-name'}>정렬순서</p>
                                        <div className={'flex-row-center gap-20'}>
                                            {
                                                FilterOrder.map((order) => {
                                                    const isChecked = data.sortCrtrCd === order.id;
                                                    return (
                                                        <Checkbox
                                                            key={order.id}
                                                            ariaLabel={order.name}
                                                            type={'square'}
                                                            isChecked={isChecked}
                                                            label={order.name}
                                                            onChange={(checked) => fncCallbackEvent('singleCheck', {sortCrtrCd: order.id})}
                                                        />
                                                    )
                                                })
                                            }
                                        </div>
                                    </fieldset>
                                </div>
                                <div className={'filter-inner-bottom-wrap'}>
                                    <Button
                                        theme={'textOnly'}
                                        size={'sm'}
                                        text={'필터 닫기'}
                                        ariaLabel={'검색 필터 닫기'}
                                        customStyle={'w-fit'}
                                        icon={<ChevronUp width={16} height={16}/>}
                                        iconPosition={'right'}
                                        onClick={() => fncCallbackEvent('toggle')}
                                    />
                                    <div className={'flex-row-center gap-8'}>
                                        <Button
                                            theme={'tertiary'}
                                            size={'sm'}
                                            text={'초기화'}
                                            ariaLabel={'검색 조건 초기화'}
                                            customStyle={'w-fit'}
                                            icon={<Rotate width={16} height={16}/>}
                                            iconPosition={'left'}
                                            onClick={() => fncCallbackEvent('initialize')}
                                        />
                                        <Button
                                            theme={'primary'}
                                            size={'sm'}
                                            text={'조회하기'}
                                            ariaLabel={'검색'}
                                            customStyle={'w-fit'}
                                            onClick={() => fncCallbackEvent('apply')}
                                        />
                                    </div>
                                </div>
                            </>
                        )
                    }
                </div>
            </div>
        </>
    )
}

/**
 * @description: Mobile
 * @screenID:    -
 */
MoListFilter.propTypes = {
    data: PropTypes.object,
    fncCallbackEvent: PropTypes.func
};
export function MoListFilter({data, fncCallbackEvent}) {
    // 모바일 컨텐츠 높이 조정 여부
    const [moContentHeight, setMoContentHeight] = useState(false);

    // 모바일의 경우 콘텐츠 영역 조절이 필요
    useEffect(() => {
        // 언어설정 드롭다운 열릴시 헤더 배경색 변경
        const handleMoFilterHeight = () => {
            setMoContentHeight(prev => {
                return !prev;
            });
        }
        window.addEventListener('eventMoFilterHeight', handleMoFilterHeight);

        return () => {
            window.removeEventListener('eventMoFilterHeight', handleMoFilterHeight);
        }
    }, [])

    return (
        <>
            <button
                className={'filter-button-wrap'}
                aria-label={'목록 검색 조건 설정'}
                onClick={() => fncCallbackEvent('toggle')}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        fncCallbackEvent('toggle');
                    }
                }}
            >
                <p>{`${data.applied.period.name} \u00B7 ${fncCallbackEvent('namesFromIds', data.applied.type)} \u00B7 ${data.applied.order.name}`}</p>
                <Filter
                    width={20} height={20}
                    color={'text-dynamic-icon-neutral-primary'}
                />
            </button>
            <div className={'filter-wrap'}>
                <div className={clsx(
                    'fixed inset-x-0 bottom-0 z-50 w-full shadow-lg',
                    'pt-40 px-20 pb-48',
                    moContentHeight ? 'h-full max-h-screen flex items-end bg-transparent' : 'h-fit max-h-[95%] rounded-t-[32px] bg-dynamic-bg-neutral-base',
                    'transform-gpu transition-transform duration-300 ease-out will-change-transform',
                    data.isOpen ? 'translate-y-0' : 'translate-y-full',
                    'scrollbar-thin scrollbar-thumb-dynamic-border-neutral-secondary scrollbar-thumb-rounded-full scrollbar-track-transparent',
                )}
                >
                    <div className={'filter-inner-top-wrap'}>
                        <fieldset role={'group'} aria-label={'조회기간 설정'} className={'filter-group'}>
                            {
                                !moContentHeight && (
                                    <>
                                        <div>
                                            <p className={'filter-name'}>조회기간</p>
                                            <p className={'text-body-xs text-dynamic-text-neutral-secondary font-normal mt-2'}>
                                                사용일로부터 2일 이후 내역 조회가 가능합니다.
                                            </p>
                                        </div>
                                        <div className={'grid grid-cols-3 gap-12'}>
                                            {
                                                FilterPeriod.map((period) => {
                                                    const isChecked = data.isPeriod === period.id;
                                                    return (
                                                        <button
                                                            key={period.id}
                                                            aria-label={period.name}
                                                            className={clsx('filter-item', isChecked && 'checked')}
                                                            onClick={(checked) => fncCallbackEvent('clickPeriodOption', period.id)}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter' || e.key === ' ') {
                                                                    fncCallbackEvent('clickPeriodOption', period.id)
                                                                }
                                                            }}
                                                        >
                                                            {period.name || null}
                                                        </button>
                                                    )
                                                })
                                            }
                                        </div>
                                    </>
                                )
                            }
                            <AnimatePresence initial={false} mode={'wait'}>
                                {
                                    data.isPeriod === FilterPeriod[FilterPeriod.length - 1].id && (
                                        <motion.div
                                            initial={{height: 0, opacity: 0, y: -8}}
                                            animate={{height: 'auto', opacity: 1, y: 0}}
                                            exit={{height: 0, opacity: 0, y: -8}}
                                            transition={{duration: 0.32, ease: 'easeInOut'}}
                                            style={{overflow: 'hidden'}}
                                            className={'flex-row-center'}
                                        >
                                            <DatePicker
                                                size={'md'}
                                                placeholder={'시작일 선택'}
                                                maxDate={new Date(moment().format('YYYY-MM-DD'))}
                                                disabled={false}
                                                id={'dlngBgngDt'}
                                                value={data.dlngBgngDt}
                                                onChange={(id, date) => fncCallbackEvent('selectDate', {id, date})}
                                            />
                                            <span className={'mx-8'}>~</span>
                                            <DatePicker
                                                size={'md'}
                                                placeholder={'종료일 선택'}
                                                minDate={new Date(data.dlngBgngDt)}
                                                maxDate={new Date(moment().format('YYYY-MM-DD'))}
                                                id={'dlngEndDt'}
                                                value={data.dlngEndDt}
                                                onChange={(id, date) => fncCallbackEvent('selectDate', {id, date})}
                                            />
                                        </motion.div>
                                    )
                                }
                            </AnimatePresence>
                        </fieldset>
                        {
                            !moContentHeight && (
                                <>
                                    <fieldset role={'group'} aria-label={'거래구분 설정'} className={'filter-group'}>
                                        <p className={'filter-name'}>거래구분</p>
                                        <div className={'grid grid-cols-3 gap-12'}>
                                            {
                                                FilterType.map((type) => {
                                                    const isChecked = data.dlngSeCdList.includes(type.id);
                                                    return (
                                                        <button
                                                            key={type.id}
                                                            aria-label={type.name}
                                                            className={clsx('filter-item', isChecked && 'checked')}
                                                            onClick={(checked) => fncCallbackEvent('multiCheck', type)}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter' || e.key === ' ') {
                                                                    fncCallbackEvent('multiCheck', type);
                                                                }
                                                            }}
                                                        >
                                                            {type.name || null}
                                                        </button>
                                                    )
                                                })
                                            }
                                        </div>
                                    </fieldset>
                                    <fieldset role={'group'} aria-label={'정렬순서 설정'} className={'filter-group'}>
                                        <p className={'filter-name'}>정렬순서</p>
                                        <div className={'grid grid-cols-3 gap-12'}>
                                            {
                                                FilterOrder.map((order) => {
                                                    const isChecked = data.sortCrtrCd === order.id;
                                                    return (
                                                        <button
                                                            key={order.id}
                                                            aria-label={order.name}
                                                            className={clsx('filter-item', isChecked && 'checked')}
                                                            onClick={(checked) => fncCallbackEvent('singleCheck', {sortCrtrCd: order.id})}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter' || e.key === ' ') {
                                                                    fncCallbackEvent('singleCheck', {sortCrtrCd: order.id});
                                                                }
                                                            }}
                                                        >
                                                            {order.name || null}
                                                        </button>
                                                    )
                                                })
                                            }
                                        </div>
                                    </fieldset>
                                </>
                            )
                        }
                    </div>
                    <div className={'filter-inner-bottom-wrap'}>
                        <Button
                            theme={'tertiary'}
                            size={'lg'}
                            text={'초기화'}
                            ariaLabel={'검색 조건 초기화'}
                            customStyle={'w-1/3'}
                            icon={<Rotate width={16} height={16}/>}
                            iconPosition={'left'}
                            onClick={() => fncCallbackEvent('initialize')}
                        />
                        <Button
                            theme={'primary'}
                            size={'lg'}
                            text={'조회하기'}
                            ariaLabel={'검색'}
                            customStyle={'w-2/3'}
                            onClick={() => fncCallbackEvent('apply')}
                        />
                    </div>
                </div>
                {/*딤디드*/}
                {
                    !moContentHeight && (
                        <button
                            onClick={() => fncCallbackEvent('toggle')}
                            className={clsx(
                                'fixed top-0 left-0 w-full h-full z-10 bg-neutral-10 transition-opacity duration-300',
                                data.isOpen ? 'opacity-80 pointer-events-auto' : 'opacity-0 pointer-events-none',
                            )}
                            aria-label={'필터 닫기'}
                        />
                    )
                }
            </div>
        </>
    )
}
