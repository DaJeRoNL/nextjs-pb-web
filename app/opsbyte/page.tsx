import type { Metadata } from 'next';
import OpsByteClient from './OpsByteClient';

export const metadata: Metadata = {
  title: 'OpsByte - Operational Excellence',
  description: 'Plug-and-play operational teams to scale your business without the overhead.',
};

export default function OpsBytePage() {
  return <OpsByteClient />;
}