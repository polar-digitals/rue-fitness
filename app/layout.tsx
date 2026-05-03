import type {Metadata} from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' });

export const metadata: Metadata = {
  title: 'Rue Fitness',
  description: 'Reach your goals at Rue Fitness. Build strength and improve your health in our premium facility.',
};

import AnnouncementBanner from './components/AnnouncementBanner';

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} dark`}>
      <body className="font-sans bg-zinc-950 text-slate-50 antialiased flex flex-col min-h-screen" suppressHydrationWarning>
        <AnnouncementBanner />
        <div className="relative flex-1 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
