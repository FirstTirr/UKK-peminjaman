'use client';

import { useEffect, useState } from 'react';
import Pagination from '@/components/pagination';
import { usePagination } from '@/src/hooks/use-pagination';
import { kategoriService, Kategori } from '@/src/services/kategori';

export default function AdminKategoriPage() {
    const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedKat, setSelectedKat] = useState<Kategori | null>(null);
    const [namaKategori, setNamaKategori] = useState('');
    const { pageItems, currentPage, totalPages, startIndex, setPage } = usePagination(kategoriList);

    const fetchKategori = async () => {
        try {
            const res = await kategoriService.getAll();
            setKategoriList(Array.isArray(res) ? res : []);
        } catch (err) {
            console.error('Gagal memuat kategori', err);
        }
    };

    useEffect(() => {
        let isCancelled = false;
        kategoriService.getAll()
            .then((data) => {
                if (!isCancelled) setKategoriList(Array.isArray(data) ? data : []);
            })
            .catch((error: unknown) => console.error('Gagal memuat kategori', error));

        return () => {
            isCancelled = true;
        };
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await kategoriService.create(namaKategori);
            setIsAddOpen(false);
            setNamaKategori('');
            fetchKategori();
        } catch {
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
        } catch {
            alert('Gagal memperbarui kategori');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Yakin ingin menghapus kategori ini?')) return;
        try {
            await kategoriService.delete(id);
            fetchKategori();
        } catch {
            alert('Gagal menghapus kategori');
        }
    };

    return (
        <div className="mx-auto w-full max-w-7xl">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Manajemen Kategori</h1>
                <button 
                    onClick={() => setIsAddOpen(true)}
                    className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-indigo-500 transition-colors"
                >
                    + Tambah Kategori
                </button>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-left border-collapse text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100 text-gray-700">
                        <tr>
                            <th className="p-4 font-semibold">No</th>
                            <th className="p-4 font-semibold">Nama Kategori</th>
                            <th className="p-4 font-semibold text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-800">
                        {pageItems.map((item, index) => (
                            <tr key={item.id_kategori} className="hover:bg-gray-50">
                                <td className="p-4">{startIndex + index + 1}</td>
                                <td className="p-4 font-medium">{item.nama_kategori}</td>
                                <td className="p-4"><div className="flex flex-wrap justify-center gap-2">
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
                                </div></td>
                            </tr>
                        ))}
                        {kategoriList.length === 0 && (
                            <tr><td colSpan={3} className="p-8 text-center text-gray-500">Belum ada data kategori.</td></tr>
                        )}
                    </tbody>
                </table>
                </div>
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={kategoriList.length} onPageChange={setPage} />

            {/* Modal Tambah */}
            {isAddOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-5 shadow-lg sm:p-6">
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
                    <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-5 shadow-lg sm:p-6">
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
