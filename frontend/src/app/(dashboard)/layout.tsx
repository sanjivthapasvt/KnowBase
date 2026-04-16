// theme: dark schema applied
import { Sidebar } from '@/shared/components/Sidebar';
import { Navbar } from '@/shared/components/Navbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[rgb(var(--color-bg-base))] text-[rgb(var(--color-text-primary))]">
      <Sidebar />
      <div className="flex flex-1 flex-col pl-60 bg-[rgb(var(--color-bg-base))]">
        <Navbar />
        <main className="flex-1 px-8 py-6">{children}</main>
      </div>
    </div>
  );
}
