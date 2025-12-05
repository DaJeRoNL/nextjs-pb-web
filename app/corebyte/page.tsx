import type { Metadata } from 'next';
import CoreByteClient from './CoreByteClient';

export const metadata: Metadata = {
  title: 'CoreByte - Intelligent Workspaces',
  description: 'Automate workflows and integrate systems with CoreByte custom software solutions.',
};

export default function CoreBytePage() {
  return <CoreByteClient />;
}