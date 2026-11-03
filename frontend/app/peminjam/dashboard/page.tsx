'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { alatService } from '@/src/services/alat';
import { peminjamanService, PayloadPeminjaman } from '@/src/services/peminjaman';

interface Alat {
    id_alat: number;
    nama_alat: string;
    harga_perhari: number | string;
    stok: number;
}

interface AlatTerpilih {
    id_alat: number;
    nama_alat: string;
    harga_perhari: number;
    stok: number;
    jumlah: number;
}

export default function PeminjamCatalogPage() {
    const [alatList, setAlatList] = useState<Alat[]>([]);
    const [alamat, setAlamat] = useState('');
    const [tglPinjam, setTglPinjam] = useState('');
    const [tglRencanaKembali, setTglRencanaKembali] = useState('');
    const [selectedAlatId, setSelectedAlatId] = useState('');
    const [jumlah, setJumlah] = useState(1);
    const [selectedItems, setSelectedItems] = useState<AlatTerpilih[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        alatService.getAll()
            .then(res => setAlatList(Array.isArray(res) ? res : []))
            .catch(err => console.error('Gagal memuat alat', err));
    }, []);

    const handleAddAlat = () => {
        if (!selectedAlatId) return;
        const alat = alatList.find(a => String(a.id_alat) === String(selectedAlatId));
        if (!alat) return;

        if (jumlah > alat.stok) {
            alert(`Stok tidak mencukupi! Maksimal: ${alat.stok}`);
            return;
        }

        const existingIndex = selectedItems.findIndex(i => i.id_alat === alat.id_alat);
        if (existingIndex >= 0) {
            const updated = [...selectedItems];
            const newTotal = updated[existingIndex].jumlah + jumlah;
            if (newTotal > alat.stok) {
                alert(`Total jumlah melebihi stok tersedia (${alat.stok})`);
                return;
            }
            updated[existingIndex].jumlah = newTotal;
            setSelectedItems(updated);
        } else {
            setSelectedItems([...selectedItems, {
                id_alat: alat.id_alat,
                nama_alat: alat.nama_alat,
                harga_perhari: Number(alat.harga_perhari || 0),
                stok: alat.stok,
                jumlah: jumlah
            }]);
        }
        setSelectedAlatId('');
        setJumlah(1);
    };

    const handleRemoveItem = (id_alat: number) => {
        setSelectedItems(selectedItems.filter(i => i.id_alat !== id_alat));
    };

    const totalJenis = selectedItems.length;
    const totalUnit = selectedItems.reduce((acc, curr) => acc + curr.jumlah, 0);

    let lamaHari = 0;
    if (tglPinjam && tglRencanaKembali) {
        const start = new Date(tglPinjam);
        const end = new Date(tglRencanaKembali);
        const diffTime = end.getTime() - start.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        lamaHari = diffDays > 0 ? diffDays : 0;
    }

    const totalEstimasi = selectedItems.reduce((acc, curr) => {
        return acc + (curr.jumlah * curr.harga_perhari * (lamaHari > 0 ? lamaHari : 1));
    }, 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!alamat.trim()) {
            alert('Mohon lengkapi alamat pengantaran.');
            return;
        }
        if (selectedItems.length === 0) {
            alert('Pilih minimal satu alat.');
            return;
        }
        if (!tglPinjam || !tglRencanaKembali) {
            alert('Tanggal peminjaman dan rencana kembali wajib diisi.');
            return;
        }

        try {
            setIsSubmitting(true);
            const payload: PayloadPeminjaman = {
                tgl_pinjam: tglPinjam,
                tgl_rencana_kembali: tglRencanaKembali,
                items: selectedItems.map(i => ({ id_alat: i.id_alat, jumlah: i.jumlah }))
            };
            await peminjamanService.ajukanPeminjaman(payload);

            alert('Pengajuan peminjaman berhasil dikirim!');
            setSelectedItems([]);
            setAlamat('');
            setTglPinjam('');
            setTglRencanaKembali('');
        } catch (error: unknown) {
            const message = axios.isAxiosError<{ error?: string }>(error)
                ? error.response?.data?.error
                : undefined;
            alert(message || 'Gagal mengajukan peminjaman');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl mb-6 text-sm">
                Lengkapi alamat pada bagian <span className="font-semibold">Data Pengiriman</span> sebelum mengirim pengajuan.
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h2 className="text-base font-bold text-gray-900 mb-1">Data Pengiriman</h2>
                        <p className="text-xs text-gray-500 mb-4">Dipakai petugas untuk mengantarkan alat.</p>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Alamat Pengantaran</label>
                            <input 
                                type="text" 
                                required
                                value={alamat}
                                onChange={e => setAlamat(e.target.value)}
                                placeholder="Jalan, nomor, kelurahan, kota" 
                                className="w-full border rounded-lg px-3 py-2 text-sm bg-white text-gray-900 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                            />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h2 className="text-base font-bold text-gray-900 mb-1">Pilih Alat</h2>
                        <p className="text-xs text-gray-500 mb-4">Bebas menambah lebih dari satu jenis alat dalam satu pengajuan.</p>
                        
                        <div className="flex flex-col sm:flex-row gap-3 items-end mb-4">
                            <div className="flex-1 w-full">
                                <label className="block text-xs font-medium text-gray-700 mb-1">Alat</label>
                                <select 
                                    value={selectedAlatId} 
                                    onChange={e => setSelectedAlatId(e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2 text-sm bg-white text-gray-900 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="">-- Pilih Alat --</option>
                                    {alatList.map(item => (
                                        <option key={item.id_alat} value={item.id_alat}>
                                            {item.nama_alat} (Stok: {item.stok})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="w-full sm:w-28">
                                <label className="block text-xs font-medium text-gray-700 mb-1">Jumlah</label>
                                <input 
                                    type="number" 
                                    min="1" 
                                    value={jumlah} 
                                    onChange={e => setJumlah(parseInt(e.target.value) || 1)}
                                    className="w-full border rounded-lg px-3 py-2 text-sm bg-white text-gray-900 border-gray-300 text-center" 
                                />
                            </div>
                            <button 
                                type="button" 
                                onClick={handleAddAlat}
                                className="w-full sm:w-auto px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 rounded-lg text-sm font-semibold transition-colors"
                            >
                                + Tambah
                            </button>
                        </div>

                        {selectedItems.length > 0 ? (
                            <div className="border border-gray-100 rounded-lg overflow-hidden mt-4">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 text-gray-700 border-b border-gray-100">
                                        <tr>
                                            <th className="p-3 font-semibold">Nama Alat</th>
                                            <th className="p-3 font-semibold text-center">Jumlah</th>
                                            <th className="p-3 font-semibold text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {selectedItems.map(item => (
                                            <tr key={item.id_alat} className="hover:bg-gray-50">
                                                <td className="p-3 font-medium text-gray-900">{item.nama_alat}</td>
                                                <td className="p-3 text-center">{item.jumlah}</td>
                                                <td className="p-3 text-right">
                                                    <button 
                                                        type="button" 
                                                        onClick={() => handleRemoveItem(item.id_alat)}
                                                        className="text-red-600 hover:text-red-800 text-xs font-medium bg-red-50 px-2.5 py-1 rounded border border-red-100"
                                                    >
                                                        Hapus
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-xs text-gray-400 italic mt-2">Belum ada alat yang dipilih.</p>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h2 className="text-base font-bold text-gray-900 mb-4">Tanggal Peminjaman</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Tgl Pinjam</label>
                                <input 
                                    type="date" 
                                    required
                                    value={tglPinjam}
                                    onChange={e => setTglPinjam(e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2 text-sm bg-white text-gray-900 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Rencana Kembali</label>
                                <input 
                                    type="date" 
                                    required
                                    value={tglRencanaKembali}
                                    onChange={e => setTglRencanaKembali(e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2 text-sm bg-white text-gray-900 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm sticky top-6 space-y-4">
                        <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">Ringkasan Pengajuan</h2>
                        
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Isi keranjang</span>
                                <span className="font-semibold text-gray-900">{totalJenis} jenis · {totalUnit} unit</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Lama pinjam</span>
                                <span className="font-semibold text-gray-900">{lamaHari > 0 ? `${lamaHari} hari` : '—'}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Kirim ke</span>
                                <span className="font-semibold text-gray-900 truncate max-w-[160px]">{alamat || '—'}</span>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-4">
                            <span className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">Total Estimasi</span>
                            <div className="text-2xl font-bold text-indigo-600">
                                Rp {totalEstimasi.toLocaleString('id-ID')}
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-500 transition-colors disabled:bg-gray-300 mt-4 shadow-sm"
                        >
                            {isSubmitting ? 'Mengirim...' : 'Kirim Pengajuan'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
