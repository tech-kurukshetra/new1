import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const siteConfig = {
  name: 'TECH KURUKSHETRA',
  url: 'https://www.techkurukshetra.in',
  ogImage: 'https://www.techkurukshetra.in/og-image.png',
  description: 'Join the ultimate coding and tech festival experience at TECH KURUKSHETRA. A two-day battlefield for developers, designers, and visionaries to learn, build, and conquer.',
  keywords: ['tech festival', 'hackathon', 'coding competition', 'robotics', 'esports', 'Gujarat tech fest', 'Ahmedabad student event', 'SVGU', 'UCPIT'],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  manifest: '/manifest.ts',
  title: {
    default: `${siteConfig.name} | Futuristic Tech Festival`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: 'Tech Kurukshetra Committee', url: siteConfig.url }],
  creator: 'Tech Kurukshetra Committee',
  publisher: 'Tech Kurukshetra Committee',

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@svgu',
  },
  
  verification: {
    google: 'XPL-dm7PTHQtWcQ0b3aLp_s3_cic6EPHrBek3VW2yxo',
  },

  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300..700&family=Orbitron:wght@400..900&family=Source+Code+Pro:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen relative">
          {children}
          <Toaster />
      </body>
    </html>
  );
}
