'use client';

import { useEffect, useState } from 'react';
import api from '@/src/lib/api';

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({
        totalAlat: 0,
        totalPeminjaman: 0,
        totalUser: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [alatRes, peminjamanRes, userRes] = await Promise.all([
                    api.get('/alat').catch(() => ({ data: [] })),
                    api.get('/peminjaman/read').catch(() => ({ data: [] })),
                    api.get('/users/read').catch(() => ({ data: [] })),
                ]);

                setStats({
                    totalAlat: Array.isArray(alatRes.data) ? alatRes.data.length : 0,
                    totalPeminjaman: Array.isArray(peminjamanRes.data) ? peminjamanRes.data.length : 0,
                    totalUser: Array.isArray(userRes.data) ? userRes.data.length : 0,
                });
            } catch (error) {
                console.error('Gagal memuat data dashboard', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
                <p className="text-sm text-gray-500 mt-1">Selamat datang kembali, Administrator sistem.</p>
            </div>

            {loading ? (
                <p className="text-sm text-gray-500">Memuat data...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <p className="text-sm font-medium text-gray-500">Total Alat</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalAlat}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <p className="text-sm font-medium text-gray-500">Total Peminjaman</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalPeminjaman}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <p className="text-sm font-medium text-gray-500">Total Pengguna</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUser}</p>
                    </div>
                </div>
            )}
        </div>
    );
}