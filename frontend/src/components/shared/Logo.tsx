import React from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export default function Logo({ className, size = 'md', showText = true }: LogoProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28'
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
        <img src="/logo.png" alt="EduXcel Logo" className="w-full h-full object-contain" />
      </div>

      {showText && (
        <div className="flex flex-col -ml-1">
          <span className={cn("font-display font-extrabold tracking-tight drop-shadow-md", textClasses[size])}>
            <span style={{ color: isDark ? '#ffffff' : '#0B1E4A' }}>Edu</span>
            <span style={{ 
              background: 'linear-gradient(to right, #00A3E0, #0047BA)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0px 2px 4px rgba(0,71,186,0.2)'
            }}>Xcel</span>
          </span>
        </div>
      )}
    </div>
  );
}
