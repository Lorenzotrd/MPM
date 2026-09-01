import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Métal Portail & Menuiserie | Aménagement sur mesure dans les Landes",
  description: "Portails, clôtures, terrasses, pergolas, bardages et menuiseries sur mesure à Saint-Vincent-de-Tyrosse. Expertise offerte et devis sous 48 h.",
  openGraph: {
    title: "Métal Portail & Menuiserie",
    description: "Vos espaces, pensés pour durer. Conception et pose sur mesure dans les Landes.",
    type: "website",
    locale: "fr_FR",
    images: [{ url: "/mpm-brand.jpeg", width: 1179, height: 684, alt: "Métal Portail & Menuiserie" }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className={`${manrope.variable} ${cormorant.variable}`}>{children}</body>
    </html>
  );
}
