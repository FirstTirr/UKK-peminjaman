'use client';

import { useEffect, useState } from 'react';
import api from '@/src/lib/api';

export default function AdminPengembalianPage() {
    const [pengembalianList, setPengembalianList] = useState<any[]>([]);

    useEffect(() => {
        // Mengambil data peminjaman/pengembalian dari backend
        api.get('/peminjaman/read')
            .then(res => {
                // Filter yang statusnya dikembalikan atau sudah selesai
                const data = Array.isArray(res.data) ? res.data.filter((item: any) => item.status === 'dikembalikan' || item.status === 'selesai') : [];
                setPengembalianList(data);
            })
            .catch(err => console.error('Gagal memuat data pengembalian', err));
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Data Pengembalian Alat</h1>
            
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100 text-gray-700">
                        <tr>
                            <th className="p-4 font-semibold">ID</th>
                            <th className="p-4 font-semibold">Peminjam</th>
                            <th className="p-4 font-semibold">Tgl Rencana Kembali</th>
                            <th className="p-4 font-semibold">Tgl Dikembalikan</th>
                            <th className="p-4 font-semibold">Denda (Rp)</th>
                            <th className="p-4 font-semibold">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-800">
                        {pengembalianList.map((item) => (
                            <tr key={item.id_peminjaman} className="hover:bg-gray-50">
                                <td className="p-4">#{item.id_peminjaman}</td>
                                <td className="p-4 font-medium">{item.username || item.nama_user || 'User'}</td>
                                <td className="p-4">{item.tgl_rencana_kembali?.slice(0, 10)}</td>
                                <td className="p-4">{item.tgl_kembali_sebenarnya?.slice(0, 10) || '-'}</td>
                                <td className="p-4 text-red-600 font-semibold">
                                    Rp {Number(item.denda || 0).toLocaleString('id-ID')}
                                </td>
                                <td className="p-4">
                                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                                        {item.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {pengembalianList.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-6 text-center text-gray-500">Belum ada data pengembalian alat.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}