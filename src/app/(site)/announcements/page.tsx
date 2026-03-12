'use client';

import { useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Loader2, Megaphone, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function AnnouncementsPage() {
  const firestore = useFirestore();

  const announcementsQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'announcements'), orderBy('timestamp', 'desc')) : null,
    [firestore]
  );

  const { data: announcements, isLoading } = useCollection(announcementsQuery);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="pt-32 pb-40 px-6 max-w-6xl mx-auto min-h-screen">
      <div className="text-center mb-16">
        <h1 className="font-headline text-5xl md:text-6xl mb-4 tracking-tighter uppercase">
          Mission <span className="text-primary">Briefings</span>
        </h1>
        <p className="text-muted-foreground text-lg uppercase tracking-widest font-light">
          Latest Updates & Announcements
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      ) : announcements && announcements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {announcements.map((announcement, idx) => (
            <Link
              key={announcement.id}
              href={`/announcements/${announcement.id}`}
              className="group block"
            >
              <Card
                className="glass-panel border-primary/10 hover:border-primary/40 p-8 rounded-none bg-black/20 h-full flex flex-col transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/10"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex-grow">
                  <div className="flex items-center gap-2 text-accent text-[10px] font-headline tracking-[0.2em] uppercase mb-4">
                    <Megaphone className="w-3.5 h-3.5" />
                    <span>{formatDate(announcement.timestamp)}</span>
                  </div>
                  <h2 className="text-2xl font-headline mb-4 text-white tracking-tight uppercase group-hover:text-primary transition-colors">
                    {announcement.title}
                  </h2>
                  <p className="text-muted-foreground font-light leading-relaxed text-sm line-clamp-3">
                    {announcement.content}
                  </p>
                </div>
                <div className="mt-6 text-xs font-headline text-primary tracking-[0.2em] uppercase flex items-center">
                  Read Briefing
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 glass-panel border-primary/20 rounded-none bg-black/40">
          <p className="text-muted-foreground">No announcements have been posted yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
