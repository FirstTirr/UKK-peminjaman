'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { authService } from '@/src/services/auth';

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        authService.logout();
        router.push('/auth/login');
    };

    const navItems = [
        { name: 'Dashboard', href: '/admin/dashboard' },
        { name: 'Manajemen Alat', href: '/admin/alat' },
        { name: 'Kategori Alat', href: '/admin/kategori' },
        { name: 'Data Peminjaman', href: '/admin/peminjaman' },
        { name: 'Data Pengembalian', href: '/admin/pengembalian' },
        { name: 'Manajemen User', href: '/admin/user' },
        { name: 'Log Aktivitas', href: '/admin/log-aktivitas' },
    ];

    return (
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col justify-between">
            <div>
                <div className="h-16 flex items-center px-6 border-b border-gray-100">
                    <span className="text-lg font-bold text-gray-900">Admin Panel</span>
                </div>
                <nav className="p-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                    isActive
                                        ? 'bg-indigo-50 text-indigo-600'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>
            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                    Keluar (Logout)
                </button>
            </div>
        </aside>
    );
}