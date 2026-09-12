import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export default function Logo({ className, size = 'md', showText = true }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };
  
  const textClasses = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-5xl',
    xl: 'text-7xl'
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("relative flex items-center justify-center shrink-0 drop-shadow-xl", sizeClasses[size])}>
        <svg viewBox="0 0 100 80" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="capTop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00A3E0" />
              <stop offset="100%" stopColor="#003299" />
            </linearGradient>
            <linearGradient id="capSide" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#002472" />
              <stop offset="100%" stopColor="#004CFF" />
            </linearGradient>
            <linearGradient id="bookLeft" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#003299" />
              <stop offset="100%" stopColor="#005BFF" />
            </linearGradient>
            <linearGradient id="bookRight" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#00DFBF" />
              <stop offset="100%" stopColor="#00C2A8" />
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.2" />
            </filter>
          </defs>

          {/* Book Pages Back */}
          <path d="M15 50 Q 30 45, 50 60 L 50 70 Q 30 55, 15 60 Z" fill="#002472" />
          <path d="M85 50 Q 70 45, 50 60 L 50 70 Q 70 55, 85 60 Z" fill="#008B79" />
          
          {/* Book Pages Front */}
          <path d="M10 53 Q 30 48, 50 63 L 50 53 Q 30 38, 10 43 Z" fill="url(#bookLeft)" filter="url(#shadow)" />
          <path d="M90 53 Q 70 48, 50 63 L 50 53 Q 70 38, 90 43 Z" fill="url(#bookRight)" filter="url(#shadow)" />

          {/* Cap Base Stand */}
          <path d="M35 35 L 50 45 L 65 35 L 50 40 Z" fill="url(#capSide)" />
          <path d="M35 35 L 50 45 L 50 55 L 35 45 Z" fill="#001F5B" />
          <path d="M65 35 L 50 45 L 50 55 L 65 45 Z" fill="#004CFF" />

          {/* Cap Top Thickness */}
          <path d="M15 25 L 50 40 L 50 43 L 15 28 Z" fill="#001F5B" />
          <path d="M85 25 L 50 40 L 50 43 L 85 28 Z" fill="#002472" />

          {/* Cap Top */}
          <path d="M15 25 L 50 10 L 85 25 L 50 40 Z" fill="url(#capTop)" />
          
          {/* Tassel String (Left - Orange) */}
          <path d="M25 21 L 25 35" stroke="#FF8C00" strokeWidth="2.5" />
          {/* Tassel Bobble */}
          <circle cx="25" cy="38" r="3.5" fill="#FF8C00" />
          <path d="M22 41 L 28 41 L 29 47 L 21 47 Z" fill="#FF8C00" />
          
          {/* Tassel String (Right - Cyan) */}
          <path d="M75 21 L 75 35" stroke="#00C2A8" strokeWidth="2.5" />
          {/* Tassel Bobble */}
          <circle cx="75" cy="38" r="3.5" fill="#00C2A8" />
          <path d="M72 41 L 78 41 L 79 47 L 71 47 Z" fill="#00C2A8" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col -ml-1">
          <span className={cn("font-display font-extrabold tracking-tight drop-shadow-md", textClasses[size])}>
            <span className="text-brand-900">Edu</span>
            <span style={{ 
              background: 'linear-gradient(to right, #FF8C00, #FFB347)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0px 2px 4px rgba(255,140,0,0.3)'
            }}>Xcel</span>
          </span>
        </div>
      )}
    </div>
  );
}
