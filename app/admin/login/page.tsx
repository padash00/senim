import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";
import { getCurrentAdmin } from "@/lib/auth";
import { Logo } from "@/components/site/Logo";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Вход · Сенім",
  robots: { index: false, follow: false, nocache: true },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const admin = await getCurrentAdmin();
  if (admin) redirect("/admin");

  const { redirect: redirectTo } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-center">
          <Logo tagline="админ-панель" />
        </div>
        <LoginForm redirectTo={redirectTo} />
      </div>
      <Toaster richColors position="top-center" />
    </div>
  );
}
