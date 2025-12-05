'use client';

import { ReactLenis } from '@studio-freight/react-lenis';
import { useEffect, useState } from 'react';

function SmoothScrolling({ children }: { children: React.ReactNode }) {
  // Default to true (enabled) until we prove otherwise on the client
  const [isSmoothed, setIsSmoothed] = useState(true);

  useEffect(() => {
    const html = document.documentElement;

    const checkMotion = () => {
      // Check if your custom class exists OR if the system prefers reduced motion
      const isReduced = html.classList.contains('reduce-motion') || 
                        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      // If motion is reduced, DISABLE smoothing
      setIsSmoothed(!isReduced);
    };

    // 1. Run immediately on mount
    checkMotion();

    // 2. Watch for class changes (Footer toggle)
    const observer = new MutationObserver(checkMotion);
    observer.observe(html, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  // If motion is reduced, render children normally without the Scroll Hijacker
  if (!isSmoothed) {
    return <div style={{ scrollBehavior: 'auto' }}>{children}</div>;
  }

  return (
    <ReactLenis root options={{ lerp: 0.15, duration: 1.2, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}

export default SmoothScrolling;