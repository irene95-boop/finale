import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AppProvider } from '@/contexts/AppContext';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GDK - Cosmétiques & Électronique',
  description: 'Votre boutique en ligne pour cosmétiques et appareils électroniques',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AppProvider>
            {children}
            <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}