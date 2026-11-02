'use client';

import { useEffect, useState } from 'react';
import api from '@/src/lib/api';

export default function AdminLogAktivitasPage() {
    const [logs, setLogs] = useState<any[]>([]);

    useEffect(() => {
        api.get('/log-aktivitas/read')
            .then(res => setLogs(res.data))
            .catch(err => console.error('Gagal memuat log aktivitas', err));
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Log Aktivitas Sistem</h1>
            
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100 text-gray-700">
                        <tr>
                            <th className="p-4 font-semibold">Waktu</th>
                            <th className="p-4 font-semibold">User</th>
                            <th className="p-4 font-semibold">Aktivitas</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-800">
                        {logs.map((item, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                                <td className="p-4 text-gray-500 text-xs">{item.created_at || item.waktu || '-'}</td>
                                <td className="p-4 font-medium">{item.username || '-'}</td>
                                <td className="p-4">{item.aktivitas || item.deskripsi || '-'}</td>
                            </tr>
                        ))}
                        {logs.length === 0 && (
                            <tr>
                                <td colSpan={3} className="p-6 text-center text-gray-500">Belum ada log aktivitas.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}