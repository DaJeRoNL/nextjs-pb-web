import type { Metadata } from "next";
import { Montserrat, Raleway, Arimo, Homemade_Apple } from "next/font/google";
import "./globals.css";
import CookieConsent from "./components/CookieConsent";

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

const homemadeApple = Homemade_Apple({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-handwriting",
});

export const metadata: Metadata = {
  title: {
    template: '%s | PlaceByte',
    default: 'PlaceByte - Engineered for Growth',
  },
  description: "Recruitment, Operations, and Systems Automation for modern teams.",
  icons: {
    icon: '/favicon.png',      // Standard favicon
    shortcut: '/favicon.png',  // For older browsers
    apple: '/favicon.png',     // For iPhone/iPad home screen
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
      <body className={`${montserrat.variable} ${raleway.variable} ${arimo.variable} ${homemadeApple.variable}`}>
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}