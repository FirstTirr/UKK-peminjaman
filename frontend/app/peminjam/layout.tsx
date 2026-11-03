import PanelLayout, { NavItem } from '@/components/sidebar';

const navItems: NavItem[] = [
    { name: 'Katalog Alat', href: '/peminjam/dashboard' },
    { name: 'Progres Peminjaman', href: '/peminjam/pesanan' },
    { name: 'Riwayat Peminjaman', href: '/peminjam/riwayat' },
];

export default function PeminjamLayout({ children }: { children: React.ReactNode }) {
    return (
        <PanelLayout title="Panel Peminjam" subtitle="Sistem Peminjaman Alat" navItems={navItems}>
            {children}
        </PanelLayout>
    );
}
