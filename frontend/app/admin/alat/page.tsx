'use client';

import { useEffect, useState } from 'react';
import Pagination from '@/components/pagination';
import { usePagination } from '@/src/hooks/use-pagination';
import { alatService, Alat } from '@/src/services/alat';
import { kategoriService, Kategori } from '@/src/services/kategori';

export default function AdminAlatPage() {
    const [alatList, setAlatList] = useState<Alat[]>([]);
    const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
    
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedAlat, setSelectedAlat] = useState<Alat | null>(null);

    const [namaAlat, setNamaAlat] = useState('');
    const [stok, setStok] = useState('');
    const [hargaPerHari, setHargaPerHari] = useState('');
    const [idKategori, setIdKategori] = useState('');
    const { pageItems, currentPage, totalPages, startIndex, setPage } = usePagination(alatList);

    const fetchData = async () => {
        try {
            const [resAlat, resKat] = await Promise.all([
                alatService.getAll(),
                kategoriService.getAll()
            ]);
            setAlatList(Array.isArray(resAlat) ? resAlat : []);
            setKategoriList(Array.isArray(resKat) ? resKat : []);
        } catch (err) {
            console.error('Gagal mengambil data alat', err);
        }
    };

    useEffect(() => {
        let isCancelled = false;
        Promise.all([alatService.getAll(), kategoriService.getAll()])
            .then(([alat, kategori]) => {
                if (!isCancelled) {
                    setAlatList(Array.isArray(alat) ? alat : []);
                    setKategoriList(Array.isArray(kategori) ? kategori : []);
                }
            })
            .catch((error: unknown) => console.error('Gagal mengambil data alat', error));

        return () => {
            isCancelled = true;
        };
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await alatService.create({ 
                nama_alat: namaAlat, 
                stok: Number(stok), 
                harga_perhari: hargaPerHari ? Number(hargaPerHari) : 0,
                id_kategori: Number(idKategori) 
            });
            setIsAddOpen(false);
            setNamaAlat('');
            setStok('');
            setHargaPerHari('');
            setIdKategori('');
            fetchData();
        } catch {
            alert('Gagal menambah alat');
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAlat) return;
        try {
            await alatService.update(selectedAlat.id_alat, {
                nama_alat: selectedAlat.nama_alat,
                stok: Number(selectedAlat.stok),
                harga_perhari: selectedAlat.harga_perhari ? Number(selectedAlat.harga_perhari) : 0,
                id_kategori: Number(selectedAlat.id_kategori)
            });
            setIsEditOpen(false);
            fetchData();
        } catch {
            alert('Gagal memperbarui alat');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Yakin ingin menghapus alat ini?')) return;
        try {
            await alatService.delete(id);
            fetchData();
        } catch {
            alert('Gagal menghapus alat');
        }
    };

    return (
        <div className="mx-auto w-full max-w-7xl">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Manajemen Alat</h1>
                <button 
                    onClick={() => setIsAddOpen(true)}
                    className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-indigo-500 transition-colors"
                >
                    + Tambah Alat
                </button>
            </div>

            {/* Tabel Alat */}
            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="overflow-x-auto">
                <table className="w-full min-w-[780px] text-left border-collapse text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100 text-gray-700">
                        <tr>
                            <th className="p-4 font-semibold">No</th>
                            <th className="p-4 font-semibold">Nama Alat</th>
                            <th className="p-4 font-semibold">Stok</th>
                            <th className="p-4 font-semibold">Harga / Hari</th>
                            <th className="p-4 font-semibold">Kategori</th>
                            <th className="p-4 font-semibold text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-800">
                        {pageItems.map((item, index) => (
                            <tr key={item.id_alat} className="hover:bg-gray-50">
                                <td className="p-4">{startIndex + index + 1}</td>
                                <td className="p-4 font-medium">{item.nama_alat}</td>
                                <td className="p-4">{item.stok}</td>
                                <td className="p-4 font-medium text-gray-900">
                                    {item.harga_perhari ? `Rp ${Number(item.harga_perhari).toLocaleString('id-ID')}` : '-'}
                                </td>
                                <td className="p-4">{item.nama_kategori || '-'}</td>
                                <td className="p-4"><div className="flex flex-wrap justify-center gap-2">
                                    <button 
                                        onClick={() => { setSelectedAlat(item); setIsDetailOpen(true); }}
                                        className="text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 text-xs font-medium"
                                    >
                                        Detail
                                    </button>
                                    <button 
                                        onClick={() => { setSelectedAlat(item); setIsEditOpen(true); }}
                                        className="text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 text-xs font-medium"
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(item.id_alat)} 
                                        className="text-red-600 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 text-xs font-medium"
                                    >
                                        Hapus
                                    </button>
                                </div></td>
                            </tr>
                        ))}
                        {alatList.length === 0 && (
                            <tr><td colSpan={6} className="p-8 text-center text-gray-500">Belum ada data alat.</td></tr>
                        )}
                    </tbody>
                </table>
                </div>
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={alatList.length} onPageChange={setPage} />

            {/* Modal Tambah */}
            {isAddOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-5 shadow-lg sm:p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Tambah Alat Baru</h2>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Alat</label>
                                <input type="text" required value={namaAlat} onChange={e => setNamaAlat(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm bg-white text-gray-900 placeholder-gray-400 border-gray-300" placeholder="Nama alat..." />
                            </div>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Stok</label>
                                    <input type="number" required value={stok} onChange={e => setStok(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm bg-white text-gray-900 placeholder-gray-400 border-gray-300" placeholder="0" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Harga / Hari (Rp)</label>
                                    <input type="number" value={hargaPerHari} onChange={e => setHargaPerHari(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm bg-white text-gray-900 placeholder-gray-400 border-gray-300" placeholder="0" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                                <select required value={idKategori} onChange={e => setIdKategori(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm bg-white text-gray-900 border-gray-300">
                                    <option value="">Pilih Kategori</option>
                                    {kategoriList.map(k => <option key={k.id_kategori} value={k.id_kategori}>{k.nama_kategori}</option>)}
                                </select>
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
            {isEditOpen && selectedAlat && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-5 shadow-lg sm:p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Edit Data Alat</h2>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Alat</label>
                                <input type="text" required value={selectedAlat.nama_alat} onChange={e => setSelectedAlat({...selectedAlat, nama_alat: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm bg-white text-gray-900 border-gray-300" />
                            </div>
                             <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Stok</label>
                                    <input type="number" required value={selectedAlat.stok} onChange={e => setSelectedAlat({...selectedAlat, stok: Number(e.target.value)})} className="w-full border rounded-lg px-3 py-2 text-sm bg-white text-gray-900 border-gray-300" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Harga / Hari (Rp)</label>
                                    <input type="number" value={selectedAlat.harga_perhari || ''} onChange={e => setSelectedAlat({...selectedAlat, harga_perhari: Number(e.target.value)})} className="w-full border rounded-lg px-3 py-2 text-sm bg-white text-gray-900 border-gray-300" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                                <select required value={selectedAlat.id_kategori} onChange={e => setSelectedAlat({...selectedAlat, id_kategori: Number(e.target.value)})} className="w-full border rounded-lg px-3 py-2 text-sm bg-white text-gray-900 border-gray-300">
                                    {kategoriList.map(k => <option key={k.id_kategori} value={k.id_kategori}>{k.nama_kategori}</option>)}
                                </select>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => setIsEditOpen(false)} className="px-4 py-2 border rounded-lg text-sm text-gray-600">Batal</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold">Perbarui</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Detail */}
            {isDetailOpen && selectedAlat && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-5 shadow-lg sm:p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Detail Alat</h2>
                        <div className="space-y-3 text-sm text-gray-700">
                            <p><strong>ID Alat:</strong> #{selectedAlat.id_alat}</p>
                            <p><strong>Nama Alat:</strong> {selectedAlat.nama_alat}</p>
                            <p><strong>Stok Tersedia:</strong> {selectedAlat.stok}</p>
                            <p><strong>Harga / Hari:</strong> {selectedAlat.harga_perhari ? `Rp ${Number(selectedAlat.harga_perhari).toLocaleString('id-ID')}` : '-'}</p>
                            <p><strong>Kategori:</strong> {selectedAlat.nama_kategori || '-'}</p>
                        </div>
                        <div className="flex justify-end pt-4">
                            <button onClick={() => setIsDetailOpen(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold">Tutup</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
