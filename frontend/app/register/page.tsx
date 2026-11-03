'use client';

import { FormEvent, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService, RegisterPayload } from '@/src/services/auth';

const initialForm: RegisterPayload = { username: '', password: '', no_hp: '', alamat: '' };

export default function RegisterPage() {
    const [form, setForm] = useState(initialForm);
    const [confirmation, setConfirmation] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setError('');

        if (form.password !== confirmation) {
            setError('Konfirmasi password tidak sama.');
            return;
        }

        try {
            setIsSubmitting(true);
            await authService.register(form);
            alert('Registrasi berhasil. Silakan masuk menggunakan akun Anda.');
            router.push('/login');
        } catch (requestError: unknown) {
            const message = axios.isAxiosError<{ error?: string }>(requestError)
                ? requestError.response?.data?.error
                : undefined;
            setError(message || 'Registrasi gagal. Silakan coba kembali.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClass = 'w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100';

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
            <div className="w-full max-w-lg rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Daftar Akun Peminjam</h1>
                    <p className="mt-1 text-sm text-gray-500">Lengkapi data untuk mulai meminjam alat.</p>
                </div>

                {error && <p className="mb-4 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-600" role="alert">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="username">Username</label>
                        <input id="username" required value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} className={inputClass} autoComplete="username" />
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="password">Password</label>
                            <input id="password" type="password" required minLength={6} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className={inputClass} autoComplete="new-password" />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="confirmation">Konfirmasi Password</label>
                            <input id="confirmation" type="password" required minLength={6} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className={inputClass} autoComplete="new-password" />
                        </div>
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="phone">Nomor HP</label>
                        <input id="phone" type="tel" required value={form.no_hp} onChange={(event) => setForm({ ...form, no_hp: event.target.value })} className={inputClass} placeholder="08xxxxxxxxxx" autoComplete="tel" />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="address">Alamat</label>
                        <textarea id="address" required rows={3} value={form.alamat} onChange={(event) => setForm({ ...form, alamat: event.target.value })} className={inputClass} placeholder="Alamat lengkap" autoComplete="street-address" />
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50">
                        {isSubmitting ? 'Mendaftarkan...' : 'Daftar'}
                    </button>
                </form>

                <p className="mt-5 text-center text-sm text-gray-500">
                    Sudah memiliki akun? <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">Masuk</Link>
                </p>
            </div>
        </main>
    );
}
