'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import * as LucideIcons from 'lucide-react';
import { CircleHelp, Loader2 } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export default function ArenasPage() {
  const firestore = useFirestore();
  const eventsQuery = useMemoFirebase(() => firestore ? collection(firestore, 'events') : null, [firestore]);
  const { data: events, isLoading: eventsLoading } = useCollection(eventsQuery);

  const technicalEvents = useMemo(() => events?.filter((e: any) => e.isTechnical) || [], [events]);
  const nonTechnicalEvents = useMemo(() => events?.filter((e: any) => !e.isTechnical) || [], [events]);

  const EventSkeleton = () => (
    <Card className="glass-card h-full overflow-hidden border-none rounded-none">
      <Skeleton className="h-48 w-full" />
      <CardHeader className="pt-4">
        <Skeleton className="w-8 h-8 mb-2" />
        <Skeleton className="h-6 w-3/4" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-1/3 mt-4" />
      </CardContent>
    </Card>
  );

  return (
    <div className="pt-32 pb-40 px-6 max-w-7xl mx-auto">
      <div className="mb-16 stagger-reveal">
        <h1 className="font-headline text-5xl md:text-6xl mb-4 tracking-tighter uppercase">FESTIVAL <span className="text-primary">ARENAS</span></h1>
        <p className="text-muted-foreground text-lg max-w-2xl">From deep technical dives to mind-bending logic challenges, explore the dual tracks of TECH KURUKSHETRA.</p>
      </div>

      <section className="mb-24">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-primary/20" />
          <h2 className="font-headline text-2xl tracking-widest text-primary uppercase">Technical Track</h2>
          <div className="h-px flex-1 bg-primary/20" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-reveal">
          {eventsLoading ? (
            Array.from({ length: 3 }).map((_, i) => <EventSkeleton key={`tech-skel-${i}`} />)
          ) : (
            technicalEvents.map((event: any) => {
              const img = !event.imageUrl && PlaceHolderImages.find(i => i.id === event.imgId);
              const imgSrc = event.imageUrl || img?.imageUrl || '';
              const Icon = (LucideIcons as any)[event.iconName] || CircleHelp;
              
              return (
                <Link key={event.slug} href={`/arenas/${event.slug}`}>
                  <Card className="glass-card h-full overflow-hidden group border-none rounded-none cursor-pointer">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={imgSrc}
                        alt={event.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                      <Badge className="absolute top-4 right-4 bg-primary/80 text-white border-none rounded-none font-headline text-[10px] tracking-widest uppercase">
                        {event.type}
                      </Badge>
                    </div>
                    <CardHeader className="pt-4">
                      <div className={event.color}><Icon className="w-8 h-8" /></div>
                      <CardTitle className="font-headline text-xl mt-2 group-hover:text-primary transition-colors">
                        {event.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                        {event.description}
                      </p>
                      <span className="mt-6 inline-block text-xs font-headline text-accent tracking-[0.2em] uppercase group-hover:underline">
                        View Protocol
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })
          )}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-accent/20" />
          <h2 className="font-headline text-2xl tracking-widest text-accent uppercase">Non-Technical Track</h2>
          <div className="h-px flex-1 bg-accent/20" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-reveal">
          {eventsLoading ? (
             Array.from({ length: 3 }).map((_, i) => <EventSkeleton key={`nontech-skel-${i}`} />)
          ) : (
            nonTechnicalEvents.map((event: any) => {
              const img = !event.imageUrl && PlaceHolderImages.find(i => i.id === event.imgId);
              const imgSrc = event.imageUrl || img?.imageUrl || '';
              const Icon = (LucideIcons as any)[event.iconName] || CircleHelp;

              return (
                <Link key={event.slug} href={`/arenas/${event.slug}`}>
                  <Card className="glass-card h-full overflow-hidden group border-none rounded-none cursor-pointer">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={imgSrc}
                        alt={event.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                      <Badge className="absolute top-4 right-4 bg-accent/80 text-background border-none rounded-none font-headline text-[10px] tracking-widest uppercase">
                        {event.type}
                      </Badge>
                    </div>
                    <CardHeader className="pt-4">
                      <div className={event.color}><Icon className="w-8 h-8" /></div>
                      <CardTitle className="font-headline text-xl mt-2 group-hover:text-accent transition-colors">
                        {event.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                        {event.description}
                      </p>
                      <span className="mt-6 inline-block text-xs font-headline text-primary tracking-[0.2em] uppercase group-hover:underline">
                        Join Mission
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}

    