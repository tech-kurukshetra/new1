'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Script from 'next/script';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import * as LucideIcons from 'lucide-react';
import { ArrowLeft, Calendar, MapPin, ShieldCheck, ListChecks, CircleHelp, Loader2, User, Phone, Tag } from 'lucide-react';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

export default function ArenaDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const firestore = useFirestore();

  const eventRef = useMemoFirebase(() => 
      firestore ? doc(firestore, 'events', slug) : null, 
      [firestore, slug]
  );
  const { data: event, isLoading } = useDoc(eventRef);

  const festivalDayRef = useMemoFirebase(() => 
    (firestore && event?.festivalDayId) ? doc(firestore, 'festivalDays', event.festivalDayId) : null,
    [firestore, event]
  );
  const { data: festivalDay, isLoading: festivalDayLoading } = useDoc(festivalDayRef);
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Date TBD';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
  }

  if (isLoading || festivalDayLoading) {
    return (
      <div className="pt-32 pb-40 px-6 max-w-5xl mx-auto min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="pt-32 pb-40 px-6 max-w-5xl mx-auto min-h-screen text-center">
        <h1 className="font-headline text-5xl md:text-6xl tracking-tighter text-destructive mb-6 uppercase">
            Arena Not Found
        </h1>
        <p className="text-xl text-muted-foreground font-light leading-relaxed">
            The event you are looking for does not exist or has been moved.
        </p>
         <Button asChild size="lg" className="mt-8 bg-primary hover:bg-primary/80 px-12 py-8 font-headline tracking-widest text-lg rounded-none w-full md:w-auto">
            <Link href="/arenas">VIEW ALL ARENAS</Link>
        </Button>
      </div>
    )
  }

  const img = !event.imageUrl && PlaceHolderImages.find(i => i.id === event.imgId);
  const imgSrc = event.imageUrl || img?.imageUrl || '';
  const Icon = (LucideIcons as any)[event.iconName] || CircleHelp;

  const eventStartDate = festivalDay?.date ? new Date(festivalDay.date).toISOString().split('T')[0] : '2026-04-10';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.name,
    startDate: event.startTime || eventStartDate,
    endDate: event.endTime || eventStartDate,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: event.location || 'UCPIT SVGU Campus',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Chimanbhai Patel Institute Campus, SG Highway, Near Prahlad Nagar',
        addressLocality: 'Ahmedabad',
        postalCode: '380015',
        addressRegion: 'GJ',
        addressCountry: 'IN',
      },
    },
    image: [imgSrc],
    description: event.longDescription,
    organizer: {
      '@type': 'Organization',
      name: 'TECH KURUKSHETRA',
      url: 'https://www.techkurukshetra.com',
    },
  };

  return (
    <>
      <Script
        id="event-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="pt-32 pb-40 px-6 max-w-5xl mx-auto min-h-screen">
        <Link href="/arenas" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-12 font-headline text-xs tracking-widest uppercase group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Arenas
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="relative aspect-square overflow-hidden glass-panel border-primary/20 rounded-none shadow-2xl">
              <Image
                src={imgSrc}
                alt={event.name}
                fill
                className="object-cover grayscale"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
            </div>

            <div className="glass-panel p-6 border-primary/10 rounded-none space-y-4">
              <div className="flex items-center gap-3 text-muted-foreground text-sm">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="uppercase tracking-widest font-headline text-[10px]">{festivalDay ? formatDate(festivalDay.date) : 'Date TBD'}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="uppercase tracking-widest font-headline text-[10px]">{event.location || 'Location TBD'}</span>
              </div>
              {event.registrationFee && (
                <div className="flex items-center gap-3 text-muted-foreground text-sm">
                  <Tag className="w-4 h-4 text-primary" />
                  <span className="uppercase tracking-widest font-headline text-[10px]">{event.registrationFee}</span>
                </div>
              )}
              {event.eventHead && (
                <div className="flex items-center gap-3 text-muted-foreground text-sm">
                  <User className="w-4 h-4 text-primary" />
                  <span className="uppercase tracking-widest font-headline text-[10px]">{event.eventHead}</span>
                </div>
              )}
              {event.organiserContact && (
                <div className="flex items-center gap-3 text-muted-foreground text-sm">
                  <Phone className="w-4 h-4 text-primary" />
                  <span className="uppercase tracking-widest font-headline text-[10px]">{event.organiserContact}</span>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-3 space-y-10">
            <div>
              <Badge className={`bg-primary/20 ${event.color} border-none rounded-none font-headline text-[10px] tracking-[0.2em] uppercase mb-4 px-4 py-1`}>
                {event.type}
              </Badge>
              <h1 className="font-headline text-5xl md:text-6xl tracking-tighter text-white mb-6 uppercase">
                {event.name}
              </h1>
            </div>

            <div className="space-y-6">
              <h2 className="font-headline text-xl text-primary tracking-widest uppercase flex items-center gap-3">
                <ShieldCheck className="w-5 h-5" /> The Protocol
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {event.longDescription}
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="font-headline text-xl text-accent tracking-widest uppercase flex items-center gap-3">
                <ListChecks className="w-5 h-5" /> Entry Constraints
              </h2>
              <div className="glass-panel p-6 border-white/5 bg-white/5 rounded-none">
                <ul className="space-y-4">
                  {event.rules.map((rule: string, idx: number) => (
                    <li key={idx} className="text-sm text-muted-foreground">
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-8">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/80 px-12 py-8 font-headline tracking-widest text-lg rounded-none w-full md:w-auto accent-glow">
                <Link href="/register">INITIALIZE REGISTRATION</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
