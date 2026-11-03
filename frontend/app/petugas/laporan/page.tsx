'use client';

import { useEffect, useState } from 'react';
import { peminjamanService, Peminjaman } from '@/src/services/peminjaman';

export default function PetugasLaporanPage() {
    const [peminjamanList, setPeminjamanList] = useState<Peminjaman[]>([]);

    useEffect(() => {
        peminjamanService.getAll()
            .then(res => setPeminjamanList(Array.isArray(res) ? res : []))
            .catch(err => console.error('Gagal memuat laporan', err));
    }, []);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6 print:hidden">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Cetak Laporan Peminjaman</h1>
                    <p className="text-sm text-gray-500">Laporan rekapitulasi data peminjaman alat laboratorium.</p>
                </div>
                <button 
                    onClick={handlePrint}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-500 shadow-sm"
                >
                    Cetak / Download PDF
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 overflow-hidden">
                <div className="text-center mb-6 hidden print:block">
                    <h2 className="text-xl font-bold text-gray-900">LAPORAN PEMINJAMAN ALAT</h2>
                    <p className="text-xs text-gray-500">Sistem Peminjaman Alat Laboratorium</p>
                </div>

                <table className="w-full text-left border-collapse text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100 text-gray-700">
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
                        {peminjamanList.map((item) => (
                            <tr key={item.id_peminjaman}>
                                <td className="p-3 font-medium">#{item.id_peminjaman}</td>
                                <td className="p-3">{item.username}</td>
                                <td className="p-3">
                                    {item.items.length > 0 ? (
                                        <div className="space-y-1">
                                            {item.items.map((subItem) => (
                                                <div key={subItem.id_detail} className="flex justify-between gap-3 text-xs">
                                                    <span>{subItem.nama_alat}</span>
                                                    <span className="whitespace-nowrap text-gray-500">{subItem.jumlah} unit</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-xs italic text-gray-400">Detail tidak tersedia</span>
                                    )}
                                </td>
                                <td className="p-3">{item.tgl_pinjam?.split('T')[0]}</td>
                                <td className="p-3">{item.tgl_rencana_kembali?.split('T')[0]}</td>
                                <td className="p-3 font-semibold">{item.status}</td>
                            </tr>
                        ))}
                        {peminjamanList.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-6 text-center text-gray-500">Belum ada data peminjaman.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
