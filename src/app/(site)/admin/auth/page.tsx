'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LayoutDashboard, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser, useAuth, initiateEmailSignIn } from '@/firebase';

export default function AuthPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/admin/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    toast({ title: "Authenticating...", description: "Please wait." });
    try {
      await initiateEmailSignIn(auth, email, password);
      toast({ title: "Login Successful", description: "Redirecting to dashboard..." });
      router.push('/admin/dashboard');
    } catch (error: any) {
      let description = "An unknown error occurred.";
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-email') {
        description = "The email or password you entered is incorrect.";
      }
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: description,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isUserLoading || user) {
     return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-muted-foreground mt-4">Loading Session...</p>
        </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-20 px-4 flex flex-col items-center justify-center">
      <div className="glass-panel p-6 md:p-10 max-w-md w-full border-primary/20 relative overflow-hidden bg-black/40">
        <div className="absolute top-0 left-0 w-16 h-1 bg-primary" />
        <div className="text-center mb-8">
          <LayoutDashboard className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="font-headline text-2xl tracking-tighter text-white uppercase">KURUKSHETRA CONTROL</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] mt-2">Admin Authentication</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 pt-6">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Console ID</Label>
            <Input name="email" type="email" required placeholder="admin@kurukshetra.com" className="bg-white/5 border-white/10 rounded-none h-12 pl-4 focus:border-primary transition-all text-sm tracking-widest" />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Security Key</Label>
            <div className="relative">
              <Input name="password" type={showPassword ? "text" : "password"} required placeholder="••••••••" className="bg-white/5 border-white/10 rounded-none h-12 pl-4 pr-12 focus:border-primary transition-all" />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 h-9 w-9 -translate-y-1/2 text-muted-foreground hover:bg-transparent hover:text-white"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </Button>
            </div>
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/80 py-6 font-headline tracking-[0.2em] rounded-none accent-glow">
            {isSubmitting ? <Loader2 className="animate-spin" /> : 'INITIATE SESSION'}
          </Button>
        </form>
      </div>
    </div>
  );
}
