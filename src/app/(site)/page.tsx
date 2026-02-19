'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, Code, Zap, Globe, Cpu, Loader2 } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase, useDoc } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';


const AboutSection = () => {
    const heroImg = PlaceHolderImages.find(img => img.id === 'hero-tech');
    return (
        <section className="py-24 md:py-32">
             <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-y-16 lg:gap-x-16 items-center stagger-reveal">
                <div className="space-y-8">
                <div>
                    <span className="text-accent text-xs font-headline tracking-[0.3em] uppercase">The Legend</span>
                    <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-6 tracking-tighter leading-none">
                    TECH <br />
                    <span className="text-primary">KURUKSHETRA</span>
                    </h2>
                </div>

                <p className="text-lg md:text-xl font-light text-muted-foreground leading-relaxed">
                    TECH KURUKSHETRA started 5 years ago with a simple mission: to bridge the gap between academic theory and industry reality. Today, it has evolved into a global battlefield where the brightest minds converge.
                </p>

                <div className="space-y-6">
                    <div className="border-l-4 border-primary pl-6">
                    <h3 className="text-2xl font-headline mb-2">OUR VISION</h3>
                    <p className="text-muted-foreground">To inspire a new generation of problem solvers through radical collaboration and technological warfare.</p>
                    </div>
                    <div className="border-l-4 border-accent pl-6">
                    <h3 className="text-2xl font-headline mb-2">THE THEME: NEON HORIZON</h3>
                    <p className="text-muted-foreground">This year's theme focuses on the intersection of human creativity and automated intelligence—exploring how we coexist with our creations.</p>
                    </div>
                </div>
                </div>

                <div className="relative h-[400px] md:h-[600px]">
                <div className="absolute inset-0 glass-panel border-primary/40 z-0 rounded-none" />
                <div className="absolute inset-4 overflow-hidden z-10 rounded-none">
                    <Image
                    src={heroImg?.imageUrl || ''}
                    alt="Festival Vibe"
                    fill
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-1000 rounded-none"
                    data-ai-hint="futuristic technology"
                    />
                </div>
                <div className="absolute -bottom-4 right-4 glass-panel p-4 z-20 max-w-[280px] rounded-none">
                    <p className="text-3xl font-headline text-accent mb-2">50K+</p>
                    <p className="text-xs font-headline tracking-widest text-muted-foreground uppercase">Expected Attendees Worldwide</p>
                </div>
                </div>
            </div>
        </section>
    );
};

const statsConfig = [
    { icon: Code, label: "Competitions", key: "competitions", defaultValue: "10+" },
    { icon: Zap, label: "Workshops", key: "workshops", defaultValue: "5+" },
    { icon: Globe, label: "Participants", key: "participants", defaultValue: "50K+" },
    { icon: Cpu, label: "Prize Pool", key: "prizePool", defaultValue: "$10K+" }
];

