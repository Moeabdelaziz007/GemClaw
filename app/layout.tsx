import type {Metadata} from 'next';
import { Outfit } from 'next/font/google';
import './globals.css'; // Global styles

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Gemigram',
  description: 'The Voice-Native AI Social Nexus.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${outfit.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#050B14" />
      </head>
      <body suppressHydrationWarning className="font-sans antialiased bg-[#050B14] text-white selection:bg-cyan-500/30">
        {children}
      </body>
    </html>
  );
}
