'use client';

import { useEffect, useState } from 'react';
import Pagination from '@/components/pagination';
import { usePagination } from '@/src/hooks/use-pagination';
import { peminjamanService, Peminjaman } from '@/src/services/peminjaman';

function ReportTable({ data }: { data: Peminjaman[] }) {
    return (
        <table className="w-full min-w-[850px] border-collapse text-left text-sm print:min-w-0 print:text-[10px]">
            <thead className="border-b border-gray-100 bg-gray-50 text-gray-700">
                <tr>
                    <th className="p-3 font-semibold">ID</th>
                    <th className="p-3 font-semibold">Peminjam</th>
                    <th className="p-3 font-semibold">Barang yang Dipinjam</th>
                    <th className="p-3 font-semibold">Tgl Pinjam</th>
                    <th className="p-3 font-semibold">Rencana Kembali</th>
                    <th className="p-3 font-semibold">Status</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-800">
                {data.map((item) => (
                    <tr key={item.id_peminjaman}>
                        <td className="p-3 font-medium">#{item.id_peminjaman}</td>
                        <td className="p-3">{item.username}</td>
                        <td className="p-3">
                            {item.items.length > 0
                                ? item.items.map((detail) => <div key={detail.id_detail}>{detail.nama_alat} · {detail.jumlah} unit</div>)
                                : <span className="italic text-gray-400">Detail tidak tersedia</span>}
                        </td>
                        <td className="p-3">{item.tgl_pinjam.slice(0, 10)}</td>
                        <td className="p-3">{item.tgl_rencana_kembali.slice(0, 10)}</td>
                        <td className="p-3 font-semibold">{item.status}</td>
                    </tr>
                ))}
                {data.length === 0 && (
                    <tr><td colSpan={6} className="p-8 text-center text-gray-500">Belum ada data peminjaman.</td></tr>
                )}
            </tbody>
        </table>
    );
}

export default function PetugasLaporanPage() {
    const [peminjamanList, setPeminjamanList] = useState<Peminjaman[]>([]);
    const { pageItems, currentPage, totalPages, setPage } = usePagination(peminjamanList);

    useEffect(() => {
        peminjamanService.getAll()
            .then((data) => setPeminjamanList(Array.isArray(data) ? data : []))
            .catch((error: unknown) => console.error('Gagal memuat laporan', error));
    }, []);

    return (
        <div className="mx-auto w-full max-w-7xl print:max-w-none">
            <div className="mb-6 flex flex-col gap-4 print:hidden sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Cetak Laporan Peminjaman</h1>
                    <p className="text-sm text-gray-500">Laporan rekapitulasi data peminjaman alat laboratorium.</p>
                </div>
                <button onClick={() => window.print()} className="w-full rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:w-auto">
                    Cetak / Download PDF
                </button>
            </div>

            <div className="hidden text-center print:mb-6 print:block">
                <h2 className="text-xl font-bold text-gray-900">LAPORAN PEMINJAMAN ALAT</h2>
                <p className="text-xs text-gray-500">Sistem Peminjaman Alat Laboratorium</p>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm print:hidden">
                <div className="overflow-x-auto"><ReportTable data={pageItems} /></div>
            </div>
            <div className="hidden print:block"><ReportTable data={peminjamanList} /></div>

            <div className="print:hidden">
                <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={peminjamanList.length} onPageChange={setPage} />
            </div>
        </div>
    );
}
