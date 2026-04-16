import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/lib/providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-geist-sans' });

export const metadata: Metadata = {
  title: 'KnowBase',
  description: 'Collaborative knowledge base for teams and organizations',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased dark`}>
      <body className="min-h-screen bg-[rgb(var(--color-bg-base))] text-[rgb(var(--color-text-primary))] flex flex-col antialiased transition-colors duration-150">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
