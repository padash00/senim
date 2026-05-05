"use client";

import { LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/app/admin/login/actions";
import { AdminMobileNav } from "./AdminMobileNav";

export function AdminHeader({ email }: { email: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border/70 bg-background/85 px-4 backdrop-blur lg:px-6">
      <button
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 lg:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Меню"
      >
        <Menu className="h-4 w-4" />
      </button>
      <div className="ml-auto flex items-center gap-3">
        <span className="hidden text-sm text-muted-foreground sm:inline">{email}</span>
        <form action={signOut}>
          <Button type="submit" variant="outline" size="sm">
            <LogOut className="h-4 w-4" />
            Выйти
          </Button>
        </form>
      </div>
      <AdminMobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
