import PanelLayout, { NavItem } from '@/components/sidebar';

const navItems: NavItem[] = [
    { name: 'Dashboard', href: '/admin/dashboard' },
    { name: 'Manajemen Alat', href: '/admin/alat' },
    { name: 'Kategori Alat', href: '/admin/kategori' },
    { name: 'Data Peminjaman', href: '/admin/peminjaman' },
    { name: 'Data Pengembalian', href: '/admin/pengembalian' },
    { name: 'Manajemen User', href: '/admin/user' },
    { name: 'Log Aktivitas', href: '/admin/log-aktivitas' },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <PanelLayout title="Admin Panel" subtitle="Sistem Peminjaman Alat" navItems={navItems}>
            {children}
        </PanelLayout>
    );
}
