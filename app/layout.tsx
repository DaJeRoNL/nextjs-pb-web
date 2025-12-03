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
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
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