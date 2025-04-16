'use client';

import { useState, useEffect } from 'react';

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if window is defined (client-side)
    if (typeof window !== 'undefined') {
      const checkIsMobile = () => {
        setIsMobile(window.innerWidth <= 768); // Consider mobile if width is 768px or less
      };

      // Initial check
      checkIsMobile();

      // Add event listener for window resize
      window.addEventListener('resize', checkIsMobile);

      // Cleanup
      return () => window.removeEventListener('resize', checkIsMobile);
    }
  }, []);

  return isMobile;
} 