'use client';

import { useEffect, useState } from 'react';
import { userService } from '@/src/services/user';

export default function AdminUserPage() {
    const [userList, setUserList] = useState<any[]>([]);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);

    // Form States
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('peminjam');
    const [noHp, setNoHp] = useState('');
    const [alamat, setAlamat] = useState('');

    const fetchUsers = async () => {
        try {
            const res = await userService.getAll();
            setUserList(Array.isArray(res) ? res : []);
        } catch (err) {
            console.error('Gagal memuat data user', err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await userService.create({
                username,
                password,
                role,
                no_hp: noHp,
                alamat
            });
            setIsAddOpen(false);
            setUsername('');
            setPassword('');
            setRole('peminjam');
            setNoHp('');
            setAlamat('');
            fetchUsers();
        } catch (err: any) {
            alert(err.response?.data?.error || 'Gagal menambah user');
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;
        try {
            const payload: any = {
                username: selectedUser.username,
                role: selectedUser.role,
                no_hp: selectedUser.no_hp,
                alamat: selectedUser.alamat
            };
            if (selectedUser.password) {
                payload.password = selectedUser.password;
            }

            await userService.update(selectedUser.id_user || selectedUser.id, payload);
            setIsEditOpen(false);
            fetchUsers();
        } catch (err: any) {
            alert(err.response?.data?.error || 'Gagal memperbarui user');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Yakin ingin menghapus user ini?')) return;
        try {
            await userService.delete(id);
            fetchUsers();
        } catch (err: any) {
            alert(err.response?.data?.error || 'Gagal menghapus user');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Manajemen Pengguna (User)</h1>
                <button 
                    onClick={() => setIsAddOpen(true)}
                    className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-indigo-500 transition-colors"
                >
                    + Tambah User
                </button>
            </div>

            {/* Tabel User */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100 text-gray-700">
                        <tr>
                            <th className="p-4 font-semibold">No</th>
                            <th className="p-4 font-semibold">Username</th>
                            <th className="p-4 font-semibold">Role</th>
                            <th className="p-4 font-semibold">No. HP</th>
                            <th className="p-4 font-semibold text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-800">
                        {userList.map((item, index) => (
                            <tr key={item.id_user || item.id} className="hover:bg-gray-50">
                                <td className="p-4">{index + 1}</td>
                                <td className="p-4 font-medium">{item.username}</td>
                                <td className="p-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                        item.role === 'admin' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                                        item.role === 'petugas' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                        'bg-gray-100 text-gray-700'
                                    }`}>
                                        {item.role}
                                    </span>
                                </td>
                                <td className="p-4">{item.no_hp || '-'}</td>
                                <td className="p-4 text-center space-x-2">
                                    <button 
                                        onClick={() => { setSelectedUser(item); setIsDetailOpen(true); }}
                                        className="text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 text-xs font-medium"
                                    >
                                        Detail
                                    </button>
                                    <button 
                                        onClick={() => { setSelectedUser(item); setIsEditOpen(true); }}
                                        className="text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 text-xs font-medium"
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(item.id_user || item.id)} 
                                        className="text-red-600 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 text-xs font-medium"
                                    >
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {userList.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-6 text-center text-gray-500">Belum ada data pengguna.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Tambah User */}
            {isAddOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Tambah User Baru</h2>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                <input type="text" required value={username} onChange={e => setUsername(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm bg-white text-gray-900 border-gray-300" placeholder="Username..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm bg-white text-gray-900 border-gray-300" placeholder="••••••••" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <select value={role} onChange={e => setRole(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm bg-white text-gray-900 border-gray-300">
                                    <option value="admin">Admin</option>
                                    <option value="petugas">Petugas</option>
                                    <option value="peminjam">Peminjam</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">No. HP</label>
                                <input type="text" value={noHp} onChange={e => setNoHp(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm bg-white text-gray-900 border-gray-300" placeholder="08xxxxxxxxxx" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                                <textarea value={alamat} onChange={e => setAlamat(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm bg-white text-gray-900 border-gray-300" rows={2} placeholder="Alamat lengkap..." />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2 border rounded-lg text-sm text-gray-600">Batal</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Edit User */}
            {isEditOpen && selectedUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Edit Data User</h2>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                <input type="text" required value={selectedUser.username} onChange={e => setSelectedUser({...selectedUser, username: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm bg-white text-gray-900 border-gray-300" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru <span className="text-xs text-gray-400 font-normal">(Kosongkan jika tidak diubah)</span></label>
                                <input type="password" value={selectedUser.password || ''} onChange={e => setSelectedUser({...selectedUser, password: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm bg-white text-gray-900 border-gray-300" placeholder="Biarkan kosong jika tetap" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <select value={selectedUser.role} onChange={e => setSelectedUser({...selectedUser, role: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm bg-white text-gray-900 border-gray-300">
                                    <option value="admin">Admin</option>
                                    <option value="petugas">Petugas</option>
                                    <option value="peminjam">Peminjam</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">No. HP</label>
                                <input type="text" value={selectedUser.no_hp || ''} onChange={e => setSelectedUser({...selectedUser, no_hp: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm bg-white text-gray-900 border-gray-300" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                                <textarea value={selectedUser.alamat || ''} onChange={e => setSelectedUser({...selectedUser, alamat: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm bg-white text-gray-900 border-gray-300" rows={2} />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => setIsEditOpen(false)} className="px-4 py-2 border rounded-lg text-sm text-gray-600">Batal</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold">Perbarui</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Detail User */}
            {isDetailOpen && selectedUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Detail Pengguna</h2>
                        <div className="space-y-3 text-sm text-gray-700">
                            <p><strong>ID User:</strong> #{selectedUser.id_user || selectedUser.id}</p>
                            <p><strong>Username:</strong> {selectedUser.username}</p>
                            <p><strong>Role:</strong> <span className="uppercase font-semibold">{selectedUser.role}</span></p>
                            <p><strong>No. HP:</strong> {selectedUser.no_hp || '-'}</p>
                            <p><strong>Alamat:</strong> {selectedUser.alamat || '-'}</p>
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