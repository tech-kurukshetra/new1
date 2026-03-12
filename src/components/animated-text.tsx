"use client";

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

type AnimatedTextProps = {
  text: string;
  className?: string;
};

const quote = {
  initial: {
    opacity: 1,
  },
  animate: {
    opacity: 1,
    transition: {
      delay: 0.5,
      staggerChildren: 0.08,
    },
  },
};

const singleWord = {
  initial: {
    opacity: 0,
    y: 50,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
    },
  },
};

// This component is a workaround for the lack of built-in stagger support in Tailwind.
// It uses framer-motion for simple, effective text animations.
export function AnimatedText({ text, className = '' }: AnimatedTextProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
        <div className="w-full mx-auto py-2 flex items-center justify-center text-center overflow-hidden">
             <h1 className={`inline-block w-full text-foreground font-bold ${className}`}>
                {text}
            </h1>
        </div>
    );
  }
  
  return (
    <div className="w-full mx-auto py-2 flex items-center justify-center text-center overflow-hidden">
      <motion.h1
        className={`inline-block w-full text-foreground font-bold ${className}`}
        variants={quote}
        initial="initial"
        animate="animate"
      >
        {text.split(" ").map((word, index) => (
          <motion.span
            key={word + '-' + index}
            className="inline-block"
            variants={singleWord}
          >
            {word}&nbsp;
          </motion.span>
        ))}
      </motion.h1>
    </div>
  );
}
