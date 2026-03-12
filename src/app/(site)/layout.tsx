import { FloatingNav } from '@/components/layout/floating-nav';
import Link from 'next/link';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { SiteFooter } from '@/components/layout/site-footer';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FirebaseClientProvider>
      <div className="flex min-h-screen flex-col">
          <header className="absolute top-8 left-8 z-40">
              <Link href="/" aria-label="Homepage" className="flex items-center gap-3 group opacity-70 hover:opacity-100 transition-opacity">
                <div className="w-10 h-10 glass-panel border-primary/40 flex items-center justify-center group-hover:border-primary transition-colors">
                  <span className="font-headline text-primary font-bold">TK</span>
                </div>
                <span className="font-headline text-xs tracking-[0.3em] text-white hidden md:block group-hover:text-primary transition-colors uppercase">TECH KURUKSHETRA</span>
              </Link>
          </header>

          <main className="flex-1">{children}</main>

          <FloatingNav />
          
          <SiteFooter />
      </div>
    </FirebaseClientProvider>
  );
}
