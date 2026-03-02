import type { Metadata } from 'next';
import './globals.css';
import { PwaRegister } from '@/components/pwa-register';

export const metadata: Metadata = {
  title: 'Technician Invoice PWA',
  description: 'Mobile-first invoicing and reporting app for technicians',
  manifest: '/manifest.webmanifest'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="max-w-3xl mx-auto p-3 pb-16">
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
