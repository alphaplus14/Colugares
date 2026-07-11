import { auth } from "@/lib/auth";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { AdminSidebar } from "@/components/layout/AdminSidebar";

export default async function AdminConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const isAdmin = session?.user?.role === "admin";
  const roleLabel =
    session?.user?.role === "admin" ? "Super-admin" : "Empleado";
  const userName = session?.user?.name ?? session?.user?.email ?? "Usuario";

  return (
    <div className="min-h-screen bg-brand-sand">
      <AdminHeader userName={userName} roleLabel={roleLabel} />
      <div className="flex min-h-[calc(100vh-3.75rem)]">
        <AdminSidebar
          isAdmin={isAdmin}
          userName={userName}
          roleLabel={roleLabel}
        />
        <div className="flex-1 overflow-auto p-5 md:p-8">{children}</div>
      </div>
    </div>
  );
}
