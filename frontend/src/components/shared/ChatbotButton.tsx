import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import XceloChatbot from './XceloChatbot';

interface ChatbotButtonProps {
  isAIOpen: boolean;
  setIsAIOpen: (isOpen: boolean) => void;
  roleContext: 'student' | 'faculty' | 'admin';
}

// Direct Google Drive thumbnail URL for the robot GIF
const XCELO_GIF = 'https://lh3.googleusercontent.com/d/1ti3-Eri8AaVOUlpUVOYPJbkRqlNqHqhQ';

export default function ChatbotButton({ isAIOpen, setIsAIOpen, roleContext }: ChatbotButtonProps) {
  const [ribbonDismissed, setRibbonDismissed] = useState(false);

  return (
    <>
      <AnimatePresence>
        {!isAIOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 20 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2"
          >
            {/* Ribbon "Hi! I am Xcello." — auto-hides after first click */}
            {!ribbonDismissed && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 200, damping: 18 }}
                className="relative flex items-center"
              >
                {/* Tail pointing to the GIF button */}
                <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-slate-900 dark:border-l-brand-600" />
                <div className="flex items-center gap-2 bg-slate-900 dark:bg-brand-600 text-white text-sm font-semibold px-4 py-2.5 rounded-2xl shadow-xl whitespace-nowrap pr-9">
                  <span className="text-base">👋</span>
                  <span>Hi! I am <span className="text-brand-400 dark:text-white font-extrabold">Xcello</span>.</span>
                </div>
                {/* Dismiss X */}
                <button
                  onClick={(e) => { e.stopPropagation(); setRibbonDismissed(true); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors text-xs leading-none"
                  aria-label="Dismiss"
                >
                  ✕
                </button>
              </motion.div>
            )}

            {/* GIF Robot Button */}
            <motion.button
              onClick={() => { setIsAIOpen(true); setRibbonDismissed(true); }}
              aria-label="Open Xcelo AI assistant"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="w-20 h-20 rounded-full overflow-hidden shadow-2xl border-4 border-white dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-brand-400/50"
            >
              <img
                src={XCELO_GIF}
                alt="Xcello AI"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if GIF doesn't load from Drive
                  const el = e.currentTarget as HTMLImageElement;
                  el.style.display = 'none';
                  const parent = el.parentElement;
                  if (parent) {
                    parent.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-500 to-brand-700 text-white text-3xl">🤖</div>`;
                  }
                }}
              />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <XceloChatbot isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} roleContext={roleContext} />
    </>
  );
}
