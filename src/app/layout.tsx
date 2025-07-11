import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import StructuredData from '@/components/StructuredData';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CEE Market Map - Interactive Tech Company Explorer',
  description: 'Discover leading tech companies in Central and Eastern Europe - Czechia, Slovakia, and Poland. Interactive market map with funding data, company insights, and sector analysis.',
  keywords: ['CEE tech', 'Central Europe startups', 'Czech companies', 'Slovak companies', 'Polish companies', 'market map', 'venture capital', 'tech ecosystem'],
  authors: [{ name: 'Market Map Team' }],
  viewport: 'width=device-width, initial-scale=1',
  openGraph: {
    title: 'CEE Market Map - Tech Companies in Central Europe',
    description: 'Interactive map of leading tech companies in Czechia, Slovakia, and Poland. Explore funding data, sectors, and company insights.',
    type: 'website',
    locale: 'en_US',
    siteName: 'CEE Market Map',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'CEE Market Map - Central European Tech Companies',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CEE Market Map - Tech Companies in Central Europe',
    description: 'Interactive map of leading tech companies in Czechia, Slovakia, and Poland.',
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <StructuredData />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <div className="min-h-screen bg-background text-foreground">
          {children}
        </div>
      </body>
    </html>
  );
}