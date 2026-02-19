'use client';

import { useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Loader2, Megaphone } from 'lucide-react';
import { Card } from '@/components/ui/card';

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
    <div className="pt-32 pb-40 px-6 max-w-4xl mx-auto min-h-screen">
      <div className="text-center mb-16 stagger-reveal">
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
        <div className="space-y-8">
          {announcements.map((announcement, idx) => (
            <Card
              key={announcement.id}
              className="glass-panel border-primary/20 p-8 rounded-none stagger-reveal bg-black/40"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex items-center gap-2 text-accent text-[10px] font-headline tracking-[0.2em] uppercase mb-3">
                <Megaphone className="w-3.5 h-3.5" />
                <span>{formatDate(announcement.timestamp)}</span>
              </div>

              <h2 className="text-3xl font-headline mb-4 text-white tracking-tight uppercase">
                {announcement.title}
              </h2>
              <p className="text-muted-foreground font-light leading-relaxed text-md">
                {announcement.content}
              </p>
            </Card>
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
