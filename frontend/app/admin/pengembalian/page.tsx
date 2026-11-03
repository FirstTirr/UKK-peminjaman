'use client';

import { useEffect, useState } from 'react';
import Pagination from '@/components/pagination';
import { usePagination } from '@/src/hooks/use-pagination';
import { laporanService, Pengembalian } from '@/src/services/laporan';

export default function AdminPengembalianPage() {
    const [pengembalianList, setPengembalianList] = useState<Pengembalian[]>([]);
    const { pageItems, currentPage, totalPages, setPage } = usePagination(pengembalianList);

    useEffect(() => {
        laporanService.getPengembalian()
            .then((data) => setPengembalianList(Array.isArray(data) ? data : []))
            .catch((error: unknown) => console.error('Gagal memuat data pengembalian', error));
    }, []);

    return (
        <div className="mx-auto w-full max-w-7xl">
            <h1 className="mb-6 text-xl font-bold text-gray-900 sm:text-2xl">Data Pengembalian Alat</h1>

            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[850px] border-collapse text-left text-sm">
                        <thead className="border-b border-gray-100 bg-gray-50 text-gray-700">
                            <tr>
                                <th className="p-4 font-semibold">ID</th>
                                <th className="p-4 font-semibold">Peminjam</th>
                                <th className="p-4 font-semibold">Rencana Kembali</th>
                                <th className="p-4 font-semibold">Dikembalikan</th>
                                <th className="p-4 font-semibold">Denda</th>
                                <th className="p-4 font-semibold">Total Pembayaran</th>
                                <th className="p-4 font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-gray-800">
                            {pageItems.map((item) => (
                                <tr key={item.id_pengembalian} className="hover:bg-gray-50">
                                    <td className="p-4 font-medium">#{item.id_peminjaman}</td>
                                    <td className="p-4 font-medium">{item.peminjam}</td>
                                    <td className="p-4">{item.tgl_rencana_kembali.slice(0, 10)}</td>
                                    <td className="p-4">{item.tgl_kembali_sebenarnya.slice(0, 10)}</td>
                                    <td className="p-4 font-semibold text-red-600">Rp {Number(item.denda).toLocaleString('id-ID')}</td>
                                    <td className="p-4 font-semibold">Rp {Number(item.total_pembayaran).toLocaleString('id-ID')}</td>
                                    <td className="p-4">
                                        <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${item.status === 'Selesai' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-blue-200 bg-blue-50 text-blue-700'}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {pengembalianList.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-gray-500">Belum ada data pengembalian alat.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={pengembalianList.length} onPageChange={setPage} />
        </div>
    );
}
