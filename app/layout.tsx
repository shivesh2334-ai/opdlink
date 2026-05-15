import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'OPDLink — Healthcare OPD Space Marketplace',
  description:
    'Connect verified doctors with healthcare centres offering OPD space. ' +
    'Single clinics, polyclinics, nursing homes and hospital OPDs across India.',
  keywords: 'OPD space, doctor placement, clinic rental, polyclinic, healthcare marketplace India',
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
      </head>
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="bg-ink text-white/60 py-8">
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="font-display text-xl text-white font-semibold">OPDLink</span>
              <span className="ml-3 text-sm">by EMC Digitals</span>
            </div>
            <p className="text-sm text-center">
              Connecting verified doctors with healthcare spaces across India.
            </p>
            <p className="text-xs">© {new Date().getFullYear()} OPDLink. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
