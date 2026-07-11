import Link from "next/link";
import { AdminSignOutButton } from "@/components/layout/AdminSignOutButton";

interface AdminHeaderProps {
  userName?: string | null;
}

export function AdminHeader({ userName }: AdminHeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link href="/" className="font-display text-lg text-brand-navy">
          Colugares
        </Link>
        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-gray-600 sm:inline">
            {userName}
          </span>
          <Link
            href="/"
            className="text-sm font-medium text-gray-600 hover:text-brand-navy"
          >
            Ver portal
          </Link>
          <AdminSignOutButton />
        </div>
      </nav>
    </header>
  );
}
