'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen pt-48 pb-20 px-6 flex flex-col items-center justify-center text-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="glass-panel p-10 md:p-16 max-w-2xl w-full border-destructive/20 relative overflow-hidden bg-black/40"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 10 }}
          >
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                filter: [
                  'drop-shadow(0 0 0px hsl(var(--destructive)))',
                  'drop-shadow(0 0 10px hsl(var(--destructive)))',
                  'drop-shadow(0 0 0px hsl(var(--destructive)))'
                ],
              }}
              transition={{
                duration: 2.5,
                ease: 'easeInOut',
                repeat: Infinity,
              }}
            >
              <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-6" />
            </motion.div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-destructive uppercase tracking-[0.3em] font-headline mb-2"
          >
            ERROR 404
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="font-headline text-4xl md:text-5xl tracking-tighter text-white uppercase"
          >
            TRANSMISSION LOST
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-muted-foreground text-lg max-w-md mx-auto mb-10"
        >
          The page you are looking for does not exist or has been moved to a different sector.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 }}
        >
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/80 px-12 py-8 font-headline tracking-widest text-lg rounded-none w-full md:w-auto accent-glow"
          >
            <Link href="/">RETURN TO COMMAND HUB</Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
