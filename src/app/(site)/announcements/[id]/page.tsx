'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import Script from 'next/script';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { ArrowLeft, Loader2, Megaphone } from 'lucide-react';
import Link from 'next/link';

export default function AnnouncementDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const firestore = useFirestore();

  const announcementRef = useMemoFirebase(
    () => (firestore && id ? doc(firestore, 'announcements', id) : null),
    [firestore, id]
  );
  const { data: announcement, isLoading } = useDoc(announcementRef);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="pt-32 pb-40 px-6 max-w-4xl mx-auto min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!announcement) {
    return (
      <div className="pt-32 pb-40 px-6 max-w-4xl mx-auto min-h-screen text-center">
        <h1 className="font-headline text-5xl md:text-6xl tracking-tighter text-destructive mb-6 uppercase">
          Briefing Not Found
        </h1>
        <p className="text-xl text-muted-foreground font-light leading-relaxed">
          The announcement you are looking for does not exist or has been retracted.
        </p>
        <Link href="/announcements" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mt-12 font-headline text-xs tracking-widest uppercase group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Return to All Briefings
        </Link>
      </div>
    );
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: announcement.title,
    datePublished: announcement.timestamp,
    dateModified: announcement.timestamp,
    description: announcement.content,
    author: [{
        '@type': 'Organization',
        name: 'TECH KURUKSHETRA',
        url: 'https://www.techkurukshetra.com'
    }],
     publisher: {
        '@type': 'Organization',
        name: 'TECH KURUKSHETRA',
        logo: {
            '@type': 'ImageObject',
            url: 'https://www.techkurukshetra.com/logo.png' // Placeholder
        }
    },
    mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://www.techkurukshetra.com/announcements/${id}`
    }
  };

  return (
    <>
      <Script
          id="announcement-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="pt-32 pb-40 px-6 max-w-4xl mx-auto min-h-screen">
        <Link href="/announcements" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-12 font-headline text-xs tracking-widest uppercase group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Return to All Briefings
        </Link>
        
        <div className="glass-panel border-primary/20 p-8 md:p-12 rounded-none stagger-reveal bg-black/40">
          <div className="flex items-center gap-2 text-accent text-[10px] font-headline tracking-[0.2em] uppercase mb-4">
            <Megaphone className="w-3.5 h-3.5" />
            <span>{formatDate(announcement.timestamp)}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-headline mb-8 text-white tracking-tight uppercase">
            {announcement.title}
          </h1>

          <div className="prose prose-invert prose-p:font-light prose-p:text-muted-foreground prose-p:leading-relaxed text-lg font-light">
            <p>{announcement.content}</p>
          </div>
        </div>
      </div>
    </>
  );
}
