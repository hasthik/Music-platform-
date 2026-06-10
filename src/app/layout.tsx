import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Outfit } from 'next/font/google';
import { OrderProvider } from '@/context/OrderContext';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Solenne Studios — Your Story, As A Song',
  description:
    'A custom song made from your memories, written and recorded by a real artist — delivered in just 6 hours.',
  metadataBase: new URL('https://solennestudios.net'),
  openGraph: {
    title: 'Solenne Studios — Your Story, As A Song',
    description: 'Turn your story into a song. Handcrafted personalized songs in 8 languages.',
    url: 'https://solennestudios.net',
    siteName: 'Solenne Studios',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${outfit.variable}`}>
      <body>
        <OrderProvider>{children}</OrderProvider>
      </body>
    </html>
  );
}
