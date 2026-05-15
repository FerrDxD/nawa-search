import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NAWA-SEARCH | Pusat Kehilangan',
  description: 'Sistem informasi barang hilang dan ditemukan di sekolah, terintegrasi dengan NAWASENA.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}