'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { href: '/admin/orders', label: 'Orders', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { href: '/admin/customers', label: 'Customers', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  { href: '/admin/analytics', label: 'Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 h-screen w-64 bg-[#111111] border-r border-blue-500/10">
        {/* Logo */}
        <div className="p-6 border-b border-blue-500/10">
          <div className="flex items-center space-x-3">
            <div className="relative w-8 h-8">
              <Image
                src="/uploads/whitetransparentlogo.png"
                alt="The Bandit Camp Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-white font-bold text-lg">Admin Panel</span>
          </div>
        </div>

        {/* Nav Items */}
        <div className="p-4">
          <nav className="space-y-1">
            <Link
              href="/admin/dashboard"
              className={`${
                pathname === '/admin/dashboard'
                  ? 'bg-blue-500/10 text-blue-500'
                  : 'text-gray-400 hover:text-blue-500'
              } flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-300`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Dashboard
            </Link>

            <Link
              href="/admin/orders"
              className={`${
                pathname === '/admin/orders'
                  ? 'bg-blue-500/10 text-blue-500'
                  : 'text-gray-400 hover:text-blue-500'
              } flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-300`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Orders
            </Link>

            <Link
              href="/admin/support"
              className={`${
                pathname === '/admin/support'
                  ? 'bg-blue-500/10 text-blue-500'
                  : 'text-gray-400 hover:text-blue-500'
              } flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-300`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Support
            </Link>
          </nav>
        </div>
      </nav>

      {/* Main Content */}
      <div className="ml-64 min-h-screen">
        <header className="h-16 bg-[#111111] border-b border-blue-500/10 flex items-center justify-end px-8">
        </header>
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
} 