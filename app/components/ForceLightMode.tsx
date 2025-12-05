'use client';

import { useEffect } from 'react';

export default function ForceLightMode() {
  useEffect(() => {
    const html = document.documentElement;
    // Store initial state to restore later if needed (optional)
    const wasDark = html.classList.contains('dark');

    const enforceLight = () => {
      if (html.classList.contains('dark')) {
        html.classList.remove('dark');
      }
      html.style.colorScheme = 'light';
    };

    // 1. Apply immediately
    enforceLight();

    // 2. Watch for system/user changes and revert them instantly
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          enforceLight();
        }
      });
    });

    observer.observe(html, { attributes: true });

    // 3. Cleanup on unmount
    return () => {
      observer.disconnect();
      html.style.colorScheme = '';
      if (wasDark) {
        html.classList.add('dark');
      }
    };
  }, []);

  return null; // This component renders nothing visually
}