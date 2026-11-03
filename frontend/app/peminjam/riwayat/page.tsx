'use client';

import { useEffect, useState } from 'react';
import Pagination from '@/components/pagination';
import { usePagination } from '@/src/hooks/use-pagination';
import { peminjamanService, Peminjaman } from '@/src/services/peminjaman';

export default function PeminjamRiwayatPage() {
    const [riwayatList, setRiwayatList] = useState<Peminjaman[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { pageItems, currentPage, totalPages, setPage } = usePagination(riwayatList);

    useEffect(() => {
        const fetchRiwayat = async () => {
            try {
                const res = await peminjamanService.getRiwayatPeminjam();
                setRiwayatList(Array.isArray(res) ? res : []);
            } catch (err) {
                console.error('Gagal memuat riwayat peminjaman', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRiwayat();
    }, []);

    if (isLoading) {
        return <div className="py-8 text-center text-sm text-gray-500">Memuat riwayat...</div>;
    }

    return (
        <div className="mx-auto w-full max-w-7xl">
            <h1 className="mb-2 text-xl font-bold text-gray-900 sm:text-2xl">Riwayat Peminjaman Alat</h1>
            <p className="text-sm text-gray-500 mb-6">Daftar seluruh riwayat pengajuan peminjaman alat Anda.</p>

            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="overflow-x-auto">
                <table className="w-full min-w-[780px] text-left border-collapse text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100 text-gray-700">
                        <tr>
                            <th className="p-4 font-semibold">ID</th>
                            <th className="p-4 font-semibold">Barang yang Dipinjam</th>
                            <th className="p-4 font-semibold">Tgl Pinjam</th>
                            <th className="p-4 font-semibold">Rencana Kembali</th>
                            <th className="p-4 font-semibold">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-800">
                        {pageItems.map((item) => {
                            const daftarAlat = item.items;
                            return (
                                <tr key={item.id_peminjaman} className="hover:bg-gray-50 align-top">
                                    <td className="p-4 font-medium">#{item.id_peminjaman}</td>
                                    <td className="p-4">
                                        <div className="space-y-1">
                                            {daftarAlat.length > 0 ? (
                                                daftarAlat.map((subItem) => (
                                                    <div key={subItem.id_detail} className="text-xs text-gray-800 flex justify-between gap-4">
                                                        <span className="font-medium">• {subItem.nama_alat}</span>
                                                        <span className="text-gray-500">{subItem.jumlah} unit</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">Detail barang tidak ditemukan di database</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4">{item.tgl_pinjam?.split('T')[0]}</td>
                                    <td className="p-4">{item.tgl_rencana_kembali?.split('T')[0]}</td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                            item.status === 'Disetujui' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                            item.status === 'Selesai' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                            'bg-amber-50 text-amber-700 border border-amber-200'
                                        }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                        {riwayatList.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-6 text-center text-gray-500">Belum ada riwayat peminjaman.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                </div>
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={riwayatList.length} onPageChange={setPage} />
        </div>
    );
}
