import type { Metadata } from 'next';
import PlaceByteClient from './PlaceByteClient';

export const metadata: Metadata = {
  title: 'PlaceByte - Recruitment Refined',
  description: 'Precision recruitment for Tech, Medical, and Startups. We find the talent that fits your culture and goals.',
};

export default function PlaceBytePage() {
  return <PlaceByteClient />;
}