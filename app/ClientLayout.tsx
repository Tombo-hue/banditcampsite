'use client';

import { usePathname } from "next/navigation";
import Header from "./components/Header";
import { useIsMobile } from "./hooks/useIsMobile";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');
  const isMobile = useIsMobile();

  return (
    <>
      {!isAdminRoute && !isMobile && <Header />}
      {children}
    </>
  );
} 