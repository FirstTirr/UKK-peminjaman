'use client';

import { PAGE_SIZE } from '@/src/hooks/use-pagination';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    pageSize?: number;
}

export default function Pagination({
    currentPage,
    totalPages,
    totalItems,
    onPageChange,
    pageSize = PAGE_SIZE
}: PaginationProps) {
    if (totalPages <= 1) return null;

    const firstItem = (currentPage - 1) * pageSize + 1;
    const lastItem = Math.min(currentPage * pageSize, totalItems);
    const buttonClass = 'rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40';

    return (
        <nav className="mt-4 flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between" aria-label="Navigasi halaman">
            <span className="text-center text-xs text-gray-500 sm:text-left">
                Menampilkan {firstItem}–{lastItem} dari {totalItems} data
            </span>
            <div className="flex items-center justify-center gap-3">
                <button className={buttonClass} onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
                    Sebelumnya
                </button>
                <span className="whitespace-nowrap text-xs font-medium text-gray-600">
                    {currentPage} / {totalPages}
                </span>
                <button className={buttonClass} onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    Selanjutnya
                </button>
            </div>
        </nav>
    );
}
