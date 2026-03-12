
"use client"

import { useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, MapPin, Loader2 } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, orderBy, query } from 'firebase/firestore';

export default function TimelinePage() {
  const firestore = useFirestore();

  const festivalDaysQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'festivalDays'), orderBy('date', 'asc')) : null),
    [firestore]
  );
  const { data: festivalDays, isLoading: daysLoading } = useCollection(festivalDaysQuery);

  const eventsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'events'), orderBy('startTime', 'asc')) : null),
    [firestore]
  );
  const { data: events, isLoading: eventsLoading } = useCollection(eventsQuery);

  const scheduleData = useMemo(() => {
    if (!festivalDays || !events) return [];
    
    return festivalDays.map(day => ({
      ...day,
      events: events.filter(event => event.festivalDayId === day.id)
    }));
  }, [festivalDays, events]);

  const isLoading = daysLoading || eventsLoading;

  const formatTime = (dateString: string | undefined) => {
    if (!dateString) return "TBD";
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch (e) {
      return "Invalid Date";
    }
  };
  
  if (isLoading) {
    return (
      <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto min-h-screen">
        <div className="text-center mb-16">
          <h1 className="font-headline text-5xl md:text-6xl mb-4 tracking-tighter uppercase text-white">FESTIVAL <span className="text-accent">TIMELINE</span></h1>
          <p className="text-muted-foreground text-lg uppercase tracking-widest font-light">Two days of intense innovation, learning, and celebration.</p>
        </div>
        <div className="flex justify-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  if (!scheduleData || scheduleData.length === 0) {
    return (
      <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto min-h-screen text-center">
        <h1 className="font-headline text-5xl md:text-6xl mb-4 tracking-tighter uppercase text-white">FESTIVAL <span className="text-accent">TIMELINE</span></h1>
        <p className="text-muted-foreground text-lg uppercase tracking-widest font-light">The timeline is not yet available. Please check back later.</p>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto min-h-screen">
      <div className="text-center mb-16">
        <h1 className="font-headline text-5xl md:text-6xl mb-4 tracking-tighter uppercase text-white">FESTIVAL <span className="text-accent">TIMELINE</span></h1>
        <p className="text-muted-foreground text-lg uppercase tracking-widest font-light">Two days of intense innovation, learning, and celebration.</p>
      </div>

      <Tabs defaultValue={scheduleData[0]?.id} className="w-full">
        <TabsList className="flex w-full bg-secondary/30 rounded-none mb-12 p-1 border border-white/5">
          {scheduleData.map(day => (
            <TabsTrigger key={day.id} value={day.id} className="flex-1 font-headline text-xs tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white rounded-none py-4 uppercase">{day.name}</TabsTrigger>
          ))}
        </TabsList>

        {scheduleData.map((day) => (
          <TabsContent key={day.id} value={day.id} className="mt-0 outline-none">
            {day.events && day.events.length > 0 ? day.events.map((item: any, idx: number) => (
               <div key={item.id || idx} className="relative pl-8 md:pl-12 border-l-2 border-primary/20 group">
                <div className="absolute -left-[9px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-none bg-background border-2 border-primary group-hover:bg-primary group-hover:rotate-45 transition-all duration-500" />
                <div className="glass-panel p-6 border border-primary/10 bg-black/20 rounded-none ml-4 mb-8 group-hover:border-primary/40 transition-all duration-300 animate-in fade-in slide-in-from-left-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2 text-accent text-[10px] font-headline tracking-[0.2em] uppercase">
                        <Clock className="w-3.5 h-3.5" />
                        {formatTime(item.startTime)}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground text-[9px] uppercase tracking-widest font-bold">
                        <MapPin className="w-3 h-3 text-primary" />
                        {item.location || "TBD"}
                        </div>
                    </div>

                    <h3 className="text-2xl font-headline text-white group-hover:text-primary transition-colors tracking-tight uppercase">
                        {item.name}
                    </h3>
                </div>
            </div>
            )) : (
              <div className="text-center text-muted-foreground py-10">No events scheduled for this day yet.</div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
