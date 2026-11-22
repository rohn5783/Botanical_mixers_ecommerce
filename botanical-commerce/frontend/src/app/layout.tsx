import type { Metadata } from 'next';
import Providers from './providers';
import { Navbar } from '../components/layout/Navbar';
import { CartDrawer } from '../components/layout/CartDrawer';
import { Footer } from '../components/layout/Footer';
import '../styles/globals.scss';

export const metadata: Metadata = {
  title: 'Aranya Botanicals | Artisanal Indian Botanical Beverage Concentrates',
  description:
    'Experience pure cold-reduced Indian botanical beverage concentrates. Western Ghats Kokum, Southern Nannari Root, Konkan Jamun, and Malabar Hibiscus for fine mixology, cafes, and conscious home hosts.',
  keywords: [
    'Botanical beverage concentrates',
    'Indian botanical syrups',
    'Kokum concentrate',
    'Nannari root sarsaparilla',
    'Jamun kala khatta concentrate',
    'Hibiscus roselle cordial',
    'Zero-proof mixology India',
    'Artisanal cafe syrups',
  ],
  authors: [{ name: 'Aranya Botanicals' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Aranya Botanicals | Pure Indian Botanical Concentrates',
    description: 'Cold-reduced Western Ghats Kokum, Nannari Root, Jamun & Hibiscus for premium drinks.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Aranya Botanicals',
  },
  robots: {
    index: true,
    follow: true,
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..700;1,400..700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Aranya Botanicals',
              url: 'https://aranyabotanicals.com',
              logo: 'https://aranyabotanicals.com/images/brand/logo.png',
              description: 'Artisanal Indian Botanical Beverage Concentrates',
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'India',
              },
            }),
          }}
        />
      </head>
      <body>
        <Providers>
          <Navbar />
          <CartDrawer />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
