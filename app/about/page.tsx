import type { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'The architecture behind our mission to redefine the modern workforce.',
};

export default function AboutPage() {
  return <AboutClient />;
}