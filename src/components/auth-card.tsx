import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import Link from 'next/link';

type AuthCardProps = {
  children: React.ReactNode;
  title: string;
  subtitle: string;
};

export default function AuthCard({
  children,
  title,
  subtitle,
}: AuthCardProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background romantic-gradient-shift p-4">
      <motion.div
        className="relative w-full max-w-md"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="absolute -top-10 left-1/2 -translate-x-1/2">
          <Link href="/">
            <motion.div
              className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.1, rotate: -10 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Heart className="w-10 h-10 text-primary" fill="currentColor" />
            </motion.div>
          </Link>
        </div>
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 pt-16 border">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="font-serif text-4xl font-bold text-foreground">
              {title}
            </h1>
            <p className="text-muted-foreground mt-2">{subtitle}</p>
          </motion.div>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
