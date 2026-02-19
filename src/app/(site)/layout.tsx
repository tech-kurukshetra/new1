import { FloatingNav } from '@/components/layout/floating-nav';
import Link from 'next/link';
import { FirebaseClientProvider } from '@/firebase/client-provider';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FirebaseClientProvider>
      <div className="flex min-h-screen flex-col">
          <header className="absolute top-8 left-8 z-40">
              <Link href="/" className="flex items-center gap-3 group opacity-70 hover:opacity-100 transition-opacity">
                <div className="w-10 h-10 glass-panel border-primary/40 flex items-center justify-center group-hover:border-primary transition-colors">
                  <span className="font-headline text-primary font-bold">TK</span>
                </div>
                <span className="font-headline text-xs tracking-[0.3em] text-white hidden md:block group-hover:text-primary transition-colors uppercase">TECH KURUKSHETRA</span>
              </Link>
          </header>

          <main className="flex-1">{children}</main>

          <FloatingNav />
          
          <footer className="pt-20 pb-40 px-6 border-t border-primary/10 mt-20 bg-black/20">
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                <div className="space-y-4">
                  <h2 className="font-headline text-2xl text-primary tracking-wider uppercase">TECH KURUKSHETRA</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                    The most immersive tech battlefield of the year. Join 50,000+ warriors of code to reshape the future.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-headline text-xs tracking-[0.2em] text-accent uppercase font-bold">Festival</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground font-light">
                    <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
                    <li><Link href="/arenas" className="hover:text-primary transition-colors">Arenas</Link></li>
                    <li><Link href="/timeline" className="hover:text-primary transition-colors">Timeline</Link></li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="font-headline text-xs tracking-[0.2em] text-accent uppercase font-bold">Connect</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground font-light">
                    <li><Link href="/announcements" className="hover:text-primary transition-colors">Announcements</Link></li>
                    <li><Link href="/team" className="hover:text-primary transition-colors">The Architects</Link></li>
                    <li><Link href="/register" className="hover:text-primary transition-colors">Get Your Pass</Link></li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="font-headline text-xs tracking-[0.2em] text-accent uppercase font-bold">Legal</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground font-light">
                    <li><a href="#" className="hover:text-primary transition-colors">Privacy Protocol</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Terms of Entry</a></li>
                    <li><Link href="/admin" className="hover:text-primary transition-colors">Admin Console</Link></li>
                  </ul>
                </div>
              </div>

              <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-primary/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground/50 font-medium">
                <p>© {new Date().getFullYear()} TECH KURUKSHETRA Festival. All rights reserved.</p>
                <p className="tracking-widest uppercase">TECH KURUKSHETRA Edition 2026</p>
              </div>
          </footer>
      </div>
    </FirebaseClientProvider>
  );
}
