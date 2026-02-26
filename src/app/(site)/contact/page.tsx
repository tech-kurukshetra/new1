'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, Loader2, Mail, MessageSquare, User, Send, MapPin } from 'lucide-react';
import { addDocumentNonBlocking, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!firestore) {
      toast({
        variant: 'destructive',
        title: 'Connection Error',
        description: 'Could not connect to the database. Please try again later.',
      });
      return;
    }
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
        submittedAt: new Date().toISOString(),
        isRead: false,
        id: Math.random().toString(36).substr(2, 9),
    };

    const colRef = collection(firestore, 'contactMessages');
    addDocumentNonBlocking(colRef, data);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="pt-48 pb-20 px-6 flex flex-col items-center justify-center text-center">
        <div className="relative mb-12">
          <CheckCircle2 className="w-24 h-24 text-primary" />
        </div>
        
        <h1 className="font-headline text-5xl md:text-7xl mb-6 tracking-tighter uppercase leading-none text-white">
          Message <br />
          <span className="text-primary text-glow">Sent</span>
        </h1>
        
        <p className="text-muted-foreground text-lg uppercase tracking-widest font-light">
          Thank you for reaching out. We'll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-40 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="text-center mb-20">
        <h1 className="font-headline text-5xl md:text-7xl mb-4 tracking-tighter uppercase text-white">
          Contact <span className="text-primary">HQ</span>
        </h1>
        <p className="text-muted-foreground text-lg uppercase tracking-widest font-light">
          Send us a direct transmission or find us at our command center.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-16">
        {/* Left Column: Contact Info & Map */}
        <div className="space-y-10">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
                <div className="glass-panel border-primary/20 p-3 mt-1">
                    <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <h3 className="font-headline text-lg text-white uppercase tracking-widest">Location</h3>
                    <p className="text-muted-foreground font-light">Chimanbhai Patel Institute Campus, SG Highway, Near Prahlad Nagar, Ahmedabad, Gujarat - 380015.</p>
                </div>
            </div>
            <div className="flex items-start gap-4">
                <div className="glass-panel border-primary/20 p-3 mt-1">
                    <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <h3 className="font-headline text-lg text-white uppercase tracking-widest">General Inquiries</h3>
                    <a href="mailto:btech_events@svgu.ac.in" className="text-muted-foreground font-light hover:text-primary transition-colors">btech_events@svgu.ac.in</a>
                </div>
            </div>
          </div>

          <div className="glass-panel border-primary/10 rounded-none overflow-hidden aspect-[4/3]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.936338805703!2d72.50852571542369!3d23.02613942183218!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e856359473bbf%3A0x28a6f3a61f5b5f0!2sChimanbhai%20Patel%20Institute!5e0!3m2!1sen!2sin!4v1622038753215!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale invert brightness-90 contrast-125"
            ></iframe>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="glass-panel border-primary/20 p-8 md:p-12 rounded-none h-fit">
          <h3 className="font-headline text-2xl text-accent tracking-widest uppercase mb-8">Send a Message</h3>
          <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                  <Label htmlFor="name" className="text-[10px] tracking-widest uppercase text-muted-foreground ml-1">Your Name</Label>
                  <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                      <Input id="name" name="name" placeholder="John Doe" required className="bg-white/5 border-white/10 rounded-none h-12 pl-10 focus:border-primary transition-all" />
                  </div>
              </div>
              <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] tracking-widest uppercase text-muted-foreground ml-1">Your Email</Label>
                  <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                      <Input id="email" name="email" type="email" placeholder="john.doe@example.com" required className="bg-white/5 border-white/10 rounded-none h-12 pl-10 focus:border-primary transition-all" />
                  </div>
              </div>
              <div className="space-y-2">
                  <Label htmlFor="message" className="text-[10px] tracking-widest uppercase text-muted-foreground ml-1">Your Message</Label>
                  <div className="relative">
                      <MessageSquare className="absolute left-3 top-4 w-4 h-4 text-primary" />
                      <Textarea id="message" name="message" placeholder="Your message here..." required className="bg-white/5 border-white/10 rounded-none min-h-[150px] p-4 pl-10 focus:border-primary transition-all" />
                  </div>
              </div>
               <div className="pt-6">
                  <Button 
                  type="submit" 
                  disabled={isSubmitting || !firestore}
                  className="w-full bg-primary hover:bg-primary/80 py-7 font-headline tracking-[0.4em] text-lg rounded-none transition-all group"
                  >
                  {isSubmitting ? (
                      <div className="flex items-center gap-3">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span>TRANSMITTING...</span>
                      </div>
                  ) : (
                      <div className="flex items-center gap-2">
                      <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      SEND MESSAGE
                      </div>
                  )}
                  </Button>
              </div>
          </form>
        </div>
      </div>
    </div>
  );
}
