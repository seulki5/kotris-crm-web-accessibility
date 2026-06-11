import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// assets
import {ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight} from '@assets/icons/Svgs';


Pagination.propTypes = {
    pagingData: PropTypes.object,
    onPaging: PropTypes.func,
};
export default function Pagination({
    pagingData,
    onPaging
}) {
    const [pager, setPager] = useState({
        totalPage: 0,
        totalBlock: 0,
        nowBlock: 0,
        sPageNum: 0,
        ePageNum: 0,
        numList: []
    })

    useEffect(() => {
        if (!pagingData) return;

        const totalPage = Math.ceil(pagingData.dataTotal / pagingData.blockData);
        const totalBlock = Math.ceil(totalPage / pagingData.blockGroup);
        const nowBlock = Math.ceil(pagingData.activePage / pagingData.blockGroup);

        let sPageNum = (nowBlock - 1) * pagingData.blockGroup + 1;
        if (sPageNum <= 0) sPageNum = 1;

        let ePageNum = nowBlock * pagingData.blockGroup;
        if (ePageNum > totalPage) ePageNum = totalPage;

        const numList = Array.from({ length: ePageNum - sPageNum + 1 }, (_, i) => sPageNum + i);

        setPager({ totalPage, totalBlock, nowBlock, sPageNum, ePageNum, numList });
    }, [pagingData])

    const baseButtonStyles = `
        flex items-center justify-center w-[40px] h-[40px] rounded-6
        text-label-lg-en transition-all duration-200
        text-dynamic-text-neutral-primary
        disabled:cursor-not-allowed
        disabled:text-dynamic-text-neutral-disabled
        hover:bg-dynamic-bg-brand-inverse
        hover:text-dynamic-text-brand-primary
        hover:disabled:bg-transparent
        hover:active:bg-transparent
      `;

    if (!pagingData) return null;

    return (
        <div className={'flex-row-center gap-2'}>
            {pagingData.activeLastBtn && (
                <button
                    type={'button'}
                    className={baseButtonStyles}
                    title={'처음으로'}
                    aria-label={'첫 페이지로 이동'}
                    disabled={pagingData.activePage === 1}
                    aria-disabled={pagingData.activePage === 1}
                    onClick={() => onPaging(1)}
                >
                    <ChevronsLeft width={20} height={20} />
                </button>
            )}

            <button
                type={'button'}
                className={baseButtonStyles}
                title={'이전'}
                aria-label={'이전 페이지로 이동'}
                disabled={pagingData.activePage <= 1}
                aria-disabled={pagingData.activePage <= 1}
                onClick={() => onPaging(pagingData.activePage - 1)}
            >
                <ChevronLeft width={20} height={20} />
            </button>

            {pager.numList.map((num) => (
                <button
                    key={num}
                    type={'button'}
                    aria-label={`${num} 페이지로 이동`}
                    onClick={() => onPaging(num)}
                    className={`
                        ${baseButtonStyles}
                        ${num === pagingData.activePage ? 'bg-dynamic-bg-brand-inverse text-dynamic-text-brand-primary' : 'text-dynamic-text-neutral-primary'}
                    `}
                >
                    {num}
                </button>
            ))}

            <button
                type={'button'}
                className={baseButtonStyles}
                title={'다음'}
                aria-label={'다음 페이지로 이동'}
                disabled={pagingData.activePage >= pager.totalPage}
                aria-disabled={pagingData.activePage >= pager.totalPage}
                onClick={() => onPaging(pagingData.activePage + 1)}
            >
                <ChevronRight width={20} height={20} />
            </button>

            {pagingData.activeLastBtn && (
                <button
                    type={'button'}
                    className={baseButtonStyles}
                    title={'마지막으로'}
                    aria-label={'마지막 페이지로 이동'}
                    disabled={pagingData.activePage >= pager.totalPage}
                    aria-disabled={pagingData.activePage >= pager.totalPage}
                    onClick={() => onPaging(pager.totalPage)}
                >
                    <ChevronsRight width={20} height={20} />
                </button>
            )}
        </div>
    )
}
