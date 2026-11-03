'use client';

import { useEffect, useState } from 'react';
import Pagination from '@/components/pagination';
import { usePagination } from '@/src/hooks/use-pagination';
import { peminjamanService, Peminjaman } from '@/src/services/peminjaman';

export default function AdminPeminjamanPage() {
    const [peminjamanList, setPeminjamanList] = useState<Peminjaman[]>([]);
    const { pageItems, currentPage, totalPages, setPage } = usePagination(peminjamanList);

    useEffect(() => {
        peminjamanService.getAll()
            .then((data) => setPeminjamanList(Array.isArray(data) ? data : []))
            .catch((error: unknown) => console.error('Gagal memuat data peminjaman', error));
    }, []);

    return (
        <div className="mx-auto w-full max-w-7xl">
            <h1 className="mb-6 text-xl font-bold text-gray-900 sm:text-2xl">Data Peminjaman Alat</h1>

            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[850px] border-collapse text-left text-sm">
                        <thead className="border-b border-gray-100 bg-gray-50 text-gray-700">
                            <tr>
                                <th className="p-4 font-semibold">ID</th>
                                <th className="p-4 font-semibold">Peminjam</th>
                                <th className="p-4 font-semibold">Barang</th>
                                <th className="p-4 font-semibold">Tgl Pinjam</th>
                                <th className="p-4 font-semibold">Rencana Kembali</th>
                                <th className="p-4 font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-gray-800">
                            {pageItems.map((item) => (
                                <tr key={item.id_peminjaman} className="align-top hover:bg-gray-50">
                                    <td className="p-4 font-medium">#{item.id_peminjaman}</td>
                                    <td className="p-4 font-medium">{item.username}</td>
                                    <td className="p-4 text-xs">
                                        {item.items.length > 0
                                            ? item.items.map((detail) => <div key={detail.id_detail}>{detail.nama_alat} · {detail.jumlah} unit</div>)
                                            : <span className="italic text-gray-400">Detail tidak tersedia</span>}
                                    </td>
                                    <td className="p-4">{item.tgl_pinjam.slice(0, 10)}</td>
                                    <td className="p-4">{item.tgl_rencana_kembali.slice(0, 10)}</td>
                                    <td className="p-4">
                                        <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
                                            item.status === 'Selesai' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' :
                                            item.status === 'Disetujui' ? 'border-blue-200 bg-blue-50 text-blue-700' :
                                            item.status === 'Ditolak' ? 'border-red-200 bg-red-50 text-red-700' :
                                            'border-amber-200 bg-amber-50 text-amber-700'
                                        }`}>{item.status}</span>
                                    </td>
                                </tr>
                            ))}
                            {peminjamanList.length === 0 && (
                                <tr><td colSpan={6} className="p-8 text-center text-gray-500">Belum ada data peminjaman.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={peminjamanList.length} onPageChange={setPage} />
        </div>
    );
}
