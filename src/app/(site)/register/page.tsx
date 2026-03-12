

"use client"

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2, Loader2, Sparkles, ShieldCheck, Zap, User, Mail, Phone, School, BookOpen, Trophy } from 'lucide-react';
import Link from 'next/link';
import { useAuth, useUser, setDocumentNonBlocking, initiateAnonymousSignIn, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection } from 'firebase/firestore';

export default function RegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { user, isUserLoading: isAuthLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();

  const eventsQuery = useMemoFirebase(() => firestore ? collection(firestore, 'events') : null, [firestore]);
  const { data: events, isLoading: eventsLoading } = useCollection(eventsQuery);

  const technicalEvents = useMemo(() => events?.filter((e: any) => e.isTechnical) || [], [events]);
  const nonTechnicalEvents = useMemo(() => events?.filter((e: any) => !e.isTechnical) || [], [events]);
  
  const isUserLoading = isAuthLoading || !firestore;


  useEffect(() => {
    if (!isUserLoading && !user && firestore) {
      initiateAnonymousSignIn(auth);
    }
  }, [isUserLoading, user, auth, firestore]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      // Or show a toast message
      console.error("User not authenticated. Cannot register.");
      return;
    }
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        phoneNumber: formData.get('phoneNumber'),
        university: formData.get('college'),
        studentId: formData.get('course'), // Not a perfect match, but close enough for demo
        registeredEventIds: [formData.get('selectedEvent')],
        registrationDate: new Date().toISOString(),
        isVerified: false,
        paymentStatus: 'Pending',
        id: user.uid
    };

    const docRef = doc(firestore, 'participant_registrations', user.uid);
    setDocumentNonBlocking(docRef, data, { merge: true });

    // Static simulation of backend registration
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="pt-48 pb-20 px-6 flex flex-col items-center justify-center text-center">
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
          <div className="relative w-32 h-32 bg-background border-2 border-primary flex items-center justify-center rounded-none rotate-45 group">
            <CheckCircle2 className="w-16 h-16 text-primary -rotate-45" />
          </div>
        </div>
        
        <h1 className="font-headline text-5xl md:text-7xl mb-6 tracking-tighter uppercase leading-none text-white">
          ACCESS <br />
          <span className="text-primary text-glow">GRANTED</span>
        </h1>
        
        <div className="max-w-md space-y-6">
          <p className="text-muted-foreground text-lg uppercase tracking-widest font-light">
            Identity Verified. Welcome to the Battlefield.
          </p>
          <div className="glass-panel p-6 border-primary/20 text-xs font-headline tracking-widest uppercase text-accent">
            Protocol successfully initiated for your track.
          </div>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/80 px-12 py-8 font-headline tracking-widest rounded-none w-full accent-glow transition-all hover:scale-105">
            <Link href="/">RETURN TO HUB</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-40 px-6 max-w-5xl mx-auto min-h-screen">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1 glass-panel border-accent/30 rounded-full mb-6 mx-auto">
          <Zap className="w-4 h-4 text-accent" />
          <span className="text-[10px] font-headline tracking-[0.3em] text-accent uppercase">Protocol Initiation</span>
        </div>
        <h1 className="font-headline text-5xl md:text-7xl mb-4 tracking-tighter uppercase text-white leading-none">
          JOIN THE <span className="text-primary text-glow">ARENA</span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto uppercase tracking-[0.2em] text-[10px] font-bold">
          Secure your position in the upcoming Neon Horizon Cycle
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-8 border-primary/20 rounded-none bg-black/40">
            <h3 className="font-headline text-xs tracking-[0.3em] text-primary uppercase mb-6 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Security Notice
            </h3>
            <ul className="space-y-4 text-[10px] text-muted-foreground uppercase tracking-widest leading-loose">
              <li className="flex gap-3"><span className="text-primary">01</span> All entries are subject to technical review.</li>
              <li className="flex gap-3"><span className="text-primary">02</span> One digital pass per verified identity.</li>
              <li className="flex gap-3"><span className="text-primary">03</span> Firebase backend is now active.</li>
            </ul>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="lg:col-span-8 glass-panel p-8 md:p-12 space-y-8 rounded-none border-primary/10 shadow-2xl relative overflow-hidden bg-black/20">
          <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-primary/20" />
          
          <div className="space-y-6">
            <h2 className="font-headline text-sm tracking-[0.3em] text-accent uppercase flex items-center gap-2">
              <User className="w-4 h-4" /> Personal Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-[10px] tracking-widest uppercase text-muted-foreground ml-1">Full Identity</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                  <Input id="fullName" name="fullName" placeholder="SURNAME GIVENNAME" required className="bg-white/5 border-white/10 rounded-none h-12 pl-10 focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm tracking-widest uppercase" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] tracking-widest uppercase text-muted-foreground ml-1">Communication Link</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                  <Input id="email" name="email" type="email" placeholder="YOUR.NAME@YOUR.DOMAIN" required className="bg-white/5 border-white/10 rounded-none h-12 pl-10 focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm tracking-widest uppercase" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-[10px] tracking-widest uppercase text-muted-foreground ml-1">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                  <Input id="phoneNumber" name="phoneNumber" type="tel" placeholder="+91 00000 00000" required className="bg-white/5 border-white/10 rounded-none h-12 pl-10 focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm tracking-widest uppercase" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="college" className="text-[10px] tracking-widest uppercase text-muted-foreground ml-1">College / University</Label>
                <div className="relative">
                  <School className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                  <Input id="college" name="college" placeholder="INSTITUTION NAME" required className="bg-white/5 border-white/10 rounded-none h-12 pl-10 focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm tracking-widest uppercase" />
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="course" className="text-[10px] tracking-widest uppercase text-muted-foreground ml-1">Course / Semester</Label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                  <Input id="course" name="course" placeholder="e.g. B.Tech CSE, Sem 4" required className="bg-white/5 border-white/10 rounded-none h-12 pl-10 focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm tracking-widest uppercase" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="font-headline text-sm tracking-[0.3em] text-accent uppercase flex items-center gap-2">
              <Trophy className="w-4 h-4" /> Select Arena
            </h2>
            
            <div className="space-y-2">
              <Label className="text-[10px] tracking-widest uppercase text-muted-foreground ml-1">Arena Track</Label>
              <Select name="selectedEvent" required disabled={eventsLoading}>
                <SelectTrigger className="bg-white/5 border-white/10 rounded-none h-14 focus:border-primary focus:ring-primary uppercase tracking-widest text-[11px] text-white">
                  <SelectValue placeholder={eventsLoading ? "LOADING ARENAS..." : "INITIALIZE ARENA SELECTION"} />
                </SelectTrigger>
                <SelectContent className="glass-panel border-primary/30 text-white rounded-none bg-black/95 backdrop-blur-xl">
                  <SelectGroup>
                    <SelectLabel className="text-[10px] text-primary tracking-widest px-4 py-2 border-b border-white/5">TECHNICAL ARENAS</SelectLabel>
                    {technicalEvents.map(event => (
                      <SelectItem key={event.slug} value={event.name} className="text-[10px] tracking-widest uppercase py-3 cursor-pointer">
                        {event.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel className="text-[10px] text-accent tracking-widest px-4 py-2 border-b border-white/5 mt-2">NON-TECHNICAL ARENAS</SelectLabel>
                    {nonTechnicalEvents.map(event => (
                      <SelectItem key={event.slug} value={event.name} className="text-[10px] tracking-widest uppercase py-3 cursor-pointer">
                        {event.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pt-6">
            <Button 
              type="submit" 
              disabled={isSubmitting || isUserLoading || !user}
              className="w-full bg-primary hover:bg-primary/80 py-8 font-headline tracking-[0.4em] text-lg rounded-none transition-all group relative overflow-hidden accent-glow"
            >
              {isSubmitting || isUserLoading ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span>TRANSMITTING...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 group-hover:scale-125 transition-transform" />
                  INITIATE REGISTRATION
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

    
