import type { Metadata } from "next";
import { Montserrat, Raleway, Arimo } from "next/font/google";
import "./globals.css";
import CookieConsent from "./components/CookieConsent";
import SmoothScrolling from "./components/SmoothScrolling"; 

const montserrat = Montserrat({ 
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const raleway = Raleway({ 
  subsets: ["latin"],
  variable: "--font-raleway",
});

const arimo = Arimo({ 
  subsets: ["latin"],
  variable: "--font-arimo",
});

export const metadata: Metadata = {
  title: {
    template: '%s | PlaceByte',
    default: 'PlaceByte - Engineered for Growth',
  },
  description: "Recruitment, Operations, and Systems Automation for modern teams.",
  icons: {
    icon: [
      // Standard browser tab icon
      { url: '/PBFweb16.png', sizes: '16x16', type: 'image/png' },
      // High-DPI/Windows taskbar icon
      { url: '/PBFweb32.png', sizes: '32x32', type: 'image/png' },
      // Windows site/high-res desktop icon
      { url: '/PBFweb48.png', sizes: '48x48', type: 'image/png' },
      // Android/PWA icon (used for Chrome/Android launchers)
      { url: '/PBFweb192.png', sizes: '192x192', type: 'image/png' }, 
    ],
    // Fallback shortcut icon
    shortcut: '/PBFweb16.png',
    // Apple Touch Icon for iOS home screens
    apple: [
        { url: '/PBFweb180.png', sizes: '180x180', type: 'image/png' }
    ],
  },
  openGraph: {
    title: 'PlaceByte',
    description: 'Where People, Platforms, and Performance come together.',
    url: 'https://placebyte.com',
    siteName: 'PlaceByte',
    images: [
      {
        url: '/favicon.png',
        width: 600,
        height: 315,
        alt: 'PlaceByte - Engineered for Growth',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${raleway.variable} ${arimo.variable}`}>
        {/* Wrap children in SmoothScrolling */}
        <SmoothScrolling>
          {children}
          <CookieConsent />
        </SmoothScrolling>
      </body>
    </html>
  );
}