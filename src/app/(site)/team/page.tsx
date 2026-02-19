'use client';

import Image from 'next/image';
import { useMemo } from 'react';
import { Github, Linkedin, Loader2, FileText, ExternalLink } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export default function TeamPage() {
  const firestore = useFirestore();
  const teamMembersQuery = useMemoFirebase(() => firestore ? collection(firestore, 'teamMembers') : null, [firestore]);
  const { data: team, isLoading: teamLoading } = useCollection(teamMembersQuery);

  const groupedTeam = useMemo(() => {
    if (!team) return {};
    const categories = [
      "Organiser",
      "Finance",
      "Social Media",
      "Tech Team",
      "Decoration",
      "Promotion",
      "Management planing and operational Team"
    ];
    
    const categoryOrder: { [key: string]: number } = categories.reduce((acc, category, index) => {
      acc[category] = index;
      return acc;
    }, {} as { [key: string]: number });

    const groups = team.reduce((acc, member: any) => {
      const category = member.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(member);
      return acc;
    }, {} as { [key: string]: any[] });

    // Sort categories based on the predefined order
    const sortedCategories = Object.keys(groups).sort((a, b) => {
      const orderA = categoryOrder[a] ?? Infinity;
      const orderB = categoryOrder[b] ?? Infinity;
      return orderA - orderB;
    });

    const sortedGroups: { [key: string]: any[] } = {};
    for (const category of sortedCategories) {
      const members = groups[category];
      // Sort members within each category by displayOrder
      members.sort((a: any, b: any) => (a.displayOrder || 0) - (b.displayOrder || 0));
      sortedGroups[category] = members;
    }

    return sortedGroups;
  }, [team]);


  const ArchitectSkeleton = ({ isShifted }: { isShifted: boolean }) => (
    <div className={`relative ${isShifted ? 'lg:translate-y-12' : ''}`}>
      <div className="absolute -inset-2 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 blur-xl opacity-50" />
      <div className="relative glass-panel border-primary/20 rounded-none bg-black/40 overflow-hidden flex flex-col">
        <Skeleton className="aspect-[4/5] w-full bg-white/10" />
        <div className="p-8 space-y-4">
          <Skeleton className="h-6 w-3/4 bg-white/10" />
          <Skeleton className="h-4 w-1/4 bg-white/10" />
          <Skeleton className="h-4 w-full mt-2 bg-white/10" />
          <Skeleton className="h-4 w-5/6 bg-white/10" />
          <div className="flex gap-4 pt-2">
            <Skeleton className="h-5 w-24 bg-white/10" />
            <Skeleton className="h-5 w-5 bg-white/10" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pt-32 pb-40 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="mb-20 stagger-reveal text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 glass-panel border-primary/30 rounded-full mb-6 mx-auto">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-headline tracking-[0.2em] text-primary uppercase">Active Personnel</span>
        </div>
        <h1 className="font-headline text-5xl md:text-7xl mb-4 tracking-tighter uppercase text-white">
          CORE <span className="text-primary">ARCHITECTS</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto uppercase tracking-[0.4em] text-[10px] font-bold">
          The Minds Behind the Neon Horizon
        </p>
      </div>

      <div className="space-y-24">
        {teamLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
                {Array.from({ length: 3 }).map((_, idx) => <ArchitectSkeleton key={idx} isShifted={idx % 2 !== 0} />)}
            </div>
        ) : (
            Object.entries(groupedTeam).map(([category, members]) => (
                <section key={category}>
                    <div className="flex items-center gap-4 mb-12">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                        <h2 className="font-headline text-xl md:text-2xl tracking-widest text-primary uppercase text-center">{category}</h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24 stagger-reveal">
                        {(members as any[]).map((member: any, idx: number) => {
                          const isShifted = idx % 2 !== 0;

                          return (
                            <div 
                              key={member.id} 
                              className={`relative ${isShifted ? 'lg:translate-y-12' : ''}`}
                            >
                              <div className="absolute -inset-2 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 blur-xl opacity-50" />
                              
                              <div className="relative glass-panel border-primary/20 rounded-none bg-black/40 overflow-hidden flex flex-col h-full">
                                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary/40 z-20" />
                                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary/40 z-20" />

                                <div className="relative aspect-[4/5] w-full overflow-hidden">
                                  <Image
                                    src={member.profileImageUrl}
                                    alt={member.fullName}
                                    fill
                                    className="object-cover"
                                    data-ai-hint="person portrait"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                                </div>
                                
                                <div className="p-8 space-y-4 flex flex-col flex-1">
                                  <div>
                                    <h3 className="font-headline text-2xl text-white mb-1 uppercase leading-none tracking-tight">
                                      {member.fullName}
                                    </h3>
                                    <p className="text-accent text-[9px] font-headline tracking-[0.3em] uppercase opacity-80">
                                      {member.role}
                                    </p>
                                  </div>
                                  
                                  <p className="text-muted-foreground text-[10px] leading-relaxed uppercase tracking-widest flex-1">
                                    {member.bio || `Category: ${member.category}`}
                                  </p>

                                  <div className="flex flex-wrap gap-x-4 gap-y-2 items-center pt-2">
                                    {member.linkedinUrl && (
                                      <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition-colors flex items-center gap-1 text-[10px] font-headline tracking-widest">
                                        <Linkedin className="w-4 h-4" /> LINKEDIN
                                      </a>
                                    )}
                                    {member.githubUrl && (
                                      <a href={member.githubUrl} target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition-colors flex items-center gap-1 text-[10px] font-headline tracking-widest">
                                        <Github className="w-4 h-4" /> GITHUB
                                      </a>
                                    )}
                                    {member.portfolioUrl && (
                                      <a href={member.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition-colors flex items-center gap-1 text-[10px] font-headline tracking-widest">
                                        <ExternalLink className="w-4 h-4" /> PORTFOLIO
                                      </a>
                                    )}
                                    {member.resumeUrl && (
                                      <a href={member.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition-colors flex items-center gap-1 text-[10px] font-headline tracking-widest">
                                        <FileText className="w-4 h-4" /> RESUME
                                      </a>
                                    )}
                                  </div>
                                </div>

                                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%),linear-gradient(90deg,rgba(255,0,0,0.01),rgba(0,255,0,0.005),rgba(0,0,255,0.01))] bg-[length:100%_2px,3px_100%] opacity-20" />
                              </div>
                            </div>
                          );
                        })}
                    </div>
                </section>
            ))
        )}
         {team && Object.keys(groupedTeam).length === 0 && !teamLoading && (
            <div className="text-center text-muted-foreground py-20">
                No team members have been added yet.
            </div>
         )}
      </div>
    </div>
  );
}