export default function Home() {
  const heroImg = PlaceHolderImages.find(img => img.id === 'hero-tech');
  
  const firestore = useFirestore();

  const heroContentRef = useMemoFirebase(() => firestore ? doc(firestore, 'heroContent', 'main') : null, [firestore]);
  const { data: heroData, isLoading: heroDataLoading } = useDoc(heroContentRef);

  const sponsorsQuery = useMemoFirebase(() => firestore ? collection(firestore, 'sponsors') : null, [firestore]);
  const { data: sponsors, isLoading: sponsorsLoading } = useCollection(sponsorsQuery);
  
  const platinumSponsors = useMemo(() => sponsors?.filter(s => s.tier === 'Platinum') || [], [sponsors]);
  const goldSponsors = useMemo(() => sponsors?.filter(s => s.tier === 'Gold') || [], [sponsors]);
  const silverSponsors = useMemo(() => sponsors?.filter(s => s.tier === 'Silver' || s.tier === 'Bronze') || [], [sponsors]);


  const counterStatsRef = useMemoFirebase(() => firestore ? doc(firestore, 'counterStats', 'main') : null, [firestore]);
  const { data: counterData, isLoading: counterDataLoading } = useDoc(counterStatsRef);


  return (
    <div className="relative overflow-hidden pt-24 min-h-screen">
      <div className="absolute inset-0 z-0">
        <Image
          src={heroImg?.imageUrl || ''}
          alt="TECH KURUKSHETRA Hero"
          fill
          className="object-cover opacity-20 grayscale"
          priority
          data-ai-hint="futuristic technology background"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] text-center stagger-reveal">
          <div className="inline-block px-4 py-1 glass-panel border-accent/30 rounded-full mb-6">
            <span className="text-accent text-xs font-headline tracking-[0.2em] uppercase">TECH KURUKSHETRA 2026</span>
          </div>
          
          {heroDataLoading ? (
            <div className="mb-6 space-y-4">
              <h1 className="text-5xl md:text-8xl font-headline font-black tracking-tighter text-glow mb-2 leading-tight text-white">
                <Skeleton className="h-20 w-4/5 mx-auto" />
              </h1>
              <div className="text-4xl md:text-5xl font-headline font-black tracking-tighter text-glow leading-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                <Skeleton className="h-12 w-3/5 mx-auto" />
              </div>
            </div>
          ) : (
            <div className="mb-6 space-y-4">
              <h1 className="text-5xl md:text-8xl font-headline font-black tracking-tighter text-glow mb-2 leading-tight text-white">
                {heroData?.mainHeadline || 'BEYOND THE HORIZON'}
              </h1>
              <div className="text-4xl md:text-5xl font-headline font-black tracking-tighter text-glow leading-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                {heroData?.subHeadline || 'Battel of Mind'}
              </div>
            </div>
          )}

          <div className="max-w-2xl text-lg md:text-xl text-muted-foreground font-light mb-10 leading-relaxed">
            {heroDataLoading ? (
              <div className="h-6 w-full max-w-lg mx-auto" > <Skeleton className="h-6 w-full"/></div>
            ) : (
              <p>{heroData?.description || 'The most immersive tech battlefield of the year. Join developers, designers, and visionaries to reshape the future.'}</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-20">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/80 px-8 py-7 text-lg font-headline tracking-wider rounded-none group">
              <Link href="/register">
                ENTER THE ARENA <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-accent text-accent hover:bg-accent hover:text-background px-8 py-7 text-lg font-headline tracking-wider rounded-none">
              <Link href="/arenas">VIEW ARENAS</Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-32">
            {counterDataLoading ? (
              statsConfig.map((_, i) => (
                  <div key={i} className="glass-card p-6 rounded-none flex flex-col items-center">
                      <Skeleton className="h-6 w-6 mb-2 rounded-full" />
                      <Skeleton className="h-7 w-12 mb-1" />
                      <Skeleton className="h-4 w-20" />
                  </div>
              ))
            ) : (
              statsConfig.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="glass-card p-6 rounded-none flex flex-col items-center hover:scale-105 transition-transform">
                    <div className="text-primary mb-2"><Icon /></div>
                    <div className="text-2xl font-headline font-bold text-white">{(counterData as any)?.[stat.key] || stat.defaultValue}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-widest">{stat.label}</div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        
        <div className="w-full pb-20 space-y-16">
            <div className="text-center">
                <h2 className="font-headline text-3xl md:text-4xl mb-4 tracking-tighter uppercase text-white">Our <span className="text-primary">Partners</span></h2>
            </div>
            
            {sponsorsLoading && (
                <div className="flex justify-center items-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            )}

            {platinumSponsors.length > 0 && (
                <section>
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-px flex-1 bg-primary/20" />
                    <h3 className="font-headline text-lg tracking-widest text-primary uppercase">Platinum</h3>
                    <div className="h-px flex-1 bg-primary/20" />
                </div>
                <div className="flex flex-wrap justify-center gap-x-8 gap-y-16 items-center">
                    {platinumSponsors.map((sponsor) => (
                    <div key={sponsor.id} data-ai-hint="company logo" className="p-4 glass-panel border-primary/20 rounded-none w-full max-w-xs h-32 flex items-center justify-center group relative transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20">
                        <Image src={sponsor.logoUrl || ''} alt={sponsor.name} fill className="object-contain p-4 opacity-80 group-hover:opacity-100 transition-opacity" />
                        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-headline tracking-widest opacity-0 group-hover:opacity-100 transition-opacity uppercase text-primary whitespace-nowrap">{sponsor.name}</span>
                    </div>
                    ))}
                </div>
                </section>
            )}

            {goldSponsors.length > 0 && (
                <section>
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-px flex-1 bg-accent/20" />
                    <h3 className="font-headline text-md tracking-widest text-accent uppercase">Gold</h3>
                    <div className="h-px flex-1 bg-accent/20" />
                </div>
                <div className="flex flex-wrap justify-center gap-x-8 gap-y-16 items-center">
                    {goldSponsors.map((sponsor) => (
                    <div key={sponsor.id} data-ai-hint="company logo" className="p-4 glass-panel border-accent/20 rounded-none w-full max-w-60 h-28 flex items-center justify-center group relative transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-accent/20">
                        <Image src={sponsor.logoUrl || ''} alt={sponsor.name} fill className="object-contain p-3 opacity-70 group-hover:opacity-100 transition-opacity" />
                        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[8px] font-headline tracking-widest opacity-0 group-hover:opacity-100 transition-opacity uppercase text-accent whitespace-nowrap">{sponsor.name}</span>
                    </div>
                    ))}
                </div>
                </section>
            )}

            {silverSponsors.length > 0 && (
                <section>
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-px flex-1 bg-white/10" />
                    <h3 className="font-headline text-sm tracking-widest text-muted-foreground uppercase">Silver & Partners</h3>
                    <div className="h-px flex-1 bg-white/10" />
                </div>
                <div className="flex flex-wrap justify-center gap-8 items-center">
                    {silverSponsors.map((sponsor) => (
                    <div key={sponsor.id} data-ai-hint="company logo" className="p-2 glass-panel border-white/10 rounded-none w-full max-w-48 h-24 flex items-center justify-center group relative transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/10">
                        <Image src={sponsor.logoUrl || ''} alt={sponsor.name} fill className="object-contain p-2 opacity-60 group-hover:opacity-100 transition-opacity" />
                        <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[8px] font-headline tracking-widest opacity-0 group-hover:opacity-100 transition-opacity uppercase text-muted-foreground whitespace-nowrap">{sponsor.name}</span>
                    </div>
                    ))}
                </div>
                </section>
            )}
        </div>
        <AboutSection />
      </div>
    </div>
  );
}
