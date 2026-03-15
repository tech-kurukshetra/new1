'use client';

import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, Code, Globe, Cpu, Loader2, Lightbulb, Users, Trophy } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase, useDoc } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';


const statsConfig = [
    { icon: Code, label: "Competitions", key: "competitions", defaultValue: "10+" },
    { icon: Globe, label: "Participants", key: "participants", defaultValue: "50K+" },
    { icon: Cpu, label: "Prize Pool", key: "prizePool", defaultValue: "$21K+" }
];

export default function Home() {
  const heroImg = PlaceHolderImages.find(img => img.id === 'hero-tech');
  const aboutImg = PlaceHolderImages.find(img => img.id === 'hero-tech');
  
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

  const siteUrl = 'https://www.techkurukshetra.in';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Festival',
    name: 'TECH KURUKSHETRA 2026',
    startDate: '2026-04-10',
    endDate: '2026-04-11',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: 'UCPIT SVGU Campus',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Chimanbhai Patel Institute Campus, SG Highway, Near Prahlad Nagar',
        addressLocality: 'Ahmedabad',
        postalCode: '380015',
        addressRegion: 'GJ',
        addressCountry: 'IN',
      },
    },
    image: [
      heroImg?.imageUrl || ''
    ],
    description: 'The most immersive tech battlefield of the year. Join developers, designers, and visionaries to reshape the future.',
    url: siteUrl,
    organizer: {
      '@type': 'Organization',
      name: 'TECH KURUKSHETRA',
      url: siteUrl,
    },
  };

  return (
    <>
      <Script
        id="festival-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] text-center">
            <div className="inline-block px-4 py-1 glass-panel border-accent/30 rounded-full mb-6">
              <span className="text-accent text-xs font-headline tracking-[0.2em] uppercase">10-11 April 2026</span>
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
                  {heroData?.mainHeadline || 'TECH KURUKSHETRA '}
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
                <p>{heroData?.description || 'The most immersive tech battlefield of the year. Join thousands of developers, designers, and visionaries from across the nation to learn, build, and conquer. Reshape the future with your skills.'}</p>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-32">
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
          
          <section id="about" className="py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative h-full min-h-[300px] lg:min-h-[500px]">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 blur-3xl" />
                <div className="relative w-full h-full p-4">
                    <div className="relative w-full h-full glass-panel border-primary/20 rounded-none overflow-hidden hover:rotate-0 transition-transform duration-500">
                        <Image 
                            src={aboutImg?.imageUrl || ''}
                            alt="About TECH KURUKSHETRA"
                            fill
                            className="object-cover"
                            data-ai-hint="futuristic technology event"
                        />
                    </div>
                </div>
              </div>

              <div className="space-y-10">
                <div>
                    <h2 className="font-headline text-3xl md:text-4xl mb-4 tracking-tighter uppercase">ABOUT THE <span className="text-primary">BATTLEFIELD</span></h2>
                    <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">TECH KURUKSHETRA is more than a festival; it's a nationwide convergence of the brightest minds in technology, hosted at the prestigious UCPIT SVGU Campus in Ahmedabad. This two-day spectacle is a melting pot of innovation, where aspiring engineers, seasoned developers, and creative designers come together to push the boundaries of what's possible. Our mission is to foster a vibrant ecosystem of learning, collaboration, and healthy competition. We provide a platform for students to showcase their talents, test their skills in high-stakes arenas, and network with industry leaders and mentors. From intense 24-hour hackathons that demand endurance and creativity to intricate robotics challenges and mind-bending logic quizzes, every event is designed to inspire and challenge. TECH KURUKSHETRA is where theoretical knowledge meets practical application, where ideas are born, and where the next generation of tech pioneers begins their journey to conquer the future.</p>
                </div>
                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="glass-panel border-primary/20 p-3 mt-1">
                            <Lightbulb className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-headline text-lg text-white uppercase tracking-widest">Innovation</h3>
                            <p className="text-muted-foreground font-light">Push the boundaries of what's possible with cutting-edge workshops and challenges.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="glass-panel border-primary/20 p-3 mt-1">
                            <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-headline text-lg text-white uppercase tracking-widest">Collaboration</h3>
                            <p className="text-muted-foreground font-light">Connect with fellow tech enthusiasts, mentors, and industry leaders.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="glass-panel border-primary/20 p-3 mt-1">
                            <Trophy className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-headline text-lg text-white uppercase tracking-widest">Competition</h3>
                            <p className="text-muted-foreground font-light">Test your skills in high-stakes arenas and fight for the top spot.</p>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </section>

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
                        <a key={sponsor.id} href={sponsor.websiteUrl || '#'} target="_blank" rel="noopener noreferrer" aria-label={sponsor.name}>
                          <div data-ai-hint="company logo" className="p-4 glass-panel border-primary/20 rounded-none w-full max-w-xs h-32 flex items-center justify-center group relative transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20">
                              <Image src={sponsor.logoUrl || ''} alt={sponsor.name} fill className="object-contain p-4 opacity-80 group-hover:opacity-100 transition-opacity" />
                              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-headline tracking-widest opacity-0 group-hover:opacity-100 transition-opacity uppercase text-primary whitespace-nowrap">{sponsor.name}</span>
                          </div>
                        </a>
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
                        <a key={sponsor.id} href={sponsor.websiteUrl || '#'} target="_blank" rel="noopener noreferrer" aria-label={sponsor.name}>
                          <div data-ai-hint="company logo" className="p-4 glass-panel border-accent/20 rounded-none w-full max-w-60 h-28 flex items-center justify-center group relative transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-accent/20">
                              <Image src={sponsor.logoUrl || ''} alt={sponsor.name} fill className="object-contain p-3 opacity-70 group-hover:opacity-100 transition-opacity" />
                              <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[8px] font-headline tracking-widest opacity-0 group-hover:opacity-100 transition-opacity uppercase text-accent whitespace-nowrap">{sponsor.name}</span>
                          </div>
                        </a>
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
                        <a key={sponsor.id} href={sponsor.websiteUrl || '#'} target="_blank" rel="noopener noreferrer" aria-label={sponsor.name}>
                          <div data-ai-hint="company logo" className="p-2 glass-panel border-white/10 rounded-none w-full max-w-48 h-24 flex items-center justify-center group relative transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/10">
                              <Image src={sponsor.logoUrl || ''} alt={sponsor.name} fill className="object-contain p-2 opacity-60 group-hover:opacity-100 transition-opacity" />
                              <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[8px] font-headline tracking-widest opacity-0 group-hover:opacity-100 transition-opacity uppercase text-muted-foreground whitespace-nowrap">{sponsor.name}</span>
                          </div>
                        </a>
                      ))}
                  </div>
                  </section>
              )}
          </div>
        </div>
      </div>
    </>
  );
}
