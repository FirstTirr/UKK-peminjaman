'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useState } from 'react';
import { authService } from '@/src/services/auth';

export interface NavItem {
    name: string;
    href: string;
}

interface PanelLayoutProps {
    title: string;
    subtitle: string;
    navItems: NavItem[];
    children: ReactNode;
}

export default function PanelLayout({ title, subtitle, navItems, children }: PanelLayoutProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        authService.logout();
        router.push('/login');
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <button
                type="button"
                aria-label="Tutup menu"
                onClick={() => setIsMenuOpen(false)}
                className={`fixed inset-0 z-40 bg-black/40 transition-opacity print:hidden md:hidden ${isMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
            />

            <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col justify-between border-r border-gray-200 bg-white transition-transform print:hidden md:sticky md:top-0 md:h-screen md:w-64 md:translate-x-0 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div>
                    <div className="flex h-16 items-center justify-between border-b border-gray-100 px-5">
                        <div>
                            <p className="text-lg font-bold text-gray-900">{title}</p>
                            <p className="text-[11px] text-gray-500">{subtitle}</p>
                        </div>
                        <button type="button" onClick={() => setIsMenuOpen(false)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 md:hidden" aria-label="Tutup menu">
                            ✕
                        </button>
                    </div>
                    <nav className="p-4 space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                        isActive
                                            ? 'bg-indigo-50 text-indigo-700'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
                <div className="border-t border-gray-100 p-4">
                    <button onClick={handleLogout} className="w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50">
                        Keluar (Logout)
                    </button>
                </div>
            </aside>

            <div className="flex min-w-0 flex-1 flex-col">
                <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-gray-200 bg-white px-4 print:hidden md:hidden">
                    <button type="button" onClick={() => setIsMenuOpen(true)} className="rounded-lg border border-gray-200 p-2 text-gray-700" aria-label="Buka menu">
                        <span className="block h-0.5 w-5 bg-current" />
                        <span className="my-1 block h-0.5 w-5 bg-current" />
                        <span className="block h-0.5 w-5 bg-current" />
                    </button>
                    <span className="font-semibold text-gray-900">{title}</span>
                </header>
                <main className="min-w-0 flex-1 p-4 print:p-0 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
