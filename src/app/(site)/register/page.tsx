"use client";

import React, { useState, useEffect, useCallback, ComponentType } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  CheckCircle2, Loader2, Sparkles, ShieldCheck, Zap, User, Mail,
  Phone, School, BookOpen, ChevronRight, ChevronLeft, Users,
  Trophy, QrCode, AlertCircle, CreditCard, ArrowRight, Info,
} from 'lucide-react';
import Link from 'next/link';
import {
  useAuth, useUser, setDocumentNonBlocking,
  initiateAnonymousSignIn, useFirestore,
} from '@/firebase';
import { doc } from 'firebase/firestore';
import { collection, addDoc } from 'firebase/firestore';
import { EVENTS, CATEGORIES, calculateAmount, EventConfig } from '@/lib/events-config';
import QRCode from 'qrcode';

// ─── Types ───────────────────────────────────────────────────────────────────

interface TeamMember {
  name: string;
  email: string;
  phone: string;
  college: string;
  course: string;
}

interface FormData {
  // Step 1 – Leader
  fullName: string;
  email: string;
  phone: string;
  college: string;
  course: string;
  // Step 2 – Event
  selectedEventId: string;
  teamName: string;
  // Step 3 – Members
  members: TeamMember[];
}

const STEP_LABELS = [
  { num: 1, label: 'Leader Details', icon: User },
  { num: 2, label: 'Select Event', icon: Trophy },
  { num: 3, label: 'Team Members', icon: Users },
  { num: 4, label: 'Review', icon: ShieldCheck },
  { num: 5, label: 'Payment', icon: QrCode },
];

