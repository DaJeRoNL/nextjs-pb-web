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

// --- Theme Initialization Script ---
const themeScript = `
  (function() {
    const root = document.documentElement;
    const initialTheme = localStorage.getItem('placebyte_theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (initialTheme === 'dark' || (!initialTheme && systemPrefersDark)) {
      root.classList.add('dark');
    }
  })();
`;

export const metadata: Metadata = {
  title: {
    template: '%s | PlaceByte',
    default: 'PlaceByte - Engineered for Growth',
  },
  description: "Recruitment, Operations, and Systems Automation for modern teams.",
  // Force disable Dark Reader
  other: {
    "darkreader-lock": "true",
  },
  icons: {
    icon: [
      { url: '/PBFweb16.png', sizes: '16x16', type: 'image/png' },
      { url: '/PBFweb32.png', sizes: '32x32', type: 'image/png' },
      { url: '/PBFweb48.png', sizes: '48x48', type: 'image/png' },
      { url: '/PBFweb192.png', sizes: '192x192', type: 'image/png' }, 
    ],
    shortcut: '/PBFweb16.png',
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
    // Note: The body classes are intentionally generic/transitional
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
        <meta name="darkreader-lock" content="true" />
        {/* INJECT THEME SCRIPT HERE TO RUN BEFORE RENDERING */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      {/* Updated dark background to Zinc-900 (#18181b) to match globals.css */}
      <body className={`${montserrat.variable} ${raleway.variable} ${arimo.variable} bg-white dark:bg-[#18181b] text-gray-900 dark:text-gray-100 transition-colors duration-300`}>
        <SmoothScrolling>
          {children}
          <CookieConsent />
        </SmoothScrolling>
      </body>
    </html>
  );
}