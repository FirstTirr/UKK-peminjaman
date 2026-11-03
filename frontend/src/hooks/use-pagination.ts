'use client';

import { useState } from 'react';

export const PAGE_SIZE = 10;

export function usePagination<T>(items: T[], pageSize = PAGE_SIZE) {
    const [requestedPage, setRequestedPage] = useState(1);
    const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
    const currentPage = Math.min(requestedPage, totalPages);
    const startIndex = (currentPage - 1) * pageSize;

    const setPage = (page: number) => {
        setRequestedPage(Math.min(Math.max(page, 1), totalPages));
    };

    return {
        currentPage,
        totalPages,
        startIndex,
        pageItems: items.slice(startIndex, startIndex + pageSize),
        setPage
    };
}
