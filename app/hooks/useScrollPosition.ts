'use client';
import { useState, useEffect } from 'react';

export const useScrollPosition = (scrollThreshold = 30) => {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > scrollThreshold);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check on load
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollThreshold]);
  return isScrolled;
};