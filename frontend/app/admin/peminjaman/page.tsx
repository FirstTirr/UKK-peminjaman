'use client';

import { useEffect, useState } from 'react';
import api from '@/src/lib/api';

export default function AdminPeminjamanPage() {
    const [peminjamanList, setPeminjamanList] = useState<any[]>([]);

    useEffect(() => {
        api.get('/peminjaman/read')
            .then(res => setPeminjamanList(res.data))
            .catch(err => console.error('Gagal memuat data peminjaman', err));
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Data Peminjaman Alat</h1>
            
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100 text-gray-700">
                        <tr>
                            <th className="p-4 font-semibold">ID</th>
                            <th className="p-4 font-semibold">Peminjam</th>
                            <th className="p-4 font-semibold">Tgl Pinjam</th>
                            <th className="p-4 font-semibold">Rencana Kembali</th>
                            <th className="p-4 font-semibold">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-800">
                        {peminjamanList.map((item) => (
                            <tr key={item.id_peminjaman} className="hover:bg-gray-50">
                                <td className="p-4">#{item.id_peminjaman}</td>
                                <td className="p-4 font-medium">{item.username || item.nama_user || 'User'}</td>
                                <td className="p-4">{item.tgl_pinjam?.slice(0, 10)}</td>
                                <td className="p-4">{item.tgl_rencana_kembali?.slice(0, 10)}</td>
                                <td className="p-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                        item.status === 'disetujui' ? 'bg-green-50 text-green-700 border border-green-200' :
                                        item.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                                        'bg-gray-100 text-gray-700'
                                    }`}>
                                        {item.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {peminjamanList.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-6 text-center text-gray-500">Belum ada data peminjaman.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}