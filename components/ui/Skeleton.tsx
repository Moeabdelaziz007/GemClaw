'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'circle' | 'sovereign';
}

export function Skeleton({ className = '', variant = 'rectangular' }: SkeletonProps) {
  const baseClass = "bg-white/[0.03] overflow-hidden relative";
  const variantClass = variant === 'circle' ? 'rounded-full' : variant === 'sovereign' ? 'rounded-[2rem]' : 'rounded-xl';

  return (
    <div className={`${baseClass} ${variantClass} ${className} border border-white/5`}>
      <motion.div
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent skew-x-[-20deg]"
      />
      {variant === 'sovereign' && (
        <div className="absolute inset-0 border border-gemigram-neon/5 rounded-[2rem] pointer-events-none" />
      )}
    </div>
  );
}

export function AgentCardSkeleton() {
  return (
    <div className="aspect-[3/4] rounded-[3rem] sovereign-glass p-8 border border-white/5 flex flex-col gap-6">
      <div className="self-center mt-4">
        <Skeleton variant="circle" className="w-20 h-20" />
      </div>
      <div className="flex-1 space-y-4">
        <Skeleton className="h-2 w-24" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="flex justify-between items-center mt-auto">
        <Skeleton className="h-6 w-20 rounded-full" />
        <div className="flex gap-2">
          <Skeleton variant="circle" className="w-8 h-8" />
          <Skeleton variant="circle" className="w-8 h-8" />
        </div>
      </div>
    </div>
  );
}

export function MarketplaceCardSkeleton() {
  return (
    <div className="p-8 rounded-[2.5rem] sovereign-glass border border-white/5 h-[340px] flex flex-col justify-between">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <Skeleton className="w-14 h-14 rounded-2xl" />
          <Skeleton className="w-12 h-6 rounded-full" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-12 w-full rounded-2xl" />
      </div>
    </div>
  );
}
