import type { Metadata } from 'next';
import { Syne, DM_Sans, JetBrains_Mono } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-syne',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mathias.dev';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Mathias — Full-Stack Developer & Data Enthusiast',
  description:
    'Portfolio of Mathias, a software developer and data enthusiast based in Kumasi, Ghana. Specializing in full-stack web development, data analysis, machine learning, and UI/UX design.',
  keywords: [
    'Mathias',
    'developer',
    'portfolio',
    'full-stack',
    'web development',
    'data analysis',
    'machine learning',
    'Ghana',
    'Kumasi',
    'React',
    'Next.js',
    'Python',
  ],
  authors: [{ name: 'Mathias' }],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: 'Mathias — Full-Stack Developer & Data Enthusiast',
    description:
      'Software developer crafting responsive web applications, intelligent data solutions, and elegant interfaces.',
    url: siteUrl,
    siteName: 'Mathias Portfolio',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Mathias — Full-Stack Developer & Data Enthusiast',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mathias — Full-Stack Developer & Data Enthusiast',
    description:
      'Software developer crafting responsive web applications, intelligent data solutions, and elegant interfaces.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-body bg-bg-primary text-text-primary antialiased">
        {/* JSON-LD Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Mathias',
              url: siteUrl,
              jobTitle: 'Full-Stack Developer & Data Enthusiast',
              description:
                'Software developer crafting responsive web applications, intelligent data solutions, and elegant interfaces.',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Kumasi',
                addressCountry: 'GH',
              },
              alumniOf: {
                '@type': 'CollegeOrUniversity',
                name: 'Kumasi Technical University',
              },
              knowsAbout: [
                'React', 'Next.js', 'Node.js', 'Python', 'TypeScript',
                'MongoDB', 'PostgreSQL', 'Machine Learning', 'Data Analysis',
              ],
              sameAs: [
                'https://github.com/Pro-Clergy',
                'https://linkedin.com/in/mathias-aidoo',
                'https://x.com/ProfessorClergy',
              ],
            }),
          }}
        />
        {/* Skip to content for keyboard/screen-reader accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent focus:text-bg-primary focus:rounded-lg focus:font-semibold focus:text-sm"
        >
          Skip to content
        </a>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#12121a',
              color: '#e8e6e3',
              border: '1px solid #1a1a26',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#00e5a0', secondary: '#0a0a0f' },
            },
            error: {
              iconTheme: { primary: '#ff6b6b', secondary: '#0a0a0f' },
            },
          }}
        />
      </body>
    </html>
  );
}
