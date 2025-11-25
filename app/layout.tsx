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
  title: "PlaceByte",
  description: "Engineered for Growth",
  icons: {
    icon: '/PB Favicon.png',
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