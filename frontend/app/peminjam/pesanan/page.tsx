'use client';

import { useEffect, useState } from 'react';
import Pagination from '@/components/pagination';
import { usePagination } from '@/src/hooks/use-pagination';
import {
    peminjamanService,
    Peminjaman,
    StatusPeminjaman
} from '@/src/services/peminjaman';

export default function PeminjamPesananPage() {
    const [pesananList, setPesananList] = useState<Peminjaman[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const { pageItems, currentPage, totalPages, setPage } = usePagination(pesananList);

    useEffect(() => {
        const fetchPesanan = async () => {
            try {
                const res = await peminjamanService.getRiwayatPeminjam();
                setPesananList(Array.isArray(res) ? res : []);
            } catch (err) {
                console.error('Gagal memuat progres pesanan', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPesanan();
    }, []);

    const getStatusStep = (status: StatusPeminjaman) => {
        switch (status) {
            case 'Menunggu': return 1;
            case 'Disetujui': return 2;
            case 'Selesai': return 3;
            default: return 1;
        }
    };

    if (isLoading) {
        return <div className="py-8 text-center text-sm text-gray-500">Memuat data pesanan...</div>;
    }

    return (
        <div className="mx-auto w-full max-w-5xl">
            <h1 className="mb-2 text-xl font-bold text-gray-900 sm:text-2xl">Progres Pesanan Alat</h1>
            <p className="text-sm text-gray-500 mb-8">Pantau status pengajuan peminjaman alat secara real-time.</p>

            <div className="space-y-4">
                {pageItems.map((item) => {
                    const currentStep = getStatusStep(item.status);
                    const daftarAlat = item.items;

                    return (
                        <div key={item.id_peminjaman} className="space-y-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
                            <div className="flex flex-col gap-2 border-b border-gray-100 pb-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="text-xs font-bold text-gray-400">Pesanan #{item.id_peminjaman}</span>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                        item.status === 'Disetujui' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                        item.status === 'Selesai' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                        'bg-amber-50 text-amber-700 border border-amber-200'
                                    }`}>
                                        {item.status}
                                    </span>
                                </div>
                                <span className="text-xs text-gray-500 font-medium">
                                    {item.tgl_pinjam?.split('T')[0]} s/d {item.tgl_rencana_kembali?.split('T')[0]}
                                </span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                <div className={`pb-2 border-b-2 ${currentStep >= 1 ? 'border-indigo-600 text-indigo-600 font-semibold' : 'border-gray-200 text-gray-400'}`}>
                                    Menunggu
                                </div>
                                <div className={`pb-2 border-b-2 ${currentStep >= 2 ? 'border-indigo-600 text-indigo-600 font-semibold' : 'border-gray-200 text-gray-400'}`}>
                                    Disetujui
                                </div>
                                <div className={`pb-2 border-b-2 ${currentStep >= 3 ? 'border-emerald-600 text-emerald-600 font-semibold' : 'border-gray-200 text-gray-400'}`}>
                                    Selesai
                                </div>
                            </div>

                            {/* Daftar Nama dan Jumlah Barang yang Dipesan */}
                            <div className="bg-gray-50 rounded-lg p-3">
                                <span className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Barang yang Dipinjam</span>
                                {daftarAlat.length > 0 ? (
                                    <div className="space-y-1">
                                        {daftarAlat.map((subItem) => (
                                            <div key={subItem.id_detail} className="flex justify-between gap-3 text-xs text-gray-800">
                                                <span className="font-medium">{subItem.nama_alat}</span>
                                                <span className="text-gray-600">{subItem.jumlah} unit</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-400 italic">Tidak ada detail barang.</p>
                                )}
                            </div>

                            <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-700 space-y-1">
                                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                                    <span>Status Petugas: {item.nama_petugas ? `Ditangani ${item.nama_petugas}` : 'Belum ditugaskan'}</span>
                                    <span className="text-gray-400">Dibuat: {item.created_at?.split('T')[0]}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {pesananList.length === 0 && (
                    <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-400 shadow-sm text-sm">
                        Belum ada riwayat peminjaman untuk akun Anda.
                    </div>
                )}
            </div>

            <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={pesananList.length} onPageChange={setPage} />
        </div>
    );
}
