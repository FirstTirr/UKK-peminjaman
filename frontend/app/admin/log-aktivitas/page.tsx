'use client';

import { useEffect, useState } from 'react';
import Pagination from '@/components/pagination';
import api from '@/src/lib/api';
import { usePagination } from '@/src/hooks/use-pagination';

interface LogAktivitas {
    id_log_aktivitas: number;
    username: string;
    aktivitas: string;
    created_at: string;
}

export default function AdminLogAktivitasPage() {
    const [logs, setLogs] = useState<LogAktivitas[]>([]);
    const { pageItems, currentPage, totalPages, setPage } = usePagination(logs);

    useEffect(() => {
        api.get<LogAktivitas[]>('/log-aktivitas/read')
            .then((response) => setLogs(Array.isArray(response.data) ? response.data : []))
            .catch((error: unknown) => console.error('Gagal memuat log aktivitas', error));
    }, []);

    return (
        <div className="mx-auto w-full max-w-7xl">
            <h1 className="mb-6 text-xl font-bold text-gray-900 sm:text-2xl">Log Aktivitas Sistem</h1>

            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[650px] border-collapse text-left text-sm">
                        <thead className="border-b border-gray-100 bg-gray-50 text-gray-700">
                            <tr>
                                <th className="p-4 font-semibold">Waktu</th>
                                <th className="p-4 font-semibold">User</th>
                                <th className="p-4 font-semibold">Aktivitas</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-gray-800">
                            {pageItems.map((item) => (
                                <tr key={item.id_log_aktivitas} className="hover:bg-gray-50">
                                    <td className="whitespace-nowrap p-4 text-xs text-gray-500">{item.created_at}</td>
                                    <td className="p-4 font-medium">{item.username}</td>
                                    <td className="p-4">{item.aktivitas}</td>
                                </tr>
                            ))}
                            {logs.length === 0 && (
                                <tr><td colSpan={3} className="p-8 text-center text-gray-500">Belum ada log aktivitas.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={logs.length} onPageChange={setPage} />
        </div>
    );
}
