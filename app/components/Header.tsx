'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-sm border-b border-blue-500/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" prefetch={false} className="flex items-center space-x-3">
              <div className="relative w-13 h-13">
                <Image
                  src="/uploads/whitetransparentlogo.png"
                  alt="The Bandit Camp Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-white font-medium">THE BANDIT CAMP</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-8">
            <Link 
              href={isHomePage ? "/#hero" : "/"} 
              className="text-gray-300 hover:text-blue-500 transition-colors duration-300 text-sm font-medium tracking-wide"
            >
              HOME
            </Link>
            <Link 
              href={isHomePage ? "/#products" : "/#products"} 
              className="text-gray-300 hover:text-blue-500 transition-colors duration-300 text-sm font-medium tracking-wide"
            >
              PRODUCTS
            </Link>
            <Link 
              href={isHomePage ? "/#contact" : "/#contact"} 
              className="text-gray-300 hover:text-blue-500 transition-colors duration-300 text-sm font-medium tracking-wide"
            >
              CONTACT
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
} 