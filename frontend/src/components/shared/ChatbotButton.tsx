import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import XceloChatbot from './XceloChatbot';

interface ChatbotButtonProps {
  isAIOpen: boolean;
  setIsAIOpen: (isOpen: boolean) => void;
  roleContext: 'student' | 'faculty' | 'admin';
}

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
            className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-1"
          >
            {/* Ribbon above the robot */}
            {!ribbonDismissed && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 220, damping: 18 }}
                className="relative flex flex-col items-end"
              >
                {/* Ribbon box */}
                <div className="flex items-center gap-2 bg-white border-2 border-brand-500 text-slate-800 text-sm font-semibold px-4 py-2.5 rounded-2xl shadow-lg whitespace-nowrap pr-8">
                  <span className="text-base">👋</span>
                  <span>Hi! I am <span className="text-brand-600 font-extrabold">Xcello</span>.</span>
                </div>
                {/* Dismiss button */}
                <button
                  onClick={(e) => { e.stopPropagation(); setRibbonDismissed(true); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors text-xs leading-none font-bold"
                  aria-label="Dismiss"
                >
                  ✕
                </button>
                {/* Triangle tail pointing DOWN-right toward the robot */}
                <div
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: '8px solid transparent',
                    borderRight: '0px solid transparent',
                    borderTop: '10px solid #3b82f6', /* brand-500 border */
                    marginRight: '28px',
                  }}
                />
                <div
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: '6px solid transparent',
                    borderRight: '0px solid transparent',
                    borderTop: '8px solid white',
                    marginRight: '30px',
                    marginTop: '-9px',
                  }}
                />
              </motion.div>
            )}

            {/* Robot GIF — no circle, no clip, natural shape */}
            <motion.button
              onClick={() => { setIsAIOpen(true); setRibbonDismissed(true); }}
              aria-label="Open Xcelo AI assistant"
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="bg-transparent border-0 p-0 cursor-pointer focus:outline-none drop-shadow-xl"
              style={{ background: 'none' }}
            >
              <img
                src={XCELO_GIF}
                alt="Xcello AI"
                style={{
                  width: 100,
                  height: 100,
                  objectFit: 'contain',
                  display: 'block',
                  background: 'url(/xcelo-avatar.jpg) center/cover no-repeat',
                  borderRadius: '50%'
                }}
                onError={(e) => {
                  const el = e.currentTarget as HTMLImageElement;
                  el.style.display = 'none';
                  const parent = el.parentElement;
                  if (parent) {
                    parent.insertAdjacentHTML('beforeend',
                      `<div style="width:100px;height:100px;display:flex;align-items:center;justify-content:center;font-size:56px;filter:drop-shadow(0 4px 12px rgba(0,0,0,0.2))">🤖</div>`
                    );
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
