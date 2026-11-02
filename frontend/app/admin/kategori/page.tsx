'use client';

import { useEffect, useState } from 'react';
import { kategoriService } from '@/src/services/kategori';

export default function AdminKategoriPage() {
    const [kategoriList, setKategoriList] = useState<any[]>([]);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedKat, setSelectedKat] = useState<any>(null);
    const [namaKategori, setNamaKategori] = useState('');

    const fetchKategori = async () => {
        try {
            const res = await kategoriService.getAll();
            setKategoriList(res);
        } catch (err) {
            console.error('Gagal memuat kategori', err);
        }
    };

    useEffect(() => {
        fetchKategori();
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await kategoriService.create(namaKategori);
            setIsAddOpen(false);
            setNamaKategori('');
            fetchKategori();
        } catch (err) {
            alert('Gagal menambah kategori');
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedKat) return;
        try {
            await kategoriService.update(selectedKat.id_kategori, selectedKat.nama_kategori);
            setIsEditOpen(false);
            fetchKategori();
        } catch (err) {
            alert('Gagal memperbarui kategori');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Yakin ingin menghapus kategori ini?')) return;
        try {
            await kategoriService.delete(id);
            fetchKategori();
        } catch (err) {
            alert('Gagal menghapus kategori');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Manajemen Kategori</h1>
                <button 
                    onClick={() => setIsAddOpen(true)}
                    className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-indigo-500 transition-colors"
                >
                    + Tambah Kategori
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100 text-gray-700">
                        <tr>
                            <th className="p-4 font-semibold">No</th>
                            <th className="p-4 font-semibold">Nama Kategori</th>
                            <th className="p-4 font-semibold text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-800">
                        {kategoriList.map((item, index) => (
                            <tr key={item.id_kategori} className="hover:bg-gray-50">
                                <td className="p-4">{index + 1}</td>
                                <td className="p-4 font-medium">{item.nama_kategori}</td>
                                <td className="p-4 text-center space-x-2">
                                    <button 
                                        onClick={() => { setSelectedKat(item); setIsEditOpen(true); }}
                                        className="text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 text-xs font-medium"
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(item.id_kategori)} 
                                        className="text-red-600 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 text-xs font-medium"
                                    >
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Tambah */}
            {isAddOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Tambah Kategori Baru</h2>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kategori</label>
                                <input type="text" required value={namaKategori} onChange={e => setNamaKategori(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm bg-white text-gray-900" />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2 border rounded-lg text-sm text-gray-600">Batal</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Edit */}
            {isEditOpen && selectedKat && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Edit Kategori</h2>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kategori</label>
                                <input type="text" required value={selectedKat.nama_kategori} onChange={e => setSelectedKat({...selectedKat, nama_kategori: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm bg-white text-gray-900" />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => setIsEditOpen(false)} className="px-4 py-2 border rounded-lg text-sm text-gray-600">Batal</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold">Perbarui</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}