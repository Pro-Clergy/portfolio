import type { Metadata } from 'next';
import { Syne, DM_Sans, JetBrains_Mono } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import ChatWidget from '@/components/ChatWidget';
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
  title: 'Mathias Aidoo — Software Engineer & Full-Stack Developer',
  description:
    'Portfolio of Mathias Aidoo, a software engineer based in Kumasi, Ghana. Specializing in full-stack development, mobile apps, cybersecurity, UI/UX design, and data analysis.',
  keywords: [
    'Mathias Aidoo',
    'software engineer',
    'developer',
    'portfolio',
    'full-stack',
    'web development',
    'mobile development',
    'cybersecurity',
    'UI/UX design',
    'data analysis',
    'Ghana',
    'Kumasi',
    'React',
    'Next.js',
    'Flutter',
    'Python',
  ],
  authors: [{ name: 'Mathias Aidoo' }],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: 'Mathias Aidoo — Software Engineer & Full-Stack Developer',
    description:
      'Software engineer building secure, scalable web & mobile applications, intelligent data solutions, and elegant interfaces.',
    url: siteUrl,
    siteName: 'Mathias Aidoo Portfolio',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Mathias Aidoo — Software Engineer & Full-Stack Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mathias Aidoo — Software Engineer & Full-Stack Developer',
    description:
      'Software engineer building secure, scalable web & mobile applications, intelligent data solutions, and elegant interfaces.',
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
              name: 'Mathias Aidoo',
              url: siteUrl,
              jobTitle: 'Software Engineer & Full-Stack Developer',
              description:
                'Software engineer building secure, scalable web & mobile applications, intelligent data solutions, and elegant interfaces.',
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
                'Flutter', 'React Native', 'MongoDB', 'PostgreSQL',
                'Cybersecurity', 'UI/UX Design', 'Machine Learning',
                'System Analysis', 'Data Analysis',
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
        <ChatWidget />
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
