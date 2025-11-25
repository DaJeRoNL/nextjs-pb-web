'use client';
import { useState, useEffect } from 'react';

export const useElementInView = (ref: React.RefObject<HTMLElement>) => {
  const [isInView, setIsInView] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0 } // Triggers as soon as 1px is visible
    );

    observer.observe(element);
    return () => {
      if (element) observer.unobserve(element);
    };
  }, [ref]);
  return isInView;
};