// Replace with your actual UPI details (or use env vars)
const UPI_ID   = process.env.NEXT_PUBLIC_UPI_ID   ?? '6352951712-3@okbizaxis';
const UPI_NAME = process.env.NEXT_PUBLIC_UPI_NAME ?? 'JAIN DHYAN JINESHKUMAR';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateOrderId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = 'TK-';
  for (let i = 0; i < 6; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

function buildUpiUrl(amount: number, orderId: string) {
  return `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(UPI_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent(orderId)}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-start md:justify-center gap-0 mb-8 md:mb-12 overflow-x-auto pb-4 scrollbar-hide w-full max-w-full">
      {STEP_LABELS.map((s, i) => (
        <div key={s.num} className="flex items-center shrink-0">
          <div className={`flex flex-col items-center gap-1.5 px-2 md:px-1`}>
            <div className={`w-6 h-6 md:w-8 md:h-8 flex items-center justify-center border transition-all duration-300 rounded-none
              ${currentStep === s.num ? 'border-primary bg-primary/20 text-primary shadow-[0_0_12px_hsl(var(--primary)/0.5)]' :
                currentStep > s.num ? 'border-primary/50 bg-primary/10 text-primary/70' :
                'border-white/10 bg-white/5 text-white/30'}`}>
              {currentStep > s.num
                ? <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4" />
                : <s.icon className="w-3 h-3 md:w-4 md:h-4" />}
            </div>
            <span className={`text-[8px] font-headline tracking-widest uppercase whitespace-nowrap
              ${currentStep === s.num ? 'text-primary' : currentStep > s.num ? 'text-primary/50' : 'text-white/20'}`}>
              {s.label}
            </span>
          </div>
          {i < STEP_LABELS.length - 1 && (
            <div className={`w-4 md:w-8 h-px mb-4 transition-all duration-500
              ${currentStep > s.num + 1 ? 'bg-primary/50' : currentStep > s.num ? 'bg-primary/30' : 'bg-white/10'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function FieldInput({
  id, label, icon: Icon, type = 'text', placeholder, value, onChange, required = true
}: {
  id: string; label: string; icon: ComponentType<{ className?: string }>; type?: string;
  placeholder: string; value: string; onChange: (v: string) => void; required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-[10px] tracking-widest uppercase text-muted-foreground ml-1">
        {label}
      </Label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
        <Input
          id={id} type={type} placeholder={placeholder} required={required} value={value}
          onChange={e => onChange(e.target.value)}
          className="bg-white/5 border-white/10 rounded-none h-12 pl-10 focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm tracking-widest"
        />
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: '', email: '', phone: '', college: '', course: '',
    selectedEventId: '', teamName: '', members: [],
  });
  const [orderId]        = useState(generateOrderId);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [utrError, setUtrError]   = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess]     = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('TECH');

  const { user, isUserLoading: isAuthLoading } = useUser();
  const auth      = useAuth();
  const firestore = useFirestore();
  const isUserLoading = isAuthLoading || !firestore;

  useEffect(() => {
    if (!isUserLoading && !user && firestore) initiateAnonymousSignIn(auth);
  }, [isUserLoading, user, auth, firestore]);

  // Derive selected event
  const selectedEvent: EventConfig | undefined = EVENTS.find(e => e.id === formData.selectedEventId);
  const memberCount = formData.members.length;
  const amount = selectedEvent ? calculateAmount(selectedEvent, memberCount) : 0;

  // Generate QR when reaching step 5
  useEffect(() => {
    if (step === 5 && selectedEvent) {
      const url = buildUpiUrl(amount, orderId);
      QRCode.toDataURL(url, { width: 240, margin: 2, color: { dark: '#ffffff', light: '#00000000' } })
        .then(setQrDataUrl);
    }
  }, [step, selectedEvent, amount, orderId]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const setField = useCallback(<K extends keyof FormData>(key: K, val: FormData[K]) =>
    setFormData(prev => ({ ...prev, [key]: val })), []);

  const setMemberField = (idx: number, key: keyof TeamMember, val: string) =>
    setFormData(prev => {
      const members = [...prev.members];
      members[idx] = { ...members[idx], [key]: val };
      return { ...prev, members };
    });

  // Sync member array length when event or count changes
  const updateMemberCount = (event: EventConfig, count: number) => {
    const newMembers = Array.from({ length: count }, (_, i) =>
      formData.members[i] ?? { name: '', email: '', phone: '', college: '', course: '' }
    );
    setFormData(prev => ({ ...prev, selectedEventId: event.id, members: newMembers }));
  };

  // ── Save to Firestore (via server API to bypass security rules) ──────────
  const saveRegistration = useCallback(async (paymentStatus: string, utr?: string) => {
    if (!selectedEvent) return;
    const payload = {
      orderId,
      fullName: formData.fullName,
      email: formData.email,
      phoneNumber: formData.phone,
      university: formData.college,
      course: formData.course,
      selectedEvent: selectedEvent.name,
      eventCategory: selectedEvent.category,
      teamName: formData.teamName || null,
      teamMembers: formData.members,
      amount,
      paymentStatus,
      utrNumber: utr ?? null,
      registrationDate: new Date().toISOString(),
      isVerified: paymentStatus === 'Verified',
    };

    // Send to Google Sheets via proxy API
    const res = await fetch('/api/sheets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'add_registration', payload }),
    });
    const result = await res.json();
    
    if (!result.success) {
      console.error('Failed to save to Sheets:', result.message);
    }
  }, [selectedEvent, formData, orderId, amount, firestore]);

  // ── Verify Payment ─────────────────────────────────────────────────────────
  const handleVerifyPayment = async () => {
    const utr = utrNumber.trim();
    if (!/^\d{12}$/.test(utr)) {
      setUtrError('Enter a valid 12-digit UTR number from your UPI app.');
      return;
    }
    setUtrError('');
    setIsVerifying(true);

    try {
      // Save with Pending first so Firestore has the record
      await saveRegistration('Pending', utr);

      const res = await fetch('/api/sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify_utr', payload: { utrNumber: utr, orderId } }),
      });
      const data = await res.json();

      if (data.success) {
        setIsSuccess(true);
      } else {
        setUtrError(data.message ?? 'Verification failed. Please try again.');
      }
    } catch {
      setUtrError('Network error. Please check your connection and try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  // ── Step validation ────────────────────────────────────────────────────────
  const canProceedStep1 = formData.fullName && formData.email && formData.phone && formData.college && formData.course;
  const canProceedStep2 = !!formData.selectedEventId && (!selectedEvent?.requiresTeamName || formData.teamName);
  const canProceedStep3 = !selectedEvent || selectedEvent.minTeam <= 1 ||
    formData.members.length >= selectedEvent.minTeam - 1 &&
    formData.members.every(m => m.name && m.email && m.phone);

  // ── Success Screen ─────────────────────────────────────────────────────────
  if (isSuccess) {
    return (
      <div className="pt-48 pb-20 px-6 flex flex-col items-center justify-center text-center">
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
          <div className="relative w-32 h-32 bg-background border-2 border-primary flex items-center justify-center rounded-none rotate-45">
            <CheckCircle2 className="w-16 h-16 text-primary -rotate-45" />
          </div>
        </div>
        <h1 className="font-headline text-5xl md:text-7xl mb-6 tracking-tighter uppercase leading-none text-white">
          ACCESS <br /><span className="text-primary text-glow">GRANTED</span>
        </h1>
        <div className="max-w-md space-y-4">
          <p className="text-muted-foreground text-lg uppercase tracking-widest font-light">
            Payment Verified. Welcome to the Battlefield.
          </p>
          <div className="glass-panel p-4 border border-primary/20 text-xs font-mono tracking-widest text-accent space-y-1">
            <p>ORDER: {orderId}</p>
            <p>EVENT: {selectedEvent?.name?.toUpperCase()}</p>
            <p>AMOUNT: ₹{amount}</p>
          </div>
          <p className="text-[10px] text-muted-foreground tracking-widest uppercase">
            Confirmation will be sent to {formData.email}
          </p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/80 px-12 py-8 font-headline tracking-widest rounded-none w-full accent-glow transition-all hover:scale-105">
            <Link href="/">RETURN TO HUB</Link>
          </Button>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="pt-20 md:pt-28 pb-32 md:pb-40 px-4 max-w-4xl mx-auto min-h-screen">

      {/* Header */}
      <div className="text-center mb-6 md:mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 md:px-4 flex-wrap justify-center glass-panel border border-accent/30 rounded-full mb-4 md:mb-6 mx-auto">
          <Zap className="w-3.5 h-3.5 md:w-4 md:h-4 text-accent" />
          <span className="text-[9px] md:text-[10px] font-headline tracking-[0.2em] md:tracking-[0.3em] text-accent uppercase text-center w-full sm:w-auto">Protocol Initiation</span>
        </div>
        <h1 className="font-headline text-4xl sm:text-5xl md:text-7xl mb-3 md:mb-4 tracking-tighter uppercase text-white leading-none">
          JOIN THE <span className="text-primary text-glow block sm:inline">ARENA</span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto uppercase tracking-[0.15em] md:tracking-[0.2em] text-[9px] md:text-[10px] font-bold">
          Only the team leader registers · Fill in all details
        </p>
      </div>

      {/* Important Notice */}
      <div className="glass-panel border border-accent/30 p-3 md:p-4 mb-6 md:mb-8 flex gap-3 items-start">
        <Info className="w-4 h-4 text-accent mt-0.5 shrink-0" />
        <p className="text-[10px] md:text-[11px] text-muted-foreground tracking-widest uppercase leading-loose">
          <span className="text-accent font-bold">Team Leader Only:</span> One person registers on behalf of the entire team. Provide accurate details in Step 3.
        </p>
      </div>

      {/* Step Indicator */}
      <StepIndicator currentStep={step} />

      {/* ── STEP 1: LEADER DETAILS ────────────────────────────────────────── */}
      {step === 1 && (
        <div className="glass-panel border border-primary/10 p-5 sm:p-8 md:p-12 rounded-none bg-black/20 animate-fade-in-up md:mx-0 -mx-2">
          <div className="absolute top-0 right-0 w-8 h-8 md:w-12 md:h-12 border-t-2 border-r-2 border-primary/20 pointer-events-none" />
          <h2 className="font-headline text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] text-primary uppercase flex items-center gap-2 mb-6 md:mb-8">
            <User className="w-4 h-4" /> Team Leader Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <FieldInput id="fullName" label="Full Name" icon={User} placeholder="SURNAME GIVEN NAME"
              value={formData.fullName} onChange={v => setField('fullName', v)} />
            <FieldInput id="email" label="Email Address" icon={Mail} type="email" placeholder="name@domain.com"
              value={formData.email} onChange={v => setField('email', v)} />
            <FieldInput id="phone" label="Phone Number" icon={Phone} type="tel" placeholder="+91 00000 00000"
              value={formData.phone} onChange={v => setField('phone', v)} />
            <FieldInput id="college" label="College / University" icon={School} placeholder="INSTITUTION NAME"
              value={formData.college} onChange={v => setField('college', v)} />
            <div className="md:col-span-2">
              <FieldInput id="course" label="Course & Semester" icon={BookOpen} placeholder="e.g. B.Tech CSE, Sem 4"
                value={formData.course} onChange={v => setField('course', v)} />
            </div>
          </div>
          <div className="flex justify-end mt-8">
            <Button
              onClick={() => setStep(2)}
              disabled={!canProceedStep1 || isUserLoading}
              className="bg-primary hover:bg-primary/80 w-full sm:w-auto px-6 md:px-10 py-6 md:py-6 font-headline tracking-[0.2em] md:tracking-[0.3em] rounded-none transition-all group text-xs"
            >
              NEXT: SELECT EVENT
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      )}

      {/* ── STEP 2: EVENT SELECTION ───────────────────────────────────────── */}
      {step === 2 && (
        <div className="animate-fade-in-up space-y-6">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 text-[10px] font-headline tracking-widest uppercase border transition-all rounded-none
                  ${selectedCategory === cat.id
                    ? `border-primary bg-primary/20 ${cat.color}`
                    : 'border-white/10 bg-white/5 text-white/40 hover:border-white/30 hover:text-white/60'}`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Event cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {EVENTS.filter(e => e.category === selectedCategory).map(event => {
              const isSelected = formData.selectedEventId === event.id;
              return (
                <button
                  key={event.id}
                  onClick={() => {
                    const defaultMembers = event.minTeam > 1
                      ? Array.from({ length: event.minTeam - 1 }, () =>
                          ({ name: '', email: '', phone: '', college: '', course: '' }))
                      : [];
                    setFormData(prev => ({ ...prev, selectedEventId: event.id, members: defaultMembers, teamName: '' }));
                  }}
                  className={`text-left p-5 border rounded-none transition-all duration-200 group
                    ${isSelected
                      ? 'border-primary bg-primary/10 shadow-[0_0_20px_hsl(var(--primary)/0.2)]'
                      : 'border-white/10 bg-white/5 hover:border-primary/40 hover:bg-primary/5'}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className={`font-headline tracking-wider text-sm uppercase transition-colors
                      ${isSelected ? 'text-primary' : 'text-white/80 group-hover:text-white'}`}>
                      {event.name}
                    </span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />}
                  </div>
                  <p className="text-[10px] text-accent/80 mt-2 tracking-widest">{event.pricingNote}</p>
                  {event.maxTeam > 1 && (
                    <p className="text-[9px] text-muted-foreground mt-1 tracking-wider uppercase">
                      Team: {event.minTeam === event.maxTeam ? `${event.minTeam} members` : `${event.minTeam}–${event.maxTeam} members`}
                    </p>
                  )}
                </button>
              );
            })}
          </div>

          {/* Team Name (if required) */}
          {selectedEvent?.requiresTeamName && (
            <div className="glass-panel border border-accent/20 p-6">
              <FieldInput id="teamName" label="Team Name" icon={Users} placeholder="YOUR TEAM NAME"
                value={formData.teamName} onChange={v => setField('teamName', v)} />
            </div>
          )}

          {/* Team size adjuster for flexible-size events */}
          {selectedEvent && selectedEvent.maxTeam > 1 && (
            <div className="glass-panel border border-white/10 p-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-headline tracking-widest text-muted-foreground uppercase">Team Size (incl. leader)</p>
                <p className="text-white text-sm mt-1">{memberCount + 1} member{memberCount + 1 !== 1 ? 's' : ''}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const newCount = Math.max(selectedEvent.minTeam - 1, memberCount - 1);
                    updateMemberCount(selectedEvent, newCount);
                  }}
                  disabled={memberCount <= selectedEvent.minTeam - 1}
                  className="w-8 h-8 border border-white/20 hover:border-primary/60 text-white flex items-center justify-center rounded-none transition-colors disabled:opacity-30"
                >−</button>
                <span className="text-white font-mono w-4 text-center">{memberCount + 1}</span>
                <button
                  onClick={() => {
                    const newCount = Math.min(selectedEvent.maxTeam - 1, memberCount + 1);
                    updateMemberCount(selectedEvent, newCount);
                  }}
                  disabled={memberCount >= selectedEvent.maxTeam - 1}
                  className="w-8 h-8 border border-white/20 hover:border-primary/60 text-white flex items-center justify-center rounded-none transition-colors disabled:opacity-30"
                >+</button>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-between mt-4 gap-4">
            <Button variant="outline" onClick={() => setStep(1)}
              className="border-white/20 hover:border-primary/50 w-full sm:w-auto rounded-none px-6 md:px-8 py-6 font-headline tracking-widest text-xs">
              <ChevronLeft className="w-4 h-4 mr-2" /> BACK
            </Button>
            <Button onClick={() => setStep(3)}
              disabled={!canProceedStep2}
              className="bg-primary hover:bg-primary/80 w-full sm:w-auto px-6 md:px-10 py-6 font-headline tracking-[0.1em] sm:tracking-[0.3em] rounded-none transition-all group text-xs text-center flex justify-center">
              {selectedEvent && selectedEvent.maxTeam === 1 ? 'NEXT: REVIEW' : 'NEXT: TEAM MEMBERS'}
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      )}

      {/* ── STEP 3: TEAM MEMBERS ─────────────────────────────────────────── */}
      {step === 3 && (
        <div className="animate-fade-in-up space-y-6">
          {selectedEvent && selectedEvent.maxTeam === 1 ? (
            // Solo event – skip members
            <div className="glass-panel border border-primary/10 p-8 text-center">
              <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
              <p className="font-headline tracking-widest text-primary uppercase">Solo Event</p>
              <p className="text-muted-foreground text-[11px] tracking-widest uppercase mt-2">
                No additional members required for {selectedEvent.name}
              </p>
            </div>
          ) : (
            <>
              <div className="glass-panel border border-primary/10 p-4 flex gap-3 items-center">
                <Info className="w-4 h-4 text-primary shrink-0" />
                <p className="text-[10px] text-muted-foreground tracking-widest uppercase">
                  Add {selectedEvent ? `${selectedEvent.minTeam - 1}–${selectedEvent.maxTeam - 1}` : ''} team members (excluding yourself as leader)
                </p>
              </div>

              {formData.members.map((member, idx) => (
                <div key={idx} className="glass-panel border border-white/10 p-6 rounded-none bg-black/20">
                  <h3 className="font-headline text-xs tracking-[0.25em] text-accent uppercase mb-5 flex items-center gap-2">
                    <Users className="w-3.5 h-3.5" /> Member {idx + 2}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FieldInput id={`m${idx}-name`} label="Full Name" icon={User} placeholder="FULL NAME"
                      value={member.name} onChange={v => setMemberField(idx, 'name', v)} />
                    <FieldInput id={`m${idx}-email`} label="Email" icon={Mail} type="email" placeholder="email@domain.com"
                      value={member.email} onChange={v => setMemberField(idx, 'email', v)} />
                    <FieldInput id={`m${idx}-phone`} label="Phone" icon={Phone} type="tel" placeholder="+91 00000 00000"
                      value={member.phone} onChange={v => setMemberField(idx, 'phone', v)} />
                    <FieldInput id={`m${idx}-college`} label="College" icon={School} placeholder="INSTITUTION"
                      value={member.college} onChange={v => setMemberField(idx, 'college', v)} required={false} />
                    <div className="md:col-span-2">
                      <FieldInput id={`m${idx}-course`} label="Course" icon={BookOpen} placeholder="e.g. B.Tech CSE"
                        value={member.course} onChange={v => setMemberField(idx, 'course', v)} required={false} />
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          <div className="flex flex-col-reverse sm:flex-row justify-between mt-8 gap-4">
            <Button variant="outline" onClick={() => setStep(2)}
              className="border-white/20 hover:border-primary/50 rounded-none px-6 md:px-8 py-6 font-headline tracking-widest text-xs w-full sm:w-auto">
              <ChevronLeft className="w-4 h-4 mr-2" /> BACK
            </Button>
            <Button onClick={() => setStep(4)} disabled={!canProceedStep3}
              className="bg-primary hover:bg-primary/80 px-6 md:px-10 py-6 font-headline tracking-[0.3em] rounded-none group text-xs w-full sm:w-auto flex justify-center">
              NEXT: REVIEW
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      )}

      {/* ── STEP 4: REVIEW / SUMMARY ─────────────────────────────────────── */}
      {step === 4 && (
        <div className="animate-fade-in-up space-y-4">
          <div className="glass-panel border border-primary/10 p-8 rounded-none bg-black/20 space-y-6">
            {/* Leader */}
            <div>
              <h3 className="font-headline text-xs tracking-[0.3em] text-primary uppercase flex items-center gap-2 mb-4">
                <User className="w-3.5 h-3.5" /> Team Leader
              </h3>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                {[
                  ['Name', formData.fullName],
                  ['Email', formData.email],
                  ['Phone', formData.phone],
                  ['College', formData.college],
                  ['Course', formData.course],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-2">
                    <span className="text-muted-foreground uppercase tracking-widest w-16 shrink-0">{k}</span>
                    <span className="text-white/80">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-white/5" />

            {/* Event */}
            <div>
              <h3 className="font-headline text-xs tracking-[0.3em] text-accent uppercase flex items-center gap-2 mb-4">
                <Trophy className="w-3.5 h-3.5" /> Event
              </h3>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="flex gap-2"><span className="text-muted-foreground uppercase tracking-widest w-20 shrink-0">Event</span><span className="text-white/80">{selectedEvent?.name}</span></div>
                <div className="flex gap-2"><span className="text-muted-foreground uppercase tracking-widest w-20 shrink-0">Category</span><span className="text-white/80">{selectedEvent?.category}</span></div>
                {formData.teamName && <div className="flex gap-2 col-span-2"><span className="text-muted-foreground uppercase tracking-widest w-20 shrink-0">Team</span><span className="text-white/80">{formData.teamName}</span></div>}
              </div>
            </div>

            {/* Members */}
            {formData.members.length > 0 && (
              <>
                <div className="border-t border-white/5" />
                <div>
                  <h3 className="font-headline text-xs tracking-[0.3em] text-primary/70 uppercase flex items-center gap-2 mb-4">
                    <Users className="w-3.5 h-3.5" /> Team Members ({formData.members.length})
                  </h3>
                  <div className="space-y-2">
                    {formData.members.map((m, i) => (
                      <div key={i} className="flex gap-3 text-[10px] text-white/60">
                        <span className="text-primary w-4">{i + 2}</span>
                        <span>{m.name}</span>
                        <span className="text-muted-foreground">·</span>
                        <span>{m.email}</span>
                        {m.phone && <><span className="text-muted-foreground">·</span><span>{m.phone}</span></>}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="border-t border-white/5" />

            {/* Amount */}
            <div className="flex items-center justify-between">
              <span className="font-headline text-xs tracking-[0.3em] text-muted-foreground uppercase">Total Amount</span>
              <div className="text-right">
                <span className="text-3xl font-headline text-primary text-glow">₹{amount}</span>
                <p className="text-[9px] text-muted-foreground tracking-widest uppercase mt-0.5">{selectedEvent?.pricingNote}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-between gap-4">
            <Button variant="outline" onClick={() => setStep(3)}
              className="border-white/20 hover:border-primary/50 rounded-none px-6 md:px-8 py-6 font-headline tracking-widest text-xs w-full sm:w-auto">
              <ChevronLeft className="w-4 h-4 mr-2" /> BACK
            </Button>
            <Button
              onClick={() => { saveRegistration('Pending'); setStep(5); }}
              disabled={isUserLoading || !user}
              className="bg-primary hover:bg-primary/80 px-6 md:px-10 py-6 font-headline tracking-[0.1em] sm:tracking-[0.3em] rounded-none group accent-glow text-[10px] sm:text-xs w-full sm:w-auto flex justify-center text-center">
              <CreditCard className="w-4 h-4 mr-2 shrink-0" />
              <span className="truncate">PROCEED TO PAYMENT</span>
              <ArrowRight className="w-4 h-4 ml-2 shrink-0 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      )}

      {/* ── STEP 5: UPI PAYMENT ──────────────────────────────────────────── */}
      {step === 5 && (
        <div className="animate-fade-in-up">
          <div className="glass-panel border border-primary/10 p-8 md:p-12 rounded-none bg-black/20">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-5">
                <QrCode className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] font-headline tracking-widest text-primary uppercase">UPI Payment</span>
              </div>
              <h2 className="font-headline text-xl tracking-[0.2em] uppercase text-white mb-1">
                Scan & Pay
              </h2>
              <p className="text-[10px] text-muted-foreground tracking-widest uppercase">
                Use any UPI app · Google Pay · PhonePe · Paytm · BHIM
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
              {/* QR + UPI details */}
              <div className="flex flex-col items-center gap-4 w-full">
                {qrDataUrl ? (
                  <div className="p-3 bg-white/5 border border-primary/20 rounded-none shrink-0 overflow-hidden w-full max-w-[246px] mx-auto flex justify-center">
                    <img src={qrDataUrl} alt="UPI QR Code" className="max-w-full h-auto w-48 sm:w-[220px]" />
                  </div>
                ) : (
                  <div className="w-48 h-48 sm:w-[236px] sm:h-[236px] bg-white/5 border border-primary/20 flex items-center justify-center shrink-0 mx-auto">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                )}
                <div className="text-center space-y-1 w-full overflow-hidden break-words">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest">UPI ID</p>
                  <p className="font-mono text-white/90 text-xs sm:text-sm select-all break-all">{UPI_ID}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-2">Name</p>
                  <p className="text-white/70 text-[10px] sm:text-xs tracking-widest">{UPI_NAME}</p>
                </div>
              </div>

              {/* Payment details + UTR */}
              <div className="space-y-5">
                {/* Amount pill */}
                <div className="glass-panel border border-primary/30 p-5">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Amount to Pay</p>
                  <p className="text-4xl font-headline text-primary text-glow">₹{amount}</p>
                  <p className="text-[9px] text-muted-foreground tracking-widest mt-1">{selectedEvent?.pricingNote}</p>
                </div>

                {/* Order ID */}
                <div className="glass-panel border border-white/10 p-4">
                  <p className="text-[9px] text-muted-foreground uppercase tracking-widest mb-1">Transaction Note / Order ID</p>
                  <p className="font-mono text-accent text-sm tracking-widest select-all">{orderId}</p>
                  <p className="text-[8px] text-muted-foreground mt-1">Add this as a note when paying</p>
                </div>

                {/* Steps */}
                <div className="space-y-2 text-[10px] text-muted-foreground uppercase tracking-widest">
                  {['Open any UPI app on your phone', 'Scan the QR code or enter UPI ID', `Pay ₹${amount} with note: ${orderId}`, 'Copy your 12-digit UTR from the app', 'Enter it below and click Verify'].map((s, i) => (
                    <div key={i} className="flex gap-3">
                      <span className="text-primary w-4 shrink-0">{i + 1}</span>
                      <span>{s}</span>
                    </div>
                  ))}
                </div>

                {/* UTR Input */}
                <div className="space-y-2">
                  <Label className="text-[10px] tracking-widest uppercase text-muted-foreground">
                    UTR Number (12 digits)
                  </Label>
                  <Input
                    placeholder="e.g. 123456789012"
                    value={utrNumber}
                    onChange={e => { setUtrNumber(e.target.value.replace(/\D/g, '').slice(0, 12)); setUtrError(''); }}
                    className="bg-white/5 border-white/10 rounded-none h-12 font-mono tracking-widest focus:border-primary focus:ring-1 focus:ring-primary text-white"
                  />
                  {utrError && (
                    <div className="flex items-center gap-2 text-red-400 text-[10px] tracking-widest uppercase">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {utrError}
                    </div>
                  )}
                  <p className="text-[9px] text-muted-foreground tracking-widest">
                    Find UTR in your UPI app → Transaction Details → Reference / UTR Number
                  </p>
                </div>

                <Button
                  onClick={handleVerifyPayment}
                  disabled={isVerifying || utrNumber.length < 12}
                  className="w-full bg-primary hover:bg-primary/80 py-5 sm:py-7 font-headline sm:tracking-[0.2em] md:tracking-[0.35em] tracking-wider rounded-none accent-glow transition-all text-[10px] sm:text-xs whitespace-normal h-auto min-h-12"
                >
                  {isVerifying ? (
                    <div className="flex items-center justify-center gap-2 sm:gap-3 w-full">
                      <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin shrink-0" />
                      <span className="truncate">VERIFYING PAYMENT...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 w-full">
                      <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                      <span className="whitespace-normal">I&apos;VE PAID — VERIFY & COMPLETE</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-start mt-4">
            <Button variant="outline" onClick={() => setStep(4)}
              className="border-white/20 hover:border-primary/50 rounded-none px-8 py-5 font-headline tracking-widest text-xs">
              <ChevronLeft className="w-4 h-4 mr-2" /> BACK TO REVIEW
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
