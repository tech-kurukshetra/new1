"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Zap, AlertCircle, Home, Lock } from 'lucide-react';
import Link from 'next/link';

// --- CONFIGURATION ---
const REGISTRATIONS_OPEN = false; // Set to true to reopen

export default function RegisterPage() {
  // If registrations are closed, show the "Access Denied" / Closed UI
  if (!REGISTRATIONS_OPEN) {
    return (
      <div className="pt-32 md:pt-48 pb-20 px-6 flex flex-col items-center justify-center text-center min-h-screen">
        <div className="relative mb-12">
          {/* Background Glow */}
          <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full animate-pulse" />
          
          {/* Locked Icon Box */}
          <div className="relative w-24 h-24 md:w-32 md:h-32 bg-background border-2 border-red-500 flex items-center justify-center rounded-none rotate-45 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
            <Lock className="w-10 h-10 md:w-16 md:h-16 text-red-500 -rotate-45" />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 glass-panel border border-red-500/30 rounded-full mb-6 mx-auto">
          <AlertCircle className="w-3.5 h-3.5 text-red-500" />
          <span className="text-[10px] font-headline tracking-[0.2em] text-red-500 uppercase">
            System Offline
          </span>
        </div>

        <h1 className="font-headline text-4xl md:text-7xl mb-6 tracking-tighter uppercase leading-none text-white">
          REGISTRATIONS <br />
          <span className="text-red-500 text-glow">CLOSED</span>
        </h1>

        <div className="max-w-md space-y-6">
          <p className="text-muted-foreground text-sm md:text-base uppercase tracking-widest font-light leading-relaxed">
            The entry portal to the arena is now sealed. <br />
            All slots have been filled or the deadline has passed.
          </p>

          <div className="glass-panel p-4 border border-white/10 text-[10px] font-mono tracking-widest text-accent uppercase">
            Stay tuned to our socials for event updates and brackets.
          </div>

          <Button asChild size="lg" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-12 py-8 font-headline tracking-widest rounded-none w-full transition-all hover:scale-105">
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-4 h-4" /> RETURN TO HUB
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // ... (Rest of your existing registration logic remains below, 
  // but won't be reached as long as REGISTRATIONS_OPEN is false)
  return null; 
}
