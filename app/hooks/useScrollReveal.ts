'use client';
import { useEffect, useRef } from 'react';

export const useScrollReveal = (ref: React.RefObject<HTMLDivElement>, delay = 0, threshold = 0.1) => {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.style.animationDelay = `${delay}ms`;
          element.classList.add('visible', 'scroll-reveal');
          observer.unobserve(element);
        }
      },
      { threshold }
    );

    observer.observe(element);
    return () => {
      if (element) observer.unobserve(element);
    };
  }, [ref, delay, threshold]);
};