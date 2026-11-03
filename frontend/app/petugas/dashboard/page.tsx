'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import {
    peminjamanService,
    Peminjaman,
    StatusPeminjaman
} from '@/src/services/peminjaman';

const getErrorMessage = (error: unknown, fallback: string) => {
    if (axios.isAxiosError<{ error?: string }>(error)) {
        return error.response?.data?.error || fallback;
    }

    return fallback;
};

export default function PetugasDashboardPage() {
    const [peminjamanList, setPeminjamanList] = useState<Peminjaman[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPinjam, setSelectedPinjam] = useState<Peminjaman | null>(null);
    const [isKembaliOpen, setIsKembaliOpen] = useState(false);
    const [tglKembali, setTglKembali] = useState('');

    const fetchData = async () => {
        const data = await peminjamanService.getAll();
        setPeminjamanList(Array.isArray(data) ? data : []);
    };

    useEffect(() => {
        let isCancelled = false;

        peminjamanService.getAll()
            .then((data) => {
                if (!isCancelled) {
                    setPeminjamanList(Array.isArray(data) ? data : []);
                }
            })
            .catch((error: unknown) => console.error('Gagal memuat data peminjaman', error))
            .finally(() => {
                if (!isCancelled) {
                    setIsLoading(false);
                }
            });

        return () => {
            isCancelled = true;
        };
    }, []);

    const handleUpdateStatus = async (id_peminjaman: number, status: StatusPeminjaman) => {
        if (!confirm(`Ubah status pesanan #${id_peminjaman} menjadi "${status}"?`)) return;
        try {
            await peminjamanService.updateStatus(id_peminjaman, status);
            alert(`Status berhasil diubah ke ${status}`);
            fetchData();
        } catch (error: unknown) {
            alert(getErrorMessage(error, 'Gagal mengubah status'));
        }
    };

    const handleProsesKembali = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPinjam) return;
        try {
            await peminjamanService.kembalikanAlat(selectedPinjam.id_peminjaman, tglKembali);
            alert('Pengembalian alat berhasil diproses!');
            setIsKembaliOpen(false);
            setTglKembali('');
            fetchData();
        } catch (error: unknown) {
            alert(getErrorMessage(error, 'Gagal memproses pengembalian'));
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500 text-sm">Memuat data asli dari database...</div>;
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Manajemen & Persetujuan Peminjaman</h1>
            <p className="text-sm text-gray-500 mb-8">Data real-time langsung dari tabel database peminjaman.</p>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100 text-gray-700">
                        <tr>
                            <th className="p-4 font-semibold">ID</th>
                            <th className="p-4 font-semibold">Nama Peminjam</th>
                            <th className="p-4 font-semibold">Barang yang Dipinjam</th>
                            <th className="p-4 font-semibold">Tgl Pinjam</th>
                            <th className="p-4 font-semibold">Rencana Kembali</th>
                            <th className="p-4 font-semibold">Status</th>
                            <th className="p-4 font-semibold text-center">Aksi Petugas</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-800 align-top">
                        {peminjamanList.map((item) => (
                            <tr key={item.id_peminjaman} className="hover:bg-gray-50">
                                <td className="p-4 font-medium">#{item.id_peminjaman}</td>
                                <td className="p-4 font-semibold text-gray-900">{item.username}</td>
                                <td className="p-4">
                                    <div className="space-y-1">
                                        {item.items && item.items.length > 0 ? (
                                            item.items.map((sub) => (
                                                <div key={sub.id_detail} className="text-xs text-gray-700 flex justify-between gap-3">
                                                    <span>• {sub.nama_alat}</span>
                                                    <span className="font-semibold text-gray-500">{sub.jumlah} unit</span>
                                                </div>
                                            ))
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">Belum ada detail barang tercatat</span>
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
                                <td className="p-4 text-center space-x-2">
                                    {item.status === 'Menunggu' && (
                                        <>
                                            <button 
                                                onClick={() => handleUpdateStatus(item.id_peminjaman, 'Disetujui')}
                                                className="bg-emerald-600 text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-emerald-500 shadow-sm"
                                            >
                                                Setujui
                                            </button>
                                            <button 
                                                onClick={() => handleUpdateStatus(item.id_peminjaman, 'Ditolak')}
                                                className="bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded-lg text-xs font-medium hover:bg-red-100"
                                            >
                                                Tolak
                                            </button>
                                        </>
                                    )}
                                    {item.status === 'Disetujui' && (
                                        <button 
                                            onClick={() => { setSelectedPinjam(item); setIsKembaliOpen(true); }}
                                            className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-indigo-500 shadow-sm"
                                        >
                                            Proses Pengembalian
                                        </button>
                                    )}
                                    {item.status === 'Selesai' && (
                                        <span className="text-xs text-gray-400 italic">Selesai</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {peminjamanList.length === 0 && (
                            <tr>
                                <td colSpan={7} className="p-6 text-center text-gray-500">Belum ada data peminjaman di database.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Pengembalian */}
            {isKembaliOpen && selectedPinjam && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg space-y-4">
                        <h2 className="text-lg font-bold text-gray-900">Proses Pengembalian Alat</h2>
                        <p className="text-xs text-gray-500">Peminjaman ID: <span className="font-semibold text-gray-800">#{selectedPinjam.id_peminjaman}</span></p>

                        <form onSubmit={handleProsesKembali} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Tanggal Pengembalian Sebenarnya</label>
                                <input 
                                    type="date" 
                                    required 
                                    value={tglKembali} 
                                    onChange={e => setTglKembali(e.target.value)} 
                                    className="w-full border rounded-lg px-3 py-2 text-sm bg-white text-gray-900 border-gray-300" 
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button 
                                    type="button" 
                                    onClick={() => setIsKembaliOpen(false)} 
                                    className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-500"
                                >
                                    Simpan Pengembalian
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
