import Link from 'next/link';

export default function HomePage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-slate-100 px-4 py-10">
            <section className="w-full max-w-4xl rounded-3xl border border-white bg-white/90 p-6 text-center shadow-xl shadow-indigo-100/60 sm:p-10 lg:p-14">
                <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">Sistem Peminjaman Alat</span>
                <h1 className="mx-auto mt-5 max-w-2xl text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Pinjam alat dengan proses yang jelas dan terpantau.</h1>
                <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-gray-600 sm:text-base">Ajukan kebutuhan alat, pantau persetujuan, dan lihat seluruh riwayat peminjaman dalam satu aplikasi.</p>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <Link href="/login" className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500">Masuk</Link>
                    <Link href="/register" className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">Daftar sebagai Peminjam</Link>
                </div>
            </section>
        </main>
    );
}
