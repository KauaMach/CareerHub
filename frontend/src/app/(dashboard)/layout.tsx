import { api } from "@/lib/api";
"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Briefcase, LayoutDashboard, FileText, Building, Award, LogOut } from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    api.get("/auth/me").catch(() => router.push("/login"));
  }, [router]);

  const handleLogout = () => {
    api.post("/auth/logout");
    router.push("/login");
  };

  const getNavClass = (path: string) => {
    const isActive = path === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(path);
    return isActive
      ? "flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary font-medium transition-colors"
      : "flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors";
  };

  if (!isMounted) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <div className="flex items-center gap-2 text-primary font-bold text-xl">
            <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">CH</div>
            CareerHub
          </div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/dashboard" className={getNavClass("/dashboard")}>
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link href="/jobs" className={getNavClass("/jobs")}>
            <Briefcase size={20} /> Vagas
          </Link>
          <Link href="/resumes" className={getNavClass("/resumes")}>
            <FileText size={20} /> Currículos
          </Link>
          <Link href="/companies" className={getNavClass("/companies")}>
            <Building size={20} /> Empresas
          </Link>
          <Link href="/certificates" className={getNavClass("/certificates")}>
            <Award size={20} /> Certificados
          </Link>
        </nav>
        <div className="p-4 border-t border-border flex items-center justify-between">
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <LogOut size={18} /> Sair
          </button>
          <ThemeSwitcher />
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-zinc-50/50 dark:bg-zinc-950/50">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
          <div className="flex items-center gap-2 text-primary font-bold text-xl">
            <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">CH</div>
            CareerHub
          </div>
          <ThemeSwitcher />
        </div>
        {children}
      </main>
    </div>
  );
}
