import PanelLayout, { NavItem } from '@/components/sidebar';

const navItems: NavItem[] = [
    { name: 'Persetujuan & Pengembalian', href: '/petugas/dashboard' },
    { name: 'Cetak Laporan', href: '/petugas/laporan' },
];

export default function PetugasLayout({ children }: { children: React.ReactNode }) {
    return (
        <PanelLayout title="Panel Petugas" subtitle="Sistem Peminjaman Alat" navItems={navItems}>
            {children}
        </PanelLayout>
    );
}
