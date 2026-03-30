'use client';

import "./globals.css";
import { Topbar } from "@/components/layout/Topbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { usePathname } from 'next/navigation';
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated && !isLoginPage) {
      router.push('/login');
    }
  }, [mounted, isAuthenticated, isLoginPage, router]);

  if (!mounted) {
    return (
      <html lang="en">
        <body className="bg-[#f8fafc]"></body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className="antialiased bg-[#f8fafc] text-[#1e293b]">
        {!isLoginPage ? (
          <div className="flex flex-col min-h-screen">
            <Topbar />
            <div className="flex flex-1 overflow-hidden">
              <Sidebar />
              <main className="flex-1 overflow-auto p-4 md:p-5 relative z-10">
                {children}
              </main>
            </div>
          </div>
        ) : (
          <div className="relative z-10">
            {children}
          </div>
        )}
      </body>
    </html>
  );
}
